import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { prisma } from "@/lib/prisma";
import DashboardFilters from "../components/DashboardFilters";
import OfferRow from "../components/OfferRow";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";

  const params = await searchParams;
  const currentCategory = params.category;
  const searchQuery = params.q;

  const offers = await prisma.catalogOffer.findMany({
    where: {
      category:
        currentCategory && currentCategory !== "All"
          ? currentCategory
          : undefined,
      ...(searchQuery
        ? {
            gameName: {
              contains: searchQuery,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: { usdValue: "desc" },
    include: { milestones: true },
  });

  const totalTasks = await prisma.task.count({
    where: { user: { email: userEmail } },
  });

  const trackedTasks = await prisma.task.findMany({
    where: { user: { email: userEmail } },
    select: { name: true, offerwall: true, status: true },
  });

  return (
    // Latar belakang utama: Off-white di light mode, Midnight di dark mode
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Overview" />

        <main className="flex-1 p-margin-desktop max-w-container-max mx-auto w-full">
          {/* STAT CARDS DINAMIS - CLEAN NEO-BRUTALISM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-[#93C5FD] dark:bg-slate-800 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all duration-300">
              <p className="text-black dark:text-slate-300 text-sm mb-2 font-black uppercase tracking-wider">
                Total Task Terlacak
              </p>
              <p className="text-5xl font-black text-black dark:text-white">
                {totalTasks}
              </p>
            </div>

            <div className="p-6 bg-[#A3E635] dark:bg-slate-800 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all duration-300">
              <p className="text-black dark:text-slate-300 text-sm mb-2 font-black uppercase tracking-wider">
                Offerwall Tersinkronisasi
              </p>
              <p className="text-5xl font-black text-black dark:text-white">
                {offers.length}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all duration-300">
              <p className="text-black dark:text-slate-400 text-sm mb-2 font-black uppercase tracking-wider">
                Peluang Arbitrase Terbaik
              </p>
              <p className="text-5xl font-black text-[#059669] dark:text-green-400">
                $
                {(offers.length >= 2
                  ? offers[0].usdValue - offers[1].usdValue
                  : 0
                ).toFixed(2)}
              </p>
            </div>
          </div>

          {/* FILTER & SEARCH SECTION */}
          <DashboardFilters />

          {/* TABLE SECTION - CLEAN NEO-BRUTALISM */}
          <div className="bg-white dark:bg-slate-900 rounded-md border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden transition-colors duration-300">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-black dark:border-white text-xs uppercase text-black dark:text-slate-300 tracking-wider font-black bg-[#F4F5F0] dark:bg-slate-800">
                  <th className="p-4 w-1/3 border-r-2 border-black dark:border-white">
                    Task Name
                  </th>
                  <th className="p-4 border-r-2 border-black dark:border-white">
                    Offerwall
                  </th>
                  <th className="p-4 border-r-2 border-black dark:border-white">
                    Raw Coins
                  </th>
                  <th className="p-4 border-r-2 border-black dark:border-white">
                    USD Value
                  </th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black dark:divide-white bg-white dark:bg-slate-900">
                {offers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center font-bold text-black dark:text-slate-400 uppercase"
                    >
                      {searchQuery
                        ? `Tidak ada tugas yang cocok dengan pencarian "${searchQuery}".`
                        : "Katalog masih kosong atau tidak ada tugas di kategori ini."}
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => {
                    const existingTask = trackedTasks.find(
                      (task) =>
                        task.name === offer.gameName &&
                        task.offerwall === offer.offerwall,
                    );

                    const taskStatus = existingTask
                      ? existingTask.status
                      : null;

                    return (
                      <OfferRow
                        key={offer.id}
                        offer={offer}
                        taskStatus={taskStatus}
                        userEmail={userEmail}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

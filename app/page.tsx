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
    // Tambahin transisi dan dark background di container utama
    <div className="flex min-h-screen bg-background dark:bg-[#0B1120] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Overview" />

        <main className="flex-1 p-margin-desktop max-w-container-max mx-auto w-full">
          {/* STAT CARDS DINAMIS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant dark:border-slate-800 shadow-sm transition-colors duration-300">
              <p className="text-on-surface-variant dark:text-slate-400 text-sm mb-2 font-medium">
                Total Task Terlacak
              </p>
              <p className="text-4xl font-light text-primary dark:text-slate-100">
                {totalTasks}
              </p>
            </div>
            <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant dark:border-slate-800 shadow-sm transition-colors duration-300">
              <p className="text-on-surface-variant dark:text-slate-400 text-sm mb-2 font-medium">
                Offerwall Tersinkronisasi
              </p>
              <p className="text-4xl font-light text-primary dark:text-slate-100">
                {offers.length}
              </p>
            </div>
            <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant dark:border-slate-800 shadow-sm transition-colors duration-300">
              <p className="text-on-surface-variant dark:text-slate-400 text-sm mb-2 font-medium">
                Peluang Arbitrase Terbaik
              </p>
              <p className="text-4xl font-light text-green-600 dark:text-green-400">
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

          {/* TABLE SECTION */}
          <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant dark:border-slate-800 text-xs uppercase text-on-surface-variant dark:text-slate-400 tracking-wider font-semibold bg-surface-container-lowest dark:bg-slate-900">
                  <th className="p-4 w-1/3">Task Name</th>
                  <th className="p-4">Offerwall</th>
                  <th className="p-4">Raw Coins</th>
                  <th className="p-4">USD Value</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant dark:divide-slate-800 bg-surface-container-lowest dark:bg-slate-900">
                {offers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-on-surface-variant dark:text-slate-400"
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

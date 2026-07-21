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
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Overview" />

        {/* ✅ UPDATE: Padding utama di HP dikecilin jadi p-3 biar ngga banyak ruang kosong terbuang */}
        <main className="flex-1 p-3 md:p-8 max-w-7xl mx-auto w-full">
          {/* STAT CARDS */}
          {/* ✅ UPDATE: Gap antar kotak dikecilin di HP (gap-3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="p-4 md:p-6 bg-[#93C5FD] dark:bg-slate-800 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {/* ✅ UPDATE: Teks label dikecilin banget di HP (text-[10px]) */}
              <p className="text-[10px] md:text-sm font-black uppercase tracking-widest">
                Total Task Terlacak
              </p>
              {/* ✅ UPDATE: Angka diturunin dari 4xl ke 3xl buat HP */}
              <p className="text-3xl md:text-5xl font-black mt-1 md:mt-0">
                {totalTasks}
              </p>
            </div>

            <div className="p-4 md:p-6 bg-[#A3E635] dark:bg-slate-800 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-widest">
                Offerwall Tersinkronisasi
              </p>
              <p className="text-3xl md:text-5xl font-black mt-1 md:mt-0">
                {offers.length}
              </p>
            </div>

            <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-widest">
                Peluang Arbitrase Terbaik
              </p>
              <p className="text-3xl md:text-5xl font-black text-[#059669] mt-1 md:mt-0">
                $
                {(offers.length >= 2
                  ? offers[0].usdValue - offers[1].usdValue
                  : 0
                ).toFixed(2)}
              </p>
            </div>
          </div>

          <DashboardFilters />

          {/* TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-md border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            {/* ✅ UPDATE: Tabelnya dibikin agak luwes dikit, min-w-full tapi nahan min-w-[700px] biar scrollnya ngga kejauhan */}
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-black dark:border-white text-[10px] md:text-xs uppercase font-black bg-[#F4F5F0] dark:bg-slate-800">
                  <th className="p-3 md:p-4 border-r-2 border-black dark:border-white whitespace-nowrap">
                    Task Name
                  </th>
                  <th className="p-3 md:p-4 border-r-2 border-black dark:border-white whitespace-nowrap">
                    Platform / Provider
                  </th>
                  <th className="p-3 md:p-4 border-r-2 border-black dark:border-white whitespace-nowrap">
                    Raw Coins
                  </th>
                  <th className="p-3 md:p-4 border-r-2 border-black dark:border-white whitespace-nowrap">
                    USD Value
                  </th>
                  <th className="p-3 md:p-4 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black dark:divide-white bg-white dark:bg-slate-900">
                {offers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-sm font-bold uppercase"
                    >
                      Tidak ada tugas ditemukan.
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => {
                    const combinedOfferwall = `${offer.platform} - ${offer.offerwall}`;

                    const existingTask = trackedTasks.find(
                      (task) =>
                        task.name.toLowerCase() ===
                          offer.gameName.toLowerCase() &&
                        task.offerwall === combinedOfferwall &&
                        (task.status === "In Progress" ||
                          task.status === "Dropped"),
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

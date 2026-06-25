import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { prisma } from "@/lib/prisma";
import { autoTrackTask } from "@/app/actions";
import TrackButton from "../components/TrackButton";
import DashboardFilters from "../components/DashboardFilters";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const currentCategory = searchParams.category;
  const searchQuery = searchParams.q;

  // 1. Tarik data Katalog dengan filter kategori DAN pencarian nama
  const offers = await prisma.catalogOffer.findMany({
    where: {
      // Filter kategori
      category:
        currentCategory && currentCategory !== "All"
          ? currentCategory
          : undefined,
      // Filter pencarian nama game (case-insensitive)
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

  // 2. Tarik angka statistik
  const totalTasks = await prisma.task.count();

  // 3. Ambil daftar game yang lagi di-track (In Progress)
  const activeTasks = await prisma.task.findMany({
    where: { status: "In Progress" },
    select: { name: true, offerwall: true },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Overview" />

        <main className="flex-1 p-margin-desktop max-w-container-max mx-auto w-full">
          {/* STAT CARDS DINAMIS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm">
              <p className="text-on-surface-variant text-sm mb-2 font-medium">
                Total Task Terlacak
              </p>
              <p className="text-4xl font-light text-primary">{totalTasks}</p>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm">
              <p className="text-on-surface-variant text-sm mb-2 font-medium">
                Offerwall Tersinkronisasi
              </p>
              <p className="text-4xl font-light text-primary">
                {offers.length}
              </p>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm">
              <p className="text-on-surface-variant text-sm mb-2 font-medium">
                Peluang Arbitrase Terbaik
              </p>
              <p className="text-4xl font-light text-green-600">
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
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant text-xs uppercase text-on-surface-variant tracking-wider font-semibold">
                  <th className="p-4 w-1/3">Task Name</th>
                  <th className="p-4">Offerwall</th>
                  <th className="p-4">Raw Coins</th>
                  <th className="p-4">USD Value</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {offers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-on-surface-variant"
                    >
                      {searchQuery
                        ? `Tidak ada tugas yang cocok dengan pencarian "${searchQuery}".`
                        : "Katalog masih kosong atau tidak ada tugas di kategori ini."}
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => {
                    const isTracked = activeTasks.some(
                      (task) =>
                        task.name === offer.gameName &&
                        task.offerwall === offer.offerwall,
                    );

                    return (
                      <tr
                        key={offer.id}
                        className="hover:bg-surface-container/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center">
                              <span className="material-symbols-outlined text-primary text-xl">
                                stadia_controller
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-primary">
                                {offer.gameName}
                              </div>
                              <div className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">
                                  sports_esports
                                </span>
                                {offer.requirement}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-surface-container border border-outline-variant rounded text-xs font-medium text-on-surface">
                            {offer.offerwall === "RevU" ? "RU " : "TX "}
                            {offer.offerwall}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-on-surface">
                          {offer.rawCoins.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-green-600 text-lg">
                            ${offer.usdValue.toFixed(2)}
                          </div>
                          {offer.isHighest && (
                            <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                              Highest{" "}
                              <span className="material-symbols-outlined text-[12px]">
                                local_fire_department
                              </span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {isTracked ? (
                            <button
                              disabled
                              className="bg-surface-variant text-on-surface-variant px-5 py-2 rounded-lg text-sm font-label-md cursor-not-allowed w-full md:w-auto shadow-inner"
                            >
                              Terlacak
                            </button>
                          ) : (
                            <form action={autoTrackTask}>
                              <input
                                type="hidden"
                                name="gameName"
                                value={offer.gameName}
                              />
                              <input
                                type="hidden"
                                name="platform"
                                value={offer.platform}
                              />
                              <input
                                type="hidden"
                                name="offerwall"
                                value={offer.offerwall}
                              />
                              <input
                                type="hidden"
                                name="usdValue"
                                value={offer.usdValue}
                              />
                              <input
                                type="hidden"
                                name="requirement"
                                value={offer.requirement}
                              />
                              <input
                                type="hidden"
                                name="milestones"
                                value={JSON.stringify(offer.milestones)}
                              />
                              <TrackButton />
                            </form>
                          )}
                        </td>
                      </tr>
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

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { prisma } from "@/lib/prisma";
import DashboardFilters from "../components/DashboardFilters";
import OfferRow from "../components/OfferRow";

export default async function DashboardPage({
  searchParams,
}: {
  // Hapus platform dari tipe data biar rapi
  searchParams: { category?: string; q?: string };
}) {
  const currentCategory = searchParams.category;
  const searchQuery = searchParams.q;

  // 1. Tarik data Katalog tanpa filter platform
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
                      <OfferRow
                        key={offer.id}
                        offer={offer}
                        isTracked={isTracked}
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

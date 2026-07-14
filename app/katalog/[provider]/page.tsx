import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import CatalogGrid from "@/components/CatalogGrid";

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const resolvedParams = await params;
  const providerSlug = resolvedParams.provider.toLowerCase();

  let providerName = providerSlug;
  if (providerSlug === "revu") providerName = "RevU";
  else if (providerSlug === "torox") providerName = "ToroX";
  else if (providerSlug === "freecash") providerName = "Freecash";
  else if (providerSlug === "adgem") providerName = "AdGem";

  const offers = await prisma.catalogOffer.findMany({
    where: {
      offerwall: {
        equals: providerName,
        mode: "insensitive",
      },
    },
    include: {
      milestones: true,
    },
    orderBy: { usdValue: "desc" },
  });

  if (!["RevU", "ToroX", "Freecash", "AdGem"].includes(providerName)) {
    notFound();
  }

  const trackedTasks = await prisma.task.findMany({
    select: { name: true, offerwall: true, status: true },
  });

  return (
    // Tambahin dark:bg-[#0B1120] buat layar utama
    <div className="flex min-h-screen bg-background dark:bg-[#0B1120] text-on-surface dark:text-slate-200 font-body-md antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title={`${providerName} Offers`} />

        <div className="p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto">
          <div className="mb-8">
            {/* Navigasi Breadcrumbs */}
            <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 font-label-md text-sm mb-4 transition-colors">
              <Link
                href="/katalog"
                className="hover:text-primary dark:hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                Kembali ke Katalog
              </Link>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <span className="text-on-surface dark:text-slate-200 font-semibold transition-colors">
                {providerName}
              </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div>
                <h2 className="text-3xl font-bold text-primary dark:text-slate-100 tracking-tight mb-2 flex items-center gap-3 transition-colors">
                  {/* Kotak Ikon Provider */}
                  <span className="w-10 h-10 rounded-lg bg-surface-container dark:bg-slate-800 flex items-center justify-center text-primary dark:text-slate-300 text-sm border border-outline-variant dark:border-slate-700 transition-colors">
                    {providerName === "RevU"
                      ? "RU"
                      : providerName === "ToroX"
                        ? "TX"
                        : providerName === "Freecash"
                          ? "FC"
                          : "AG"}
                  </span>
                  {providerName} Games
                </h2>
                <p className="text-base text-on-surface-variant dark:text-slate-400 max-w-2xl transition-colors">
                  Daftar peluang arbitrase dengan yield tertinggi dari{" "}
                  {providerName}.
                </p>
              </div>

              {/* Badge Jumlah Offers */}
              <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors">
                <span className="material-symbols-outlined text-green-500 text-[18px]">
                  monitoring
                </span>
                {offers.length} Active Offers
              </div>
            </div>
          </div>

          {/* Kondisi Empty State vs Isi Katalog Grid */}
          {offers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center mt-6 transition-colors">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 transition-colors">
                videogame_asset_off
              </span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">
                Belum ada tawaran aktif
              </h3>
              <p className="text-slate-500 dark:text-slate-400 transition-colors">
                Saat ini belum ada data game yang masuk untuk {providerName}.
              </p>
            </div>
          ) : (
            <CatalogGrid
              offers={offers}
              providerName={providerName}
              trackedTasks={trackedTasks}
            />
          )}
        </div>
      </main>
    </div>
  );
}

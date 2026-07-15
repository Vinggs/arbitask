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
    // Background Neo-Brutalism
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white font-body-md antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title={`${providerName} Offers`} />

        <div className="p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto">
          <div className="mb-8">
            {/* Navigasi Breadcrumbs Neo-Brutalism */}
            <div className="flex items-center gap-2 font-black uppercase text-sm mb-6 transition-colors">
              <Link
                href="/katalog"
                className="text-slate-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 bg-white dark:bg-slate-800 border-2 border-black dark:border-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
              >
                <span className="material-symbols-outlined text-sm font-black">
                  arrow_back
                </span>
                Back to Catalog
              </Link>
              <span className="material-symbols-outlined text-sm font-black text-black dark:text-white">
                chevron_right
              </span>
              <span className="text-black dark:text-black bg-[#FCD34D] px-3 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                {providerName}
              </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
              <div>
                <h2 className="text-4xl font-black text-black dark:text-white tracking-tight mb-3 flex items-center gap-4 uppercase transition-colors">
                  {/* Kotak Ikon Provider Brutalist */}
                  <span className="w-14 h-14 bg-white dark:bg-slate-800 flex items-center justify-center text-black dark:text-white text-xl border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors">
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
                <p className="text-base font-bold text-slate-700 dark:text-slate-400 max-w-2xl transition-colors uppercase">
                  Daftar peluang arbitrase dengan yield tertinggi dari{" "}
                  {providerName}.
                </p>
              </div>

              {/* Badge Jumlah Offers Brutalist */}
              <div className="bg-[#A3E635] border-4 border-black dark:border-white px-5 py-3 text-sm font-black text-black uppercase flex items-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-colors">
                <span className="material-symbols-outlined text-black text-[24px] font-black">
                  monitoring
                </span>
                {offers.length} Active Offers
              </div>
            </div>
          </div>

          {/* Kondisi Empty State vs Isi Katalog Grid */}
          {offers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col items-center justify-center mt-6 transition-colors">
              <span className="material-symbols-outlined text-6xl text-black dark:text-white mb-4 font-black transition-colors">
                videogame_asset_off
              </span>
              <h3 className="text-3xl font-black text-black dark:text-white mb-2 uppercase transition-colors">
                Belum ada tawaran aktif
              </h3>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase transition-colors">
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

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
  else if (providerSlug === "adgem") providerName = "AdGem";
  else if (providerSlug === "ayetstudios") providerName = "AyetStudios";
  else if (providerSlug === "lootably") providerName = "Lootably";

  if (
    !["RevU", "ToroX", "AdGem", "AyetStudios", "Lootably"].includes(
      providerName,
    )
  ) {
    notFound();
  }

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

  const trackedTasks = await prisma.task.findMany({
    select: { name: true, offerwall: true, status: true },
  });

  return (
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white font-body-md antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title={`${providerName} Offers`} />

        <div className="p-4 md:p-margin-desktop w-full max-w-container-max mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-2 font-black uppercase text-[10px] md:text-sm mb-6 transition-colors">
              <Link
                href="/katalog"
                className="text-slate-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 bg-white dark:bg-slate-800 border-2 border-black dark:border-white px-2 py-1 md:px-3 md:py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
              >
                <span className="material-symbols-outlined text-[14px] md:text-sm font-black">
                  arrow_back
                </span>
                Back to Catalog
              </Link>
              <span className="material-symbols-outlined text-sm font-black text-black dark:text-white">
                chevron_right
              </span>
              <span className="text-black dark:text-black bg-[#FCD34D] px-2 py-1 md:px-3 md:py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                {providerName}
              </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 md:gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight mb-3 flex items-center gap-3 md:gap-4 uppercase transition-colors">
                  <span className="w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-slate-800 flex items-center justify-center text-black dark:text-white text-lg md:text-xl border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors">
                    {providerName === "RevU"
                      ? "RU"
                      : providerName === "ToroX"
                        ? "TX"
                        : providerName === "AdGem"
                          ? "AG"
                          : providerName.substring(0, 2).toUpperCase()}
                  </span>
                  {providerName} Games
                </h2>
                <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-400 max-w-2xl transition-colors uppercase tracking-wider">
                  Daftar peluang arbitrase dengan yield tertinggi dari{" "}
                  {providerName}.
                </p>
              </div>

              <div className="bg-[#A3E635] border-4 border-black dark:border-white px-4 py-2 md:px-5 md:py-3 text-xs md:text-sm font-black text-black uppercase flex items-center justify-center md:justify-start gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-colors w-full md:w-auto mt-2 md:mt-0">
                <span className="material-symbols-outlined text-black text-[20px] md:text-[24px] font-black">
                  monitoring
                </span>
                {offers.length} Active Offers
              </div>
            </div>
          </div>

          {offers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-8 md:p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center mt-6 transition-colors">
              <span className="material-symbols-outlined text-5xl md:text-6xl text-black dark:text-white mb-4 font-black transition-colors">
                videogame_asset_off
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-2 uppercase transition-colors">
                Belum ada tawaran aktif
              </h3>
              <p className="text-[10px] md:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase transition-colors">
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

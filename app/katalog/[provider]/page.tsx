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
    <div className="flex min-h-screen bg-background text-on-surface font-body-md antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title={`${providerName} Offers`} />

        <div className="p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-sm mb-4">
              <Link
                href="/katalog"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                Kembali ke Katalog
              </Link>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <span className="text-on-surface font-semibold">
                {providerName}
              </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div>
                <h2 className="text-3xl font-bold text-primary tracking-tight mb-2 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary text-sm border border-outline-variant">
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
                <p className="text-base text-on-surface-variant max-w-2xl">
                  Daftar peluang arbitrase dengan yield tertinggi dari{" "}
                  {providerName}.
                </p>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-green-500 text-[18px]">
                  monitoring
                </span>
                {offers.length} Active Offers
              </div>
            </div>
          </div>

          {offers.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center mt-6">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                videogame_asset_off
              </span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Belum ada tawaran aktif
              </h3>
              <p className="text-slate-500">
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

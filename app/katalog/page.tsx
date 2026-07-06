import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function KatalogPage() {
  // Hitung jumlah tugas yang ada di database secara dinamis (Case Insensitive)
  const revuCount = await prisma.catalogOffer.count({
    where: {
      offerwall: {
        equals: "RevU",
        mode: "insensitive",
      },
    },
  });

  const toroxCount = await prisma.catalogOffer.count({
    where: {
      offerwall: {
        equals: "ToroX",
        mode: "insensitive",
      },
    },
  });

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title="Katalog Offerwall" />

        <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                Available Platforms
              </h2>
              <p className="text-base text-slate-500 max-w-2xl">
                Browse and integrate with top-tier offerwalls. Discover
                high-yield opportunities to maximize your arbitrage margins.
              </p>
            </div>

            <div className="flex gap-4 shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search offerwalls..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Grid Katalog Offerwall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
            {/* Offerwall Card 1: RevU */}
            <Link href="/katalog/revu" className="block outline-none">
              <article className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition-all hover:border-blue-200 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    RU
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">
                      link
                    </span>{" "}
                    CONNECTED
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">RevU</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                  Premium surveys and high-paying game tracking tasks.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    {revuCount} ACTIVE TASKS
                  </span>
                  <span className="material-symbols-outlined text-blue-600 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </article>
            </Link>

            {/* Offerwall Card 2: ToroX */}
            <Link href="/katalog/torox" className="block outline-none">
              <article className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition-all hover:border-indigo-200 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    TX
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">
                      link
                    </span>{" "}
                    CONNECTED
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">ToroX</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                  Fast payouts with a focus on mobile app installations.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    {toroxCount} ACTIVE TASKS
                  </span>
                  <span className="material-symbols-outlined text-indigo-600 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </article>
            </Link>

            {/* Offerwall Card 3: Freecash (Not Connected) */}
            <article className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xl">
                  FC
                </div>
                <span className="bg-slate-50 text-slate-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
                  DISCONNECTED
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-500 mb-2">
                Freecash
              </h3>
              <p className="text-sm text-slate-400 mb-6 flex-1 leading-relaxed">
                Direct crypto withdrawals and competitive leaderboards.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button className="text-slate-600 font-bold text-[11px] uppercase tracking-wider hover:text-slate-900 w-full text-left flex items-center justify-between transition-colors">
                  CONNECT API{" "}
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>
            </article>

            {/* Offerwall Card 4: AdGem (Not Connected) */}
            <article className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xl">
                  AG
                </div>
                <span className="bg-slate-50 text-slate-400 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
                  DISCONNECTED
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-500 mb-2">AdGem</h3>
              <p className="text-sm text-slate-400 mb-6 flex-1 leading-relaxed">
                Specialized in multi-reward gaming milestones.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button className="text-slate-600 font-bold text-[11px] uppercase tracking-wider hover:text-slate-900 w-full text-left flex items-center justify-between transition-colors">
                  CONNECT API{" "}
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}

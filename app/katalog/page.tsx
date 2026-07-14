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
    // Tambahin dark:bg-[#0B1120] dan transisi di container utama
    <div className="flex min-h-screen bg-background dark:bg-[#0B1120] text-on-surface dark:text-slate-200 font-body-md antialiased transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title="Katalog Offerwall" />

        <main className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2 transition-colors">
                Available Platforms
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl transition-colors">
                Browse and integrate with top-tier offerwalls. Discover
                high-yield opportunities to maximize your arbitrage margins.
              </p>
            </div>

            <div className="flex gap-4 shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search offerwalls..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Grid Katalog Offerwall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
            {/* Offerwall Card 1: RevU */}
            <Link href="/katalog/revu" className="block outline-none">
              <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl transition-colors">
                    RU
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider transition-colors">
                    <span className="material-symbols-outlined text-[14px]">
                      link
                    </span>{" "}
                    CONNECTED
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 transition-colors">
                  RevU
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed transition-colors">
                  Premium surveys and high-paying game tracking tasks.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider transition-colors">
                    {revuCount} ACTIVE TASKS
                  </span>
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
              </article>
            </Link>

            {/* Offerwall Card 2: ToroX */}
            <Link href="/katalog/torox" className="block outline-none">
              <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition-all hover:border-indigo-200 dark:hover:border-indigo-700 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl transition-colors">
                    TX
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider transition-colors">
                    <span className="material-symbols-outlined text-[14px]">
                      link
                    </span>{" "}
                    CONNECTED
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 transition-colors">
                  ToroX
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed transition-colors">
                  Fast payouts with a focus on mobile app installations.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider transition-colors">
                    {toroxCount} ACTIVE TASKS
                  </span>
                  <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
              </article>
            </Link>

            {/* Offerwall Card 3: Freecash (Not Connected) */}
            <article className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-xl transition-colors">
                  FC
                </div>
                <span className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-wider transition-colors">
                  DISCONNECTED
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2 transition-colors">
                Freecash
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-6 flex-1 leading-relaxed transition-colors">
                Direct crypto withdrawals and competitive leaderboards.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
                <button className="text-slate-600 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider hover:text-slate-900 dark:hover:text-slate-200 w-full text-left flex items-center justify-between transition-colors">
                  CONNECT API{" "}
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>
            </article>

            {/* Offerwall Card 4: AdGem (Not Connected) */}
            <article className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-xl transition-colors">
                  AG
                </div>
                <span className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-wider transition-colors">
                  DISCONNECTED
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-2 transition-colors">
                AdGem
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-6 flex-1 leading-relaxed transition-colors">
                Specialized in multi-reward gaming milestones.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
                <button className="text-slate-600 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider hover:text-slate-900 dark:hover:text-slate-200 w-full text-left flex items-center justify-between transition-colors">
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

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function KatalogPage() {
  const revuCount = await prisma.catalogOffer.count({
    where: { offerwall: { equals: "RevU", mode: "insensitive" } },
  });

  const toroxCount = await prisma.catalogOffer.count({
    where: { offerwall: { equals: "ToroX", mode: "insensitive" } },
  });

  return (
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-slate-200 font-body-md antialiased transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title="Katalog Offerwall" />

        <main className="flex-1 p-4 md:p-margin-desktop max-w-container-max mx-auto w-full">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight mb-2 uppercase">
                Available Offerwalls
              </h2>
              <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-400 max-w-2xl uppercase tracking-wider">
                Browse and compare tasks from top-tier provider networks.
                Discover high-yield opportunities across different platforms to
                maximize your arbitrage margins.
              </p>
            </div>

            <div className="flex gap-4 shrink-0 w-full md:w-auto">
              <div className="relative group w-full md:w-auto">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-slate-500 text-[20px] font-bold">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search offerwalls..."
                  className="w-full md:w-64 pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-white rounded-md text-sm font-bold text-black dark:text-white placeholder-slate-500 focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:-translate-y-1 focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-12">
            <Link href="/katalog/revu" className="block outline-none">
              <article className="bg-[#93C5FD] dark:bg-slate-800 border-2 border-black dark:border-white rounded-md p-5 md:p-6 flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-white border-2 border-black flex items-center justify-center text-black font-black text-lg md:text-xl">
                    RU
                  </div>
                  <span className="bg-white text-black font-black text-[10px] px-2.5 py-1 rounded-sm flex items-center gap-1 border-2 border-black uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">
                      link
                    </span>{" "}
                    CONNECTED
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-2 uppercase">
                  RevU
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-300 mb-6 flex-1 leading-relaxed">
                  Premium surveys and high-paying game tracking tasks.
                </p>
                <div className="flex items-center justify-between pt-4 border-t-2 border-black dark:border-white">
                  <span className="text-[10px] md:text-[12px] font-black text-black dark:text-white uppercase tracking-wider">
                    {revuCount} ACTIVE TASKS
                  </span>
                  <span className="material-symbols-outlined text-black dark:text-white group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
              </article>
            </Link>

            <Link href="/katalog/torox" className="block outline-none">
              <article className="bg-[#FCA5A5] dark:bg-slate-800 border-2 border-black dark:border-white rounded-md p-5 md:p-6 flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-white border-2 border-black flex items-center justify-center text-black font-black text-lg md:text-xl">
                    TX
                  </div>
                  <span className="bg-white text-black font-black text-[10px] px-2.5 py-1 rounded-sm flex items-center gap-1 border-2 border-black uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">
                      link
                    </span>{" "}
                    CONNECTED
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-2 uppercase">
                  ToroX
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-300 mb-6 flex-1 leading-relaxed">
                  Fast payouts with a focus on mobile app installations.
                </p>
                <div className="flex items-center justify-between pt-4 border-t-2 border-black dark:border-white">
                  <span className="text-[10px] md:text-[12px] font-black text-black dark:text-white uppercase tracking-wider">
                    {toroxCount} ACTIVE TASKS
                  </span>
                  <span className="material-symbols-outlined text-black dark:text-white group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
              </article>
            </Link>

            <article className="bg-white dark:bg-slate-900 border-2 border-dashed border-black dark:border-white rounded-md p-5 md:p-6 flex flex-col h-full relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-slate-200 border-2 border-black flex items-center justify-center text-slate-500 font-black text-lg md:text-xl opacity-50">
                  AG
                </div>
                <span className="bg-slate-200 text-slate-600 font-black text-[10px] px-2.5 py-1 rounded-sm border-2 border-black uppercase tracking-wider">
                  DISCONNECTED
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-400 dark:text-slate-500 mb-2 uppercase">
                AdGem
              </h3>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-600 mb-6 flex-1 leading-relaxed">
                Rewarding engagement with dynamic task walls.
              </p>
              <div className="flex items-center justify-between pt-4 border-t-2 border-black/20 dark:border-white/20">
                <button className="text-black dark:text-white font-black text-[10px] md:text-[12px] uppercase tracking-wider w-full text-left flex items-center justify-between hover:translate-x-1 transition-transform">
                  CONNECT API{" "}
                  <span className="material-symbols-outlined text-[16px] md:text-[18px]">
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

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {/* HAMBURGER BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-5 right-4 z-[999] bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 w-10 h-10 flex items-center justify-center shadow-brutal-sm dark:shadow-brutal-dark-sm hover:-translate-y-px transition-all"
      >
        <span className="material-symbols-outlined font-black">
          {isSidebarOpen ? "close" : "menu"}
        </span>
      </button>

      {/* OVERLAY GELAP */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/60 z-[998] backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR UTAMA */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-[999] md:z-50 bg-slate-50 dark:bg-slate-950 border-r-2 border-slate-900 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300
          ${
            isSidebarOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full md:translate-x-0 md:w-20"
          }
        `}
      >
        <div
          className="flex items-center h-[80px] min-h-[80px] max-h-[80px] shrink-0 px-6 border-b-2 border-slate-900 dark:border-slate-700 cursor-pointer box-border overflow-hidden bg-emerald-400 dark:bg-slate-950 transition-colors"
          onClick={() => {
            if (window.innerWidth >= 768) setIsSidebarOpen(!isSidebarOpen);
          }}
        >
          <div className="font-display-lg text-[24px] font-black uppercase text-slate-900 dark:text-white tracking-tighter select-none">
            {isSidebarOpen ? "Arbitask." : "A."}
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-3 px-4 mt-6 overflow-y-auto overflow-x-hidden hide-scrollbar">
          <Link
            href="/"
            className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
              pathname === "/en" || pathname === "/id" || pathname === "/"
                ? "text-slate-900 dark:text-white bg-blue-300 dark:bg-sky-800 font-black border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark md:translate-x-1"
                : "text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-900 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 font-bold"
            }`}
          >
            <span className="material-symbols-outlined text-xl font-black">
              dashboard
            </span>
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-wider whitespace-nowrap">
                {t("dashboard")}
              </span>
            )}
          </Link>

          <Link
            href="/katalog"
            className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
              pathname.includes("/katalog")
                ? "text-slate-900 dark:text-white bg-blue-300 dark:bg-sky-800 font-black border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark md:translate-x-1"
                : "text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-900 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 font-bold"
            }`}
          >
            <span className="material-symbols-outlined text-xl font-black">
              list_alt
            </span>
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-wider whitespace-nowrap">
                {t("catalog")}
              </span>
            )}
          </Link>

          <Link
            href="/tracking"
            className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
              pathname.includes("/tracking")
                ? "text-slate-900 dark:text-white bg-blue-300 dark:bg-sky-800 font-black border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark md:translate-x-1"
                : "text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-900 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 font-bold"
            }`}
          >
            <span className="material-symbols-outlined text-xl font-black">
              monitoring
            </span>
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-wider whitespace-nowrap">
                {t("tracking")}
              </span>
            )}
          </Link>

          <Link
            href="/logs"
            className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
              pathname.includes("/logs")
                ? "text-slate-900 dark:text-white bg-blue-300 dark:bg-sky-800 font-black border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark md:translate-x-1"
                : "text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-900 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 font-bold"
            }`}
          >
            <span className="material-symbols-outlined text-xl font-black">
              history
            </span>
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-wider whitespace-nowrap">
                {t("history")}
              </span>
            )}
          </Link>
        </nav>
      </aside>
    </>
  );
}

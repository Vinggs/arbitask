"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 h-screen sticky top-0 bg-[#F4F5F0] dark:bg-[#0B1120] border-r-2 border-black dark:border-white flex flex-col shrink-0 z-50`}
    >
      {/* KOTAK LOGO */}
      <div
        className="flex items-center h-[80px] min-h-[80px] max-h-[80px] shrink-0 px-6 border-b-2 border-black dark:border-white cursor-pointer box-border overflow-hidden bg-[#A3E635] dark:bg-[#0B1120]"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="font-display-lg text-[24px] font-black uppercase text-black dark:text-white tracking-tighter select-none">
          {isSidebarOpen ? "Arbitask." : "A."}
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-3 px-4 mt-6">
        <Link
          href="/"
          className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
            pathname === "/"
              ? "text-black dark:text-white bg-[#93C5FD] dark:bg-slate-800 font-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-1"
              : "text-slate-700 dark:text-slate-400 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-slate-900 font-bold"
          }`}
        >
          <span className="material-symbols-outlined text-xl font-black">
            dashboard
          </span>
          {isSidebarOpen && (
            <span className="text-sm uppercase tracking-wider">Dashboard</span>
          )}
        </Link>

        <Link
          href="/katalog"
          className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
            pathname === "/katalog"
              ? "text-black dark:text-white bg-[#93C5FD] dark:bg-slate-800 font-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-1"
              : "text-slate-700 dark:text-slate-400 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-slate-900 font-bold"
          }`}
        >
          <span className="material-symbols-outlined text-xl font-black">
            list_alt
          </span>
          {isSidebarOpen && (
            <span className="text-sm uppercase tracking-wider">Katalog</span>
          )}
        </Link>

        <Link
          href="/tracking"
          className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
            pathname === "/tracking"
              ? "text-black dark:text-white bg-[#93C5FD] dark:bg-slate-800 font-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-1"
              : "text-slate-700 dark:text-slate-400 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-slate-900 font-bold"
          }`}
        >
          <span className="material-symbols-outlined text-xl font-black">
            monitoring
          </span>
          {isSidebarOpen && (
            <span className="text-sm uppercase tracking-wider">Tracking</span>
          )}
        </Link>

        <Link
          href="/logs"
          className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
            pathname === "/logs"
              ? "text-black dark:text-white bg-[#93C5FD] dark:bg-slate-800 font-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-1"
              : "text-slate-700 dark:text-slate-400 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-slate-900 font-bold"
          }`}
        >
          <span className="material-symbols-outlined text-xl font-black">
            history
          </span>
          {isSidebarOpen && (
            <span className="text-sm uppercase tracking-wider">History</span>
          )}
        </Link>
      </nav>
    </aside>
  );
}

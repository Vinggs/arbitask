"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Otomatis nutup sidebar di HP tiap ganti halaman
  useEffect(() => {
    // Di layar kecil (mobile), kita tutup sidebar otomatis
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {/* HAMBURGER BUTTON (Hanya muncul di HP) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-5 right-4 z-[999] bg-[#FCD34D] text-black border-2 border-black w-10 h-10 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px transition-all"
      >
        <span className="material-symbols-outlined font-black">
          {isSidebarOpen ? "close" : "menu"}
        </span>
      </button>

      {/* OVERLAY GELAP UNTUK HP */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 z-[998] backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR UTAMA */}
      {/* ✅ FIX: Ubah md:relative jadi md:sticky biar sidebar nggak ketinggalan pas di-scroll */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-[999] md:z-50 bg-[#F4F5F0] dark:bg-[#0B1120] border-r-2 border-black dark:border-white flex flex-col shrink-0 transition-all duration-300
          ${
            isSidebarOpen
              ? "translate-x-0 w-64" // Terbuka penuh di HP & Laptop
              : "-translate-x-full md:translate-x-0 md:w-20" // Ngumpet di HP, menyusut di Laptop
          }
        `}
      >
        <div
          className="flex items-center h-[80px] min-h-[80px] max-h-[80px] shrink-0 px-6 border-b-2 border-black dark:border-white cursor-pointer box-border overflow-hidden bg-[#A3E635] dark:bg-[#0B1120]"
          onClick={() => {
            // Kalau di laptop, klik logo buat ngecilin/gedein sidebar
            if (window.innerWidth >= 768) setIsSidebarOpen(!isSidebarOpen);
          }}
        >
          <div className="font-display-lg text-[24px] font-black uppercase text-black dark:text-white tracking-tighter select-none">
            {isSidebarOpen ? "Arbitask." : "A."}
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-3 px-4 mt-6 overflow-y-auto overflow-x-hidden">
          <Link
            href="/"
            className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
              pathname === "/"
                ? "text-black dark:text-white bg-[#93C5FD] dark:bg-slate-800 font-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:translate-x-1"
                : "text-slate-700 dark:text-slate-400 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-slate-900 font-bold"
            }`}
          >
            <span className="material-symbols-outlined text-xl font-black">
              dashboard
            </span>
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-wider whitespace-nowrap">
                Dashboard
              </span>
            )}
          </Link>

          <Link
            href="/katalog"
            className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
              pathname === "/katalog"
                ? "text-black dark:text-white bg-[#93C5FD] dark:bg-slate-800 font-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:translate-x-1"
                : "text-slate-700 dark:text-slate-400 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-slate-900 font-bold"
            }`}
          >
            <span className="material-symbols-outlined text-xl font-black">
              list_alt
            </span>
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-wider whitespace-nowrap">
                Katalog
              </span>
            )}
          </Link>

          <Link
            href="/tracking"
            className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
              pathname === "/tracking"
                ? "text-black dark:text-white bg-[#93C5FD] dark:bg-slate-800 font-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:translate-x-1"
                : "text-slate-700 dark:text-slate-400 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-slate-900 font-bold"
            }`}
          >
            <span className="material-symbols-outlined text-xl font-black">
              monitoring
            </span>
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-wider whitespace-nowrap">
                Tracking
              </span>
            )}
          </Link>

          <Link
            href="/logs"
            className={`flex items-center gap-4 transition-all px-4 py-3 border-2 ${
              pathname === "/logs"
                ? "text-black dark:text-white bg-[#93C5FD] dark:bg-slate-800 font-black border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:translate-x-1"
                : "text-slate-700 dark:text-slate-400 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-slate-900 font-bold"
            }`}
          >
            <span className="material-symbols-outlined text-xl font-black">
              history
            </span>
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-wider whitespace-nowrap">
                History
              </span>
            )}
          </Link>
        </nav>
      </aside>
    </>
  );
}

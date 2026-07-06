"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 h-screen sticky top-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col shrink-0 z-50`}
    >
      {/* KOTAK LOGO: Dikunci mati di 80px (max-h dan shrink-0) */}
      <div
        className="flex items-center h-[80px] min-h-[80px] max-h-[80px] shrink-0 px-6 border-b border-outline-variant cursor-pointer box-border overflow-hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="font-display-lg text-[24px] font-bold text-primary tracking-tight select-none">
          {isSidebarOpen ? "Arbitask." : "A."}
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-3 mt-6">
        <Link
          href="/"
          className={`flex items-center gap-4 transition-colors rounded-lg px-3 py-3 ${pathname === "/" ? "text-primary bg-primary-fixed/20 font-bold border-l-4 border-primary rounded-r-lg" : "text-on-surface hover:bg-surface-container-low"}`}
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          {isSidebarOpen && (
            <span className="font-label-md whitespace-nowrap">
              Dashboard Utama
            </span>
          )}
        </Link>

        <Link
          href="/katalog"
          className={`flex items-center gap-4 transition-colors rounded-lg px-3 py-3 ${pathname === "/katalog" ? "text-primary bg-primary-fixed/20 font-bold border-l-4 border-primary rounded-r-lg" : "text-on-surface hover:bg-surface-container-low"}`}
        >
          <span className="material-symbols-outlined text-lg">list_alt</span>
          {isSidebarOpen && (
            <span className="font-label-md whitespace-nowrap">
              Katalog Offerwall
            </span>
          )}
        </Link>

        <Link
          href="/tracking"
          className={`flex items-center gap-4 transition-colors rounded-lg px-3 py-3 ${pathname === "/tracking" ? "text-primary bg-primary-fixed/20 font-bold border-l-4 border-primary rounded-r-lg" : "text-on-surface hover:bg-surface-container-low"}`}
        >
          <span className="material-symbols-outlined text-lg">monitoring</span>
          {isSidebarOpen && (
            <span className="font-label-md whitespace-nowrap">Tracking</span>
          )}
        </Link>

        {/* --- TAMBAHAN MENU LOG HISTORY --- */}
        <Link
          href="/logs"
          className={`flex items-center gap-4 transition-colors rounded-lg px-3 py-3 ${pathname === "/logs" ? "text-primary bg-primary-fixed/20 font-bold border-l-4 border-primary rounded-r-lg" : "text-on-surface hover:bg-surface-container-low"}`}
        >
          <span className="material-symbols-outlined text-lg">history</span>
          {isSidebarOpen && (
            <span className="font-label-md whitespace-nowrap">Log History</span>
          )}
        </Link>
      </nav>
    </aside>
  );
}

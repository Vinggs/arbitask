"use client";

import React from "react";

export default function DropTaskButton({
  styleType = "card",
}: {
  styleType?: "card" | "detail";
}) {
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isConfirmed = window.confirm(
      "⚠️ WARNING: Yakin mau drop task ini?\n\nTask yang udah di-drop (Quest Abandoned) nggak bisa dilanjutin lagi dan statusnya bakal permanen!",
    );

    if (!isConfirmed) {
      e.preventDefault();
    }
  };

  if (styleType === "detail") {
    return (
      <button
        type="submit"
        onClick={handleConfirm}
        className="px-5 py-2.5 bg-[#FCA5A5] text-black border-4 border-black dark:border-white font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px] font-black">
          flag
        </span>
        Drop Task
      </button>
    );
  }

  // Tampilan tombol untuk halaman Grid Cards (Dashboard Tracking)
  return (
    <button
      type="submit"
      onClick={handleConfirm}
      className="text-xs bg-[#FCA5A5] text-black font-black uppercase border-2 border-black hover:-translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all cursor-pointer px-3 py-1.5 flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-[14px] font-black">
        flag
      </span>
      Drop Task
    </button>
  );
}

"use client";

import React from "react";

export default function DropTaskButton({
  styleType = "card",
}: {
  styleType?: "card" | "detail";
}) {
  // Fungsi penahan (Warning Pop-up)
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isConfirmed = window.confirm(
      "⚠️ WARNING: Yakin mau drop task ini?\n\nTask yang udah di-drop (Quest Abandoned) nggak bisa dilanjutin lagi dan statusnya bakal permanen!",
    );

    if (!isConfirmed) {
      e.preventDefault(); // Batalin form submit kalau user ngeklik Cancel
    }
  };

  // Tampilan tombol untuk halaman Detail
  if (styleType === "detail") {
    return (
      <button
        type="submit"
        onClick={handleConfirm}
        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[16px]">flag</span>
        Drop Task
      </button>
    );
  }

  // Tampilan tombol untuk halaman Grid Cards (Dashboard Tracking)
  return (
    <button
      type="submit"
      onClick={handleConfirm}
      className="text-[11px] text-red-600 font-bold hover:bg-red-100 transition-all cursor-pointer bg-red-50 px-3 py-1.5 rounded-md border border-red-100 flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-[14px]">flag</span>
      Drop Task
    </button>
  );
}

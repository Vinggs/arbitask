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
        className="px-5 py-2.5 bg-red-400 dark:bg-rose-700 text-slate-900 dark:text-white border-4 border-slate-900 dark:border-slate-700 font-black uppercase text-sm shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px] font-black">
          flag
        </span>
        Drop Task
      </button>
    );
  }

  return (
    <button
      type="submit"
      onClick={handleConfirm}
      className="text-xs bg-red-400 dark:bg-rose-700 text-slate-900 dark:text-white font-black uppercase border-2 border-slate-900 dark:border-slate-700 hover:-translate-y-1 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:shadow-brutal dark:hover:shadow-brutal-dark active:translate-y-0 active:shadow-none transition-all cursor-pointer px-3 py-1.5 flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-[14px] font-black">
        flag
      </span>
      Drop Task
    </button>
  );
}

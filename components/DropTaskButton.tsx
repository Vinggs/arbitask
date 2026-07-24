"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal, useFormStatus } from "react-dom";

export default function DropTaskButton({
  styleType = "card",
}: {
  styleType?: "card" | "detail";
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Tombol rahasia untuk memicu pengiriman form
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const { pending } = useFormStatus();

  // Memastikan portal hanya di-render di Client-side untuk mencegah error hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Jangan langsung submit!
    setIsModalOpen(true); // Buka pop-up
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    // Klik tombol rahasia secara programatis untuk memicu aksi server
    if (hiddenSubmitRef.current) {
      hiddenSubmitRef.current.click();
    }
  };

  const Modal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay Gelap (Klik area luar untuk menutup) */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsModalOpen(false)}
      ></div>

      {/* Kotak Modal Neo-Brutalism */}
      <div className="relative bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 shadow-brutal-lg dark:shadow-brutal-dark-lg w-full max-w-md p-5 md:p-6 flex flex-col gap-4">
        <h3 className="text-xl md:text-2xl font-black text-red-500 uppercase flex items-center gap-2 border-b-4 border-slate-900 dark:border-slate-700 pb-3">
          <span className="material-symbols-outlined font-black text-3xl">
            warning
          </span>
          Peringatan Fatal!
        </h3>
        <p className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
          Yakin mau drop task ini? Task yang berstatus{" "}
          <strong className="text-red-500 uppercase">Abandoned</strong> tidak
          bisa dilanjutkan lagi secara permanen! Keputusan ini tidak dapat
          dibatalkan.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            disabled={pending}
            onClick={() => setIsModalOpen(false)}
            className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border-4 border-slate-900 dark:border-slate-700 font-black uppercase text-xs md:text-sm py-3 shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={handleConfirm}
            className="flex-1 bg-red-400 dark:bg-rose-700 text-slate-900 dark:text-white border-4 border-slate-900 dark:border-slate-700 font-black uppercase text-xs md:text-sm py-3 shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            Yakin Drop
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Tombol Pemicu di UI (Tidak melakukan submit langsung) */}
      {styleType === "detail" ? (
        <button
          type="button"
          onClick={handleTriggerClick}
          disabled={pending}
          className="px-5 py-2.5 bg-red-400 dark:bg-rose-700 text-slate-900 dark:text-white border-4 border-slate-900 dark:border-slate-700 font-black uppercase text-sm shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0"
        >
          <span className="material-symbols-outlined text-[18px] font-black">
            flag
          </span>
          {pending ? "Dropping..." : "Drop Task"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleTriggerClick}
          disabled={pending}
          className="text-xs bg-red-400 dark:bg-rose-700 text-slate-900 dark:text-white font-black uppercase border-2 border-slate-900 dark:border-slate-700 hover:-translate-y-1 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:shadow-brutal dark:hover:shadow-brutal-dark active:translate-y-0 active:shadow-none transition-all px-3 py-1.5 flex items-center gap-1 disabled:opacity-50 disabled:translate-y-0"
        >
          <span className="material-symbols-outlined text-[14px] font-black">
            flag
          </span>
          {pending ? "..." : "Drop Task"}
        </button>
      )}

      {/* Trik: Tombol Submit Rahasia (Disembunyikan) */}
      <button
        type="submit"
        ref={hiddenSubmitRef}
        className="hidden"
        aria-hidden="true"
      />

      {/* Render Pop-up menggunakan Portal agar overlay berada di seluruh layar */}
      {mounted && isModalOpen && createPortal(<Modal />, document.body)}
    </>
  );
}

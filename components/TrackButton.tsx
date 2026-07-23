"use client";

import { useFormStatus } from "react-dom";

export default function TrackButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full md:w-auto px-6 py-3 font-black uppercase text-sm border-2 border-slate-900 dark:border-slate-700 transition-all flex justify-center items-center gap-2 shadow-brutal dark:shadow-brutal-dark
        ${
          pending
            ? "bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-wait shadow-none translate-y-1"
            : "bg-blue-300 dark:bg-sky-700 text-slate-900 dark:text-white hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-1 active:shadow-none"
        }
      `}
    >
      {pending ? "Adding..." : "+ Track"}
    </button>
  );
}

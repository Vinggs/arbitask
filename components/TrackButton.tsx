"use client";

import { useFormStatus } from "react-dom";

export default function TrackButton() {
  // Hook ini akan bernilai 'true' saat Server Action sedang memproses data
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full md:w-auto px-6 py-3 font-black uppercase text-sm border-2 border-black dark:border-white transition-all flex justify-center items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]
        ${
          pending
            ? "bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-wait shadow-none translate-y-1"
            : "bg-[#93C5FD] dark:bg-blue-600 text-black dark:text-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:shadow-none"
        }
      `}
    >
      {pending ? "Adding..." : "+ Track"}
    </button>
  );
}

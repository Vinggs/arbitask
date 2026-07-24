"use client";

import { useState, useTransition } from "react";
import { skipMilestone } from "@/app/[locale]/actions";

export default function SkipMilestoneButton({
  taskId,
  milestoneId,
}: {
  taskId: string;
  milestoneId: string;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSkip = () => {
    startTransition(async () => {
      await skipMilestone(taskId, milestoneId);
      setIsConfirming(false);
    });
  };

  if (isConfirming) {
    return (
      <div className="mt-4 p-4 border-4 border-slate-900 dark:border-slate-700 bg-red-300 dark:bg-rose-800 shadow-brutal-sm dark:shadow-brutal-dark-sm transition-colors">
        <p className="text-[10px] md:text-xs font-black uppercase text-slate-900 dark:text-white mb-3">
          Yakin mau skip? Reward tier ini tidak akan ditambahkan ke total yield.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleSkip}
            disabled={isPending}
            className="flex-1 px-3 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black uppercase text-[10px] md:text-xs border-2 border-slate-900 dark:border-slate-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {isPending ? "Skipping..." : "Yakin, Skip"}
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            disabled={isPending}
            className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase text-[10px] md:text-xs border-2 border-slate-900 dark:border-slate-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="mt-4 w-full px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border-4 border-slate-900 dark:border-slate-700 font-black uppercase text-[10px] md:text-xs shadow-brutal-sm dark:shadow-brutal-dark-sm hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined text-[16px] md:text-[18px]">
        skip_next
      </span>
      Skip Milestone (No Top-up)
    </button>
  );
}

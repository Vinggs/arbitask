"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserBalance } from "@/app/[locale]/actions";

export default function HeaderBalance() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      getUserBalance(session.user.email).then((total) => {
        setBalance(total);
        setLoading(false);
      });
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="hidden md:block w-[80px] h-[34px] bg-slate-200 dark:bg-slate-800 animate-pulse border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm"></div>
    );
  }

  if (!session) return null;

  return (
    <div
      className="hidden md:flex items-center gap-2 bg-emerald-400 dark:bg-teal-600 px-3 py-1.5 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm cursor-default hover:-translate-y-px hover:shadow-brutal dark:hover:shadow-brutal-dark transition-all"
      title="Total Cuan Arbitrase Terkumpul"
    >
      <span className="material-symbols-outlined text-[18px] text-slate-900 dark:text-white font-black">
        account_balance_wallet
      </span>
      <span className="text-sm font-black text-slate-900 dark:text-white">
        ${balance.toFixed(2)}
      </span>
    </div>
  );
}

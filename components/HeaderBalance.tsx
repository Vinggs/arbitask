"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserBalance } from "@/app/actions";

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
      <div className="hidden md:block w-[80px] h-[34px] bg-slate-200 dark:bg-slate-700 animate-pulse border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"></div>
    );
  }

  if (!session) return null;

  return (
    <div
      className="hidden md:flex items-center gap-2 bg-[#A3E635] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-default hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
      title="Total Cuan Arbitrase Terkumpul"
    >
      <span className="material-symbols-outlined text-[18px] text-black font-black">
        account_balance_wallet
      </span>
      <span className="text-sm font-black text-black">
        ${balance.toFixed(2)}
      </span>
    </div>
  );
}

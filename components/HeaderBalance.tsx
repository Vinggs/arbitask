"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserBalance } from "@/app/actions";

export default function HeaderBalance() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kalau user udah login dan emailnya ada, tarik datanya dari database
    if (session?.user?.email) {
      getUserBalance(session.user.email).then((total) => {
        setBalance(total);
        setLoading(false);
      });
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  // Efek loading skeleton biar UI gak lompat pas data lagi diambil
  if (status === "loading" || loading) {
    return (
      <div className="hidden md:block w-[80px] h-[34px] bg-emerald-50/50 animate-pulse rounded-full border border-emerald-100"></div>
    );
  }

  // Kalau belum login, hilangin aja badge-nya
  if (!session) return null;

  return (
    <div
      className="hidden md:flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm cursor-default hover:shadow-md transition-shadow"
      title="Total Cuan Arbitrase Terkumpul"
    >
      <span className="material-symbols-outlined text-[18px] text-emerald-600">
        account_balance_wallet
      </span>
      <span className="text-sm font-bold text-emerald-700">
        ${balance.toFixed(2)}
      </span>
    </div>
  );
}

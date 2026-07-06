"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-10 h-10 bg-surface-container animate-pulse rounded-xl border border-outline-variant"></div>
    );
  }

  // Tampilan Kotak Avatar
  if (session && session.user) {
    // LOGIKA BARU: Ambil nama, kalau kosong (karena login email), pakai emailnya.
    const userName = session.user.name || session.user.email || "User";

    // Bikin link avatar otomatis
    const profileImage =
      session.user.image ||
      `https://ui-avatars.com/api/?name=${userName}&background=0f172a&color=fff&size=128&bold=true`;

    return (
      <Link href="/profile" title="View Profile">
        <img
          src={profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-xl object-cover border border-outline-variant shadow-sm hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer bg-surface-container"
        />
      </Link>
    );
  }

  // Tombol Login Universal
  return (
    <button
      onClick={() => signIn()}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5"
      title="Sign In"
    >
      <span className="material-symbols-outlined text-[20px]">login</span>
    </button>
  );
}

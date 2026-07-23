"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 animate-pulse border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm"></div>
    );
  }

  if (session && session.user) {
    const userName = session.user.name || session.user.email || "User";
    const profileImage =
      session.user.image ||
      `https://ui-avatars.com/api/?name=${userName}&background=000&color=fff&size=128&bold=true`;

    return (
      <Link
        href="/profile"
        title="View Profile"
        className="block w-10 h-10 border-2 border-slate-900 dark:border-slate-700 bg-white hover:-translate-y-1 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:shadow-brutal dark:hover:shadow-brutal-dark transition-all"
      >
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </Link>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="w-10 h-10 flex items-center justify-center bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-dark active:translate-y-0 active:shadow-none transition-all"
      title="Sign In"
    >
      <span className="material-symbols-outlined text-[20px] font-black">
        login
      </span>
    </button>
  );
}

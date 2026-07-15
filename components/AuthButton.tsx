"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 animate-pulse border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"></div>
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
        className="block w-10 h-10 border-2 border-black dark:border-white bg-white hover:-translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
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
      className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all"
      title="Sign In"
    >
      <span className="material-symbols-outlined text-[20px] font-black">
        login
      </span>
    </button>
  );
}

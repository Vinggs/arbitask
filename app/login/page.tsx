"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl: "/" });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-5 md:p-8 shadow-brutal-lg dark:shadow-brutal-dark-lg transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-400 dark:bg-teal-600 mx-auto border-4 border-slate-900 dark:border-slate-700 flex items-center justify-center mb-4 shadow-brutal dark:shadow-brutal-dark transition-colors">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-slate-900 dark:text-white font-black">
              task_alt
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase text-slate-900 dark:text-white mb-1 transition-colors">
            Login Arbitask
          </h1>
          <p className="font-bold text-slate-600 dark:text-slate-400 text-[10px] md:text-sm uppercase transition-colors tracking-widest">
            Pilih metode akses untuk masuk
          </p>
        </div>

        {/* Tombol Sosmed */}
        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-amber-300 dark:bg-amber-600 border-4 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-black uppercase text-xs md:text-sm shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Login with Google
          </button>

          <button
            onClick={() => signIn("twitter", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white font-black uppercase text-xs md:text-sm shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-5 h-5 text-slate-900 dark:text-white"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
            </svg>
            Login with X (Twitter)
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white border-4 border-slate-900 dark:border-slate-700 font-black uppercase text-xs md:text-sm shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                className="w-4 h-4 invert dark:invert-0"
              />
              GitHub
            </button>
            <button
              onClick={() => signIn("discord", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-300 dark:bg-sky-700 border-4 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-black uppercase text-xs md:text-sm shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all"
            >
              <img
                src="https://www.svgrepo.com/show/353655/discord-icon.svg"
                alt="Discord"
                className="w-4 h-4"
              />
              Discord
            </button>
          </div>
        </div>

        {/* Pemisah */}
        <div className="my-6 md:my-8 flex items-center gap-2 md:gap-4">
          <div className="h-1 bg-slate-900 dark:bg-slate-700 flex-1 transition-colors"></div>
          <span className="text-[10px] md:text-xs text-slate-900 dark:text-slate-400 font-black uppercase transition-colors tracking-widest whitespace-nowrap">
            OR MAGIC LINK
          </span>
          <div className="h-1 bg-slate-900 dark:bg-slate-700 flex-1 transition-colors"></div>
        </div>

        {/* Form Email */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="email@kamu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-950 border-4 border-slate-900 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-slate-200 focus:outline-none shadow-brutal dark:shadow-brutal-dark focus:-translate-y-1 transition-all placeholder-slate-400 dark:placeholder-slate-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 font-black uppercase text-xs md:text-sm border-4 border-slate-900 dark:border-slate-700 hover:-translate-y-1 shadow-brutal dark:shadow-brutal-dark hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin text-[18px] md:text-[20px] font-black">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-[18px] md:text-[20px] font-black">
                mail
              </span>
            )}
            Send Login Link
          </button>
        </form>

        <div className="mt-6 md:mt-8 text-center">
          <Link
            href="/"
            className="text-[10px] md:text-xs font-black uppercase text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1 inline-flex border-b-2 border-transparent hover:border-slate-900 dark:hover:border-slate-200"
          >
            <span className="material-symbols-outlined text-[14px] md:text-[16px] font-black">
              arrow_back
            </span>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

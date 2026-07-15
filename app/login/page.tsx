"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi buat ngirim Magic Link
  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl: "/" });
    setIsLoading(false);
  };

  return (
    // Background Solid Clean Neo-Brutalism
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F5F0] dark:bg-[#0B1120] transition-colors duration-300">
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#A3E635] dark:bg-green-500 mx-auto border-4 border-black dark:border-white flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors">
            <span className="material-symbols-outlined text-4xl text-black font-black">
              task_alt
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase text-black dark:text-white mb-1 transition-colors">
            Login Arbitask
          </h1>
          <p className="font-bold text-slate-700 dark:text-slate-400 text-sm uppercase transition-colors">
            Pilih metode akses untuk masuk
          </p>
        </div>

        {/* Tombol Sosmed - Neo Brutalism */}
        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FCD34D] border-4 border-black text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all"
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
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-4 border-black dark:border-white text-black dark:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-5 h-5 text-black dark:text-white"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
            </svg>
            Login with X (Twitter)
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-slate-700 text-white border-4 border-black dark:border-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all"
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
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#93C5FD] border-4 border-black text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all"
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

        {/* Pemisah Brutalist */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-1 bg-black dark:bg-white flex-1 transition-colors"></div>
          <span className="text-xs text-black dark:text-white font-black uppercase transition-colors">
            OR MAGIC LINK
          </span>
          <div className="h-1 bg-black dark:bg-white flex-1 transition-colors"></div>
        </div>

        {/* Form Email Magic Link */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="email@kamu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-4 border-black dark:border-white font-bold text-black dark:text-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:-translate-y-1 transition-all placeholder-slate-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase border-4 border-black dark:border-white hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin text-[20px] font-black">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px] font-black">
                mail
              </span>
            )}
            Send Login Link
          </button>
        </form>

        {/* Tombol Kembali */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs font-black uppercase text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-1 inline-flex border-b-2 border-transparent hover:border-black dark:hover:border-white"
          >
            <span className="material-symbols-outlined text-[16px] font-black">
              arrow_back
            </span>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

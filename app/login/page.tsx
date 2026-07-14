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
    // Tambahin dark:bg-[#0B1120] dan transisi
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-container-lowest dark:bg-[#0B1120] transition-colors duration-300">
      {/* Background Aksen */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-fixed/20 dark:from-blue-900/20 via-surface-container-lowest dark:via-[#0B1120] to-surface-container-lowest dark:to-[#0B1120] transition-colors duration-300"></div>

      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-outline-variant/50 dark:border-slate-800 transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary dark:bg-blue-600 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-primary/20 dark:shadow-blue-900/20 transition-colors">
            <span className="material-symbols-outlined text-3xl text-on-primary dark:text-white">
              task_alt
            </span>
          </div>
          <h1 className="font-headline-md text-primary dark:text-slate-100 font-bold mb-1 transition-colors">
            Masuk ke Arbitask
          </h1>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm transition-colors">
            Pilih metode login untuk melanjutkan
          </p>
        </div>

        {/* Tombol Sosmed */}
        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 border border-outline-variant/50 dark:border-slate-700 transition-all font-medium text-on-surface dark:text-slate-200"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Lanjutkan dengan Google
          </button>

          <button
            onClick={() => signIn("twitter", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 border border-outline-variant/50 dark:border-slate-700 transition-all font-medium text-on-surface dark:text-slate-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-5 h-5 text-on-surface dark:text-slate-200"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
            </svg>
            Lanjutkan dengan X (Twitter)
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 border border-outline-variant/50 dark:border-slate-700 transition-all font-medium text-sm text-on-surface dark:text-slate-200"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                className="w-4 h-4 dark:invert"
              />
              GitHub
            </button>
            <button
              onClick={() => signIn("discord", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high dark:hover:bg-slate-700 border border-outline-variant/50 dark:border-slate-700 transition-all font-medium text-sm text-on-surface dark:text-slate-200"
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
        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-outline-variant/50 dark:bg-slate-700 flex-1 transition-colors"></div>
          <span className="text-xs text-on-surface-variant dark:text-slate-500 font-medium transition-colors">
            ATAU LINK
          </span>
          <div className="h-px bg-outline-variant/50 dark:bg-slate-700 flex-1 transition-colors"></div>
        </div>

        {/* Form Email Magic Link */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="email@kamu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant dark:border-slate-700 bg-surface-container-lowest dark:bg-slate-900 focus:border-primary dark:focus:border-blue-500 focus:ring-1 focus:ring-primary dark:focus:ring-blue-500 outline-none transition-all text-on-surface dark:text-slate-200 placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-primary dark:bg-blue-600 text-on-primary dark:text-white font-bold hover:bg-primary/90 dark:hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">
                mail
              </span>
            )}
            Kirim Link Login
          </button>
        </form>

        {/* Tombol Kembali */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1 inline-flex"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

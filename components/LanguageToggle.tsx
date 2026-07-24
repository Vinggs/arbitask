"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPathname;
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => switchLanguage("id")}
        className={`px-4 py-2 md:py-2.5 border-2 border-slate-900 dark:border-slate-700 font-black uppercase text-[10px] md:text-xs transition-all ${
          locale === "id"
            ? "bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white translate-y-px shadow-none"
            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-dark shadow-brutal-sm dark:shadow-brutal-dark-sm"
        }`}
      >
        Indonesia
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={`px-4 py-2 md:py-2.5 border-2 border-slate-900 dark:border-slate-700 font-black uppercase text-[10px] md:text-xs transition-all ${
          locale === "en"
            ? "bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white translate-y-px shadow-none"
            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-dark shadow-brutal-sm dark:shadow-brutal-dark-sm"
        }`}
      >
        English
      </button>
    </div>
  );
}

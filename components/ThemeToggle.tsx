"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-4 py-2 flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border-2 border-black dark:border-white text-black dark:text-white font-black uppercase text-xs rounded-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all"
    >
      <span className="material-symbols-outlined text-[18px] font-black">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

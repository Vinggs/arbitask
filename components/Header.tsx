// File: components/Header.tsx
import AuthButton from "./AuthButton";
import HeaderBalance from "./HeaderBalance";
import HeaderNotification from "./HeaderNotification";
import ThemeToggle from "./ThemeToggle"; // <-- 1. Import ThemeToggle di sini

export default function Header({ title }: { title: string }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    // Tambahin transisi dan warna dark mode (dark:bg-slate-900, dll) biar headernya ikut gelap
    <header className="flex items-center justify-between h-[80px] min-h-[80px] max-h-[80px] shrink-0 bg-surface-container-lowest dark:bg-[#0B1120] border-b border-outline-variant dark:border-slate-800 px-margin-desktop sticky top-0 z-40 box-border transition-colors duration-300">
      <h1 className="font-headline-lg text-primary dark:text-slate-100 truncate">
        {title}
      </h1>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden lg:flex items-center text-sm font-medium text-on-surface-variant dark:text-slate-400">
          <span className="material-symbols-outlined text-[18px] mr-1.5">
            calendar_today
          </span>
          {formattedDate}
        </div>

        <div className="hidden md:block h-6 w-px bg-outline-variant dark:bg-slate-700"></div>

        <HeaderBalance />

        {/* 2. Taruh tombol ThemeToggle di sebelah kiri Notifikasi biar rapi */}
        <ThemeToggle />

        <HeaderNotification />

        <div className="ml-1 sm:ml-2">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

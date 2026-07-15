// File: components/Header.tsx
import AuthButton from "./AuthButton";
import HeaderBalance from "./HeaderBalance";
import HeaderNotification from "./HeaderNotification";

export default function Header({ title }: { title: string }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between h-[80px] min-h-[80px] max-h-[80px] shrink-0 bg-[#F4F5F0] dark:bg-[#0B1120] border-b-2 border-black dark:border-white px-margin-desktop sticky top-0 z-40 box-border transition-colors duration-300">
      <h1 className="font-headline-lg font-black uppercase text-black dark:text-white truncate">
        {title}
      </h1>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden lg:flex items-center text-sm font-black uppercase text-black dark:text-slate-300">
          <span className="material-symbols-outlined text-[18px] mr-1.5 font-black">
            calendar_today
          </span>
          {formattedDate}
        </div>

        <div className="hidden md:block h-8 w-[2px] bg-black dark:bg-white"></div>

        <HeaderBalance />
        <HeaderNotification />

        <div className="ml-1 sm:ml-2">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

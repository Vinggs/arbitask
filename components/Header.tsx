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
    // ✅ UPDATE: Tambahin "pr-16 md:pr-margin-desktop px-4" biar tombol Notif & Profile ga ketimpa menu hamburger di HP
    <header className="flex items-center justify-between h-[80px] min-h-[80px] max-h-[80px] shrink-0 bg-[#F4F5F0] dark:bg-[#0B1120] border-b-2 border-black dark:border-white px-4 pr-16 md:px-margin-desktop sticky top-0 z-40 box-border transition-colors duration-300">
      <h1 className="text-lg md:text-2xl font-black uppercase text-black dark:text-white truncate">
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

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
    // HAPUS overflow-hidden di baris className ini!
    <header className="flex items-center justify-between h-[80px] min-h-[80px] max-h-[80px] shrink-0 bg-surface-container-lowest border-b border-outline-variant px-margin-desktop sticky top-0 z-40 box-border">
      <h1 className="font-headline-lg text-primary truncate">{title}</h1>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden lg:flex items-center text-sm font-medium text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] mr-1.5">
            calendar_today
          </span>
          {formattedDate}
        </div>

        <div className="hidden md:block h-6 w-px bg-outline-variant"></div>

        <HeaderBalance />

        <HeaderNotification />

        <div className="ml-1 sm:ml-2">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

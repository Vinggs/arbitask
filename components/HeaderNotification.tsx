"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getUserNotifications } from "@/app/[locale]/profile/actions";
import { formatDistanceToNow } from "date-fns";
import { id, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";

export default function HeaderNotification() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("HeaderNotification");
  const locale = useLocale();

  useEffect(() => {
    if (session?.user?.email) {
      getUserNotifications(session.user.email).then((notifs) => {
        setNotifications(notifs);
      });
    }
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayNotifs = notifications.slice(0, 3);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-transparent border-2 border-transparent hover:border-slate-900 dark:hover:border-slate-700 text-slate-900 dark:text-white transition-all focus:outline-none"
        title={t("title")}
      >
        <span className="material-symbols-outlined text-[24px] font-black">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-rose-500 border-2 border-slate-900 dark:border-slate-700"></span>
        )}
      </button>

      {/* DROPDOWN MENU KECIL */}
      {isOpen && (
        <div className="absolute right-[-40px] sm:right-0 mt-4 w-[300px] sm:w-80 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 shadow-brutal-lg dark:shadow-brutal-dark-lg z-50 transition-colors">
          <div className="p-4 border-b-4 border-slate-900 dark:border-slate-700 flex justify-between items-center bg-amber-300 dark:bg-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
              {t("title")}
            </h3>
            {unreadCount > 0 && (
              <span className="bg-slate-900 dark:bg-slate-200 text-slate-100 dark:text-slate-900 text-[10px] font-black uppercase px-2 py-1">
                {t("newBadge", { count: unreadCount })}
              </span>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
            {displayNotifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-bold uppercase border-b-4 border-slate-900 dark:border-slate-700">
                {t("empty")}
              </div>
            ) : (
              displayNotifs.map((notif) => (
                <Link
                  href="/profile?tab=inbox"
                  key={notif.id}
                  onClick={() => setIsOpen(false)}
                  className={`block p-4 border-b-2 border-dashed border-slate-900 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!notif.isRead ? "bg-emerald-400/20 dark:bg-teal-900/40" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase line-clamp-1">
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 whitespace-nowrap ml-2 font-bold uppercase border-b-2 border-slate-600 dark:border-slate-400">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: locale === "id" ? id : enUS,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </Link>
              ))
            )}
          </div>

          <Link
            href="/profile?tab=inbox"
            onClick={() => setIsOpen(false)}
            className="block p-4 text-center text-sm font-black uppercase text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors bg-white dark:bg-slate-900"
          >
            {t("viewAll")}
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getUserNotifications } from "@/app/profile/actions";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default function HeaderNotification() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        className="relative p-2 bg-transparent border-2 border-transparent hover:border-black dark:hover:border-white text-black dark:text-white transition-all focus:outline-none"
        title="Notifikasi"
      >
        <span className="material-symbols-outlined text-[24px] font-black">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-black dark:border-white"></span>
        )}
      </button>

      {/* DROPDOWN MENU KECIL - NEO BRUTALISM */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] z-50 transition-all">
          <div className="p-4 border-b-4 border-black dark:border-white flex justify-between items-center bg-[#FCD34D] dark:bg-slate-800">
            <h3 className="font-black text-black dark:text-white uppercase text-sm">
              Notifikasi
            </h3>
            {unreadCount > 0 && (
              <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase px-2 py-1">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {displayNotifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-bold uppercase">
                Belum ada notifikasi.
              </div>
            ) : (
              displayNotifs.map((notif) => (
                <Link
                  href="/profile?tab=inbox"
                  key={notif.id}
                  onClick={() => setIsOpen(false)}
                  className={`block p-4 border-b-2 border-dashed border-black dark:border-white hover:bg-[#F4F5F0] dark:hover:bg-slate-800 transition-colors ${!notif.isRead ? "bg-[#A3E635]/20 dark:bg-green-900/20" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-black text-black dark:text-white uppercase line-clamp-1">
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 whitespace-nowrap ml-2 font-bold uppercase border-b-2 border-slate-600">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: id,
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
            className="block p-4 text-center text-sm font-black uppercase text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors bg-white dark:bg-slate-900"
          >
            Lihat Semua di Inbox
          </Link>
        </div>
      )}
    </div>
  );
}

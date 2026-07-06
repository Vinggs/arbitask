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

  // Buat ngedeteksi klik di luar kotak dropdown biar otomatis nutup
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user?.email) {
      getUserNotifications(session.user.email).then((notifs) => {
        setNotifications(notifs);
      });
    }
  }, [session]);

  // Logika buat nutup dropdown kalau user ngeklik sembarang tempat
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
  // Cuma tampilin maksimal 3 pesan terbaru di dropdown
  const displayNotifs = notifications.slice(0, 3);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
        title="Notifikasi"
      >
        <span className="material-symbols-outlined text-[22px]">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-surface-container-lowest rounded-full"></span>
        )}
      </button>

      {/* DROPDOWN MENU KECIL */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/60 overflow-hidden z-50 transform origin-top-right transition-all">
          <div className="p-4 border-b border-outline-variant/50 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm">Notifikasi</h3>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {displayNotifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-on-surface-variant font-medium">
                Belum ada notifikasi.
              </div>
            ) : (
              displayNotifs.map((notif) => (
                <Link
                  href="/profile?tab=inbox" // <-- Kode sakti buat ngarahin ke tab inbox
                  key={notif.id}
                  onClick={() => setIsOpen(false)}
                  className={`block p-4 border-b border-outline-variant/30 hover:bg-surface-container/50 transition-colors ${!notif.isRead ? "bg-primary/5" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-on-surface-variant whitespace-nowrap ml-2 font-medium">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </Link>
              ))
            )}
          </div>

          <Link
            href="/profile?tab=inbox"
            onClick={() => setIsOpen(false)}
            className="block p-3 text-center text-xs font-bold text-primary hover:bg-surface-container/50 transition-colors bg-white"
          >
            Lihat Semua di Inbox
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  getProfileStats,
  updateUserProfile,
  getUserNotifications,
  markAllNotificationsAsRead,
} from "./actions";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState("personal");

  // --- TAMBAHIN BLOK KODE INI ---
  // Fungsi buat ngebaca URL dari lonceng notifikasi
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "inbox") {
      setActiveTab("inbox"); // Langsung buka tab inbox
    }
  }, []);
  // -----------------------------

  // State form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // State loading & data dinamis
  const [stats, setStats] = useState({ taskCount: 0, totalYield: 0 });
  const [notifications, setNotifications] = useState<any[]>([]); // Menyimpan data notif dari DB
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const userEmail = session?.user?.email || "";

  // Tarik data pas komponen dimuat
  useEffect(() => {
    if (userEmail) {
      // Tarik stats task
      getProfileStats(userEmail).then((data) => {
        setStats(data);
        setIsLoadingStats(false);
      });
      // Tarik data notifikasi
      getUserNotifications(userEmail).then((data) => {
        setNotifications(data);
      });
    }
  }, [userEmail]);

  // Set nilai awal form pas data session masuk
  useEffect(() => {
    if (session?.user) {
      const fullName = session.user.name || "";
      const nameParts = fullName.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
    }
  }, [session]);

  // Fungsi simpan perubahan form profile
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    const result = await updateUserProfile(
      userEmail,
      firstName,
      lastName,
      phone,
    );

    if (result.success) {
      // Paksa NextAuth buat update session lokal biar nama di pojok kanan atas ikut ganti
      await update({ name: `${firstName} ${lastName}`.trim() });
      setSaveMessage("Berhasil disimpan!");
    } else {
      setSaveMessage("Gagal menyimpan data.");
    }

    setIsSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // Fungsi tandai semua notifikasi terbaca
  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(userEmail);
    // Update state lokal tanpa refresh halaman
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  const fullName = session?.user?.name || userEmail.split("@")[0] || "User";
  const profileImage =
    session?.user?.image ||
    `https://ui-avatars.com/api/?name=${fullName}&background=0f172a&color=fff&size=128&bold=true`;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="User Profile - Arbitask" />

        <main className="flex-1 p-6 max-w-[1200px] w-full mx-auto space-y-6">
          {/* HERO BANNER */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/60 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
            <div className="relative group w-24 h-24 flex-shrink-0">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-background shadow-md bg-surface-container"
              />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h2 className="text-2xl font-bold text-slate-900">
                  {fullName}
                </h2>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold w-fit mx-auto md:mx-0">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  Elite Arbitrager
                </div>
              </div>
              <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                Akun terverifikasi Arbitask. Saat ini melacak dan mengoptimalkan
                yield secara real-time dari berbagai offerwall.
              </p>
            </div>
          </div>

          {/* STATS GRID ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Potensi Yield Tracked
                </p>
                <p className="text-2xl font-bold text-primary">
                  ${stats.totalYield.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <span className="material-symbols-outlined">task_alt</span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Tasks Tracked
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.taskCount}
                </p>
              </div>
            </div>
            <div className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <span className="material-symbols-outlined">
                  local_fire_department
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-orange-600">Active</p>
              </div>
            </div>
          </div>

          {/* TABS & SETTINGS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* SUB-TABS NAVIGATION */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 border-b lg:border-b-0 border-outline-variant/50">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap w-full text-left ${activeTab === "personal" ? "bg-slate-900 text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-container"}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>{" "}
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap w-full text-left ${activeTab === "security" ? "bg-slate-900 text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-container"}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  shield
                </span>{" "}
                Security Settings
              </button>
              <button
                onClick={() => setActiveTab("inbox")}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap w-full text-left ${activeTab === "inbox" ? "bg-slate-900 text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-container"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">
                    inbox
                  </span>{" "}
                  Inbox
                </div>
                {unreadCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "inbox" ? "bg-white/20 text-white" : "bg-primary text-on-primary"}`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* CONTENT VIEWS */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "personal" && (
                <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/60 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Personal Information
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Kelola detail informasi dasar akun lu.
                    </p>
                  </div>
                  <div className="h-px bg-outline-variant/40"></div>

                  <form className="space-y-4" onSubmit={handleSaveChanges}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-on-surface-variant">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-on-surface-variant">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={userEmail}
                          disabled
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-outline-variant bg-slate-50 text-on-surface-variant/70 text-sm cursor-not-allowed outline-none"
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-[20px]">
                          check_circle
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+62 8xx-xxxx-xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      {saveMessage && (
                        <span className="text-xs font-medium text-emerald-600">
                          {saveMessage}
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2"
                      >
                        {isSaving ? (
                          <span className="material-symbols-outlined animate-spin text-[16px]">
                            progress_activity
                          </span>
                        ) : null}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/60 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Security & Protection
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium">
                      Proteksi akses masuk akun pelacakan lu.
                    </p>
                  </div>
                  <div className="h-px bg-outline-variant/40"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container/40 border border-outline-variant/30">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Password
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Atur kata sandi untuk login manual lewat form email.
                      </p>
                    </div>
                    <button className="px-4 py-2 border border-outline-variant hover:bg-surface-container font-semibold text-xs rounded-xl transition-all">
                      Set New Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "inbox" && (
                <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/60 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        System Inbox
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        Pesan dan notifikasi seputar akun lu.
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="h-px bg-outline-variant/40"></div>

                  <div className="space-y-3">
                    {/* INI BAGIAN DINAMIS YANG NARIK DARI DB */}
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-on-surface-variant text-sm">
                        Belum ada notifikasi masuk.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 rounded-xl border flex gap-4 items-start transition-colors ${!notif.isRead ? "border-primary/20 bg-primary/5" : "border-outline-variant/50 opacity-70"}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notif.isRead ? "bg-primary/20 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {notif.type === "SYSTEM"
                                ? "settings"
                                : notif.type === "ACHIEVEMENT"
                                  ? "celebration"
                                  : "sync"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-bold text-slate-900">
                                {notif.title}
                              </p>
                              <span className="text-[10px] font-medium text-on-surface-variant">
                                {formatDistanceToNow(
                                  new Date(notif.createdAt),
                                  { addSuffix: true, locale: id },
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

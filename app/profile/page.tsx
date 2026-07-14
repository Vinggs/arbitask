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
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0B1120] transition-colors duration-300">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary dark:text-blue-500">
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
    <div className="flex min-h-screen bg-background dark:bg-[#0B1120] text-on-surface dark:text-slate-200 transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="User Profile - Arbitask" />

        <main className="flex-1 p-6 max-w-[1200px] w-full mx-auto space-y-6">
          {/* HERO BANNER */}
          <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/60 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 dark:from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>
            <div className="relative group w-24 h-24 flex-shrink-0">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-background dark:border-slate-800 shadow-md bg-surface-container dark:bg-slate-700 transition-colors"
              />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
                  {fullName}
                </h2>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold w-fit mx-auto md:mx-0 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  Elite Arbitrager
                </div>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 max-w-2xl leading-relaxed transition-colors">
                Akun terverifikasi Arbitask. Saat ini melacak dan mengoptimalkan
                yield secara real-time dari berbagai offerwall.
              </p>
            </div>
          </div>

          {/* STATS GRID ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/60 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-400 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant dark:text-slate-400 uppercase tracking-wider transition-colors">
                  Potensi Yield Tracked
                </p>
                <p className="text-2xl font-bold text-primary dark:text-slate-100 transition-colors">
                  ${stats.totalYield.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="p-5 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/60 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">task_alt</span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant dark:text-slate-400 uppercase tracking-wider transition-colors">
                  Tasks Tracked
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
                  {stats.taskCount}
                </p>
              </div>
            </div>
            <div className="p-5 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/60 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">
                  local_fire_department
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-on-surface-variant dark:text-slate-400 uppercase tracking-wider transition-colors">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 transition-colors">
                  Active
                </p>
              </div>
            </div>
          </div>

          {/* TABS & SETTINGS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* SUB-TABS NAVIGATION */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 border-b lg:border-b-0 border-outline-variant/50 dark:border-slate-800">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap w-full text-left ${activeTab === "personal" ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm" : "text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800/50"}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>{" "}
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap w-full text-left ${activeTab === "security" ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm" : "text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800/50"}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  shield
                </span>{" "}
                Security Settings
              </button>
              <button
                onClick={() => setActiveTab("inbox")}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-colors whitespace-nowrap w-full text-left ${activeTab === "inbox" ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm" : "text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800/50"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">
                    inbox
                  </span>{" "}
                  Inbox
                </div>
                {unreadCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "inbox" ? "bg-white/20 text-white" : "bg-primary dark:bg-blue-600 text-on-primary dark:text-white"}`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* CONTENT VIEWS */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "personal" && (
                <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/60 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors">
                      Personal Information
                    </h3>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 transition-colors">
                      Kelola detail informasi dasar akun lu.
                    </p>
                  </div>
                  <div className="h-px bg-outline-variant/40 dark:bg-slate-800 transition-colors"></div>

                  <form className="space-y-4" onSubmit={handleSaveChanges}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 transition-colors">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant dark:border-slate-700 bg-surface-container-lowest dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:border-primary dark:focus:border-blue-500 focus:ring-1 focus:ring-primary dark:focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 transition-colors">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant dark:border-slate-700 bg-surface-container-lowest dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:border-primary dark:focus:border-blue-500 focus:ring-1 focus:ring-primary dark:focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 transition-colors">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={userEmail}
                          disabled
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-outline-variant dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-on-surface-variant/70 dark:text-slate-500 text-sm cursor-not-allowed outline-none transition-colors"
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 text-[20px] transition-colors">
                          check_circle
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 transition-colors">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+62 8xx-xxxx-xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-outline-variant dark:border-slate-700 bg-surface-container-lowest dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:border-primary dark:focus:border-blue-500 focus:ring-1 focus:ring-primary dark:focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      {saveMessage && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {saveMessage}
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-70 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2"
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
                <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/60 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors">
                      Security & Protection
                    </h3>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 font-medium transition-colors">
                      Proteksi akses masuk akun pelacakan lu.
                    </p>
                  </div>
                  <div className="h-px bg-outline-variant/40 dark:bg-slate-800 transition-colors"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container/40 dark:bg-slate-800/40 border border-outline-variant/30 dark:border-slate-700/50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors">
                        Password
                      </p>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5 transition-colors">
                        Atur kata sandi untuk login manual lewat form email.
                      </p>
                    </div>
                    <button className="px-4 py-2 border border-outline-variant dark:border-slate-700 hover:bg-surface-container dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all">
                      Set New Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "inbox" && (
                <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/60 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors">
                        System Inbox
                      </h3>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 transition-colors">
                        Pesan dan notifikasi seputar akun lu.
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-bold text-primary dark:text-blue-400 hover:underline transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="h-px bg-outline-variant/40 dark:bg-slate-800 transition-colors"></div>

                  <div className="space-y-3">
                    {/* INI BAGIAN DINAMIS YANG NARIK DARI DB */}
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-on-surface-variant dark:text-slate-400 text-sm transition-colors">
                        Belum ada notifikasi masuk.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 rounded-xl border flex gap-4 items-start transition-colors ${!notif.isRead ? "border-primary/20 dark:border-blue-900/50 bg-primary/5 dark:bg-blue-900/10" : "border-outline-variant/50 dark:border-slate-800 opacity-70"}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${!notif.isRead ? "bg-primary/20 dark:bg-blue-900/30 text-primary dark:text-blue-400" : "bg-surface-container-high dark:bg-slate-800 text-on-surface-variant dark:text-slate-400"}`}
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
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors">
                                {notif.title}
                              </p>
                              <span className="text-[10px] font-medium text-on-surface-variant dark:text-slate-500 transition-colors">
                                {formatDistanceToNow(
                                  new Date(notif.createdAt),
                                  { addSuffix: true, locale: id },
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed transition-colors">
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

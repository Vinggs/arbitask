"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle"; // IMPORT THEMETOGGLE DI SINI
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "inbox") {
      setActiveTab("inbox");
    }
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [stats, setStats] = useState({ taskCount: 0, totalYield: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (userEmail) {
      getProfileStats(userEmail).then((data) => {
        setStats(data);
        setIsLoadingStats(false);
      });
      getUserNotifications(userEmail).then((data) => {
        setNotifications(data);
      });
    }
  }, [userEmail]);

  useEffect(() => {
    if (session?.user) {
      const fullName = session.user.name || "";
      const nameParts = fullName.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
    }
  }, [session]);

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
      await update({ name: `${firstName} ${lastName}`.trim() });
      setSaveMessage("SAVED SUCCESSFULLY!");
    } else {
      setSaveMessage("FAILED TO SAVE.");
    }

    setIsSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(userEmail);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F0] dark:bg-[#0B1120]">
        <span className="material-symbols-outlined animate-spin text-4xl text-black dark:text-white font-black">
          progress_activity
        </span>
      </div>
    );
  }

  const fullName = session?.user?.name || userEmail.split("@")[0] || "User";
  const profileImage =
    session?.user?.image ||
    `https://ui-avatars.com/api/?name=${fullName}&background=000&color=fff&size=128&bold=true`;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="User Profile" />

        {/* ✅ FIX: Ganti p-6 jadi p-4 md:p-6 biar responsif */}
        <main className="flex-1 p-4 md:p-6 max-w-[1200px] w-full mx-auto space-y-4 md:space-y-6">
          {/* HERO BANNER - BRUTALISM */}
          <div className="bg-[#FCD34D] dark:bg-slate-800 rounded-md p-4 md:p-6 border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row items-center gap-4 md:gap-6 relative transition-colors duration-300">
            <div className="relative group w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover border-4 border-black bg-white"
              />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h2 className="text-2xl md:text-3xl font-black uppercase text-black dark:text-white">
                  {fullName}
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-1 md:px-3 bg-white border-2 border-black text-black text-[10px] md:text-xs font-black uppercase w-fit mx-auto md:mx-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-[14px] md:text-[16px] font-black">
                    verified
                  </span>
                  Elite Arbitrager
                </div>
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-300 max-w-2xl leading-relaxed">
                VERIFIED ARBITASK ACCOUNT. TRACKING AND OPTIMIZING YIELD IN
                REAL-TIME.
              </p>
            </div>
          </div>

          {/* STATS GRID ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="p-4 md:p-5 bg-[#A3E635] dark:bg-slate-800 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 md:gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-white dark:bg-slate-700 border-2 border-black dark:border-white text-black dark:text-white flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                  monitoring
                </span>
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-wider text-black dark:text-slate-300">
                  Total Yield Tracked
                </p>
                <p className="text-2xl md:text-3xl font-black text-black dark:text-white">
                  ${stats.totalYield.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="p-4 md:p-5 bg-white dark:bg-slate-900 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 md:gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-slate-200 dark:bg-slate-700 border-2 border-black dark:border-white text-black dark:text-white flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                  task_alt
                </span>
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-wider text-black dark:text-slate-300">
                  Tasks Tracked
                </p>
                <p className="text-2xl md:text-3xl font-black text-black dark:text-white">
                  {stats.taskCount}
                </p>
              </div>
            </div>
            <div className="p-4 md:p-5 bg-[#FCA5A5] dark:bg-slate-800 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3 md:gap-4 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-white dark:bg-slate-700 border-2 border-black dark:border-white text-black dark:text-white flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                  local_fire_department
                </span>
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-wider text-black dark:text-slate-300">
                  Current Streak
                </p>
                <p className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase">
                  Active
                </p>
              </div>
            </div>
          </div>

          {/* TABS & SETTINGS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 items-start">
            {/* ✅ FIX: Ditambahin whitespace-nowrap biar teks tab nggak kepotong-potong di HP */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 hide-scrollbar">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white font-black uppercase text-xs md:text-sm transition-all whitespace-nowrap w-auto lg:w-full text-left ${activeTab === "personal" ? "bg-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] translate-x-1" : "bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"}`}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                  person
                </span>{" "}
                Personal Info
              </button>

              <button
                onClick={() => setActiveTab("preferences")}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white font-black uppercase text-xs md:text-sm transition-all whitespace-nowrap w-auto lg:w-full text-left ${activeTab === "preferences" ? "bg-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] translate-x-1" : "bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"}`}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                  palette
                </span>{" "}
                Preferences
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white font-black uppercase text-xs md:text-sm transition-all whitespace-nowrap w-auto lg:w-full text-left ${activeTab === "security" ? "bg-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] translate-x-1" : "bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"}`}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                  shield
                </span>{" "}
                Security
              </button>
              <button
                onClick={() => setActiveTab("inbox")}
                className={`flex items-center justify-between gap-4 px-3 md:px-4 py-2 md:py-3 border-2 border-black dark:border-white font-black uppercase text-xs md:text-sm transition-all whitespace-nowrap w-auto lg:w-full text-left ${activeTab === "inbox" ? "bg-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] translate-x-1" : "bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1"}`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                    inbox
                  </span>{" "}
                  Inbox
                </div>
                {unreadCount > 0 && (
                  <span
                    className={`px-2 py-0.5 border-2 border-black dark:border-white text-[10px] font-black ${activeTab === "inbox" ? "bg-white text-black dark:bg-black dark:text-white" : "bg-[#FCA5A5] text-black"}`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="lg:col-span-3 space-y-4 md:space-y-6">
              {/* TAB 1: PERSONAL INFORMATION */}
              {activeTab === "personal" && (
                <div className="bg-white dark:bg-slate-900 rounded-md p-4 md:p-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white">
                      Personal Information
                    </h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Manage basic account details.
                    </p>
                  </div>
                  <div className="h-0.5 bg-black dark:bg-white w-full"></div>

                  <form className="space-y-4" onSubmit={handleSaveChanges}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] md:text-xs font-black uppercase text-black dark:text-white tracking-widest">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-sm border-2 border-black dark:border-white bg-[#F4F5F0] dark:bg-slate-800 text-xs md:text-sm font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus:-translate-y-1 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] md:text-xs font-black uppercase text-black dark:text-white tracking-widest">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-sm border-2 border-black dark:border-white bg-[#F4F5F0] dark:bg-slate-800 text-xs md:text-sm font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus:-translate-y-1 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] md:text-xs font-black uppercase text-black dark:text-white tracking-widest">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-sm border-2 border-black dark:border-white bg-slate-200 dark:bg-slate-700 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] md:text-xs font-black uppercase text-black dark:text-white tracking-widest">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+62 8xx-xxxx-xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-sm border-2 border-black dark:border-white bg-[#F4F5F0] dark:bg-slate-800 text-xs md:text-sm font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus:-translate-y-1 transition-all outline-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
                      {saveMessage && (
                        <span className="text-[10px] md:text-xs font-black uppercase text-[#A3E635]">
                          {saveMessage}
                        </span>
                      )}

                      {/* ✅ FIX: w-full di HP biar gampang ditekan */}
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto px-6 py-3 bg-[#A3E635] dark:bg-[#A3E635] text-black border-2 border-black font-black uppercase text-xs md:text-sm rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <span className="material-symbols-outlined animate-spin text-[16px] font-black">
                            progress_activity
                          </span>
                        ) : null}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: PREFERENCES (THEME) */}
              {activeTab === "preferences" && (
                <div className="bg-white dark:bg-slate-900 rounded-md p-4 md:p-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white">
                      Theme Preferences
                    </h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Manage your viewing experience.
                    </p>
                  </div>
                  <div className="h-0.5 bg-black dark:bg-white w-full"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-sm bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div>
                      <p className="text-sm md:text-base font-black uppercase text-black dark:text-white">
                        Dark / Light Mode
                      </p>
                      <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-widest leading-relaxed">
                        Switch between dark and light themes for the dashboard.
                      </p>
                    </div>

                    <ThemeToggle />
                  </div>
                </div>
              )}

              {/* TAB 3: SECURITY */}
              {activeTab === "security" && (
                <div className="bg-white dark:bg-slate-900 rounded-md p-4 md:p-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white">
                      Security & Protection
                    </h3>
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Protect your tracking account access.
                    </p>
                  </div>
                  <div className="h-0.5 bg-black dark:bg-white w-full"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-sm bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div>
                      <p className="text-sm md:text-base font-black uppercase text-black dark:text-white">
                        Password
                      </p>
                      <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-widest leading-relaxed">
                        Set password for manual email login.
                      </p>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-3 md:py-2 bg-white dark:bg-slate-700 border-2 border-black dark:border-white text-black dark:text-white font-black uppercase text-[10px] md:text-xs rounded-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all text-center">
                      Set Password
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: INBOX */}
              {activeTab === "inbox" && (
                <div className="bg-white dark:bg-slate-900 rounded-md p-4 md:p-6 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white">
                        System Inbox
                      </h3>
                      <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Messages & Notifications.
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] md:text-xs font-black uppercase text-black dark:text-white border-b-2 border-black dark:border-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="h-0.5 bg-black dark:bg-white w-full"></div>

                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold uppercase text-xs md:text-sm border-2 border-dashed border-black dark:border-white">
                        NO NEW MESSAGES.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 md:p-4 rounded-sm border-2 border-black dark:border-white flex flex-col sm:flex-row gap-3 md:gap-4 items-start shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-colors ${!notif.isRead ? "bg-[#FCD34D] dark:bg-slate-700" : "bg-[#F4F5F0] dark:bg-slate-800 opacity-80"}`}
                        >
                          <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-sm border-2 border-black dark:border-white flex items-center justify-center flex-shrink-0 ${!notif.isRead ? "bg-white text-black dark:bg-slate-900 dark:text-white" : "bg-slate-200 dark:bg-slate-900 text-slate-500"}`}
                          >
                            <span className="material-symbols-outlined text-[20px] md:text-[24px] font-black">
                              {notif.type === "SYSTEM"
                                ? "settings"
                                : notif.type === "ACHIEVEMENT"
                                  ? "celebration"
                                  : "sync"}
                            </span>
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <p className="text-sm md:text-base font-black uppercase text-black dark:text-white leading-tight">
                                {notif.title}
                              </p>
                              <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase border-2 border-slate-500 px-1 whitespace-nowrap">
                                {formatDistanceToNow(
                                  new Date(notif.createdAt),
                                  { addSuffix: true, locale: id },
                                )}
                              </span>
                            </div>
                            <p className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed uppercase">
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

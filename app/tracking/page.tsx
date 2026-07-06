import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddTaskForm from "@/components/AddTaskForm";
import { dropTask } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DropTaskButton from "@/components/DropTaskButton"; // <-- 1. Import komponen pintar di sini

export default async function TrackingPage() {
  // Ambil sesi user yang lagi login
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";

  // 1. Tarik semua task dari database beserta tier/milestones-nya
  const tasks = await prisma.task.findMany({
    orderBy: { deadline: "asc" },
    include: {
      milestones: {
        orderBy: { id: "asc" },
      },
    },
  });

  const today = new Date();

  // 2. Kalkulasi Statistik Cepat (Yang di-drop nggak dihitung ke activeTasks)
  const activeTasks = tasks.filter((t) => t.status === "In Progress");
  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const totalPotentialYield = activeTasks.reduce(
    (acc, curr) => acc + curr.targetValue,
    0,
  );

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title="Tracking" />

        <div className="p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto">
          {/* Header Section dengan Tombol Add Task */}
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">
                Active Allocations
              </h2>
              <p className="text-base text-on-surface-variant max-w-2xl">
                Monitor your ongoing tasks, track milestone completions, and
                project your final yields.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <button className="px-6 py-2 border border-outline-variant text-primary rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                Filter
              </button>
              <AddTaskForm />
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center">
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                In Progress
              </p>
              <p className="text-4xl font-bold text-primary">
                {activeTasks.length}
              </p>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center">
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Potential Yield
              </p>
              <p className="text-4xl font-bold text-green-600">
                ${totalPotentialYield.toFixed(2)}
              </p>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col justify-center">
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Completed
              </p>
              <p className="text-4xl font-bold text-blue-600">
                {completedTasks.length}
              </p>
            </div>
          </div>

          {/* Grid Cards Task */}
          {tasks.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center shadow-sm">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">
                monitoring
              </span>
              <h3 className="text-xl font-bold text-primary mb-2">
                Belum ada task yang di-track
              </h3>
              <p className="text-on-surface-variant">
                Mulai tracking task dari halaman Dashboard Utama atau tambahkan
                manual.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
              {tasks.map((task) => {
                // Kalkulasi Progress Milestone
                const totalMilestones = task.milestones.length;
                const claimedMilestones = task.milestones.filter(
                  (m) => m.isClaimed,
                ).length;
                const progressPercent =
                  totalMilestones > 0
                    ? (claimedMilestones / totalMilestones) * 100
                    : task.targetValue > 0
                      ? (task.currentValue / task.targetValue) * 100
                      : 0;

                // Kalkulasi Deadline/Days Left
                const daysLeft = Math.ceil(
                  (task.deadline.getTime() - today.getTime()) /
                    (1000 * 3600 * 24),
                );
                const isUrgent = daysLeft <= 3 && daysLeft >= 0;

                // Logika Gambar Placeholder
                const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  task.name,
                )}&background=0f172a&color=fff&size=128&font-size=0.4&bold=true`;
                const displayImage = task.imageUrl
                  ? task.imageUrl
                  : imgPlaceholder;

                const isCompleted = task.status === "Completed";
                const isDropped = task.status === "Dropped";

                return (
                  <div
                    key={task.id}
                    className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm transition-all flex flex-col relative overflow-hidden ${isDropped ? "opacity-75 grayscale-[50%]" : "hover:shadow-md hover:border-blue-400"}`}
                  >
                    {/* Badge Status (Absolute) */}
                    <div className="absolute top-4 right-4 z-10 pointer-events-none">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-200">
                          <span className="material-symbols-outlined text-[14px]">
                            check_circle
                          </span>
                          COMPLETED
                        </span>
                      ) : isDropped ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-200">
                          <span className="material-symbols-outlined text-[14px]">
                            flag
                          </span>
                          DROPPED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-200">
                          <span className="material-symbols-outlined text-[14px]">
                            sync
                          </span>
                          IN PROGRESS
                        </span>
                      )}
                    </div>

                    {/* Area Klik ke Halaman Detail */}
                    <Link
                      href={`/tracking/${task.id}`}
                      className="block p-6 flex-1 group"
                    >
                      <div className="flex items-center gap-4 mb-6 mt-2">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                          <img
                            src={displayImage}
                            alt={task.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* ZONA AMAN TEKS */}
                        <div className="flex-1 min-w-0 pr-28">
                          <h3 className="text-lg font-bold text-primary tracking-tight group-hover:text-blue-600 transition-colors truncate">
                            {task.name}
                          </h3>
                          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest mt-1 truncate">
                            {task.offerwall}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Financial Yield Info */}
                        <div className="flex justify-between items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              Current Yield
                            </p>
                            <p className="text-lg font-bold text-slate-800">
                              ${task.currentValue.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              Target Yield
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              ${task.targetValue.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] font-semibold text-slate-500">
                              Milestone Progress
                            </span>
                            <span className="text-[11px] font-bold text-primary">
                              {claimedMilestones} / {totalMilestones}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                isCompleted
                                  ? "bg-green-500"
                                  : isDropped
                                    ? "bg-red-400"
                                    : "bg-primary"
                              }`}
                              style={{
                                width: `${Math.min(progressPercent, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Footer Area with Actions */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <div
                        className={`flex items-center gap-1 ${
                          isUrgent && !isCompleted && !isDropped
                            ? "text-red-500 font-bold"
                            : "text-slate-500"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        <span className="text-xs font-semibold">
                          {isDropped
                            ? "Abandoned"
                            : daysLeft < 0
                              ? "Overdue"
                              : isCompleted
                                ? "Done"
                                : `${daysLeft} Days Left`}
                        </span>
                      </div>

                      {/* Tombol Drop Task cuma muncul kalau statusnya In Progress */}
                      {task.status === "In Progress" && (
                        <form action={dropTask}>
                          <input type="hidden" name="id" value={task.id} />
                          <input
                            type="hidden"
                            name="userEmail"
                            value={userEmail}
                          />

                          {/* 2. Gunakan komponen DropTaskButton dengan style card */}
                          <DropTaskButton styleType="card" />
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

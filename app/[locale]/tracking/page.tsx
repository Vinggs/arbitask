import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddTaskForm from "@/components/AddTaskForm";
import { dropTask } from "@/app/[locale]/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DropTaskButton from "@/components/DropTaskButton";
import { getTranslations } from "next-intl/server";

export default async function TrackingPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";
  const t = await getTranslations("Tracking");

  const tasks = await prisma.task.findMany({
    orderBy: { deadline: "asc" },
    include: { milestones: { orderBy: { id: "asc" } } },
  });

  const today = new Date();
  const activeTasks = tasks.filter((t) => t.status === "In Progress");
  const completedTasks = tasks.filter((t) => t.status === "Completed");
  const totalPotentialYield = activeTasks.reduce(
    (acc, curr) => acc + curr.targetValue,
    0,
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-body-md antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title={t("title")} />

        <div className="p-4 md:p-8 w-full max-w-container-max mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">
                {t("activeAllocations")}
              </h2>
              <p className="text-xs md:text-base font-bold text-slate-600 dark:text-slate-400 max-w-2xl tracking-wider">
                {t("subtitle")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <button className="w-full sm:w-auto px-6 py-3 md:py-2 border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md text-xs md:text-sm font-black uppercase shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all">
                {t("filterBtn")}
              </button>
              <div className="w-full sm:w-auto">
                <AddTaskForm />
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="p-4 md:p-6 bg-blue-300 dark:bg-sky-800 rounded-md border-2 border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark flex flex-col justify-center hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg transition-all">
              <p className="text-[10px] md:text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1 md:mb-2">
                {t("statInProgress")}
              </p>
              <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                {activeTasks.length}
              </p>
            </div>
            <div className="p-4 md:p-6 bg-emerald-400 dark:bg-teal-700 rounded-md border-2 border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark flex flex-col justify-center hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg transition-all">
              <p className="text-[10px] md:text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-1 md:mb-2">
                {t("statPotentialYield")}
              </p>
              <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                ${totalPotentialYield.toFixed(2)}
              </p>
            </div>
            <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-md border-2 border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark flex flex-col justify-center hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg transition-all">
              <p className="text-[10px] md:text-sm font-black text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-1 md:mb-2">
                {t("statCompleted")}
              </p>
              <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                {completedTasks.length}
              </p>
            </div>
          </div>

          {/* Cards Task */}
          {tasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-md p-8 md:p-12 text-center shadow-brutal-lg dark:shadow-brutal-dark-lg transition-colors">
              <span className="material-symbols-outlined text-4xl md:text-5xl text-slate-900 dark:text-slate-400 mb-4">
                monitoring
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase">
                {t("emptyTitle")}
              </h3>
              <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400">
                {t("emptyDesc")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-12">
              {tasks.map((task) => {
                const totalMilestones = task.milestones.length;
                const claimedMilestones = task.milestones.filter(
                  (m) => m.isClaimed,
                ).length;
                const progressPercent =
                  totalMilestones > 0
                    ? (claimedMilestones / totalMilestones) * 100
                    : 0;

                const daysLeft = Math.ceil(
                  (task.deadline.getTime() - today.getTime()) /
                    (1000 * 3600 * 24),
                );
                const displayImage = task.imageUrl
                  ? task.imageUrl
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      task.name,
                    )}&background=000&color=fff&size=128&bold=true`;
                const isCompleted = task.status === "Completed";
                const isDropped = task.status === "Dropped";

                const offerwallParts = task.offerwall.split(" - ");
                const platformName =
                  offerwallParts.length > 1 ? offerwallParts[0] : "";
                const providerName =
                  offerwallParts.length > 1
                    ? offerwallParts[1]
                    : task.offerwall;

                return (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-md shadow-brutal dark:shadow-brutal-dark flex flex-col relative overflow-hidden transition-all duration-200 ${
                      isDropped
                        ? "opacity-70 grayscale"
                        : "hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg"
                    }`}
                  >
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-sm text-[8px] md:text-[10px] font-black border-2 border-slate-900 dark:border-slate-700 uppercase shadow-brutal-sm dark:shadow-brutal-dark-sm ${
                          isCompleted
                            ? "bg-emerald-400 dark:bg-teal-600 text-slate-900 dark:text-white"
                            : isDropped
                              ? "bg-red-400 dark:bg-rose-700 text-slate-900 dark:text-white"
                              : "bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white"
                        }`}
                      >
                        {isCompleted
                          ? t("badgeCompleted")
                          : isDropped
                            ? t("badgeDropped")
                            : t("badgeInProgress")}
                      </span>
                    </div>

                    <Link
                      href={`/tracking/${task.id}`}
                      className="block p-4 md:p-6 flex-1 group"
                    >
                      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 mt-4 md:mt-2">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-md border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden shadow-brutal-sm dark:shadow-brutal-dark-sm">
                          <img
                            src={displayImage}
                            alt={task.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-16 md:pr-24">
                          <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white truncate uppercase group-hover:underline">
                            {task.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {platformName && (
                              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-200 border-2 border-slate-900 dark:border-slate-700 px-1.5 md:px-2 py-0.5 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                                {platformName}
                              </span>
                            )}
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100 bg-amber-300 dark:bg-amber-600 border-2 border-slate-900 dark:border-slate-700 px-1.5 md:px-2 py-0.5 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                              {providerName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end bg-slate-50 dark:bg-slate-900 p-3 rounded-sm border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                          <div>
                            <p className="text-[8px] md:text-[10px] font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest mb-1">
                              {t("current")}
                            </p>
                            <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                              ${task.currentValue.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] md:text-[10px] font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest mb-1">
                              {t("target")}
                            </p>
                            <p className="text-lg md:text-xl font-black text-emerald-600 dark:text-teal-400">
                              ${task.targetValue.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] md:text-[11px] font-black uppercase text-slate-900 dark:text-slate-300">
                              {t("progress")}
                            </span>
                            <span className="text-[10px] md:text-[11px] font-black text-slate-900 dark:text-slate-300">
                              {claimedMilestones} / {totalMilestones}
                            </span>
                          </div>
                          <div className="w-full bg-white dark:bg-slate-700 h-3 md:h-4 rounded-sm border-2 border-slate-900 dark:border-slate-700 overflow-hidden">
                            <div
                              className={`h-full border-r-2 border-slate-900 dark:border-slate-700 ${
                                isCompleted
                                  ? "bg-emerald-400 dark:bg-teal-500"
                                  : isDropped
                                    ? "bg-red-400 dark:bg-rose-600"
                                    : "bg-blue-300 dark:bg-sky-500"
                              }`}
                              style={{
                                width: `${Math.min(progressPercent, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="px-4 md:px-6 py-3 md:py-4 border-t-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                      <div className="font-black text-[10px] md:text-xs uppercase text-slate-900 dark:text-slate-300">
                        {isDropped
                          ? t("statusAbandoned")
                          : daysLeft < 0
                            ? t("statusOverdue")
                            : isCompleted
                              ? t("statusDone")
                              : t("daysLeft", { days: daysLeft })}
                      </div>
                      {task.status === "In Progress" && (
                        <form action={dropTask}>
                          <input type="hidden" name="id" value={task.id} />
                          <input
                            type="hidden"
                            name="userEmail"
                            value={userEmail}
                          />
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

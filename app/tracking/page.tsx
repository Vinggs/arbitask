import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddTaskForm from "@/components/AddTaskForm";
import { dropTask } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DropTaskButton from "@/components/DropTaskButton";

export default async function TrackingPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";

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
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white font-body-md antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title="Tracking" />

        {/* ✅ FIX: Ganti padding utama jadi p-4 md:p-8 */}
        <div className="p-4 md:p-8 w-full max-w-container-max mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight mb-2 uppercase">
                Active Allocations
              </h2>
              <p className="text-xs md:text-base font-bold text-slate-700 dark:text-slate-400 max-w-2xl tracking-wider">
                Monitor your ongoing tasks, track milestone completions, and
                project your yields.
              </p>
            </div>

            {/* ✅ FIX: Tombol jadi full width di HP, jejer di desktop */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <button className="w-full sm:w-auto px-6 py-3 md:py-2 border-2 border-black dark:border-white bg-white dark:bg-slate-800 text-black dark:text-white rounded-md text-xs md:text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all">
                Filter
              </button>
              <div className="w-full sm:w-auto">
                <AddTaskForm />
              </div>
            </div>
          </div>

          {/* Quick Stats Cards - Neo Brutalism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="p-4 md:p-6 bg-[#93C5FD] rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <p className="text-[10px] md:text-sm font-black text-black uppercase tracking-wider mb-1 md:mb-2">
                In Progress
              </p>
              <p className="text-4xl md:text-5xl font-black text-black">
                {activeTasks.length}
              </p>
            </div>
            <div className="p-4 md:p-6 bg-[#A3E635] rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <p className="text-[10px] md:text-sm font-black text-black uppercase tracking-wider mb-1 md:mb-2">
                Potential Yield
              </p>
              <p className="text-4xl md:text-5xl font-black text-black">
                ${totalPotentialYield.toFixed(2)}
              </p>
            </div>
            <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-center hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
              <p className="text-[10px] md:text-sm font-black uppercase tracking-wider mb-1 md:mb-2">
                Completed
              </p>
              <p className="text-4xl md:text-5xl font-black">
                {completedTasks.length}
              </p>
            </div>
          </div>

          {/* Cards Task */}
          {tasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white rounded-md p-8 md:p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
              <span className="material-symbols-outlined text-4xl md:text-5xl text-black dark:text-white mb-4">
                monitoring
              </span>
              <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-2 uppercase">
                Belum ada task
              </h3>
              <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400">
                Tambahkan task untuk mulai tracking yield.
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
                    className={`bg-white dark:bg-slate-800 border-2 border-black dark:border-white rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col relative overflow-hidden transition-all duration-200 ${
                      isDropped
                        ? "opacity-70 grayscale"
                        : "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                    }`}
                  >
                    {/* Badge absolute */}
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-sm text-[8px] md:text-[10px] font-black border-2 border-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          isCompleted
                            ? "bg-[#A3E635] text-black"
                            : isDropped
                              ? "bg-[#FCA5A5] text-black"
                              : "bg-[#FCD34D] text-black"
                        }`}
                      >
                        {isCompleted
                          ? "COMPLETED"
                          : isDropped
                            ? "DROPPED"
                            : "IN PROGRESS"}
                      </span>
                    </div>

                    <Link
                      href={`/tracking/${task.id}`}
                      className="block p-4 md:p-6 flex-1 group"
                    >
                      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 mt-4 md:mt-2">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-md border-2 border-black bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <img
                            src={displayImage}
                            alt={task.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-16 md:pr-24">
                          <h3 className="text-lg md:text-xl font-black text-black dark:text-white truncate uppercase group-hover:underline">
                            {task.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {platformName && (
                              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white bg-black border-2 border-black px-1.5 md:px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {platformName}
                              </span>
                            )}
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-black bg-[#FCD34D] border-2 border-black px-1.5 md:px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              {providerName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end bg-[#F4F5F0] dark:bg-slate-900 p-3 rounded-sm border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                          <div>
                            <p className="text-[8px] md:text-[10px] font-black text-black dark:text-white uppercase tracking-widest mb-1">
                              Current
                            </p>
                            <p className="text-lg md:text-xl font-black text-black dark:text-white">
                              ${task.currentValue.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] md:text-[10px] font-black text-black dark:text-white uppercase tracking-widest mb-1">
                              Target
                            </p>
                            <p className="text-lg md:text-xl font-black text-[#059669] dark:text-green-400">
                              ${task.targetValue.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar Brutalism */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] md:text-[11px] font-black uppercase">
                              Progress
                            </span>
                            <span className="text-[10px] md:text-[11px] font-black">
                              {claimedMilestones} / {totalMilestones}
                            </span>
                          </div>
                          <div className="w-full bg-white dark:bg-slate-700 h-3 md:h-4 rounded-sm border-2 border-black dark:border-white overflow-hidden">
                            <div
                              className={`h-full border-r-2 border-black ${
                                isCompleted
                                  ? "bg-[#A3E635]"
                                  : isDropped
                                    ? "bg-[#FCA5A5]"
                                    : "bg-[#93C5FD]"
                              }`}
                              style={{
                                width: `${Math.min(progressPercent, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="px-4 md:px-6 py-3 md:py-4 border-t-2 border-black dark:border-white bg-[#F4F5F0] dark:bg-slate-900 flex justify-between items-center">
                      <div className="font-black text-[10px] md:text-xs uppercase">
                        {isDropped
                          ? "Abandoned"
                          : daysLeft < 0
                            ? "Overdue"
                            : isCompleted
                              ? "Done"
                              : `${daysLeft} Days Left`}
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

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import EvidenceUploader from "@/components/EvidenceUploader";
import { dropTask } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DropTaskButton from "@/components/DropTaskButton";

type MilestoneWithEvidence = {
  id: string;
  description: string;
  reward: number;
  isClaimed: boolean;
  taskId: string;
  evidenceUrl?: string | null;
};

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";

  const resolvedParams = await params;
  const taskId = resolvedParams.id;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { milestones: { orderBy: { reward: "asc" } } },
  });

  if (!task) notFound();

  const typedMilestones = task.milestones as MilestoneWithEvidence[];
  const totalMilestones = typedMilestones.length;
  const claimedMilestones = typedMilestones.filter((m) => m.isClaimed).length;
  const progressPercentage =
    totalMilestones > 0 ? (claimedMilestones / totalMilestones) * 100 : 0;
  const currentObjective = typedMilestones.find((m) => !m.isClaimed);

  const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(task.name)}&background=000&color=fff&size=128&font-size=0.4&bold=true`;
  const displayImage = task.imageUrl ? task.imageUrl : imgPlaceholder;

  const offerwallParts = task.offerwall.split(" - ");
  const platformName = offerwallParts.length > 1 ? offerwallParts[0] : "";
  const providerName =
    offerwallParts.length > 1 ? offerwallParts[1] : task.offerwall;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-body-md text-body-md overflow-hidden antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col w-full h-screen overflow-y-auto md:border-l-2 md:border-slate-900 dark:border-slate-700">
        <Header title="Task Details" />

        <div className="p-4 md:p-8 w-full max-w-container-max mx-auto space-y-4 md:space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <div className="flex items-center gap-2 font-black uppercase text-[10px] md:text-sm">
                <Link
                  href="/tracking"
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 px-2 py-1 md:px-3 md:py-1 shadow-brutal-sm dark:shadow-brutal-dark-sm"
                >
                  Tracking
                </Link>
                <span className="material-symbols-outlined text-[12px] md:text-sm font-black text-slate-900 dark:text-slate-400">
                  chevron_right
                </span>
                <span className="text-slate-900 dark:text-slate-100 bg-emerald-400 dark:bg-teal-600 px-2 py-1 md:px-3 md:py-1 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm line-clamp-1 break-all">
                  {task.name}
                </span>
              </div>

              {task.status === "In Progress" && (
                <div className="w-full sm:w-auto">
                  <form action={dropTask}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="userEmail" value={userEmail} />
                    <DropTaskButton styleType="detail" />
                  </form>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="flex flex-row items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-slate-900 dark:border-slate-700 flex items-center justify-center shadow-brutal md:shadow-brutal-lg dark:shadow-brutal-dark md:dark:shadow-brutal-dark-lg shrink-0 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={task.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase text-slate-900 dark:text-white tracking-tight line-clamp-2">
                    {task.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="flex font-black uppercase text-[10px] md:text-sm border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                      {platformName && (
                        <span className="bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-2 py-0.5">
                          {platformName}
                        </span>
                      )}
                      <span className="bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-slate-100 px-2 py-0.5">
                        {providerName}
                      </span>
                    </div>

                    {task.status === "Dropped" && (
                      <span className="text-[10px] font-black bg-red-400 dark:bg-rose-700 border-2 border-slate-900 dark:border-slate-700 px-2 py-0.5 uppercase text-slate-900 dark:text-white shadow-brutal-sm dark:shadow-brutal-dark-sm">
                        DROPPED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 px-4 py-3 md:px-5 md:py-4 flex flex-col w-full md:min-w-[280px] md:w-auto shadow-brutal md:shadow-brutal-lg dark:shadow-brutal-dark md:dark:shadow-brutal-dark-lg transition-colors">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                  <span className="text-xs md:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-300">
                    Milestone Progress
                  </span>
                  <span className="text-base md:text-lg font-black text-slate-900 dark:text-white">
                    {claimedMilestones} / {totalMilestones}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 md:h-6 border-2 border-slate-900 dark:border-slate-700 overflow-hidden">
                  <div
                    className="bg-emerald-400 dark:bg-teal-500 border-r-2 border-slate-900 dark:border-slate-700 h-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pt-4">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {task.status === "Dropped" ? (
                <div className="bg-red-300 dark:bg-rose-800 border-4 border-slate-900 dark:border-slate-700 p-6 md:p-8 text-center shadow-brutal-lg dark:shadow-brutal-dark-lg">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-brutal dark:shadow-brutal-dark">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-slate-900 dark:text-slate-300">
                      flag
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 md:mb-3 uppercase">
                    Quest Abandoned
                  </h3>
                  <p className="text-xs md:text-base font-bold text-slate-800 dark:text-slate-300 max-w-md mx-auto">
                    Lu udah nyerah sama task ini. Milestone yang udah
                    diverifikasi tetep aman, tapi nggak bisa lanjut lagi.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-4 md:p-6 shadow-brutal md:shadow-brutal-lg dark:shadow-brutal-dark md:dark:shadow-brutal-dark-lg transition-colors">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="mt-1 hidden sm:block">
                        <span
                          className="material-symbols-outlined text-slate-900 dark:text-slate-300 text-4xl md:text-5xl font-black"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          assignment_turned_in
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black uppercase text-slate-900 dark:text-white mb-1 md:mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined sm:hidden text-2xl font-black">
                            assignment_turned_in
                          </span>
                          Current Objective
                        </h3>
                        <p className="text-sm md:text-lg font-bold text-slate-700 dark:text-slate-400 mb-3 md:mb-4">
                          {currentObjective
                            ? `Submit proof for: ${currentObjective.description}`
                            : "ALL MILESTONES COMPLETED! GREAT JOB."}
                        </p>
                        <div className="inline-flex items-center gap-1.5 md:gap-2 bg-blue-300 dark:bg-sky-700 text-slate-900 dark:text-slate-100 px-2 py-1 md:px-3 md:py-1.5 border-2 border-slate-900 dark:border-slate-700 text-[10px] md:text-xs font-black uppercase shadow-brutal-sm dark:shadow-brutal-dark-sm">
                          <span className="material-symbols-outlined text-[14px] md:text-[16px] font-black">
                            info
                          </span>
                          Ensure username is visible
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 flex flex-col shadow-brutal-lg dark:shadow-brutal-dark-lg transition-colors">
                    <div className="border-b-4 border-slate-900 dark:border-slate-700 px-4 py-3 md:px-6 md:py-4 bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-slate-100 flex items-center justify-between transition-colors">
                      <div>
                        <h3 className="text-lg md:text-2xl font-black uppercase flex items-center gap-1.5 md:gap-2">
                          <span className="material-symbols-outlined font-black text-[20px] md:text-[24px]">
                            {currentObjective ? "cloud_upload" : "verified"}
                          </span>
                          {currentObjective
                            ? "Evidence Submission"
                            : "Task Completed"}
                        </h3>
                      </div>
                      <span className="text-[10px] md:text-sm font-black uppercase border-4 border-slate-900 dark:border-slate-700 px-2 py-0.5 md:px-3 md:py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-brutal-sm dark:shadow-brutal-dark-sm">
                        {currentObjective ? "REQUIRED" : "DONE"}
                      </span>
                    </div>

                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                      {currentObjective ? (
                        <>
                          <p className="text-xs md:text-base font-bold text-slate-700 dark:text-slate-400 mb-4 md:mb-6 uppercase">
                            Upload screenshot evidence of level achievement from
                            your device.
                          </p>
                          <EvidenceUploader
                            taskId={task.id}
                            currentObjectiveId={currentObjective.id}
                          />
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 md:py-12">
                          <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-400 dark:bg-teal-600 border-4 border-slate-900 dark:border-slate-700 flex items-center justify-center mb-4 md:mb-6 shadow-brutal md:shadow-brutal-lg dark:shadow-brutal-dark">
                            <span className="material-symbols-outlined text-4xl md:text-6xl text-slate-900 dark:text-slate-100 font-black">
                              task_alt
                            </span>
                          </div>
                          <h4 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase mb-2 md:mb-3">
                            Maximum Yield Reached! 💸
                          </h4>
                          <p className="text-xs md:text-base font-bold text-slate-600 dark:text-slate-400 max-w-sm mx-auto uppercase">
                            All tiers have been successfully verified. Time to
                            move on to the next game!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1 space-y-4 md:space-y-6">
              <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 p-4 md:p-6 shadow-brutal md:shadow-brutal-lg dark:shadow-brutal-dark transition-colors">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase mb-4 md:mb-6 border-b-4 border-slate-900 dark:border-slate-700 pb-3 md:pb-4">
                  Milestone Ledger
                </h3>
                <div className="space-y-4 md:space-y-6">
                  {typedMilestones.length === 0 ? (
                    <p className="text-[10px] md:text-sm font-bold uppercase border-2 border-dashed border-slate-400 dark:border-slate-600 p-3 md:p-4 text-center text-slate-600 dark:text-slate-400">
                      No Tiers Found.
                    </p>
                  ) : (
                    typedMilestones.map((milestone, index) => {
                      const isClaimed = milestone.isClaimed;
                      const isCurrent =
                        task.status !== "Dropped" &&
                        currentObjective?.id === milestone.id;

                      return (
                        <div
                          key={milestone.id}
                          className="relative pl-8 md:pl-10"
                        >
                          {index !== typedMilestones.length - 1 && (
                            <div
                              className={`absolute left-0 top-3 bottom-[-30px] md:bottom-[-40px] w-1 ml-2.5 md:ml-3 border-l-4 border-slate-900 dark:border-slate-700 ${isClaimed ? "border-solid" : "border-dashed"}`}
                            ></div>
                          )}

                          <div
                            className={`absolute left-0 top-1 w-6 h-6 md:w-8 md:h-8 border-2 md:border-4 border-slate-900 dark:border-slate-700 flex items-center justify-center transition-colors ${isClaimed ? "bg-emerald-400 dark:bg-teal-600" : isCurrent ? "bg-blue-300 dark:bg-sky-600" : "bg-white dark:bg-slate-800"}`}
                          >
                            {isClaimed ? (
                              <span className="material-symbols-outlined text-slate-900 dark:text-white text-[14px] md:text-[20px] font-black">
                                check
                              </span>
                            ) : null}
                          </div>

                          <h4
                            className={`text-sm md:text-base font-black uppercase ${isClaimed || isCurrent ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
                          >
                            {milestone.description}
                          </h4>
                          <p className="text-[10px] md:text-xs font-bold mt-1 text-slate-500 dark:text-slate-400 uppercase border-2 border-slate-300 dark:border-slate-600 inline-block px-1">
                            {isClaimed
                              ? "Verified"
                              : isCurrent
                                ? "Pending"
                                : task.status === "Dropped"
                                  ? "Abandoned"
                                  : "Locked"}
                          </p>
                          <p
                            className={`text-xs md:text-sm font-black mt-1.5 md:mt-2 ${isClaimed ? "text-emerald-600 dark:text-teal-400" : isCurrent ? "text-blue-600 dark:text-sky-400" : "text-slate-500 dark:text-slate-500"}`}
                          >
                            YIELD: +${milestone.reward.toFixed(2)}
                          </p>
                          {isClaimed && milestone.evidenceUrl && (
                            <a
                              href={milestone.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2.5 md:mt-3 text-[10px] md:text-xs font-black text-slate-900 dark:text-slate-100 bg-blue-300 dark:bg-sky-700 border-2 border-slate-900 dark:border-slate-700 px-2 py-1 md:px-3 md:py-1.5 uppercase shadow-brutal-sm dark:shadow-brutal-dark-sm hover:translate-y-1 hover:shadow-none transition-all active:translate-y-2"
                            >
                              <span className="material-symbols-outlined text-[14px] md:text-[16px] font-black">
                                image
                              </span>{" "}
                              Lihat Bukti
                            </a>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-blue-300 dark:bg-sky-800 border-4 border-slate-900 dark:border-slate-700 p-4 md:p-6 text-center shadow-brutal md:shadow-brutal-lg dark:shadow-brutal-dark transition-colors">
                <span className="material-symbols-outlined text-slate-900 dark:text-white text-4xl md:text-5xl mb-2 font-black">
                  support_agent
                </span>
                <h4 className="text-xl md:text-2xl font-black uppercase text-slate-900 dark:text-white mb-2">
                  Need Help?
                </h4>
                <p className="text-[10px] md:text-sm font-bold text-slate-900 dark:text-slate-200 mb-4 md:mb-6 uppercase border-2 border-slate-900 dark:border-slate-700 p-2 bg-white/20 dark:bg-black/20">
                  Compliance team is available 24/7.
                </p>
                <button className="w-full bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white font-black uppercase text-xs md:text-sm py-2.5 md:py-3 shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

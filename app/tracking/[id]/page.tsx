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

  return (
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white font-body-md text-body-md overflow-hidden antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col w-full h-screen overflow-y-auto border-l-2 border-black dark:border-white">
        <Header title="Task Details" />

        <div className="p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-black uppercase text-sm">
                <Link
                  href="/tracking"
                  className="text-slate-500 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-slate-800 border-2 border-black dark:border-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                >
                  Tracking
                </Link>
                <span className="material-symbols-outlined text-sm font-black">
                  chevron_right
                </span>
                <span className="text-black dark:text-white bg-[#A3E635] dark:bg-green-600 px-3 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  {task.name}
                </span>
              </div>

              {task.status === "In Progress" && (
                <form action={dropTask}>
                  <input type="hidden" name="id" value={task.id} />
                  <input type="hidden" name="userEmail" value={userEmail} />
                  <DropTaskButton styleType="detail" />
                </form>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white border-4 border-black dark:border-white flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] shrink-0 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={task.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-4xl font-black uppercase text-black dark:text-white tracking-tight">
                    {task.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-sm font-bold uppercase flex items-center gap-1 border-2 border-black dark:border-white px-2 py-0.5 bg-[#FCD34D] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span className="font-black">
                        {task.offerwall === "RevU" ? "RU" : "TX"}
                      </span>
                      {task.offerwall}
                    </p>
                    {task.status === "Dropped" && (
                      <span className="text-[10px] font-black bg-[#FCA5A5] border-2 border-black px-2 py-0.5 uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        DROPPED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white px-5 py-4 flex flex-col min-w-[280px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-black uppercase tracking-wider">
                    Milestone Progress
                  </span>
                  <span className="text-lg font-black">
                    {claimedMilestones} / {totalMilestones}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-6 border-2 border-black dark:border-white overflow-hidden">
                  <div
                    className="bg-[#A3E635] dark:bg-green-500 border-r-2 border-black dark:border-white h-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            <div className="lg:col-span-2 space-y-6">
              {task.status === "Dropped" ? (
                <div className="bg-[#FCA5A5] border-4 border-black dark:border-white p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                  <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-5xl text-black">
                      flag
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-black mb-3 uppercase">
                    Quest Abandoned
                  </h3>
                  <p className="text-base font-bold text-black max-w-md mx-auto">
                    Lu udah nyerah sama task ini. Milestone yang udah
                    diverifikasi tetep aman, tapi nggak bisa lanjut lagi.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <span
                          className="material-symbols-outlined text-black dark:text-white text-5xl font-black"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          assignment_turned_in
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase mb-2">
                          Current Objective
                        </h3>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                          {currentObjective
                            ? `Submit proof for: ${currentObjective.description}`
                            : "ALL MILESTONES COMPLETED! GREAT JOB."}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-[#93C5FD] dark:bg-blue-600 text-black dark:text-white px-3 py-1.5 border-2 border-black dark:border-white text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                          <span className="material-symbols-outlined text-[16px] font-black">
                            info
                          </span>
                          Ensure username is visible
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                    <div className="border-b-4 border-black dark:border-white px-6 py-4 bg-[#FCD34D] dark:bg-yellow-600 text-black dark:text-white flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black uppercase flex items-center gap-2">
                          <span className="material-symbols-outlined font-black">
                            {currentObjective ? "cloud_upload" : "verified"}
                          </span>
                          {currentObjective
                            ? "Evidence Submission"
                            : "Task Completed"}
                        </h3>
                      </div>
                      <span className="text-sm font-black uppercase border-4 border-black dark:border-white px-3 py-1 bg-white dark:bg-slate-800 text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                        {currentObjective ? "REQUIRED" : "DONE"}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      {currentObjective ? (
                        <>
                          <p className="text-base font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase">
                            Upload screenshot evidence of level achievement from
                            your device.
                          </p>
                          <EvidenceUploader
                            taskId={task.id}
                            currentObjectiveId={currentObjective.id}
                          />
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                          <div className="w-24 h-24 bg-[#A3E635] border-4 border-black rounded-none flex items-center justify-center mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <span className="material-symbols-outlined text-6xl text-black font-black">
                              task_alt
                            </span>
                          </div>
                          <h4 className="text-3xl font-black uppercase mb-3">
                            Maximum Yield Reached! 💸
                          </h4>
                          <p className="text-base font-bold text-slate-600 dark:text-slate-400 max-w-sm mx-auto uppercase">
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

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black dark:border-white pb-4">
                  Milestone Ledger
                </h3>
                <div className="space-y-6">
                  {typedMilestones.length === 0 ? (
                    <p className="text-sm font-bold uppercase border-2 border-dashed border-slate-500 p-4 text-center">
                      No Tiers Found.
                    </p>
                  ) : (
                    typedMilestones.map((milestone, index) => {
                      const isClaimed = milestone.isClaimed;
                      const isCurrent =
                        task.status !== "Dropped" &&
                        currentObjective?.id === milestone.id;

                      return (
                        <div key={milestone.id} className="relative pl-10">
                          {index !== typedMilestones.length - 1 && (
                            <div
                              className={`absolute left-0 top-3 bottom-[-40px] w-1 ml-3 border-l-4 border-black dark:border-white ${isClaimed ? "border-solid" : "border-dashed"}`}
                            ></div>
                          )}

                          <div
                            className={`absolute left-0 top-1 w-8 h-8 border-4 border-black dark:border-white flex items-center justify-center ${isClaimed ? "bg-[#A3E635]" : isCurrent ? "bg-[#93C5FD]" : "bg-white dark:bg-slate-800"}`}
                          >
                            {isClaimed ? (
                              <span className="material-symbols-outlined text-black text-[20px] font-black">
                                check
                              </span>
                            ) : null}
                          </div>

                          <h4
                            className={`text-base font-black uppercase ${isClaimed || isCurrent ? "text-black dark:text-white" : "text-slate-500"}`}
                          >
                            {milestone.description}
                          </h4>
                          <p className="text-xs font-bold mt-1 text-slate-500 uppercase border-2 border-slate-300 inline-block px-1">
                            {isClaimed
                              ? "Verified"
                              : isCurrent
                                ? "Pending"
                                : task.status === "Dropped"
                                  ? "Abandoned"
                                  : "Locked"}
                          </p>
                          <p
                            className={`text-sm font-black mt-2 ${isClaimed ? "text-[#A3E635] dark:text-green-400" : isCurrent ? "text-blue-500 dark:text-blue-400" : "text-slate-500"}`}
                          >
                            YIELD: +${milestone.reward.toFixed(2)}
                          </p>
                          {isClaimed && milestone.evidenceUrl && (
                            <a
                              href={milestone.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-3 text-xs font-black text-black bg-[#93C5FD] border-2 border-black px-3 py-1.5 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
                            >
                              <span className="material-symbols-outlined text-[16px] font-black">
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

              <div className="bg-[#93C5FD] dark:bg-blue-600 border-4 border-black dark:border-white p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                <span className="material-symbols-outlined text-black dark:text-white text-5xl mb-2 font-black">
                  support_agent
                </span>
                <h4 className="text-2xl font-black uppercase text-black dark:text-white mb-2">
                  Need Help?
                </h4>
                <p className="text-sm font-bold text-black dark:text-white mb-6 uppercase border-2 border-black dark:border-white p-2 bg-white/20">
                  Compliance team is available 24/7.
                </p>
                <button className="w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white text-black dark:text-white font-black uppercase text-sm py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all">
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

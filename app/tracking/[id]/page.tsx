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
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white font-body-md text-body-md overflow-hidden antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col w-full h-screen overflow-y-auto md:border-l-2 md:border-black dark:border-white">
        <Header title="Task Details" />

        {/* ✅ FIX: Ganti padding p-margin-mobile ke p-4 md:p-8 */}
        <div className="p-4 md:p-8 w-full max-w-container-max mx-auto space-y-4 md:space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <div className="flex items-center gap-2 font-black uppercase text-[10px] md:text-sm">
                <Link
                  href="/tracking"
                  className="text-slate-500 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-slate-800 border-2 border-black dark:border-white px-2 py-1 md:px-3 md:py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                >
                  Tracking
                </Link>
                <span className="material-symbols-outlined text-[12px] md:text-sm font-black">
                  chevron_right
                </span>
                <span className="text-black dark:text-white bg-[#A3E635] dark:bg-green-600 px-2 py-1 md:px-3 md:py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] line-clamp-1 break-all">
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
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] md:dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] shrink-0 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={task.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black uppercase text-black dark:text-white tracking-tight line-clamp-2">
                    {task.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="flex font-black uppercase text-[10px] md:text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {platformName && (
                        <span className="bg-black text-white px-2 py-0.5">
                          {platformName}
                        </span>
                      )}
                      <span className="bg-[#FCD34D] text-black px-2 py-0.5">
                        {providerName}
                      </span>
                    </div>

                    {task.status === "Dropped" && (
                      <span className="text-[10px] font-black bg-[#FCA5A5] border-2 border-black px-2 py-0.5 uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        DROPPED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ✅ FIX: Kotak progress dibikin w-full pas di HP */}
              <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white px-4 py-3 md:px-5 md:py-4 flex flex-col w-full md:min-w-[280px] md:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                  <span className="text-xs md:text-sm font-black uppercase tracking-wider">
                    Milestone Progress
                  </span>
                  <span className="text-base md:text-lg font-black">
                    {claimedMilestones} / {totalMilestones}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 md:h-6 border-2 border-black dark:border-white overflow-hidden">
                  <div
                    className="bg-[#A3E635] dark:bg-green-500 border-r-2 border-black dark:border-white h-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pt-4">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {task.status === "Dropped" ? (
                <div className="bg-[#FCA5A5] border-4 border-black dark:border-white p-6 md:p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-black flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-black">
                      flag
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-black mb-2 md:mb-3 uppercase">
                    Quest Abandoned
                  </h3>
                  <p className="text-xs md:text-base font-bold text-black max-w-md mx-auto">
                    Lu udah nyerah sama task ini. Milestone yang udah
                    diverifikasi tetep aman, tapi nggak bisa lanjut lagi.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="mt-1 hidden sm:block">
                        <span
                          className="material-symbols-outlined text-black dark:text-white text-4xl md:text-5xl font-black"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          assignment_turned_in
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black uppercase mb-1 md:mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined sm:hidden text-2xl font-black">
                            assignment_turned_in
                          </span>
                          Current Objective
                        </h3>
                        <p className="text-sm md:text-lg font-bold text-slate-700 dark:text-slate-300 mb-3 md:mb-4">
                          {currentObjective
                            ? `Submit proof for: ${currentObjective.description}`
                            : "ALL MILESTONES COMPLETED! GREAT JOB."}
                        </p>
                        <div className="inline-flex items-center gap-1.5 md:gap-2 bg-[#93C5FD] dark:bg-blue-600 text-black dark:text-white px-2 py-1 md:px-3 md:py-1.5 border-2 border-black dark:border-white text-[10px] md:text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span className="material-symbols-outlined text-[14px] md:text-[16px] font-black">
                            info
                          </span>
                          Ensure username is visible
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="border-b-4 border-black dark:border-white px-4 py-3 md:px-6 md:py-4 bg-[#FCD34D] dark:bg-yellow-600 text-black dark:text-white flex items-center justify-between">
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
                      <span className="text-[10px] md:text-sm font-black uppercase border-4 border-black dark:border-white px-2 py-0.5 md:px-3 md:py-1 bg-white dark:bg-slate-800 text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {currentObjective ? "REQUIRED" : "DONE"}
                      </span>
                    </div>

                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                      {currentObjective ? (
                        <>
                          <p className="text-xs md:text-base font-bold text-slate-700 dark:text-slate-300 mb-4 md:mb-6 uppercase">
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
                          <div className="w-16 h-16 md:w-24 md:h-24 bg-[#A3E635] border-4 border-black flex items-center justify-center mb-4 md:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <span className="material-symbols-outlined text-4xl md:text-6xl text-black font-black">
                              task_alt
                            </span>
                          </div>
                          <h4 className="text-xl md:text-3xl font-black uppercase mb-2 md:mb-3">
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
              <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl md:text-2xl font-black uppercase mb-4 md:mb-6 border-b-4 border-black dark:border-white pb-3 md:pb-4">
                  Milestone Ledger
                </h3>
                <div className="space-y-4 md:space-y-6">
                  {typedMilestones.length === 0 ? (
                    <p className="text-[10px] md:text-sm font-bold uppercase border-2 border-dashed border-slate-500 p-3 md:p-4 text-center">
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
                              className={`absolute left-0 top-3 bottom-[-30px] md:bottom-[-40px] w-1 ml-2.5 md:ml-3 border-l-4 border-black dark:border-white ${isClaimed ? "border-solid" : "border-dashed"}`}
                            ></div>
                          )}

                          <div
                            className={`absolute left-0 top-1 w-6 h-6 md:w-8 md:h-8 border-2 md:border-4 border-black dark:border-white flex items-center justify-center ${isClaimed ? "bg-[#A3E635]" : isCurrent ? "bg-[#93C5FD]" : "bg-white dark:bg-slate-800"}`}
                          >
                            {isClaimed ? (
                              <span className="material-symbols-outlined text-black text-[14px] md:text-[20px] font-black">
                                check
                              </span>
                            ) : null}
                          </div>

                          <h4
                            className={`text-sm md:text-base font-black uppercase ${isClaimed || isCurrent ? "text-black dark:text-white" : "text-slate-500"}`}
                          >
                            {milestone.description}
                          </h4>
                          <p className="text-[10px] md:text-xs font-bold mt-1 text-slate-500 uppercase border-2 border-slate-300 inline-block px-1">
                            {isClaimed
                              ? "Verified"
                              : isCurrent
                                ? "Pending"
                                : task.status === "Dropped"
                                  ? "Abandoned"
                                  : "Locked"}
                          </p>
                          <p
                            className={`text-xs md:text-sm font-black mt-1.5 md:mt-2 ${isClaimed ? "text-[#A3E635] dark:text-green-400" : isCurrent ? "text-blue-500 dark:text-blue-400" : "text-slate-500"}`}
                          >
                            YIELD: +${milestone.reward.toFixed(2)}
                          </p>
                          {isClaimed && milestone.evidenceUrl && (
                            <a
                              href={milestone.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2.5 md:mt-3 text-[10px] md:text-xs font-black text-black bg-[#93C5FD] border-2 border-black px-2 py-1 md:px-3 md:py-1.5 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
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

              <div className="bg-[#93C5FD] dark:bg-blue-600 border-4 border-black dark:border-white p-4 md:p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <span className="material-symbols-outlined text-black dark:text-white text-4xl md:text-5xl mb-2 font-black">
                  support_agent
                </span>
                <h4 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white mb-2">
                  Need Help?
                </h4>
                <p className="text-[10px] md:text-sm font-bold text-black dark:text-white mb-4 md:mb-6 uppercase border-2 border-black dark:border-white p-2 bg-white/20">
                  Compliance team is available 24/7.
                </p>
                <button className="w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white text-black dark:text-white font-black uppercase text-xs md:text-sm py-2.5 md:py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all">
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

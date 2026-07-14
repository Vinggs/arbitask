import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import EvidenceUploader from "@/components/EvidenceUploader";
import { dropTask } from "@/app/actions";
import { getServerSession } from "next-auth"; // Buat ambil email user
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DropTaskButton from "@/components/DropTaskButton"; // <-- Import komponen Drop Task

// Bikin tipe sementara biar TypeScript nggak rewel soal evidenceUrl
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
  // Ambil sesi user yang lagi login
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || "";

  const resolvedParams = await params;
  const taskId = resolvedParams.id;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      milestones: {
        orderBy: { reward: "asc" },
      },
    },
  });

  if (!task) {
    notFound();
  }

  // Cast tipe milestones-nya biar TS kenal evidenceUrl
  const typedMilestones = task.milestones as MilestoneWithEvidence[];

  const totalMilestones = typedMilestones.length;
  const claimedMilestones = typedMilestones.filter((m) => m.isClaimed).length;
  const progressPercentage =
    totalMilestones > 0 ? (claimedMilestones / totalMilestones) * 100 : 0;

  const currentObjective = typedMilestones.find((m) => !m.isClaimed);

  const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    task.name,
  )}&background=0f172a&color=fff&size=128&font-size=0.4&bold=true`;
  const displayImage = task.imageUrl ? task.imageUrl : imgPlaceholder;

  return (
    // Tambahin dark mode classes untuk kontainer paling luar[cite: 10]
    <div className="flex min-h-screen bg-background dark:bg-[#0B1120] text-on-surface dark:text-slate-200 font-body-md text-body-md overflow-hidden antialiased transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col w-full h-screen overflow-y-auto bg-background dark:bg-[#0B1120] transition-colors duration-300">
        <Header title="Task Details" />

        <div className="p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 font-label-md text-sm transition-colors">
                <Link
                  href="/tracking"
                  className="hover:text-primary dark:hover:text-slate-200 transition-colors"
                >
                  Tracking
                </Link>
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
                <span className="text-on-surface dark:text-slate-200 font-semibold transition-colors">
                  {task.name}
                </span>
              </div>

              {/* TOMBOL DROP TASK DENGAN POP-UP WARNING */}
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
                <div className="w-16 h-16 rounded-xl bg-surface-container dark:bg-slate-800 border border-outline-variant dark:border-slate-700 flex items-center justify-center shadow-sm shrink-0 overflow-hidden transition-colors">
                  <img
                    src={displayImage}
                    alt={task.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-primary dark:text-slate-100 tracking-tight transition-colors">
                    {task.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-on-surface-variant dark:text-slate-400 font-medium flex items-center gap-1 transition-colors">
                      <span className="font-bold text-slate-400 dark:text-slate-500">
                        {task.offerwall === "RevU" ? "RU" : "TX"}
                      </span>
                      {task.offerwall} Allocation
                    </p>
                    {/* Badge Status */}
                    {task.status === "Dropped" && (
                      <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded uppercase border border-red-200 dark:border-red-800/50 transition-colors">
                        Dropped
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg px-5 py-3 flex flex-col min-w-[240px] shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider transition-colors">
                    Milestone Progress
                  </span>
                  <span className="text-sm text-primary dark:text-slate-100 font-bold transition-colors">
                    {claimedMilestones} / {totalMilestones}
                  </span>
                </div>
                <div className="w-full bg-surface-container dark:bg-slate-800 h-2 rounded-full overflow-hidden transition-colors">
                  <div
                    className="bg-primary dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Pesan kalau task udah di-drop */}
              {task.status === "Dropped" ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl p-6 text-center shadow-sm transition-colors">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-800/50 transition-colors">
                    <span className="material-symbols-outlined text-4xl text-red-500 dark:text-red-400">
                      flag
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2 transition-colors">
                    Quest Abandoned
                  </h3>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 max-w-md mx-auto transition-colors">
                    Lu udah nyerah sama task ini. Milestone lu yang udah
                    diverifikasi akan tetap tersimpan, tapi lu nggak bisa
                    ngumpulin milestone baru lagi.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <span
                          className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl transition-colors"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          assignment_turned_in
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-on-surface dark:text-slate-100 mb-2 transition-colors">
                          Current Objective
                        </h3>
                        <p className="text-base text-on-surface-variant dark:text-slate-400 mb-4 transition-colors">
                          {currentObjective
                            ? `Submit proof for: ${currentObjective.description}`
                            : "All milestones completed! Great job."}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200 dark:border-green-800/30 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">
                            info
                          </span>
                          Ensure your username is clearly visible in the
                          screenshot.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supabase Upload Card / Task Completed Card */}
                  <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm transition-colors">
                    <div className="border-b border-outline-variant dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between transition-colors">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface dark:text-slate-100 flex items-center gap-2 transition-colors">
                          <span
                            className={`material-symbols-outlined ${currentObjective ? "text-primary dark:text-blue-400" : "text-green-600 dark:text-green-400"}`}
                          >
                            {currentObjective ? "cloud_upload" : "verified"}
                          </span>
                          {currentObjective
                            ? "Evidence Submission"
                            : "Task Completed"}
                        </h3>
                        <p className="text-xs text-on-surface-variant dark:text-slate-500 mt-1 font-medium transition-colors">
                          Supabase Storage Integration
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${currentObjective ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50"}`}
                      >
                        {currentObjective ? "Required" : "Done"}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      {currentObjective ? (
                        <>
                          <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-4 transition-colors">
                            Upload screenshot evidence of level achievement from
                            your device directly to your Arbitask ledger.
                            Enterprise-grade cloud management ensures secure
                            verification.
                          </p>

                          <EvidenceUploader
                            taskId={task.id}
                            currentObjectiveId={currentObjective.id}
                          />
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                          <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 border border-green-100 dark:border-green-800/30 transition-colors">
                            <span className="material-symbols-outlined text-6xl text-green-500 dark:text-green-400 transition-colors">
                              task_alt
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 transition-colors">
                            You've Reached the Maximum Yield! 💸
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto transition-colors">
                            All tiers have been successfully verified. There's
                            no need to submit any more proof. Time to move on
                            and start grinding the next game!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 shadow-sm transition-colors">
                <h3 className="text-lg font-bold text-on-surface dark:text-slate-100 mb-6 border-b border-outline-variant dark:border-slate-800 pb-4 transition-colors">
                  Milestone Ledger
                </h3>
                <div className="space-y-6">
                  {typedMilestones.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic transition-colors">
                      Tidak ada detail tier.
                    </p>
                  ) : (
                    typedMilestones.map((milestone, index) => {
                      const isClaimed = milestone.isClaimed;
                      // Kalau task udah di-drop, nggak ada lagi milestone "Current"
                      const isCurrent =
                        task.status !== "Dropped" &&
                        currentObjective?.id === milestone.id;

                      return (
                        <div key={milestone.id} className="relative pl-6">
                          {index !== typedMilestones.length - 1 && (
                            <div
                              className={`absolute left-0 top-0 bottom-[-24px] w-px ml-2.5 transition-colors ${isClaimed ? "bg-green-500 dark:bg-green-400" : "bg-slate-200 dark:bg-slate-700 border-dashed border-l-2"}`}
                            ></div>
                          )}

                          <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center transition-colors">
                            {isClaimed ? (
                              <span
                                className="material-symbols-outlined text-green-500 dark:text-green-400 text-[20px] transition-colors"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                check_circle
                              </span>
                            ) : isCurrent ? (
                              <span
                                className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] transition-colors"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                radio_button_checked
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[20px] transition-colors">
                                radio_button_unchecked
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-sm font-bold transition-colors ${isClaimed ? "text-slate-800 dark:text-slate-200" : isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
                          >
                            {milestone.description}
                          </h4>
                          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400 transition-colors">
                            {isClaimed
                              ? "Verified"
                              : isCurrent
                                ? "Pending submission"
                                : task.status === "Dropped"
                                  ? "Abandoned"
                                  : "Locked"}
                          </p>
                          <p
                            className={`text-xs font-semibold mt-1 transition-colors ${isClaimed ? "text-green-600 dark:text-green-400" : isCurrent ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}
                          >
                            Yield: +${milestone.reward.toFixed(2)}
                          </p>
                          {isClaimed && milestone.evidenceUrl && (
                            <a
                              href={milestone.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2.5 py-1 rounded-md transition-colors border border-blue-100 dark:border-blue-800/50"
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                image
                              </span>
                              Lihat Bukti
                            </a>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 border border-outline-variant dark:border-slate-800 rounded-xl p-6 text-center shadow-sm transition-colors">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-3xl mb-2 transition-colors">
                  support_agent
                </span>
                <h4 className="text-sm font-bold text-on-surface dark:text-slate-200 mb-2 transition-colors">
                  Need Assistance?
                </h4>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4 transition-colors">
                  Our compliance team is available 24/7 for verification
                  inquiries.
                </p>
                <button className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2 rounded-lg transition-colors shadow-sm">
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

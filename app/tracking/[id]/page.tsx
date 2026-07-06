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
    <div className="flex min-h-screen bg-background text-on-surface font-body-md text-body-md overflow-hidden antialiased">
      <Sidebar />

      <main className="flex-1 flex flex-col w-full h-screen overflow-y-auto bg-background">
        <Header title="Task Details" />

        <div className="p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-sm">
                <Link
                  href="/tracking"
                  className="hover:text-primary transition-colors"
                >
                  Tracking
                </Link>
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
                <span className="text-on-surface font-semibold">
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
                <div className="w-16 h-16 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={task.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-primary tracking-tight">
                    {task.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-on-surface-variant font-medium flex items-center gap-1">
                      <span className="font-bold text-slate-400">
                        {task.offerwall === "RevU" ? "RU" : "TX"}
                      </span>
                      {task.offerwall} Allocation
                    </p>
                    {/* Badge Status */}
                    {task.status === "Dropped" && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase">
                        Dropped
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg px-5 py-3 flex flex-col min-w-[240px] shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Milestone Progress
                  </span>
                  <span className="text-sm text-primary font-bold">
                    {claimedMilestones} / {totalMilestones}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
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
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-sm">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl text-red-500">
                      flag
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-red-700 mb-2">
                    Quest Abandoned
                  </h3>
                  <p className="text-sm text-red-600/80 max-w-md mx-auto">
                    Lu udah nyerah sama task ini. Milestone lu yang udah
                    diverifikasi akan tetap tersimpan, tapi lu nggak bisa
                    ngumpulin milestone baru lagi.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <span
                          className="material-symbols-outlined text-green-600 text-3xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          assignment_turned_in
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-on-surface mb-2">
                          Current Objective
                        </h3>
                        <p className="text-base text-on-surface-variant mb-4">
                          {currentObjective
                            ? `Submit proof for: ${currentObjective.description}`
                            : "All milestones completed! Great job."}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200">
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
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
                    <div className="border-b border-outline-variant px-6 py-4 bg-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined ${currentObjective ? "text-primary" : "text-green-600"}`}
                          >
                            {currentObjective ? "cloud_upload" : "verified"}
                          </span>
                          {currentObjective
                            ? "Evidence Submission"
                            : "Task Completed"}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1 font-medium">
                          Supabase Storage Integration
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${currentObjective ? "bg-slate-200 text-slate-700 border-slate-300" : "bg-green-100 text-green-700 border-green-200"}`}
                      >
                        {currentObjective ? "Required" : "Done"}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      {currentObjective ? (
                        <>
                          <p className="text-sm text-on-surface-variant mb-4">
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
                          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                            <span className="material-symbols-outlined text-6xl text-green-500">
                              task_alt
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-slate-800 mb-2">
                            You've Reached the Maximum Yield! 💸
                          </h4>
                          <p className="text-sm text-slate-500 max-w-sm mx-auto">
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
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">
                  Milestone Ledger
                </h3>
                <div className="space-y-6">
                  {typedMilestones.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">
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
                              className={`absolute left-0 top-0 bottom-[-24px] w-px ml-2.5 ${isClaimed ? "bg-green-500" : "bg-slate-200 border-dashed border-l-2"}`}
                            ></div>
                          )}

                          <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                            {isClaimed ? (
                              <span
                                className="material-symbols-outlined text-green-500 text-[20px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                check_circle
                              </span>
                            ) : isCurrent ? (
                              <span
                                className="material-symbols-outlined text-blue-600 text-[20px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                radio_button_checked
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-slate-300 text-[20px]">
                                radio_button_unchecked
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-sm font-bold ${isClaimed ? "text-slate-800" : isCurrent ? "text-blue-600" : "text-slate-400"}`}
                          >
                            {milestone.description}
                          </h4>
                          <p className="text-xs mt-1 text-slate-500">
                            {isClaimed
                              ? "Verified"
                              : isCurrent
                                ? "Pending submission"
                                : task.status === "Dropped"
                                  ? "Abandoned"
                                  : "Locked"}
                          </p>
                          <p
                            className={`text-xs font-semibold mt-1 ${isClaimed ? "text-green-600" : isCurrent ? "text-slate-700" : "text-slate-400"}`}
                          >
                            Yield: +${milestone.reward.toFixed(2)}
                          </p>
                          {isClaimed && milestone.evidenceUrl && (
                            <a
                              href={milestone.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors border border-blue-100"
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

              <div className="bg-slate-50 border border-outline-variant rounded-xl p-6 text-center shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-3xl mb-2">
                  support_agent
                </span>
                <h4 className="text-sm font-bold text-on-surface mb-2">
                  Need Assistance?
                </h4>
                <p className="text-xs text-on-surface-variant mb-4">
                  Our compliance team is available 24/7 for verification
                  inquiries.
                </p>
                <button className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2 rounded-lg transition-colors shadow-sm">
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

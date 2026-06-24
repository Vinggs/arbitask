import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { prisma } from "@/lib/prisma";
import AddTaskForm from "@/components/AddTaskForm";
// Panggil claimMilestone yang baru
import { claimMilestone, deleteTask } from "@/app/actions";

export default async function TrackingPage() {
  // Ambil data task plus semua tier-nya sekalian
  const tasks = await prisma.task.findMany({
    orderBy: { deadline: "asc" },
    include: {
      milestones: {
        orderBy: { id: "asc" },
      },
    },
  });

  const today = new Date();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Tracking" />

        <main className="flex-1 p-margin-desktop max-w-container-max mx-auto w-full">
          <div className="mb-stack-lg flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="font-headline-lg text-primary mb-2">
                My Active Tracks
              </h2>
              <p className="text-on-surface-variant font-body-md max-w-2xl">
                Monitor the progress of your current financial optimization
                tasks. Maintain trajectory to secure projected yields.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <button className="px-6 py-2 border border-outline-variant text-primary rounded-lg font-label-md hover:bg-surface-container-highest transition-colors">
                Filter
              </button>
              <AddTaskForm />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mt-8">
            {tasks.length === 0 ? (
              <p className="text-on-surface-variant font-body-md col-span-full">
                Belum ada task yang di-track. Silakan klik New Analysis!
              </p>
            ) : (
              tasks.map((task) => {
                const percentage =
                  task.targetValue > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (task.currentValue / task.targetValue) * 100,
                        ),
                      )
                    : 0;

                const daysLeft = Math.ceil(
                  (task.deadline.getTime() - today.getTime()) /
                    (1000 * 3600 * 24),
                );
                const isUrgent = daysLeft <= 3;

                const badgeColor =
                  task.status === "Completed"
                    ? "bg-green-500/20 text-green-500 border-green-500/30"
                    : "bg-secondary-fixed/30 text-secondary border-secondary-fixed-dim/50";

                // Cari tier selanjutnya yang belum di-claim
                const nextMilestone = task.milestones.find((m) => !m.isClaimed);

                return (
                  <article
                    key={task.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col gap-6 hover:shadow-md transition-shadow cursor-default group"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-2xl text-primary">
                          {task.status === "Completed"
                            ? "check_circle"
                            : "track_changes"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-headline-md text-[18px] leading-tight text-primary mb-1 line-clamp-1">
                          {task.name}
                        </h3>
                        <p className="text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                          {task.platform} • {task.offerwall}
                        </p>
                      </div>
                      <span
                        className={`font-label-sm text-[11px] px-3 py-1 rounded-full whitespace-nowrap border ${badgeColor}`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="font-label-md text-on-surface">
                          ${task.currentValue} / ${task.targetValue}
                        </span>
                        <span className="font-label-md text-on-surface-variant">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${task.status === "Completed" ? "bg-green-500" : "bg-secondary"}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-outline-variant mt-auto">
                      <div className="flex gap-2 items-center">
                        {/* Tombol Claim Otomatis pengganti kotak input */}
                        {task.status !== "Completed" && nextMilestone ? (
                          <form action={claimMilestone} className="flex">
                            <input
                              type="hidden"
                              name="taskId"
                              value={task.id}
                            />
                            <input
                              type="hidden"
                              name="milestoneId"
                              value={nextMilestone.id}
                            />
                            <input
                              type="hidden"
                              name="reward"
                              value={nextMilestone.reward}
                            />
                            <button
                              type="submit"
                              className="font-label-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                            >
                              Claim {nextMilestone.description}
                            </button>
                          </form>
                        ) : task.status === "Completed" ? (
                          <span className="font-label-sm text-green-500 font-bold">
                            Maxed!
                          </span>
                        ) : null}

                        <form action={deleteTask}>
                          <input type="hidden" name="id" value={task.id} />
                          <button
                            type="submit"
                            className="font-label-sm text-error px-2 py-1.5 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </form>
                      </div>

                      <div
                        className={`flex items-center gap-1 ${isUrgent && task.status !== "Completed" ? "text-error font-semibold" : "text-on-surface-variant"}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>
                        <span className="font-label-sm">
                          {daysLeft < 0 ? "Overdue" : `${daysLeft} Days`}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

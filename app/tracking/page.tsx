import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function TrackingPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Panggil komponen Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Panggil komponen Header */}
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
              <button className="px-6 py-2 bg-primary-container text-on-primary rounded-lg font-label-md hover:bg-opacity-90 transition-colors shadow-sm">
                New Analysis
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {/* CARD 1 */}
            <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col gap-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    security
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline-md text-[18px] leading-tight text-primary mb-1">
                    Raid: Shadow Legends
                  </h3>
                  <p className="text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                    Level Progression
                  </p>
                </div>
                <span className="bg-secondary-fixed/30 text-secondary font-label-sm text-[11px] px-3 py-1 rounded-full whitespace-nowrap border border-secondary-fixed-dim/50">
                  In Progress
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="font-label-md text-on-surface">
                    Level 15 / 50
                  </span>
                  <span className="font-label-md text-on-surface-variant">
                    30%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant mt-auto">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  <span className="font-label-sm">12 Days Remaining</span>
                </div>
                <span className="font-label-md text-primary group-hover:text-secondary transition-colors">
                  Details &rarr;
                </span>
              </div>
            </article>

            {/* CARD 2 */}
            <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col gap-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    account_balance
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline-md text-[18px] leading-tight text-primary mb-1">
                    Rise of Kingdoms
                  </h3>
                  <p className="text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                    City Hall Upgrade
                  </p>
                </div>
                <span className="bg-secondary-fixed/30 text-secondary font-label-sm text-[11px] px-3 py-1 rounded-full whitespace-nowrap border border-secondary-fixed-dim/50">
                  In Progress
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="font-label-md text-on-surface">
                    City Hall Lv. 12 / 21
                  </span>
                  <span className="font-label-md text-on-surface-variant">
                    57%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: "57%" }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant mt-auto">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  <span className="font-label-sm">8 Days Remaining</span>
                </div>
                <span className="font-label-md text-primary group-hover:text-secondary transition-colors">
                  Details &rarr;
                </span>
              </div>
            </article>

            {/* CARD 3 */}
            <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col gap-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    candlestick_chart
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline-md text-[18px] leading-tight text-primary mb-1">
                    Webull Trading
                  </h3>
                  <p className="text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                    Deposit Milestone
                  </p>
                </div>
                <span className="bg-secondary-fixed/30 text-secondary font-label-sm text-[11px] px-3 py-1 rounded-full whitespace-nowrap border border-secondary-fixed-dim/50">
                  In Progress
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="font-label-md text-on-surface">
                    Deposit $50 / $100
                  </span>
                  <span className="font-label-md text-on-surface-variant">
                    50%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant mt-auto">
                <div className="flex items-center gap-2 text-error">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  <span className="font-label-sm font-semibold">
                    2 Days Remaining
                  </span>
                </div>
                <span className="font-label-md text-primary group-hover:text-secondary transition-colors">
                  Details &rarr;
                </span>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}

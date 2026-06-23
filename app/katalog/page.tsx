import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function KatalogPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header title="Katalog Offerwall" />

        <main className="flex-1 p-margin-desktop max-w-container-max mx-auto w-full">
          <div className="mb-stack-lg flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="font-headline-lg text-primary mb-2">
                Available Platforms
              </h2>
              <p className="text-on-surface-variant font-body-md max-w-2xl">
                Browse and integrate with top-tier offerwalls. Discover
                high-yield opportunities to maximize your arbitrage margins.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search offerwalls..."
                  className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors w-64"
                />
              </div>
            </div>
          </div>

          {/* Grid Katalog Offerwall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-margin-desktop">
            {/* Offerwall Card 1: RevU */}
            <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col hover:shadow-md transition-all hover:border-primary-container cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  RU
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <span className="material-symbols-outlined text-[12px]">
                    link
                  </span>{" "}
                  Connected
                </span>
              </div>
              <h3 className="font-headline-md text-[20px] text-primary mb-1">
                RevU
              </h3>
              <p className="text-on-surface-variant font-body-md mb-6 flex-1">
                Premium surveys and high-paying game tracking tasks.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <span className="font-label-sm text-on-surface-variant">
                  142 Active Tasks
                </span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </article>

            {/* Offerwall Card 2: ToroX */}
            <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col hover:shadow-md transition-all hover:border-primary-container cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface font-bold text-xl">
                  TX
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-label-sm text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <span className="material-symbols-outlined text-[12px]">
                    link
                  </span>{" "}
                  Connected
                </span>
              </div>
              <h3 className="font-headline-md text-[20px] text-primary mb-1">
                ToroX
              </h3>
              <p className="text-on-surface-variant font-body-md mb-6 flex-1">
                Fast payouts with a focus on mobile app installations.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <span className="font-label-sm text-on-surface-variant">
                  89 Active Tasks
                </span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </article>

            {/* Offerwall Card 3: Freecash (Not Connected) */}
            <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col hover:shadow-md transition-all hover:border-primary-container cursor-pointer group relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface font-bold text-xl opacity-60">
                  FC
                </div>
                <span className="bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full border border-outline-variant">
                  Disconnected
                </span>
              </div>
              <h3 className="font-headline-md text-[20px] text-primary mb-1 opacity-80">
                Freecash
              </h3>
              <p className="text-on-surface-variant font-body-md mb-6 flex-1 opacity-80">
                Direct crypto withdrawals and competitive leaderboards.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <button className="text-primary font-label-md hover:underline w-full text-left flex items-center justify-between">
                  Connect API{" "}
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>
            </article>

            {/* Offerwall Card 4: AdGem (Not Connected) */}
            <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col hover:shadow-md transition-all hover:border-primary-container cursor-pointer group relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface font-bold text-xl opacity-60">
                  AG
                </div>
                <span className="bg-surface-container-highest text-on-surface-variant font-label-sm text-[10px] px-2 py-0.5 rounded-full border border-outline-variant">
                  Disconnected
                </span>
              </div>
              <h3 className="font-headline-md text-[20px] text-primary mb-1 opacity-80">
                AdGem
              </h3>
              <p className="text-on-surface-variant font-body-md mb-6 flex-1 opacity-80">
                Specialized in multi-reward gaming milestones.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                <button className="text-primary font-label-md hover:underline w-full text-left flex items-center justify-between">
                  Connect API{" "}
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}

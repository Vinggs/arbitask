"use client";

import { useState } from "react";
import { autoTrackTask } from "@/app/actions";
import { useSession } from "next-auth/react";

export default function CatalogGrid({
  offers,
  providerName,
  trackedTasks,
}: {
  offers: any[];
  providerName: string;
  trackedTasks: any[]; // Pastikan ini dikirim dari server dengan mencakup semua status
}) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

  return (
    <>
      {/* GRID DAFTAR GAME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {offers.map((offer) => {
          const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            offer.gameName,
          )}&background=0f172a&color=fff&size=128&font-size=0.4&bold=true`;
          const displayImage = offer.imageUrl ? offer.imageUrl : imgPlaceholder;

          // Cari apakah task udah ada di DB user
          const existingTask = trackedTasks.find(
            (t) =>
              t.name.toLowerCase() === offer.gameName.toLowerCase() &&
              t.offerwall === offer.offerwall,
          );

          return (
            <article
              key={offer.id}
              className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col group relative ${
                existingTask?.status === "Dropped"
                  ? "opacity-75"
                  : "hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {offer.isHighest && (
                <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <span className="material-symbols-outlined text-[12px]">
                    local_fire_department
                  </span>
                  Hot
                </div>
              )}

              <div className="h-36 relative w-full overflow-hidden border-b border-slate-100 bg-slate-900 flex items-center justify-center">
                <img
                  src={displayImage}
                  alt={offer.gameName}
                  className={`w-full h-full object-cover transition-transform duration-500 opacity-90 ${
                    existingTask?.status === "Dropped"
                      ? "grayscale"
                      : "group-hover:scale-110"
                  }`}
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-700 uppercase tracking-wider border border-white/50 shadow-sm">
                  {offer.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-1 mb-1">
                  {offer.gameName}
                </h3>

                <div className="flex-1">
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {offer.requirement}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Yield Value
                    </p>
                    <p className="text-xl font-black text-green-600">
                      ${offer.usdValue.toFixed(2)}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        toll
                      </span>
                      {offer.rawCoins.toLocaleString()} Coins
                    </p>
                  </div>

                  {/* BUTTON ACTION DINAMIS */}
                  {existingTask ? (
                    <button
                      disabled
                      className={`h-10 px-3 rounded-xl font-bold text-[10px] shadow-sm flex items-center gap-1.5 cursor-not-allowed ${
                        existingTask.status === "Dropped"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : existingTask.status === "Completed"
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-surface-container text-on-surface-variant border border-outline-variant"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {existingTask.status === "Dropped"
                          ? "flag"
                          : existingTask.status === "Completed"
                            ? "check_circle"
                            : "sync"}
                      </span>
                      {existingTask.status === "Dropped"
                        ? "Abandoned"
                        : existingTask.status === "Completed"
                          ? "Completed"
                          : "In Progress"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="h-10 px-4 rounded-xl bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 hover:bg-slate-900 hover:text-white transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add
                      </span>
                      Track
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* MODAL POP-UP */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] w-full max-w-md p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedOffer(null)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>

            <div className="flex gap-4 items-center mb-6 pr-8">
              <img
                src={
                  selectedOffer.imageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedOffer.gameName)}&background=0f172a&color=fff&size=128&bold=true`
                }
                alt={selectedOffer.gameName}
                className="w-14 h-14 rounded-xl border border-slate-200 object-cover shadow-sm"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedOffer.gameName}
                </h3>
                <span className="inline-block mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider border border-slate-200 px-2 py-0.5 rounded-md">
                  {providerName} EXCLUSIVE
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 w-max mb-6">
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>
              Complete within 30 days
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Mission Milestones
              </p>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {selectedOffer.milestones &&
                selectedOffer.milestones.length > 0 ? (
                  selectedOffer.milestones.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-4 border border-slate-100 rounded-xl"
                    >
                      <span className="text-sm font-bold text-slate-700">
                        {m.description}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        ${m.reward.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl">
                    <span className="text-sm font-bold text-slate-700">
                      {selectedOffer.requirement}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      ${selectedOffer.usdValue.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* FORM SUBMISSION FROM MODAL */}
            <form
              action={autoTrackTask}
              onSubmit={() => setSelectedOffer(null)}
            >
              <input
                type="hidden"
                name="gameName"
                value={selectedOffer.gameName}
              />
              <input
                type="hidden"
                name="imageUrl"
                value={selectedOffer.imageUrl || ""}
              />
              <input
                type="hidden"
                name="offerwall"
                value={selectedOffer.offerwall}
              />
              <input
                type="hidden"
                name="usdValue"
                value={selectedOffer.usdValue.toString()}
              />
              <input
                type="hidden"
                name="userEmail"
                value={userEmail} // Pakai userEmail
              />
              <input
                type="hidden"
                name="milestones"
                value={JSON.stringify(selectedOffer.milestones)}
              />

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Start Tracking
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>
            </form>

            <p className="text-center text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-wider">
              Terms and conditions apply
            </p>
          </div>
        </div>
      )}
    </>
  );
}

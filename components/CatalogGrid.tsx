"use client";

import { useState } from "react";
import { autoTrackTask } from "@/app/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CatalogGrid({
  offers,
  providerName,
  trackedTasks,
}: {
  offers: any[];
  providerName: string;
  trackedTasks: any[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const userEmail = session?.user?.email || "";
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-12">
        {offers.map((offer) => {
          const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            offer.gameName,
          )}&background=000&color=fff&size=128&bold=true`;
          const displayImage = offer.imageUrl ? offer.imageUrl : imgPlaceholder;

          const combinedProvider = `${offer.platform} - ${offer.offerwall}`;
          const existingTask = trackedTasks.find(
            (t) =>
              t.name.toLowerCase() === offer.gameName.toLowerCase() &&
              t.offerwall === combinedProvider,
          );

          return (
            <article
              key={offer.id}
              className={`bg-white dark:bg-slate-900 border-2 border-black dark:border-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col group relative ${
                existingTask?.status === "Dropped"
                  ? "opacity-75"
                  : "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all"
              }`}
            >
              {offer.isHighest && (
                <div className="absolute top-3 right-3 z-20 bg-[#A3E635] text-black border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-[12px] font-black">
                    local_fire_department
                  </span>{" "}
                  Hot
                </div>
              )}

              <div className="h-40 relative w-full overflow-hidden border-b-2 border-black dark:border-white bg-black flex items-center justify-center">
                <img
                  src={displayImage}
                  alt={offer.gameName}
                  className={`w-full h-full object-cover opacity-90 ${
                    existingTask?.status === "Dropped"
                      ? "grayscale"
                      : "group-hover:scale-105 transition-transform duration-500"
                  }`}
                />
                <div className="absolute top-3 left-3 flex gap-1 z-10">
                  <span className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    {offer.platform}
                  </span>
                  <span className="bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-white px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    {offer.category}
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-5 flex-1 flex flex-col bg-[#F4F5F0] dark:bg-slate-900">
                <h3 className="text-lg md:text-xl font-black text-black dark:text-white uppercase line-clamp-1 mb-1">
                  {offer.gameName}
                </h3>
                <div className="flex-1">
                  <p className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-400 line-clamp-2 mt-2 uppercase">
                    {offer.requirement}
                  </p>
                </div>

                <div className="mt-2 mb-2">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Reward: {offer.rawCoins.toLocaleString("en-US")} Coins
                  </p>
                </div>

                <div className="mt-2 pt-4 border-t-2 border-black dark:border-white border-dashed flex items-center justify-between">
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-black dark:text-slate-300 uppercase tracking-widest mb-0.5">
                      Yield Value
                    </p>
                    <p className="text-xl md:text-2xl font-black text-[#059669] dark:text-green-400">
                      ${offer.usdValue.toFixed(2)}
                    </p>
                  </div>
                  {existingTask ? (
                    <button
                      disabled
                      className={`h-10 px-3 border-2 border-black dark:border-white font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-not-allowed ${
                        existingTask.status === "Dropped"
                          ? "bg-[#FCA5A5] text-black"
                          : existingTask.status === "Completed"
                            ? "bg-[#A3E635] text-black"
                            : "bg-white dark:bg-slate-800 text-black dark:text-white"
                      }`}
                    >
                      {existingTask.status === "Dropped"
                        ? "Abandoned"
                        : existingTask.status === "Completed"
                          ? "Completed"
                          : "Tracking"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="h-10 px-4 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-black uppercase text-xs hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    >
                      Track
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selectedOffer && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white w-full max-w-md max-h-[90vh] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] flex flex-col text-left overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ UPDATE: Modal Padding di HP dikecilin jadi p-4 */}
            <div className="p-4 md:p-6 border-b-4 border-black dark:border-white flex items-start justify-between bg-[#93C5FD] dark:bg-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedOffer.imageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedOffer.gameName,
                    )}&background=000&color=fff&size=128&bold=true`
                  }
                  className="w-12 h-12 md:w-16 md:h-16 object-cover border-4 border-black dark:border-white bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                />
                <div>
                  <h3 className="font-black text-black dark:text-white text-xl md:text-2xl uppercase tracking-tighter line-clamp-1">
                    {selectedOffer.gameName}
                  </h3>
                  <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest border-2 border-black dark:border-white px-2 py-0.5 bg-white dark:bg-slate-700 mt-1 inline-block">
                    {selectedOffer.platform} - {selectedOffer.offerwall}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-black dark:text-white border-2 border-black dark:border-white w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-black hover:text-white transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px] font-black">
                  close
                </span>
              </button>
            </div>

            <div className="p-4 md:p-6 bg-[#F4F5F0] dark:bg-slate-900 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 text-black dark:text-white text-[10px] md:text-xs font-black uppercase mb-4 md:mb-5 bg-[#FCD34D] dark:bg-yellow-600 w-fit px-3 py-1.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <span className="material-symbols-outlined text-[14px] md:text-[16px]">
                  schedule
                </span>{" "}
                30 Days Limit
              </div>

              <h4 className="text-[10px] md:text-[12px] font-black text-black dark:text-slate-300 uppercase tracking-widest mb-3">
                Milestones
              </h4>

              <div className="space-y-3">
                {selectedOffer.milestones &&
                selectedOffer.milestones.length > 0 ? (
                  selectedOffer.milestones.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-800 border-2 border-black dark:border-white p-3 md:p-4 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] gap-3"
                    >
                      <span className="text-xs md:text-sm font-black uppercase text-black dark:text-white line-clamp-2">
                        {m.description}
                      </span>
                      <span className="text-xs md:text-sm font-black text-[#059669] dark:text-green-400 whitespace-nowrap">
                        ${m.reward.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-800 border-2 border-black dark:border-white p-3 md:p-4 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] gap-3">
                    <span className="text-xs md:text-sm font-black uppercase text-black dark:text-white line-clamp-2">
                      {selectedOffer.requirement}
                    </span>
                    <span className="text-xs md:text-sm font-black text-[#059669] dark:text-green-400 whitespace-nowrap">
                      ${selectedOffer.usdValue.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 md:p-6 border-t-4 border-black dark:border-white bg-white dark:bg-slate-800">
              <form
                action={autoTrackTask}
                onSubmit={(e) => {
                  if (!userEmail) {
                    e.preventDefault();
                    router.push("/login");
                    return;
                  }
                  setSelectedOffer(null);
                }}
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
                  value={`${selectedOffer.platform} - ${selectedOffer.offerwall}`}
                />
                <input
                  type="hidden"
                  name="usdValue"
                  value={selectedOffer.usdValue.toString()}
                />
                <input type="hidden" name="userEmail" value={userEmail} />
                <input
                  type="hidden"
                  name="milestones"
                  value={JSON.stringify(selectedOffer.milestones)}
                />

                <button
                  type="submit"
                  className="w-full bg-[#A3E635] dark:bg-green-500 text-black dark:text-white font-black uppercase py-3 md:py-4 border-2 border-black dark:border-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all flex justify-center items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                >
                  Start Tracking{" "}
                  <span className="material-symbols-outlined text-[16px] md:text-[18px] font-black">
                    arrow_forward
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

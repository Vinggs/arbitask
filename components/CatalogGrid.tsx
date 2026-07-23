"use client";

import { useState } from "react";
import { autoTrackTask } from "@/app/[locale]/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { translateDynamicText } from "./translateDynamic"; // Memanggil kamus Regex kita

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

  const t = useTranslations("CatalogGrid");
  const locale = useLocale();

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

          // Eksekusi fungsi Regex untuk teks requirement di Grid
          const translatedRequirement = translateDynamicText(
            offer.requirement,
            locale,
          );

          return (
            <article
              key={offer.id}
              className={`bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 overflow-hidden shadow-brutal dark:shadow-brutal-dark flex flex-col group relative ${
                existingTask?.status === "Dropped"
                  ? "opacity-75"
                  : "hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg transition-all"
              }`}
            >
              {offer.isHighest && (
                <div className="absolute top-3 right-3 z-20 bg-emerald-400 dark:bg-teal-600 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 px-2 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                  <span className="material-symbols-outlined text-[12px] font-black">
                    local_fire_department
                  </span>{" "}
                  {t("hot")}
                </div>
              )}

              <div className="h-40 relative w-full overflow-hidden border-b-2 border-slate-900 dark:border-slate-700 bg-black flex items-center justify-center">
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
                  <span className="bg-slate-900 dark:bg-slate-200 text-slate-100 dark:text-slate-900 border-2 border-slate-900 dark:border-slate-700 px-2 py-1 text-[10px] font-black uppercase shadow-brutal-sm dark:shadow-brutal-dark-sm">
                    {offer.platform}
                  </span>
                  <span className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 px-2 py-1 text-[10px] font-black uppercase shadow-brutal-sm dark:shadow-brutal-dark-sm">
                    {offer.category}
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-5 flex-1 flex flex-col bg-slate-50 dark:bg-slate-900">
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase line-clamp-1 mb-1">
                  {offer.gameName}
                </h3>
                <div className="flex-1">
                  <p className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-400 line-clamp-2 mt-2 uppercase">
                    {translatedRequirement}
                  </p>
                </div>

                <div className="mt-2 mb-2">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {t("reward", {
                      coins: offer.rawCoins.toLocaleString("en-US"),
                    })}
                  </p>
                </div>

                <div className="mt-2 pt-4 border-t-2 border-slate-900 dark:border-slate-700 border-dashed flex items-center justify-between">
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-0.5">
                      {t("yieldValue")}
                    </p>
                    <p className="text-xl md:text-2xl font-black text-emerald-600 dark:text-teal-400">
                      ${offer.usdValue.toFixed(2)}
                    </p>
                  </div>
                  {existingTask ? (
                    <button
                      disabled
                      className={`h-10 px-3 border-2 border-slate-900 dark:border-slate-700 font-black uppercase text-[10px] shadow-brutal-sm dark:shadow-brutal-dark-sm cursor-not-allowed ${
                        existingTask.status === "Dropped"
                          ? "bg-red-400 dark:bg-rose-800 text-slate-900 dark:text-white"
                          : existingTask.status === "Completed"
                            ? "bg-emerald-400 dark:bg-teal-700 text-slate-900 dark:text-white"
                            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      }`}
                    >
                      {existingTask.status === "Dropped"
                        ? t("statusAbandoned")
                        : existingTask.status === "Completed"
                          ? t("statusCompleted")
                          : t("statusTracking")}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="h-10 px-4 bg-slate-900 dark:bg-slate-200 text-slate-100 dark:text-slate-900 border-2 border-slate-900 dark:border-slate-700 font-black uppercase text-xs hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-dark transition-all flex items-center gap-1 shadow-brutal-sm dark:shadow-brutal-dark-sm"
                    >
                      {t("trackBtn")}
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
            className="bg-white dark:bg-slate-950 border-4 border-slate-900 dark:border-slate-700 w-full max-w-md max-h-[90vh] shadow-brutal-lg dark:shadow-brutal-dark-lg flex flex-col text-left overflow-hidden transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 md:p-6 border-b-4 border-slate-900 dark:border-slate-700 flex items-start justify-between bg-blue-300 dark:bg-sky-800 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedOffer.imageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedOffer.gameName,
                    )}&background=000&color=fff&size=128&bold=true`
                  }
                  className="w-12 h-12 md:w-16 md:h-16 object-cover border-4 border-slate-900 dark:border-slate-700 bg-white shadow-brutal dark:shadow-brutal-dark"
                />
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-xl md:text-2xl uppercase tracking-tighter line-clamp-1">
                    {selectedOffer.gameName}
                  </h3>
                  <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-2 border-slate-900 dark:border-slate-700 px-2 py-0.5 bg-white dark:bg-slate-700 mt-1 inline-block">
                    {selectedOffer.platform} - {selectedOffer.offerwall}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-900 hover:text-white transition-colors flex-shrink-0 shadow-brutal-sm dark:shadow-brutal-dark-sm"
              >
                <span className="material-symbols-outlined text-[20px] font-black">
                  close
                </span>
              </button>
            </div>

            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 flex-1 overflow-y-auto transition-colors">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white text-[10px] md:text-xs font-black uppercase mb-4 md:mb-5 bg-amber-300 dark:bg-amber-600 w-fit px-3 py-1.5 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                <span className="material-symbols-outlined text-[14px] md:text-[16px]">
                  schedule
                </span>{" "}
                {t("daysLimit")}
              </div>

              <h4 className="text-[10px] md:text-[12px] font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-3">
                {t("milestones")}
              </h4>

              <div className="space-y-3">
                {selectedOffer.milestones &&
                selectedOffer.milestones.length > 0 ? (
                  selectedOffer.milestones.map((m: any, idx: number) => {
                    // Eksekusi fungsi Regex untuk teks milestone di Modal
                    const translatedMilestone = translateDynamicText(
                      m.description,
                      locale,
                    );

                    return (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 p-3 md:p-4 flex justify-between items-center shadow-brutal dark:shadow-brutal-dark gap-3"
                      >
                        <span className="text-xs md:text-sm font-black uppercase text-slate-900 dark:text-white line-clamp-2">
                          {translatedMilestone}
                        </span>
                        <span className="text-xs md:text-sm font-black text-emerald-600 dark:text-teal-400 whitespace-nowrap">
                          ${m.reward.toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 p-3 md:p-4 flex justify-between items-center shadow-brutal dark:shadow-brutal-dark gap-3">
                    <span className="text-xs md:text-sm font-black uppercase text-slate-900 dark:text-white line-clamp-2">
                      {translateDynamicText(selectedOffer.requirement, locale)}
                    </span>
                    <span className="text-xs md:text-sm font-black text-emerald-600 dark:text-teal-400 whitespace-nowrap">
                      ${selectedOffer.usdValue.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 md:p-6 border-t-4 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
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
                  className="w-full bg-emerald-400 dark:bg-teal-600 text-slate-900 dark:text-white font-black uppercase py-3 md:py-4 border-2 border-slate-900 dark:border-slate-700 hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg transition-all flex justify-center items-center gap-2 shadow-brutal dark:shadow-brutal-dark"
                >
                  {t("startTracking")}{" "}
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

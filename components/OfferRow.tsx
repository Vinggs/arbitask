"use client";

import { useState } from "react";
import { autoTrackTask } from "@/app/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Milestone = { id: string; description: string; reward: number };
type Offer = {
  id: string;
  gameName: string;
  platform: string;
  imageUrl?: string | null;
  offerwall: string;
  usdValue: number;
  rawCoins: number;
  requirement: string;
  isHighest: boolean;
  milestones: Milestone[];
};

export default function OfferRow({
  offer,
  taskStatus,
  userEmail,
}: {
  offer: Offer;
  taskStatus: string | null;
  userEmail: string;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    offer.gameName,
  )}&background=000&color=fff&size=128&bold=true`;
  const displayImage = offer.imageUrl ? offer.imageUrl : imgPlaceholder;

  const combinedProvider = `${offer.platform} - ${offer.offerwall}`;

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  return (
    <tr
      onClick={() => setIsModalOpen(true)}
      className="hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group border-b-2 border-slate-900 dark:border-slate-700 border-dashed last:border-b-0"
    >
      <td className="p-4 border-r-2 border-slate-900 dark:border-slate-700 border-dashed">
        <div className="flex items-center gap-4">
          <div
            className={`relative w-12 h-12 bg-white border-2 border-slate-900 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 ${
              taskStatus === "Dropped" ? "grayscale opacity-70" : ""
            }`}
          >
            <Image
              src={displayImage}
              alt={offer.gameName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div
              className={`font-black uppercase text-base transition-colors ${
                taskStatus === "Dropped"
                  ? "text-slate-500 dark:text-slate-500"
                  : "text-slate-900 dark:text-white group-hover:underline"
              }`}
            >
              {offer.gameName}
            </div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5 uppercase">
              {offer.requirement}
            </div>
          </div>
        </div>
      </td>

      <td className="p-4 border-r-2 border-slate-900 dark:border-slate-700 border-dashed">
        <div className="flex flex-col gap-1 items-start">
          <span className="px-2 py-0.5 bg-slate-900 dark:bg-slate-200 text-[10px] font-black uppercase text-slate-100 dark:text-slate-900 inline-block">
            {offer.platform}
          </span>
          <span className="px-2 py-1 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 text-xs font-black uppercase text-slate-900 dark:text-white inline-block shadow-brutal-sm dark:shadow-brutal-dark-sm">
            {offer.offerwall}
          </span>
        </div>
      </td>

      <td className="p-4 text-sm text-slate-900 dark:text-white font-black border-r-2 border-slate-900 dark:border-slate-700 border-dashed">
        {offer.rawCoins.toLocaleString("en-US")}
      </td>

      <td className="p-4 border-r-2 border-slate-900 dark:border-slate-700 border-dashed">
        <div className="font-black text-emerald-600 dark:text-teal-400 text-lg">
          {formatUSD(offer.usdValue)}
        </div>
        {offer.isHighest && (
          <span className="text-[10px] bg-emerald-400 dark:bg-teal-600 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 px-2 py-0.5 inline-flex items-center gap-1 mt-1 font-black uppercase shadow-brutal-sm dark:shadow-brutal-dark-sm">
            Highest{" "}
            <span className="material-symbols-outlined text-[12px] font-black">
              local_fire_department
            </span>
          </span>
        )}
      </td>

      <td className="p-4 text-right">
        {taskStatus ? (
          <button
            disabled
            onClick={(e) => e.stopPropagation()}
            className={`px-4 py-2 border-2 border-slate-900 dark:border-slate-700 font-black uppercase text-xs inline-flex items-center gap-1.5 shadow-brutal-sm dark:shadow-brutal-dark-sm cursor-not-allowed ${
              taskStatus === "Dropped"
                ? "bg-red-400 dark:bg-rose-800 text-slate-900 dark:text-white"
                : taskStatus === "Completed"
                  ? "bg-emerald-400 dark:bg-teal-700 text-slate-900 dark:text-white"
                  : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            }`}
          >
            {taskStatus === "Dropped"
              ? "Abandoned"
              : taskStatus === "Completed"
                ? "Completed"
                : "Tracking"}
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="bg-slate-900 dark:bg-slate-200 text-slate-100 dark:text-slate-900 border-2 border-slate-900 dark:border-slate-700 px-5 py-2 text-sm font-black uppercase hover:-translate-y-1 hover:shadow-brutal dark:hover:shadow-brutal-dark transition-all flex items-center justify-center gap-1 w-full max-w-[120px] ml-auto"
          >
            Track
          </button>
        )}

        {isModalOpen && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <div
              className="bg-white dark:bg-slate-950 border-4 border-slate-900 dark:border-slate-700 w-full max-w-md shadow-brutal-lg dark:shadow-brutal-dark-lg flex flex-col text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b-4 border-slate-900 dark:border-slate-700 flex items-start justify-between bg-amber-300 dark:bg-slate-800">
                <div className="flex items-center gap-4">
                  <Image
                    src={displayImage}
                    alt={offer.gameName}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover border-4 border-slate-900 dark:border-slate-700 bg-white shadow-brutal dark:shadow-brutal-dark"
                  />
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-2xl uppercase tracking-tighter">
                      {offer.gameName}
                    </h3>
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-2 border-slate-900 dark:border-slate-700 px-2 py-0.5 bg-white dark:bg-slate-700 mt-1 inline-block">
                      {combinedProvider}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                  className="text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors shadow-brutal-sm dark:shadow-brutal-dark-sm"
                >
                  <span className="material-symbols-outlined text-[20px] font-black">
                    close
                  </span>
                </button>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 flex-1 max-h-[50vh] overflow-y-auto hide-scrollbar">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white text-xs font-black uppercase mb-5 bg-emerald-400 dark:bg-teal-600 w-fit px-3 py-1.5 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>{" "}
                  30 Days Limit
                </div>

                <h4 className="text-[12px] font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-3">
                  Milestones
                </h4>

                <div className="space-y-3">
                  {offer.milestones.length === 0 ? (
                    <p className="text-sm font-bold text-slate-500 uppercase text-center py-4 border-2 border-dashed border-slate-400">
                      Tidak ada tier.
                    </p>
                  ) : (
                    offer.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 p-4 flex justify-between items-center shadow-brutal dark:shadow-brutal-dark"
                      >
                        <span className="text-sm font-black uppercase text-slate-900 dark:text-white">
                          {m.description}
                        </span>
                        <span className="text-sm font-black text-emerald-600 dark:text-teal-400">
                          {formatUSD(m.reward)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 border-t-4 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800">
                {taskStatus ? (
                  <button
                    disabled
                    className={`w-full font-black uppercase py-4 border-2 border-slate-900 dark:border-slate-700 shadow-brutal dark:shadow-brutal-dark cursor-not-allowed ${
                      taskStatus === "Dropped"
                        ? "bg-red-400 dark:bg-rose-800 text-slate-900 dark:text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    }`}
                  >
                    {taskStatus === "Dropped" ? "Abandoned" : "Already Tracked"}
                  </button>
                ) : (
                  <form
                    action={autoTrackTask}
                    onSubmit={(e) => {
                      if (!userEmail) {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push("/login");
                        return;
                      }
                      e.stopPropagation();
                      setIsModalOpen(false);
                    }}
                  >
                    <input type="hidden" name="userEmail" value={userEmail} />
                    <input
                      type="hidden"
                      name="gameName"
                      value={offer.gameName}
                    />
                    <input
                      type="hidden"
                      name="offerwall"
                      value={combinedProvider}
                    />
                    <input
                      type="hidden"
                      name="usdValue"
                      value={offer.usdValue}
                    />
                    <input
                      type="hidden"
                      name="requirement"
                      value={offer.requirement}
                    />
                    <input
                      type="hidden"
                      name="milestones"
                      value={JSON.stringify(offer.milestones)}
                    />
                    <input
                      type="hidden"
                      name="imageUrl"
                      value={offer.imageUrl || ""}
                    />

                    <button
                      type="submit"
                      className="w-full bg-blue-300 dark:bg-sky-600 text-slate-900 dark:text-white font-black uppercase py-4 border-2 border-slate-900 dark:border-slate-700 hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg transition-all flex justify-center items-center gap-2 shadow-brutal dark:shadow-brutal-dark"
                    >
                      Start Tracking{" "}
                      <span className="material-symbols-outlined text-[18px] font-black">
                        arrow_forward
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

"use client";

import { useState } from "react";
import { autoTrackTask } from "@/app/actions";
import { useRouter } from "next/navigation"; // 1. Import useRouter

type Milestone = { id: string; description: string; reward: number };
type Offer = {
  id: string;
  gameName: string;
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
  const router = useRouter(); // 2. Inisialisasi router
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(offer.gameName)}&background=000&color=fff&size=128&bold=true`;
  const displayImage = offer.imageUrl ? offer.imageUrl : imgPlaceholder;

  return (
    <tr
      onClick={() => setIsModalOpen(true)}
      className="hover:bg-[#FCD34D] dark:hover:bg-slate-800 transition-colors cursor-pointer group border-b-2 border-black dark:border-white border-dashed last:border-b-0"
    >
      <td className="p-4 border-r-2 border-black dark:border-white border-dashed">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 bg-white border-2 border-black dark:border-white flex items-center justify-center overflow-hidden flex-shrink-0 ${taskStatus === "Dropped" ? "grayscale opacity-70" : ""}`}
          >
            <img
              src={displayImage}
              alt={offer.gameName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div
              className={`font-black uppercase text-base transition-colors ${taskStatus === "Dropped" ? "text-slate-500" : "text-black dark:text-white group-hover:underline"}`}
            >
              {offer.gameName}
            </div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5 uppercase">
              {offer.requirement}
            </div>
          </div>
        </div>
      </td>

      <td className="p-4 border-r-2 border-black dark:border-white border-dashed">
        <span className="px-2 py-1 bg-white dark:bg-slate-800 border-2 border-black dark:border-white text-xs font-black uppercase text-black dark:text-white inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          {offer.offerwall}
        </span>
      </td>

      <td className="p-4 text-sm text-black dark:text-white font-black border-r-2 border-black dark:border-white border-dashed">
        {offer.rawCoins.toLocaleString()}
      </td>

      <td className="p-4 border-r-2 border-black dark:border-white border-dashed">
        <div className="font-black text-[#059669] dark:text-green-400 text-lg">
          ${offer.usdValue.toFixed(2)}
        </div>
        {offer.isHighest && (
          <span className="text-[10px] bg-[#A3E635] text-black border-2 border-black px-2 py-0.5 inline-flex items-center gap-1 mt-1 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
            className={`px-4 py-2 border-2 border-black dark:border-white font-black uppercase text-xs inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-not-allowed ${taskStatus === "Dropped" ? "bg-[#FCA5A5] text-black" : taskStatus === "Completed" ? "bg-[#A3E635] text-black" : "bg-white dark:bg-slate-700 text-black dark:text-white"}`}
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
            className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white px-5 py-2 text-sm font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-1 w-full max-w-[120px] ml-auto"
          >
            Track
          </button>
        )}

        {/* MODAL NEO-BRUTALISM */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <div
              className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] flex flex-col text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b-4 border-black dark:border-white flex items-start justify-between bg-[#FCD34D] dark:bg-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={displayImage}
                    className="w-16 h-16 object-cover border-4 border-black dark:border-white bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  />
                  <div>
                    <h3 className="font-black text-black dark:text-white text-2xl uppercase tracking-tighter">
                      {offer.gameName}
                    </h3>
                    <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest border-2 border-black dark:border-white px-2 py-0.5 bg-white dark:bg-slate-700 mt-1 inline-block">
                      {offer.offerwall} EXCLUSIVE
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                  className="text-black dark:text-white border-2 border-black dark:border-white w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] font-black">
                    close
                  </span>
                </button>
              </div>

              <div className="p-6 bg-[#F4F5F0] dark:bg-slate-900 flex-1 max-h-[50vh] overflow-y-auto">
                <div className="flex items-center gap-2 text-black dark:text-white text-xs font-black uppercase mb-5 bg-[#A3E635] dark:bg-green-600 w-fit px-3 py-1.5 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>{" "}
                  30 Days Limit
                </div>

                <h4 className="text-[12px] font-black text-black dark:text-slate-300 uppercase tracking-widest mb-3">
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
                        className="bg-white dark:bg-slate-800 border-2 border-black dark:border-white p-4 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                      >
                        <span className="text-sm font-black uppercase text-black dark:text-white">
                          {m.description}
                        </span>
                        <span className="text-sm font-black text-[#059669] dark:text-green-400">
                          ${m.reward.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 border-t-4 border-black dark:border-white bg-white dark:bg-slate-800">
                {taskStatus ? (
                  <button
                    disabled
                    className={`w-full font-black uppercase py-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] cursor-not-allowed ${taskStatus === "Dropped" ? "bg-[#FCA5A5] text-black" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}
                  >
                    {taskStatus === "Dropped" ? "Abandoned" : "Already Tracked"}
                  </button>
                ) : (
                  <form
                    action={autoTrackTask}
                    onSubmit={(e) => {
                      // 3. Cek form kalau di table row
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
                      value={offer.offerwall}
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
                      className="w-full bg-[#93C5FD] dark:bg-blue-600 text-black dark:text-white font-black uppercase py-4 border-2 border-black dark:border-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all flex justify-center items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
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

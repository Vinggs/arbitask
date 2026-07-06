"use client";

import { useState } from "react";
import { autoTrackTask } from "@/app/actions";

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
  taskStatus, // Menerima status task dari page.tsx
  userEmail, // Menerima email dari page.tsx
}: {
  offer: Offer;
  taskStatus: string | null; // Definisi tipe data baru
  userEmail: string; // Definisi tipe data baru
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    offer.gameName,
  )}&background=0f172a&color=fff&size=128&font-size=0.4&bold=true`;

  const displayImage = offer.imageUrl ? offer.imageUrl : imgPlaceholder;

  return (
    <tr
      onClick={() => setIsModalOpen(true)}
      className="hover:bg-surface-container/30 transition-colors cursor-pointer group"
    >
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 ${taskStatus === "Dropped" ? "grayscale opacity-70" : ""}`}
          >
            <img
              src={displayImage}
              alt={offer.gameName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div
              className={`font-semibold text-base transition-colors ${taskStatus === "Dropped" ? "text-slate-500" : "text-primary group-hover:text-blue-600"}`}
            >
              {offer.gameName}
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">
                sports_esports
              </span>
              {offer.requirement}
            </div>
          </div>
        </div>
      </td>

      <td className="p-4">
        <div className="flex flex-col gap-1 items-start">
          <span className="px-2.5 py-1 bg-surface-container border border-outline-variant rounded text-xs font-medium text-on-surface flex items-center gap-1">
            <span className="font-bold text-gray-400">
              {offer.offerwall === "RevU" ? "RU" : "TX"}
            </span>
            {offer.offerwall}
          </span>
        </div>
      </td>

      <td className="p-4 text-sm text-on-surface font-medium">
        {offer.rawCoins.toLocaleString()}
      </td>

      <td className="p-4">
        <div className="font-bold text-green-600 text-lg">
          ${offer.usdValue.toFixed(2)}
        </div>
        {offer.isHighest && (
          <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1 font-semibold">
            Highest{" "}
            <span className="material-symbols-outlined text-[12px]">
              local_fire_department
            </span>
          </span>
        )}
      </td>

      <td className="p-4 text-right">
        {/* Tombol Action Dinamis */}
        {taskStatus ? (
          <button
            disabled
            onClick={(e) => e.stopPropagation()} // Biar nggak ngebuka modal kalau diklik
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-not-allowed
              ${
                taskStatus === "Dropped"
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : taskStatus === "Completed"
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-surface-container text-on-surface-variant border border-outline-variant"
              }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {taskStatus === "Dropped"
                ? "flag"
                : taskStatus === "Completed"
                  ? "check_circle"
                  : "sync"}
            </span>
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
            className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md flex items-center gap-1"
          >
            <span className="text-[16px]">+</span> Track
          </button>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-transform text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-white">
                <div className="flex items-center gap-4">
                  <img
                    src={displayImage}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl tracking-tight">
                      {offer.gameName}
                    </h3>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200 px-2 py-0.5 rounded mt-1.5 inline-block">
                      {offer.offerwall} EXCLUSIVE
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-slate-50/50 flex-1 max-h-[50vh] overflow-y-auto">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-5 bg-emerald-50 w-fit px-3 py-1.5 rounded-full border border-emerald-100">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  Complete within 30 days
                </div>

                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Mission Milestones
                </h4>

                <div className="space-y-2.5">
                  {offer.milestones.length === 0 ? (
                    <p className="text-sm text-gray-500 italic text-center py-4">
                      Tidak ada milestone spesifik.
                    </p>
                  ) : (
                    offer.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white border border-gray-200 rounded-xl p-3.5 flex justify-between items-center shadow-sm hover:border-blue-200 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-700">
                          {m.description}
                        </span>
                        <span className="text-sm font-bold text-emerald-600">
                          ${m.reward.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-white">
                {taskStatus ? (
                  <button
                    disabled
                    className={`w-full font-semibold py-3.5 rounded-xl cursor-not-allowed ${
                      taskStatus === "Dropped"
                        ? "bg-red-50 text-red-400 border border-red-100"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    Task{" "}
                    {taskStatus === "Dropped"
                      ? "Abandoned"
                      : taskStatus === "Completed"
                        ? "Completed"
                        : "Already Tracked"}
                  </button>
                ) : (
                  <form
                    action={autoTrackTask}
                    onSubmit={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(false);
                    }}
                  >
                    {/* Selipin email lu ke dalam form ini */}
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
                      className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-slate-900/20"
                    >
                      Start Tracking{" "}
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </button>
                  </form>
                )}
                <p className="text-[9px] text-center text-gray-400 font-semibold uppercase tracking-widest mt-4">
                  Terms and conditions apply
                </p>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

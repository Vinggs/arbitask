"use client";

import { useState } from "react";
import { addTask } from "@/app/actions";

export default function AddTaskForm() {
  const [isOpen, setIsOpen] = useState(false);
  // State untuk form tier
  const [milestones, setMilestones] = useState([
    { description: "", reward: "" },
  ]);

  const addMilestone = () =>
    setMilestones([...milestones, { description: "", reward: "" }]);

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value } as any;
    setMilestones(newMilestones);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = [...milestones];
    newMilestones.splice(index, 1);
    setMilestones(newMilestones);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        New Analysis
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
              Mulai Task Baru
            </h3>

            <form
              action={(formData) => {
                addTask(formData);
                setIsOpen(false);
                setMilestones([{ description: "", reward: "" }]); // Reset form
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                  Nama Game / Task
                </label>
                <input
                  name="name"
                  placeholder="ex: Raid Shadow Legends"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              {/* INPUT PLATFORM UDAH DIHAPUS SECARA PERMANEN DARI SINI */}

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                  Offerwall
                </label>
                <input
                  name="offerwall"
                  placeholder="ex: RevU, Torox"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                    Target Total ($)
                  </label>
                  <input
                    name="targetValue"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                    Deadline (Estimasi)
                  </label>
                  <input
                    name="deadline"
                    type="date"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Area Milestones */}
              <div className="mt-2 border-t border-gray-100 pt-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-gray-900">
                    Target Tiers
                  </span>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    + Add Tier
                  </button>
                </div>

                <div className="space-y-3">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        placeholder="Ex: Level 10"
                        value={m.description}
                        onChange={(e) =>
                          updateMilestone(i, "description", e.target.value)
                        }
                        className="flex-1 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                        required
                      />
                      <div className="relative w-24">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={m.reward}
                          onChange={(e) =>
                            updateMilestone(i, "reward", e.target.value)
                          }
                          className="w-full p-2.5 pl-7 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(i)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <input
                type="hidden"
                name="milestones"
                value={JSON.stringify(milestones)}
              />

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-slate-900/20 mt-4"
              >
                Track Sekarang
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

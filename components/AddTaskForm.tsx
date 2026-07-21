"use client";

import { useState } from "react";
import { addTask } from "@/app/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddTaskForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [milestones, setMilestones] = useState([
    { description: "", reward: "" },
  ]);

  const [platform, setPlatform] = useState("");
  const [provider, setProvider] = useState("");

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
    <div className="relative w-full md:w-auto">
      {/* ✅ FIX: Tombol jadi full width di HP */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto px-6 py-3 md:py-2 bg-[#93C5FD] dark:bg-blue-600 text-black dark:text-white border-2 border-black dark:border-white text-xs md:text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px] font-black">
          add
        </span>
        New Manual Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-[#F4F5F0] dark:bg-slate-900 border-4 border-black dark:border-white w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative max-h-[90vh] flex flex-col">
            <div className="p-4 md:p-6 border-b-4 border-black dark:border-white bg-[#A3E635] flex justify-between items-center">
              <h3 className="text-xl md:text-2xl font-black text-black uppercase tracking-tighter">
                Manual Tracking
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="border-2 border-black bg-white hover:bg-black hover:text-white transition-colors w-8 h-8 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
              >
                <span className="material-symbols-outlined text-[20px] font-black text-inherit">
                  close
                </span>
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto bg-white dark:bg-slate-800">
              <form
                action={(formData) => {
                  if (!session?.user?.email) {
                    router.push("/login");
                    return;
                  }
                  addTask(formData);
                  setIsOpen(false);
                  setMilestones([{ description: "", reward: "" }]);
                  setPlatform("");
                  setProvider("");
                }}
                className="flex flex-col gap-4 md:gap-5"
              >
                <input
                  type="hidden"
                  name="userEmail"
                  value={session?.user?.email || ""}
                />
                <input
                  type="hidden"
                  name="offerwall"
                  value={`${platform} - ${provider}`}
                />

                <div>
                  <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 block">
                    Nama Game / Task
                  </label>
                  <input
                    name="name"
                    placeholder="ex: Raid Shadow Legends"
                    className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-900 border-2 border-black dark:border-white text-xs md:text-sm font-bold text-black dark:text-white focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    required
                  />
                </div>

                {/* ✅ FIX: Jadikan flex-col di HP (sm:flex-row) biar input nggak mepet */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 block">
                      Platform
                    </label>
                    <input
                      type="text"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="ex: Swagbucks"
                      className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-900 border-2 border-black dark:border-white text-xs md:text-sm font-bold text-black dark:text-white focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 block">
                      Provider
                    </label>
                    <input
                      type="text"
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      placeholder="ex: Torox"
                      className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-900 border-2 border-black dark:border-white text-xs md:text-sm font-bold text-black dark:text-white focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      required
                    />
                  </div>
                </div>

                {/* ✅ FIX: Jadikan flex-col di HP (sm:flex-row) */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 block">
                      Target Total ($)
                    </label>
                    <input
                      name="targetValue"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-900 border-2 border-black dark:border-white text-xs md:text-sm font-bold text-black dark:text-white focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 block">
                      Deadline
                    </label>
                    <input
                      name="deadline"
                      type="date"
                      className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-900 border-2 border-black dark:border-white text-xs md:text-sm font-bold text-black dark:text-white focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      required
                    />
                  </div>
                </div>

                <div className="mt-2 md:mt-4 border-t-4 border-black dark:border-white border-dashed pt-4 md:pt-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs md:text-sm font-black uppercase text-black dark:text-white">
                      Target Tiers
                    </span>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="text-[10px] font-black uppercase bg-[#FCD34D] text-black border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px transition-all"
                    >
                      + Add Tier
                    </button>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    {milestones.map((m, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-[#F4F5F0] dark:bg-slate-700 p-2 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      >
                        <input
                          placeholder="Level 10"
                          value={m.description}
                          onChange={(e) =>
                            updateMilestone(i, "description", e.target.value)
                          }
                          className="w-full sm:w-auto sm:flex-1 p-2 bg-transparent text-xs md:text-sm font-bold text-black dark:text-white focus:outline-none border-b-2 border-black dark:border-white border-dashed"
                          required
                        />
                        <div className="relative w-full sm:w-24 flex items-center gap-2 sm:block">
                          <span className="sm:absolute left-1 sm:top-1/2 sm:-translate-y-1/2 text-black dark:text-white text-sm font-black">
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
                            className="flex-1 sm:w-full p-2 sm:pl-4 bg-transparent text-xs md:text-sm font-bold text-[#059669] dark:text-green-400 focus:outline-none border-b-2 border-black dark:border-white border-dashed"
                            required
                          />
                          {milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(i)}
                              className="sm:hidden p-1.5 bg-[#FCA5A5] border-2 border-black text-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              <span className="material-symbols-outlined text-[16px] font-black text-inherit">
                                delete
                              </span>
                            </button>
                          )}
                        </div>
                        {milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMilestone(i)}
                            className="hidden sm:block p-1.5 bg-[#FCA5A5] border-2 border-black text-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:shadow-none"
                          >
                            <span className="material-symbols-outlined text-[16px] font-black text-inherit">
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
                  className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase py-3 md:py-4 border-2 border-black dark:border-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all flex justify-center items-center gap-2"
                >
                  Start Tracking
                  <span className="material-symbols-outlined text-[18px] font-black">
                    arrow_forward
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

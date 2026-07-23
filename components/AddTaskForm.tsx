"use client";

import { useState } from "react";
import { addTask } from "@/app/[locale]/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AddTaskForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations("AddTaskForm");

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
      <button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto px-6 py-3 md:py-2 bg-blue-300 dark:bg-sky-700 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 text-xs md:text-sm font-black uppercase shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px] font-black">
          add
        </span>
        {t("btnNewTask")}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-slate-50 dark:bg-slate-950 border-4 border-slate-900 dark:border-slate-700 w-full max-w-md shadow-brutal-lg dark:shadow-brutal-dark-lg relative max-h-[90vh] flex flex-col transition-colors">
            <div className="p-4 md:p-6 border-b-4 border-slate-900 dark:border-slate-700 bg-emerald-400 dark:bg-teal-700 flex justify-between items-center transition-colors">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {t("modalTitle")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors w-8 h-8 flex items-center justify-center shadow-brutal-sm dark:shadow-brutal-dark-sm active:translate-y-0 active:shadow-none"
              >
                <span className="material-symbols-outlined text-[20px] font-black text-inherit">
                  close
                </span>
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto bg-white dark:bg-slate-900 transition-colors">
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
                  <label className="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1.5 block">
                    {t("labelGame")}
                  </label>
                  <input
                    name="name"
                    placeholder={t("placeholderGame")}
                    className="w-full p-2.5 md:p-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-900 dark:text-white focus:outline-none shadow-brutal-sm dark:shadow-brutal-dark-sm"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1.5 block">
                      {t("labelPlatform")}
                    </label>
                    <input
                      type="text"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder={t("placeholderPlatform")}
                      className="w-full p-2.5 md:p-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-900 dark:text-white focus:outline-none shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1.5 block">
                      {t("labelProvider")}
                    </label>
                    <input
                      type="text"
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      placeholder={t("placeholderProvider")}
                      className="w-full p-2.5 md:p-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-900 dark:text-white focus:outline-none shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1.5 block">
                      {t("labelTarget")}
                    </label>
                    <input
                      name="targetValue"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full p-2.5 md:p-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-900 dark:text-white focus:outline-none shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="text-[10px] md:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1.5 block">
                      {t("labelDeadline")}
                    </label>
                    <input
                      name="deadline"
                      type="date"
                      className="w-full p-2.5 md:p-3 bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-900 dark:text-white focus:outline-none shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      required
                    />
                  </div>
                </div>

                <div className="mt-2 md:mt-4 border-t-4 border-slate-900 dark:border-slate-700 border-dashed pt-4 md:pt-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs md:text-sm font-black uppercase text-slate-900 dark:text-white">
                      {t("targetTiers")}
                    </span>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="text-[10px] font-black uppercase bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 px-3 py-1 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:-translate-y-px transition-all"
                    >
                      {t("btnAddTier")}
                    </button>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    {milestones.map((m, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-slate-50 dark:bg-slate-800 p-2 border-2 border-slate-900 dark:border-slate-700 shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      >
                        <input
                          placeholder={t("placeholderTier")}
                          value={m.description}
                          onChange={(e) =>
                            updateMilestone(i, "description", e.target.value)
                          }
                          className="w-full sm:w-auto sm:flex-1 p-2 bg-transparent text-xs md:text-sm font-bold text-slate-900 dark:text-white focus:outline-none border-b-2 border-slate-900 dark:border-slate-700 border-dashed"
                          required
                        />
                        <div className="relative w-full sm:w-24 flex items-center gap-2 sm:block">
                          <span className="sm:absolute left-1 sm:top-1/2 sm:-translate-y-1/2 text-slate-900 dark:text-white text-sm font-black">
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
                            className="flex-1 sm:w-full p-2 sm:pl-4 bg-transparent text-xs md:text-sm font-bold text-emerald-600 dark:text-teal-400 focus:outline-none border-b-2 border-slate-900 dark:border-slate-700 border-dashed"
                            required
                          />
                          {milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(i)}
                              className="sm:hidden p-1.5 bg-red-400 border-2 border-slate-900 text-slate-900 shrink-0 shadow-brutal-sm"
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
                            className="hidden sm:block p-1.5 bg-red-400 dark:bg-rose-700 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white transition-colors shadow-brutal-sm dark:shadow-brutal-dark-sm active:translate-y-px active:shadow-none"
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
                  className="w-full mt-4 bg-slate-900 dark:bg-slate-200 text-slate-100 dark:text-slate-900 font-black uppercase py-3 md:py-4 border-2 border-slate-900 dark:border-slate-700 hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg shadow-brutal dark:shadow-brutal-dark transition-all flex justify-center items-center gap-2"
                >
                  {t("btnStart")}
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

"use client";

import { useState } from "react";
import { addGameToCatalog } from "@/app/actions";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AddGamePage() {
  const [milestones, setMilestones] = useState([
    { description: "", reward: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    setIsSubmitting(true);
    const formData = new FormData(form);
    formData.append("milestones", JSON.stringify(milestones));

    await addGameToCatalog(formData);

    alert("Game berhasil ditambahkan ke Katalog!");
    form.reset();
    setMilestones([{ description: "", reward: "" }]);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title="Data Entry" />

        {/* ✅ FIX: Padding responsif di main wrapper */}
        <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
          <header className="mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
              Add New Game
            </h2>
            <p className="text-xs md:text-sm font-bold mt-1 md:mt-2 uppercase text-slate-600 dark:text-slate-400">
              Masukkan tawaran baru ke dalam katalog utama.
            </p>
          </header>

          {/* ✅ FIX: Padding form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-4 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col gap-5 md:gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 block">
                  Nama Game
                </label>
                <input
                  name="gameName"
                  placeholder="Ex: Monopoly GO!"
                  className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 block">
                  Platform
                </label>
                <select
                  name="platform"
                  className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
                  required
                >
                  <option value="Swagbucks">Swagbucks</option>
                  <option value="Freecash">Freecash</option>
                  <option value="InboxDollars">InboxDollars</option>
                  <option value="YSense">YSense</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 block">
                  Provider (Offerwall)
                </label>
                <select
                  name="offerwall"
                  className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
                  required
                >
                  <option value="Torox">Torox</option>
                  <option value="RevU">RevU</option>
                  <option value="AdGem">AdGem</option>
                  <option value="AyetStudios">AyetStudios</option>
                  <option value="Lootably">Lootably</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 block">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
                  required
                >
                  <option value="Games">Games</option>
                  <option value="Surveys">Surveys</option>
                  <option value="Sign Ups">Sign Ups</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 block">
                  Total USD Value
                </label>
                <input
                  name="usdValue"
                  type="number"
                  step="0.01"
                  placeholder="10.50"
                  className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 block">
                  Raw Coins Reward
                </label>
                <input
                  name="rawCoins"
                  type="number"
                  placeholder="1050"
                  className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 block">
                Persyaratan Utama (Requirement)
              </label>
              <input
                name="requirement"
                placeholder="Ex: Reach Level 50 within 30 days"
                className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-end">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-1 md:mb-2 block">
                  Image URL (Optional)
                </label>
                <input
                  name="imageUrl"
                  placeholder="https://..."
                  className="w-full p-2.5 md:p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                />
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-[#FCD34D] dark:bg-yellow-600 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <input
                  type="checkbox"
                  name="isHighest"
                  value="true"
                  className="w-5 h-5 border-2 border-black accent-black cursor-pointer shrink-0"
                />
                <label className="text-[10px] md:text-xs font-black uppercase text-black cursor-pointer leading-tight">
                  Tandai sebagai Highest Yield 🔥
                </label>
              </div>
            </div>

            <div className="mt-2 md:mt-4 border-t-4 border-black dark:border-white border-dashed pt-4 md:pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs md:text-sm font-black uppercase">
                  Game Milestones
                </span>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="text-[10px] font-black uppercase bg-[#93C5FD] dark:bg-blue-600 text-black dark:text-white border-2 border-black dark:border-white px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-px transition-all"
                >
                  + Add Milestone
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    // ✅ FIX: flex-col di mobile biar input tier nggak kegencet
                    className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center bg-[#F4F5F0] dark:bg-slate-800 p-2 md:p-3 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  >
                    <input
                      placeholder="Ex: Reach Level 10"
                      value={m.description}
                      onChange={(e) =>
                        updateMilestone(i, "description", e.target.value)
                      }
                      className="w-full sm:flex-1 p-2 bg-transparent text-sm font-bold focus:outline-none border-b-2 border-black dark:border-white border-dashed"
                      required
                    />
                    <div className="relative w-full sm:w-32 flex items-center gap-2 sm:block">
                      <span className="sm:absolute left-1 sm:top-1/2 sm:-translate-y-1/2 text-sm font-black hidden sm:block">
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
                        className="flex-1 sm:w-full p-2 sm:pl-5 bg-transparent text-sm font-bold text-[#059669] dark:text-green-400 focus:outline-none border-b-2 border-black dark:border-white border-dashed"
                        required
                      />
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(i)}
                          className="sm:hidden p-2 bg-[#FCA5A5] border-2 border-black text-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
                        className="hidden sm:block p-2 bg-[#FCA5A5] border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 md:mt-6 bg-[#A3E635] dark:bg-green-500 text-black dark:text-white font-black uppercase py-3 md:py-4 border-4 border-black dark:border-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menyimpan..." : "Publish ke Katalog"}
              <span className="material-symbols-outlined text-[18px] md:text-[20px] font-black">
                save
              </span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

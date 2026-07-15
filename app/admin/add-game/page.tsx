// File: app/admin/add-game/page.tsx
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
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("milestones", JSON.stringify(milestones));

    await addGameToCatalog(formData);

    alert("Game berhasil ditambahkan ke Katalog!");
    e.currentTarget.reset();
    setMilestones([{ description: "", reward: "" }]);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F0] dark:bg-[#0B1120] text-black dark:text-white transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header title="Data Entry" />

        <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
          <header className="mb-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Add New Game
            </h2>
            <p className="text-sm font-bold mt-2 uppercase text-slate-600 dark:text-slate-400">
              Masukkan tawaran baru ke dalam katalog utama.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">
                  Nama Game
                </label>
                <input
                  name="gameName"
                  placeholder="Ex: Monopoly GO!"
                  className="w-full p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">
                  Offerwall Provider
                </label>
                <select
                  name="offerwall"
                  className="w-full p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
                  required
                >
                  <option value="RevU">RevU</option>
                  <option value="ToroX">ToroX</option>
                  <option value="Freecash">Freecash</option>
                  <option value="AdGem">AdGem</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
                  required
                >
                  <option value="Games">Games</option>
                  <option value="Surveys">Surveys</option>
                  <option value="Sign Ups">Sign Ups</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">
                  Total USD Value
                </label>
                <input
                  name="usdValue"
                  type="number"
                  step="0.01"
                  placeholder="10.50"
                  className="w-full p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">
                  Raw Coins Reward
                </label>
                <input
                  name="rawCoins"
                  type="number"
                  placeholder="1050"
                  className="w-full p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">
                Persyaratan Utama (Requirement)
              </label>
              <input
                name="requirement"
                placeholder="Ex: Reach Level 50 within 30 days"
                className="w-full p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">
                  Image URL (Optional)
                </label>
                <input
                  name="imageUrl"
                  placeholder="https://..."
                  className="w-full p-3 bg-[#F4F5F0] dark:bg-slate-800 border-2 border-black dark:border-white text-sm font-bold focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#FCD34D] dark:bg-yellow-600 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <input
                  type="checkbox"
                  name="isHighest"
                  value="true"
                  className="w-5 h-5 border-2 border-black accent-black cursor-pointer"
                />
                <label className="text-xs font-black uppercase text-black cursor-pointer">
                  Tandai sebagai Highest Yield 🔥
                </label>
              </div>
            </div>

            {/* Milestones / Tiers Section */}
            <div className="mt-4 border-t-4 border-black dark:border-white border-dashed pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black uppercase">
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

              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-center bg-[#F4F5F0] dark:bg-slate-800 p-3 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  >
                    <input
                      placeholder="Ex: Reach Level 10"
                      value={m.description}
                      onChange={(e) =>
                        updateMilestone(i, "description", e.target.value)
                      }
                      className="flex-1 p-2 bg-transparent text-sm font-bold focus:outline-none border-b-2 border-black dark:border-white border-dashed"
                      required
                    />
                    <div className="relative w-32">
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-sm font-black">
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
                        className="w-full p-2 pl-5 bg-transparent text-sm font-bold text-[#059669] dark:text-green-400 focus:outline-none border-b-2 border-black dark:border-white border-dashed"
                        required
                      />
                    </div>
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMilestone(i)}
                        className="p-2 bg-[#FCA5A5] border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
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
              className="w-full mt-6 bg-[#A3E635] dark:bg-green-500 text-black dark:text-white font-black uppercase py-4 border-4 border-black dark:border-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menyimpan..." : "Publish ke Katalog"}
              <span className="material-symbols-outlined text-[20px] font-black">
                save
              </span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

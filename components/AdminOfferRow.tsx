"use client";

import { useState } from "react";
import Image from "next/image";

// Tipe data (sesuaikan dengan schema lu)
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

export default function AdminOfferRow({
  offer,
  updateOfferAction, // Server action buat update DB
}: {
  offer: Offer;
  updateOfferAction: (formData: FormData) => Promise<void> | void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ✅ FIX: Tambahin state loading kayak di halaman add-game
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk nyimpen milestone biar bisa diedit dinamis di form
  const [milestones, setMilestones] = useState<Milestone[]>(offer.milestones);

  const imgPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    offer.gameName,
  )}&background=000&color=fff&size=128&bold=true`;
  const displayImage = offer.imageUrl ? offer.imageUrl : imgPlaceholder;

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  // Fungsi buat ngatur input milestone
  const handleMilestoneChange = (
    index: number,
    field: keyof Milestone,
    value: string | number,
  ) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { id: Date.now().toString(), description: "", reward: 0 },
    ]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  // ✅ FIX: Fungsi handle submit custom buat nampilin notif
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Tahan reload halaman
    setIsSubmitting(true); // Ganti tombol jadi loading

    try {
      const formData = new FormData(e.currentTarget);

      // Panggil server action pakai await
      await updateOfferAction(formData);

      // Munculin notif berhasil
      alert("MANTAP! Data game berhasil di-update!");

      // Tutup modal otomatis kalau berhasil
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("YAH EROR! Gagal mengupdate data, coba lagi bang.");
    } finally {
      // Matiin loading
      setIsSubmitting(false);
    }
  };

  return (
    <tr className="hover:bg-[#FCD34D] dark:hover:bg-slate-800 transition-colors border-b-2 border-black dark:border-white border-dashed last:border-b-0">
      <td className="p-4 border-r-2 border-black dark:border-white border-dashed">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 bg-white border-2 border-black dark:border-white flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={displayImage}
              alt={offer.gameName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-black uppercase text-base text-black dark:text-white">
              {offer.gameName}
            </div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-0.5 uppercase">
              {offer.requirement}
            </div>
          </div>
        </div>
      </td>

      <td className="p-4 border-r-2 border-black dark:border-white border-dashed">
        <div className="flex flex-col gap-1 items-start">
          <span className="px-2 py-0.5 bg-black dark:bg-white text-[10px] font-black uppercase text-white dark:text-black inline-block">
            {offer.platform}
          </span>
          <span className="px-2 py-1 bg-white dark:bg-slate-800 border-2 border-black dark:border-white text-xs font-black uppercase text-black dark:text-white inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {offer.offerwall}
          </span>
        </div>
      </td>

      <td className="p-4 text-sm text-black dark:text-white font-black border-r-2 border-black dark:border-white border-dashed">
        {offer.rawCoins.toLocaleString("en-US")}
      </td>

      <td className="p-4 border-r-2 border-black dark:border-white border-dashed">
        <div className="font-black text-[#059669] dark:text-green-400 text-lg">
          {formatUSD(offer.usdValue)}
        </div>
      </td>

      <td className="p-4 text-right">
        {/* TOMBOL EDIT ADMIN */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-[#FCD34D] text-black border-2 border-black px-5 py-2 text-sm font-black uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1 w-full max-w-[120px] ml-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit
        </button>

        {/* MODAL EDIT DATA (NEO-BRUTALISM) */}
        {isEditModalOpen && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsEditModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white w-full max-w-2xl my-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] flex flex-col text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b-4 border-black dark:border-white flex items-center justify-between bg-[#FCD34D] dark:bg-yellow-600 sticky top-0 z-10">
                <h3 className="font-black text-black text-2xl uppercase tracking-tighter flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">
                    database
                  </span>
                  Edit Offer Data
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-black border-2 border-black w-8 h-8 flex items-center justify-center bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="material-symbols-outlined text-[20px] font-black">
                    close
                  </span>
                </button>
              </div>

              {/* ✅ FIX: Ganti action jadi onSubmit */}
              <form onSubmit={handleSubmit}>
                <div className="p-6 bg-[#F4F5F0] dark:bg-slate-800 space-y-6 max-h-[60vh] overflow-y-auto">
                  <input type="hidden" name="id" value={offer.id} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                        Game Name
                      </label>
                      <input
                        type="text"
                        name="gameName"
                        defaultValue={offer.gameName}
                        className="w-full p-3 border-2 border-black font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                        Provider (Offerwall)
                      </label>
                      <input
                        type="text"
                        name="offerwall"
                        defaultValue={offer.offerwall}
                        className="w-full p-3 border-2 border-black font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                        Platform
                      </label>
                      <select
                        name="platform"
                        defaultValue={offer.platform}
                        className="w-full p-3 border-2 border-black font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white text-black"
                      >
                        <option value="Android">Android</option>
                        <option value="iOS">iOS</option>
                        <option value="Desktop">Desktop</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="imageUrl"
                        defaultValue={offer.imageUrl || ""}
                        className="w-full p-3 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                        Raw Coins (Reward Asli)
                      </label>
                      <input
                        type="number"
                        name="rawCoins"
                        defaultValue={offer.rawCoins}
                        className="w-full p-3 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                        Total USD Value
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="usdValue"
                        defaultValue={offer.usdValue}
                        className="w-full p-3 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white text-black text-[#059669]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-black dark:text-white mb-1">
                      Requirement (Syarat Utama)
                    </label>
                    <textarea
                      name="requirement"
                      defaultValue={offer.requirement}
                      rows={2}
                      className="w-full p-3 border-2 border-black font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none bg-white text-black"
                      required
                    />
                  </div>

                  <hr className="border-2 border-black dark:border-white border-dashed my-6" />

                  {/* BAGIAN MILESTONES DINAMIS */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <label className="block text-sm font-black uppercase text-black dark:text-white">
                        Milestones / Tiers
                      </label>
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="bg-[#A3E635] text-black border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          add
                        </span>{" "}
                        Add Tier
                      </button>
                    </div>

                    <input
                      type="hidden"
                      name="milestones"
                      value={JSON.stringify(milestones)}
                    />

                    <div className="space-y-3">
                      {milestones.map((m, index) => (
                        <div
                          key={m.id}
                          className="flex gap-2 items-center bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <input
                            type="text"
                            placeholder="Misal: Collect 1000 Gems"
                            value={m.description}
                            onChange={(e) =>
                              handleMilestoneChange(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="flex-1 p-2 bg-slate-100 border-2 border-black font-bold text-xs uppercase focus:outline-none text-black"
                            required
                          />
                          <div className="relative w-32">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 font-black text-black">
                              $
                            </span>
                            <input
                              type="number"
                              step="any"
                              placeholder="0.00"
                              value={m.reward}
                              onChange={(e) =>
                                handleMilestoneChange(
                                  index,
                                  "reward",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-full p-2 pl-6 bg-[#A3E635] border-2 border-black font-black text-xs focus:outline-none text-black"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMilestone(index)}
                            className="bg-[#FCA5A5] text-black border-2 border-black w-9 h-9 flex items-center justify-center hover:bg-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px] font-black">
                              delete
                            </span>
                          </button>
                        </div>
                      ))}
                      {milestones.length === 0 && (
                        <p className="text-xs font-bold text-slate-500 uppercase text-center py-4 border-2 border-dashed border-slate-400">
                          Tidak ada tier milestone.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t-4 border-black dark:border-white bg-white dark:bg-slate-900 sticky bottom-0 z-10">
                  {/* ✅ FIX: Tombolnya ganti state pas lagi submitting */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#3B82F6] text-white font-black uppercase py-4 border-2 border-black dark:border-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all flex justify-center items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {isSubmitting
                      ? "Menyimpan Data..."
                      : "Save Changes to Database"}
                    <span className="material-symbols-outlined text-[18px] font-black">
                      save
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

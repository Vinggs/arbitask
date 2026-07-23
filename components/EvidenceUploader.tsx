"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { verifyMilestone } from "@/app/actions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function EvidenceUploader({
  taskId,
  currentObjectiveId,
}: {
  taskId: string;
  currentObjectiveId?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5242880) {
      alert("Ukuran file maksimal 5MB ya!");
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${taskId}-${Date.now()}.${fileExt}`;
      const filePath = `screenshots/${fileName}`;

      const { data, error } = await supabase.storage
        .from("evidence")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("evidence")
        .getPublicUrl(filePath);

      setUploadedUrl(publicUrlData.publicUrl);
    } catch (error: any) {
      console.error("Gagal upload:", error.message);
      alert("Gagal upload gambar. Cek koneksi atau setting Supabase lu.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {!uploadedUrl ? (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-4 border-slate-900 dark:border-slate-700 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer group mb-6 flex-1 min-h-[200px] transition-all shadow-brutal dark:shadow-brutal-dark ${
            isUploading
              ? "bg-slate-200 dark:bg-slate-800 cursor-not-allowed opacity-70"
              : "bg-slate-50 dark:bg-slate-900 hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg"
          }`}
        >
          <div className="w-16 h-16 bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-slate-700 flex items-center justify-center mb-4 shadow-brutal dark:shadow-brutal-dark group-hover:bg-blue-300 dark:group-hover:bg-sky-800 transition-colors">
            {isUploading ? (
              <span className="material-symbols-outlined text-4xl text-slate-900 dark:text-white font-black animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-4xl text-slate-900 dark:text-white font-black">
                add_photo_alternate
              </span>
            )}
          </div>
          <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
            {isUploading
              ? "Uploading to Cloud..."
              : "Click to browse or drag file here"}
          </h4>
          <p className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 px-2 py-1">
            Supports PNG, JPG up to 5MB.
          </p>
        </div>
      ) : (
        <div className="relative mb-6 flex-1 min-h-[200px] border-4 border-slate-900 dark:border-slate-700 overflow-hidden shadow-brutal-lg dark:shadow-brutal-dark-lg group">
          <img
            src={uploadedUrl}
            alt="Uploaded Evidence"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button
              onClick={() => setUploadedUrl(null)}
              className="bg-red-400 dark:bg-rose-700 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 font-black uppercase text-xs md:text-sm px-4 py-2 flex items-center gap-2 shadow-brutal dark:shadow-brutal-dark hover:-translate-y-1 hover:shadow-brutal-lg dark:hover:shadow-brutal-dark-lg active:translate-y-0 active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined text-[18px] font-black">
                delete
              </span>
              Ganti Gambar
            </button>
          </div>
        </div>
      )}

      <button
        disabled={!currentObjectiveId || !uploadedUrl || isUploading}
        onClick={async () => {
          try {
            await verifyMilestone(taskId, currentObjectiveId!, uploadedUrl!);
            alert("Tier berhasil diverifikasi! Cuan bertambah 💸");
            window.location.reload();
          } catch (error) {
            console.error(error);
            alert("Gagal verifikasi tier.");
          }
        }}
        className="w-full bg-emerald-400 dark:bg-teal-600 text-slate-900 dark:text-white font-black uppercase py-4 border-4 border-slate-900 dark:border-slate-700 shadow-brutal-lg dark:shadow-brutal-dark-lg transition-all flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-brutal-sm dark:disabled:shadow-brutal-dark-sm hover:not(:disabled):-translate-y-1 hover:not(:disabled):shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] dark:hover:not(:disabled):shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] active:not(:disabled):translate-y-0 active:not(:disabled):shadow-none"
      >
        <span className="material-symbols-outlined font-black">verified</span>
        {currentObjectiveId ? "Submit for Verification" : "Fully Verified"}
      </button>
    </div>
  );
}

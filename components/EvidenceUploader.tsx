"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { verifyMilestone } from "@/app/actions"; // <-- Import fungsi verifikasi dari actions.ts

// Inisialisasi Supabase Client
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

    // Batasi ukuran file max 5MB (5 * 1024 * 1024)
    if (file.size > 5242880) {
      alert("Ukuran file maksimal 5MB ya!");
      return;
    }

    try {
      setIsUploading(true);

      // Bikin nama file unik pakai timestamp biar nggak bentrok
      const fileExt = file.name.split(".").pop();
      const fileName = `${taskId}-${Date.now()}.${fileExt}`;
      const filePath = `screenshots/${fileName}`;

      // Upload ke bucket bernama "evidence"
      const { data, error } = await supabase.storage
        .from("evidence")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Ambil Public URL dari file yang baru di-upload
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
      {/* Input File Tersembunyi */}
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Zona Upload */}
      {!uploadedUrl ? (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer group mb-6 flex-1 min-h-[200px] transition-all ${
            isUploading
              ? "border-gray-300 bg-gray-100 cursor-not-allowed"
              : "border-outline-variant hover:border-blue-500 bg-slate-50 hover:bg-blue-50"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white border border-outline-variant flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
            {isUploading ? (
              <span className="material-symbols-outlined text-3xl text-blue-500 animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-blue-500">
                add_photo_alternate
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-on-surface mb-1">
            {isUploading
              ? "Uploading to Cloud..."
              : "Click to browse or drag file here"}
          </h4>
          <p className="text-xs text-on-surface-variant">
            Supports PNG, JPG, JPEG up to 5MB.
          </p>
        </div>
      ) : (
        /* Preview Gambar Setelah Berhasil Upload */
        <div className="relative mb-6 flex-1 min-h-[200px] rounded-lg border border-gray-200 overflow-hidden shadow-sm group">
          <img
            src={uploadedUrl}
            alt="Uploaded Evidence"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => setUploadedUrl(null)} // Tombol hapus/ganti gambar
              className="bg-white text-red-600 font-bold px-4 py-2 rounded-lg text-sm shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
              Ganti Gambar
            </button>
          </div>
        </div>
      )}

      {/* Tombol Submit (Hanya aktif kalau gambar udah di-upload) */}
      <button
        disabled={!currentObjectiveId || !uploadedUrl || isUploading}
        onClick={async () => {
          try {
            // Panggil server action buat verifikasi tier
            await verifyMilestone(taskId, currentObjectiveId!, uploadedUrl!);
            alert("Tier berhasil diverifikasi! Cuan bertambah 💸");
            window.location.reload(); // Refresh halaman biar progress bar jalan
          } catch (error) {
            console.error(error);
            alert("Gagal verifikasi tier.");
          }
        }}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">verified</span>
        {currentObjectiveId ? "Submit for Verification" : "Fully Verified"}
      </button>
    </div>
  );
}

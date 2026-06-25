"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Baca parameter dari URL, kalau kosong set ke "All" atau ""
  const currentCategory = searchParams.get("category") || "All";
  const currentPlatform = searchParams.get("platform") || "All";
  const currentSearch = searchParams.get("q") || "";

  // Handle Dropdown Kategori
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value === "All") params.delete("category");
    else params.set("category", value);

    router.push(`/?${params.toString()}`);
  };

  // Handle Dropdown Platform (Android Only)
  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value === "All") params.delete("platform");
    else params.set("platform", value);

    router.push(`/?${params.toString()}`);
  };

  // Handle Search dengan Debounce biar server nggak jebol
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) params.set("q", term);
      else params.delete("q");

      router.push(`/?${params.toString()}`);
    }, 300);
  };

  const handleClearFilters = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      {/* Kiri: Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-semibold text-gray-500 uppercase tracking-wider text-xs">
          Filters
        </span>

        {/* Dropdown Platform: Sudah bersih, tinggal All & Android */}
        <select
          value={currentPlatform}
          onChange={handlePlatformChange}
          className="border border-gray-200 rounded-full px-4 py-1.5 bg-white text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">Platform: All</option>
          <option value="Android">Android</option>
        </select>

        {/* Dropdown Kategori */}
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className="border border-gray-200 rounded-full px-4 py-1.5 bg-white text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">Category: All</option>
          <option value="Games">Games</option>
          <option value="Surveys">Surveys</option>
          <option value="Sign Ups">Sign Ups</option>
        </select>
      </div>

      {/* Kanan: Search Bar & Clear Button */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            defaultValue={currentSearch}
            onChange={handleSearchChange}
            placeholder="Search game name..."
            className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white text-gray-700"
          />
        </div>

        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[16px]">
            clear_all
          </span>
          Clear
        </button>
      </div>
    </div>
  );
}

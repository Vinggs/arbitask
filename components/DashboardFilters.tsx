"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const currentCategory = searchParams.get("category") || "All";
  const currentSearch = searchParams.get("q") || "";

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") params.delete("category");
    else params.set("category", value);
    router.push(`/?${params.toString()}`);
  };

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-black text-black dark:text-white uppercase tracking-wider text-xs">
          Filters
        </span>
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className="border-2 border-black dark:border-white px-4 py-2 bg-white dark:bg-slate-800 text-black dark:text-white outline-none font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-px transition-all cursor-pointer"
        >
          <option value="All">Category: All</option>
          <option value="Games">Games</option>
          <option value="Surveys">Surveys</option>
          <option value="Sign Ups">Sign Ups</option>
        </select>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black dark:text-white text-[20px] font-black">
            search
          </span>
          <input
            type="text"
            defaultValue={currentSearch}
            onChange={handleSearchChange}
            placeholder="Search game name..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-black dark:border-white text-sm focus:outline-none bg-white dark:bg-slate-800 text-black dark:text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus:-translate-y-px transition-all placeholder-slate-500"
          />
        </div>

        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 text-sm font-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-2 border-transparent hover:border-black dark:hover:border-white px-3 py-2 transition-all uppercase whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[18px] font-black">
            clear_all
          </span>
          Clear
        </button>
      </div>
    </div>
  );
}

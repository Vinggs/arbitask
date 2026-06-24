"use client";

import { useFormStatus } from "react-dom";

export default function TrackButton() {
  // Hook ini akan bernilai 'true' saat Server Action sedang memproses data
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-5 py-2 rounded-lg text-sm font-label-md transition shadow-sm w-full md:w-auto
        ${
          pending
            ? "bg-surface-variant text-on-surface-variant cursor-wait opacity-70"
            : "bg-primary text-on-primary hover:bg-primary/90 active:scale-95"
        }
      `}
    >
      {pending ? "Adding..." : "+ Track"}
    </button>
  );
}

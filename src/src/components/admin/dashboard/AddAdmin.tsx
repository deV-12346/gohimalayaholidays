"use client";

import { Plus}  from "lucide-react";

export default function AdminActions() {
  return (
    <div>
   
      <button
        className="
        flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        px-5
        py-3
        text-sm
        font-semibold
        text-white
        transition-all
        hover:scale-[1.02]">
        <Plus className="h-5 w-5" />
        Create New Admin
      </button>
    </div>
  );
}
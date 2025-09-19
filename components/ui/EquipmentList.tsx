// components/ui/EquipmentList.tsx
"use client";
import React from "react";

export type EquipmentItem = { key: string; label: string; has: boolean };

type Props = { items: EquipmentItem[]; className?: string; columns?: 2 | 3 | 4 };

export default function EquipmentList({ items, className = "", columns = 3 }: Props) {
  const colClass =
    columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
    columns === 2 ? "grid-cols-1 sm:grid-cols-2" :
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-2 ${colClass} ${className}`}>
      {items.map((it) => (
        <div
          key={it.key}
          className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-white ${
            it.has ? "text-emerald-700 border-emerald-200" : "text-gray-800 border-gray-200"
          }`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${it.has ? "bg-emerald-500" : "bg-gray-300"}`}
            aria-hidden
          />
          <span className="text-sm">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
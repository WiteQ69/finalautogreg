// components/admin/EquipmentField.tsx
"use client";
import { useController, useFormContext } from "react-hook-form";
import { getAllEquipment, type EquipId } from "@/lib/equipment";
import { cn } from "@/lib/utils";

export default function EquipmentField() {
  const { control } = useFormContext<{ equipment: EquipId[] }>();
  const { field } = useController({
    name: "equipment",
    control,
    defaultValue: [] as EquipId[],
  });

  const selected = new Set<EquipId>(field.value ?? []);
  const OPTIONS = getAllEquipment();

  const toggle = (id: EquipId) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    field.onChange(Array.from(next));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Wyposażenie</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {OPTIONS.map(({ id, label }) => {
          const active = selected.has(id as EquipId);
          return (
            <button
              type="button"
              key={id}
              onClick={() => toggle(id as EquipId)}
              className={cn(
                "w-full rounded-xl border p-3 text-left transition flex items-center gap-2",
                active ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:bg-zinc-50"
              )}
              aria-pressed={active}
            >
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

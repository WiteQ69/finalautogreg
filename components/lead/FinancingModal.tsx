"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import LeadForm from "./LeadForm";

export default function FinancingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <button
        aria-label="Zamknij"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl bg-background shadow-2xl border border-border">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background p-4">
            <div className="font-heading font-bold text-lg">Wniosek finansowania</div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-muted"
              aria-label="Zamknij okno"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
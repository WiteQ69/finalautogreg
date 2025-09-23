// components/StatusStamp.tsx
"use client";

import { cn } from "@/lib/utils";

type Status = "reserved" | "sold";
type Variant = "corner" | "full";

/**
 * PNG oczekuje w: /public/stamps/{reservation|sold}.png
 * Rodzic MUSI mieć className="relative".
 */
export default function StatusStamp({
  status,
  variant = "full",
  className,
}: {
  status: Status;
  variant?: Variant;
  className?: string;
}) {
  if (status !== "reserved" && status !== "sold") return null;

  const src = status === "reserved" ? "/stamps/reservation.png" : "/stamps/sold.png";
  const alt = status === "reserved" ? "REZERWACJA" : "SPRZEDANY";

  if (variant === "full") {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-20 flex items-center justify-center",
          className
        )}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="select-none opacity-95 w-[88%] sm:w-[84%] md:w-[82%] lg:w-[78%] xl:w-[74%] max-w-[1100px] rotate-[-12deg] drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute top-3 right-3 z-20 rotate-12", className)}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="select-none opacity-90 w-40 sm:w-48 md:w-56 lg:w-64"
      />
    </div>
  );
}

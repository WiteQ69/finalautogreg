// components/ui/CountryBadge.tsx
"use client";

import React from "react";
import { codeToFlagEmoji, normalizeCountry } from "@/lib/flags";

type Props = {
  country?: string; // może być "Polska", "DE", "Germany" — znormalizujemy
  className?: string;
  showLabel?: boolean; // czy pokazywać też tekst kraju obok flagi
};

export default function CountryBadge({ country, className = "", showLabel = true }: Props) {
  const code = normalizeCountry(country);
  const flag = codeToFlagEmoji(code);

  if (!country) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs leading-none bg-white/60 dark:bg-white/5 ${className}`}
      title={country}
    >
      {flag ? <span aria-hidden="true" className="text-base">{flag}</span> : null}
      {showLabel ? <span className="opacity-90">{country}</span> : null}
    </span>
  );
}
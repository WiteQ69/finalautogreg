// components/layout/StickyFacebook.tsx
"use client";
import React from "react";

const FB_URL = "https://www.facebook.com/share/1ZEipaZUEB/?mibextid=wwXIfr";

export default function StickyFacebook() {
  return (
    <a
      href={FB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Otwórz Facebook"
      className="fixed z-50 bottom-4 right-4 h-12 w-12 rounded-full shadow-lg border bg-white hover:translate-y-[-1px] transition-transform flex items-center justify-center"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,.12)" }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06C2 17.08 5.657 21.213 10.438 22v-7.02H7.898v-2.92h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.473h-1.26c-1.243 0-1.632.777-1.632 1.574v1.88h2.773l-.443 2.92h-2.33V22C18.343 21.213 22 17.08 22 12.06z" />
      </svg>
    </a>
  );
}
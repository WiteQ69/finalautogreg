'use client';

import { useState } from 'react';

type Props = {
  label: string;
  colorClass: string;
  tabText?: string;
  width?: number;
  height?: number;
  /** przesunięcie w pionie (px) – dodatnie w dół */
  offsetPx?: number;
  children: React.ReactNode;
};

export default function SocialSlidePanel({
  label,
  colorClass,
  tabText,
  width = 380,
  height = 520,
  offsetPx = 0,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* UCHO */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={[
          'fixed z-[1000] right-0 h-[100px] w-[60px] md:flex hidden',
          'items-center justify-center rounded-l-md text-white cursor-pointer select-none shadow-lg',
          colorClass,
        ].join(' ')}
        style={{ top: `calc(35% + ${offsetPx}px)` }}   // ⬅️ przesunięcie
        aria-label={label}
      >
        <div className="flex items-center justify-center -rotate-90">
          <span className="font-semibold tracking-wide">{tabText ?? label}</span>
        </div>
      </div>

      {/* PANEL */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="fixed z-[999] hidden md:block"
        style={{
          top: `calc(50% + ${offsetPx}px)`,          // ⬅️ przesunięcie
          right: open ? 0 : -width,
          transform: 'translateY(-50%)',
          width,
          height,
          transition: 'right 0.3s ease',
          borderRadius: '12px 0 0 12px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.1)',
          background: '#fff',
        }}
        aria-hidden={!open}
      >
        {children}
      </div>
    </>
  );
}

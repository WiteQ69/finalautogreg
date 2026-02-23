'use client';
import React from 'react';

type Item = {
  label: string;
  href: string;
  className: string; // tło/kolor
  ariaLabel?: string;
};

export default function SocialSideStack({
  items = [
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/',
      className: 'bg-black text-white',
      ariaLabel: 'TikTok',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/autopaczynski/',
      className: 'bg-[#808080] text-white',
      ariaLabel: 'Instagram',
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/autopaczynski',
      className: 'bg-[#1877F2] text-white',
      ariaLabel: 'Facebook',
    },
  ],
  top = '50%',
  gap = 12,
}: {
  items?: Item[];
  top?: string;   // np. '50%' albo '60%'
  gap?: number;   // odstęp między uchami w px
}) {
  return (
    <div
      className="hidden md:flex fixed right-0 z-[1000] flex-col items-end"
      style={{ top, transform: 'translateY(-50%)', gap }}
    >
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={it.ariaLabel || it.label}
          className={[
            'h-[100px] w-[60px]',
            'flex items-center justify-center',
            'rounded-l-md shadow-lg select-none cursor-pointer',
            it.className,
          ].join(' ')}
        >
          <div className="flex items-center justify-center -rotate-90">
            <span className="font-semibold tracking-wide">{it.label}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

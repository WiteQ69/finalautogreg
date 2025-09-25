'use client';

import React, { useState } from 'react';

type Props = {
  /** pełny adres strony na FB */
  pageUrl?: string;
  /** szerokość wysuwanego panelu (iframe) */
  width?: number;
  /** wysokość wysuwanego panelu (iframe) */
  height?: number;
};

/**
 * Wysuwany widżet Facebook (jak na starej stronie):
 * - po prawej „ucho” w kolorze FB
 * - na hover/najechaniu wysuwa się panel z ostatnimi postami (timeline)
 * - czysty <iframe>, zero SDK/parse – więc nie ma białych pustych bloków
 */
export default function FacebookSlideWidget({
  pageUrl = 'https://www.facebook.com/autogreg',
  width = 340,
  height = 331,
}: Props) {
  const [open, setOpen] = useState(false);
  const encoded = encodeURIComponent(pageUrl);

  return (
    <>
      {/* UCHO */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="
          fixed z-[1000]
          top-[35%] right-0
          h-[100px] w-[60px]
          flex items-center justify-center
          rounded-l-md
          bg-[#1877F2] text-white
          cursor-pointer select-none
          shadow-lg
          md:flex
          hidden
        "
        aria-label="Facebook"
      >
        {/* obrazek/napis obrócony jak u Ciebie */}
        <div className="flex items-center justify-center -rotate-90">
          <span className="font-semibold tracking-wide">Facebook</span>
        </div>
      </div>

      {/* PANEL Z IFRAME (ostatnie posty) */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="
          fixed z-[999]
          top-1/2
          hidden md:block
        "
        style={{
          right: open ? 0 : -width,
          transform: 'translateY(-50%)',
          width,
          height,
          transition: 'right 0.3s ease',
          borderRadius: '12px 0 0 12px',
          overflow: 'hidden',
          boxShadow:
            '0 10px 30px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.1)',
          background: '#fff',
        }}
        aria-hidden={!open}
      >
        <iframe
          src={`https://www.facebook.com/plugins/page.php?href=${encoded}&tabs=timeline&width=${width}&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`}
          width={width}
          height={height}
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          title="Facebook timeline"
        />
      </div>

      {/* Mobile: pokaż tylko pływający przycisk otwierający FB */}
      <a
        href={pageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          md:hidden fixed right-3 bottom-3
          rounded-full p-3 shadow-xl bg-[#1877F2] text-white
          z-[1000]
        "
        aria-label="Otwórz Facebook"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.79-3.88 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.9h-2.34V22c4.78-.75 8.44-4.92 8.44-9.94z"/>
        </svg>
      </a>
    </>
  );
}

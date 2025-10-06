'use client';

import { useMemo } from 'react';
import SocialSlidePanel from './SocialSlidePanel';

type Props = {
  pageUrl?: string;
  width?: number;
  height?: number;
  offsetPx?: number; // przesunięcie w pionie (px)
};

export default function FacebookSlideWidget({
  pageUrl = 'https://www.facebook.com/autopaczynski',
  width = 380,
  height = 520,
  offsetPx = 0,
}: Props) {
  const encoded = useMemo(() => encodeURIComponent(pageUrl), [pageUrl]);

  return (
    <>
      <SocialSlidePanel
        label="Facebook"
        tabText="Facebook"
        colorClass="bg-[#1877F2]"
        width={width}
        height={height}
        offsetPx={offsetPx}
      >
        <iframe
          src={`https://www.facebook.com/plugins/page.php?href=${encoded}&tabs=timeline&width=${width}&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`}
          width={width}
          height={height}
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          title="Facebook timeline"
        />
      </SocialSlidePanel>

      {/* Mobile – pływający przycisk */}
      <a
        href={pageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed right-3 bottom-3 rounded-full p-3 shadow-xl bg-[#1877F2] text-white z-[1000]"
        aria-label="Otwórz Facebook"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.79-3.88 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.9h-2.34V22c4.78-.75 8.44-4.92 8.44-9.94z"/>
        </svg>
      </a>
    </>
  );
}

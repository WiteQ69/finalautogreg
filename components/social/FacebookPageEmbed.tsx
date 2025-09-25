'use client';

import { useMemo } from 'react';

/**
 * Responsive Facebook Page Plugin embed.
 * Set your page URL via NEXT_PUBLIC_FACEBOOK_PAGE_URL (recommended),
 * or pass `pageUrl` prop. Fallback is Facebook main page (works, but change it).
 */
export default function FacebookPageEmbed({
  pageUrl,
  height = 700,
  tabs = 'timeline',
  hideCover = false,
  showFacepile = true,
  smallHeader = false,
}: {
  pageUrl?: string;
  height?: number;
  tabs?: string;
  hideCover?: boolean;
  showFacepile?: boolean;
  smallHeader?: boolean;
}) {
  const href = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL;
    const url = pageUrl || envUrl || 'https://www.facebook.com/facebook';
    return encodeURIComponent(url);
  }, [pageUrl]);

  const src = `https://www.facebook.com/autopaczynski`;

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-xl border bg-white">
        <iframe
          title="Facebook Page"
          src={src}
          width="100%"
          height={height}
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder={0}
          allow="encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        W razie potrzeby ustaw adres strony w pliku środowiskowym: <code>NEXT_PUBLIC_FACEBOOK_PAGE_URL</code>.
      </p>
    </div>
  );
}
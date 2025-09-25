'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

type Props = {
  /** URL strony na Facebooku */
  url?: string;
  /** Szerokość okienka (px) */
  width?: number;
  /** Wysokość okienka (px) */
  height?: number;
  /** Etykieta na pasku */
  label?: string;
};

/**
 * FacebookFloat – wersja z prostokątnym paskiem + iframe Page Plugin.
 * Desktop: panel rozwija się na hover. Mobile: kliknięcie w pasek otwiera/zamyka.
 */
export default function FacebookFloat({
  url = 'https://www.facebook.com/autopaczynski?locale=pl_PL',
  width = 320,
  height = 400,
  label = 'Facebook'
}: Props) {
  const [open, setOpen] = useState(false);

  // Składamy adres do pluginu FB
  const pageHref = encodeURIComponent(url);
  const pluginSrc =
    `https://www.facebook.com/autopaczynski` +
    `href=${pageHref}&tabs=timeline&width=${width}&height=${height}` +
    `&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <div className="fixed right-4 bottom-24 z-40 select-none">
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Rozwijany panel z embedem */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 16, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="absolute right-[calc(100%+12px)] bottom-0 rounded-2xl border bg-white shadow-xl overflow-hidden"
              style={{ width, height }}
            >
              <iframe
                key={pluginSrc}
                src={pluginSrc}
                width={width}
                height={height}
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pasek / przycisk */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all px-4 h-12"
          title="Facebook strony"
        >
          <FbIcon className="h-5 w-5 text-white" />
          <span className="text-sm font-semibold tracking-wide">{label}</span>
        </button>
      </div>
    </div>
  );
}

function FbIcon({ className = '' }: { className?: string }) {
  // Prosta ikona "f"
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.07 5.66 21.2 10.44 22v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.78l-.44 2.9h-2.34V22C18.34 21.2 22 17.07 22 12.06z" />
    </svg>
  );
}

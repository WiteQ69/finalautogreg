'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

type Props = {
  pageUrl?: string;        // adres Twojej strony FB, domyślnie z przykładu
  width?: number;          // szerokość w px (min. 180, max. 500)
  height?: number;         // wysokość w px
  locale?: string;         // np. 'pl_PL'
  buttonLabel?: string;    // etykieta przycisku otwierającego
};

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

export default function FacebookDrawer({
  pageUrl = 'https://www.facebook.com/autopaczynski',
  width = 360,
  height = 600,
  locale = 'pl_PL',
  buttonLabel = 'Obserwuj nas na Facebooku',
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkLoadedRef = useRef(false);

  // Ładowanie SDK FB tylko raz
  useEffect(() => {
    if (typeof window === 'undefined' || sdkLoadedRef.current) return;

    // jeśli już jest załadowany, pomiń
    if (document.getElementById('facebook-jssdk')) {
      sdkLoadedRef.current = true;
      return;
    }

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://connect.facebook.net/${locale}/sdk.js#xfbml=1&version=v19.0`;
    document.body.appendChild(script);

    sdkLoadedRef.current = true;
  }, [locale]);

  // Gdy otwieramy panel, parsujemy XFBML, żeby wczytać plugin
  useEffect(() => {
    if (!open) return;
    const tryParse = () => {
      if (typeof window !== 'undefined' && window.FB && containerRef.current) {
        window.FB.XFBML.parse(containerRef.current);
      }
    };
    // małe opóźnienie, żeby DOM się wyrenderował
    const t = setTimeout(tryParse, 50);
    return () => clearTimeout(t);
  }, [open]);

  // ESC zamyka panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* PRZYCISK OTWARCIA */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-[#1877F2] text-white px-4 py-3 shadow-lg hover:brightness-110 transition"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {buttonLabel}
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SZUFLADA */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full bg-white shadow-2xl w-[min(100vw,${width + 24}px)] transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Facebook feed"
      >
        {/* Pasek nagłówka */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-semibold">Nasza strona na Facebooku</div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Zamknij"
            className="rounded p-1 hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wnętrze z pluginem */}
        <div
          ref={containerRef}
          className="p-3"
          style={{ width: width + 0 }} // wymusza szerokość kontenera
        >
          <div
            className="fb-page"
            data-href={pageUrl}
            data-tabs="timeline"
            data-width={String(width)}
            data-height={String(height)}
            data-small-header="false"
            data-adapt-container-width="false"
            data-hide-cover="false"
            data-show-facepile="true"
          >
            <blockquote
              cite={pageUrl}
              className="fb-xfbml-parse-ignore"
            >
              <a href={pageUrl}>Facebook</a>
            </blockquote>
          </div>
        </div>
      </aside>
    </>
  );
}

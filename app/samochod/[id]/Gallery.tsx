'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

type Props = {
  images: string[];
  videoUrl?: string;
};

export default function Gallery({ images, videoUrl }: Props) {
  // items = wszystkie zdjęcia + (ew.) wideo jako ostatni slajd
  const items = React.useMemo(() => {
    const arr = (images || []).filter(Boolean);
    return videoUrl ? [...arr, videoUrl] : arr;
  }, [images, videoUrl]);

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = React.useState(0);

  const isVideo = (src: string) => /\.(mp4|webm|ogg|mov)$/i.test(src);

  // === MODAL (pełnoekranowy podgląd zdjęcia) ===
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalIndex, setModalIndex] = React.useState<number>(0); // index wśród zdjęć (NIE items)

  // Lista tylko zdjęć (bez wideo) do modala
  const photoSources = React.useMemo(
    () => (images || []).filter(Boolean),
    [images]
  );

  // otwórz modal dla klikniętego zdjęcia (po indeksie zdjęcia — nie items!)
  const openModalAtPhoto = (photoIdx: number) => {
    if (!photoSources.length) return;
    setModalIndex(Math.max(0, Math.min(photoSources.length - 1, photoIdx)));
    setModalOpen(true);
  };

  // aktualizacja indexu podczas przewijania (snap)
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      if (!children.length) return;
      // znajdź najbliższy slajd (środek viewportu)
      const center = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let best = Number.POSITIVE_INFINITY;
      children.forEach((child, i) => {
        const mid = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < best) {
          best = dist;
          nearest = i;
        }
      });
      setIndex(nearest);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
    setIndex(i);
  };

  const prev = () => goTo(Math.max(0, index - 1));
  const next = () => goTo(Math.min(items.length - 1, index + 1));

  if (!items.length) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
        Brak zdjęć
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative group">
        {/* główna karuzela */}
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory rounded-2xl bg-zinc-100 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((src, i) => {
            const isVid = isVideo(src);
            return (
              <div key={i} className="min-w-full snap-center relative">
                {isVid ? (
                  <video
                    src={src}
                    controls
                    className="aspect-video w-full object-cover rounded-2xl bg-black"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={`Zdjęcie ${i + 1}`}
                    className="aspect-video w-full object-cover rounded-2xl cursor-zoom-in"
                    // Uwaga: i może wskazywać na pozycję w items (gdzie może być też wideo),
                    // dlatego bierzemy index zdjęcia wg images, nie wg items:
                    onClick={() => {
                      const photoIdx = photoSources.indexOf(src);
                      if (photoIdx !== -1) openModalAtPhoto(photoIdx);
                    }}
                  />
                )}

                {/* badge „wideo” w rogu miniatury slajdu z filmem */}
                {isVid && (
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <Play className="h-3.5 w-3.5" /> Wideo
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* strzałki na overlay */}
        {items.length > 1 && (
          <>
            <button
              aria-label="Poprzednie"
              onClick={prev}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow group-hover:opacity-100 opacity-0 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Następne"
              onClick={next}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow group-hover:opacity-100 opacity-0 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* licznik */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {index + 1} / {items.length}
        </div>
      </div>

      {/* miniatury */}
      {items.length > 1 && (
        <div className="grid grid-cols-7 gap-3">
          {items.slice(0, 10).map((src, i) => {
            const active = i === index;
            const asVideo = isVideo(src);
            return asVideo ? (
              <button
  key={i}
  onClick={() => goTo(i)}
  className={`h-24 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs ${
    active ? 'ring-2 ring-zinc-900' : ''
  }`}
  title="Wideo"
>
  <Play className="h-4 w-4 mr-1" /> Wideo
</button>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Miniatura ${i + 1}`}
                className={`h-16 w-full object-cover rounded-lg cursor-pointer ${active ? 'ring-2 ring-zinc-900' : ''}`}
                onClick={() => goTo(i)}
              />
            );
          })}
        </div>
      )}

      {/* MODAL: pełnoekranowy podgląd zdjęcia */}
      {modalOpen && photoSources.length > 0 && (
        <ImageModal
          sources={photoSources}
          initialIndex={modalIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

/* ===================== MODAL ===================== */

function ImageModal({
  sources,
  initialIndex = 0,
  onClose,
}: {
  sources: string[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const [i, setI] = React.useState(
    Math.max(0, Math.min(sources.length - 1, initialIndex))
  );

  // blokuj scroll body
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // klawiatura: ESC zamyka, strzałki zmieniają slajdy
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI((v) => Math.min(sources.length - 1, v + 1));
      if (e.key === 'ArrowLeft') setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, sources.length]);

  const prev = () => setI((v) => Math.max(0, v - 1));
  const next = () => setI((v) => Math.min(sources.length - 1, v + 1));

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-h-[90vh] max-w-[95vw] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // nie zamykaj, gdy klik w obraz
      >
        {/* przycisk zamknięcia */}
        <button
          aria-label="Zamknij"
          onClick={onClose}
          className="absolute right-2 top-2 h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/90"
        >
          <X className="h-5 w-5" />
        </button>

        {/* strzałki */}
        {sources.length > 1 && (
          <>
            <button
              aria-label="Poprzednie zdjęcie"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hidden md:flex items-center justify-center"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              aria-label="Następne zdjęcie"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hidden md:flex items-center justify-center"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* powiększone zdjęcie */}
        <div className="max-h-full max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sources[i]}
            alt={`Podgląd ${i + 1}`}
            className="max-h-[90vh] max-w-[95vw] object-contain select-none"
            draggable={false}
          />
        </div>

        {/* licznik */}
        {sources.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            {i + 1} / {sources.length}
          </div>
        )}
      </div>
    </div>
  );
}

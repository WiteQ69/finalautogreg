'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

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
          {items.map((src, i) => (
            <div key={i} className="min-w-full snap-center relative">
              {isVideo(src) ? (
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
                  className="aspect-video w-full object-cover rounded-2xl"
                />
              )}

              {/* badge „wideo” w rogu miniatury slajdu z filmem */}
              {isVideo(src) && (
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <Play className="h-3.5 w-3.5" /> Wideo
                </div>
              )}
            </div>
          ))}
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
        <div className="grid grid-cols-5 gap-2">
          {items.slice(0, 10).map((src, i) => {
            const active = i === index;
            const asVideo = isVideo(src);
            return asVideo ? (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-16 w-full rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs ${active ? 'ring-2 ring-zinc-900' : ''}`}
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
    </div>
  );
}

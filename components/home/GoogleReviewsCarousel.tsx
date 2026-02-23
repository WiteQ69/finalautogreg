'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

type Review = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
};

function Stars({ value }: { value: number }) {
  const v = Math.round(value ?? 0);
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < v ? 'fill-amber-400' : 'fill-zinc-200 text-zinc-300'}`}
        />
      ))}
    </div>
  );
}

// ---------- Avatar kolorowy z generatora (stabilny po nazwie) ----------
function hashString(str: string) {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hslFromName(name: string) {
  const h = hashString(name.toLowerCase().trim());
  const hue = h % 360;                 // 0-359
  const sat = 62 + (h % 18);           // 62-79
  const light = 44 + (h % 10);         // 44-53
  return { hue, sat, light };
}

function InitialAvatar({ name }: { name: string }) {
  const initial = (name?.trim()?.[0] ?? '?').toUpperCase();
  const { hue, sat, light } = hslFromName(name || 'anon');

  return (
    <div
      className="h-10 w-10 rounded-full flex items-center justify-center font-extrabold text-white shrink-0"
      style={{ backgroundColor: `hsl(${hue} ${sat}% ${light}%)` }}
      aria-label={name}
      title={name}
    >
      {initial}
    </div>
  );
}

// ---------- Statyczne opinie (sparafrazowane z Twoich screenów) ----------
const STATIC_REVIEWS: Review[] = [
  {
    author_name: 'Marcin Chudek',
    rating: 5,
    relative_time_description: '4 miesiące temu',
    text:
      'Długo szukaliśmy auta i trafiliśmy z polecenia. Wszystko jasno wytłumaczone, bez ściemy. Auto z Niemiec dokładnie takie jak w opisie — kupno bez stresu.',
  },
  {
    author_name: 'Marek Strzyżewski',
    rating: 5,
    relative_time_description: '3 miesiące temu',
    text:
      'Byliśmy w kilku miejscach i dopiero tutaj było spokojnie: zero presji, normalna atmosfera, można obejrzeć auto i o wszystko dopytać. Kupiliśmy Kię i jesteśmy mega zadowoleni.',
  },
  {
    author_name: 'Marcin Danielewski',
    rating: 5,
    relative_time_description: '3 miesiące temu',
    text:
      'Idealne dla osób, które nie chcą stresu przy zakupie. Dostaliśmy konkretne wskazówki, co sprawdzić. Wybraliśmy Toyotę — świetny wybór, auto jeździ super.',
  },
  {
    author_name: 'Szymek Lipski',
    rating: 5,
    relative_time_description: 'miesiąc temu',
    text:
      'Mój pierwszy zakup w komisie i miałem obawy, ale wszystko poszło gładko. Bez nerwów, miła obsługa i sprawnie domknięta transakcja. Polecam.',
  },
  {
    author_name: 'Dominik Głuszek',
    rating: 5,
    relative_time_description: '4 miesiące temu',
    text:
      'Hyundai z Niemiec — przebieg i stan zgodne z dokumentami. Widać uczciwe podejście, a nie szybki zysk. Po czasie był kontakt, czy wszystko OK — szacunek.',
  },
  {
    author_name: 'Ania Brzeska',
    rating: 5,
    relative_time_description: '3 miesiące temu',
    text:
      'Szukaliśmy auta w internecie i trafiliśmy tutaj. Wszystko pokazane i wytłumaczone spokojnie, bez pośpiechu. Kupiliśmy Renault Captur i dostaliśmy pomoc w formalnościach.',
  },
  {
    author_name: 'Piotrek Bączkowski',
    rating: 5,
    relative_time_description: '3 miesiące temu',
    text:
      'Od pierwszego kontaktu czuć zaufanie. Spokojnie, konkretnie i z kulturą. Auto po zakupie sprawuje się świetnie, więc z czystym sumieniem polecam dalej.',
  },
  {
    author_name: 'Kasia Banach',
    rating: 5,
    relative_time_description: '3 miesiące temu',
    text:
      'Minęło już trochę od zakupu i auto działa bez zarzutu. Widać, że stawia się tu na jakość i pewne samochody. Pozytyw w pełni zasłużony.',
  },
  {
    author_name: 'Wiktoria K',
    rating: 5,
    relative_time_description: 'miesiąc temu',
    text:
      'Obsługa na wysokim poziomie. Szybkie odpowiedzi i pełny wgląd w historię auta. Człowiek ma poczucie, że kupuje pewnie i bez ryzyka.',
  },
  {
    author_name: 'Natalia Wieczorek',
    rating: 5,
    relative_time_description: '3 miesiące temu',
    text:
      'Trafiłam z polecenia i rozumiem czemu. Wszystko przejrzyście, auto przygotowane, dokumenty ogarnięte. Samochód sprawuje się świetnie — jestem bardzo zadowolona.',
  },
  {
    author_name: 'Michał Kocik',
    rating: 5,
    relative_time_description: '4 miesiące temu',
    text:
      'Polecenie było trafione: rzetelne podejście, auta przygotowane do jazdy i po serwisie przed sprzedażą. Wybraliśmy KIA Stonic — pełna satysfakcja, zero niespodzianek.',
  },
  {
    author_name: 'Jarek Wojtaszek',
    rating: 5,
    relative_time_description: '3 miesiące temu',
    text:
      'Najlepszy zakup od lat. Auto zadbane i dopięte, a na start wymienione rzeczy typu olej/filtry. Oszczędziło mi to czasu i kasy. Rewelacja.',
  },
];

export default function GoogleReviewsCarousel({
  autoPlayMs = 6000,
  title = 'OPINIE KLIENTÓW',
}: {
  autoPlayMs?: number;
  title?: string;
}) {
  const [idx, setIdx] = useState(0);

  const reviews = useMemo(() => STATIC_REVIEWS, []);

  // autoplay
  useEffect(() => {
    if (reviews.length <= 1 || autoPlayMs <= 0) return;
    const t = setInterval(() => {
      setIdx((prev) => (prev + 1) % reviews.length);
    }, autoPlayMs);
    return () => clearInterval(t);
  }, [reviews.length, autoPlayMs]);

  // 3 kafelki (na desktop). Na mobile i tak będą 1/2 przez grid.
  const trio = useMemo(() => {
    if (!reviews.length) return [] as Review[];
    if (reviews.length === 1) return [reviews[0]];
    if (reviews.length === 2) return [reviews[0], reviews[1]];
    return [
      reviews[idx % reviews.length],
      reviews[(idx + 1) % reviews.length],
      reviews[(idx + 2) % reviews.length],
    ];
  }, [reviews, idx]);

  if (!trio.length) return null;

  return (
    <section className="w-full">
      <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
        {title}
      </h3>

      {/* 1 kolumna na mobile, 2 na md, 3 na lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trio.map((rv, i) => (
          <Card
            key={`${rv.author_name}-${idx}-${i}`}
            className="rounded-2xl border bg-white/90 shadow-sm transition"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <InitialAvatar name={rv.author_name} />

                <div className="min-w-0">
                  <div className="font-semibold text-zinc-900 truncate">
                    {rv.author_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars value={rv.rating} />
                    <span className="text-xs text-zinc-500">
                      {rv.relative_time_description ?? ''}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-zinc-700 leading-relaxed line-clamp-6">
                {rv.text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

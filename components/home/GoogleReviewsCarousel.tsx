'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

type GReview = {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  text?: string;
  relative_time_description?: string;
};

type ApiResp = {
  ok: boolean;
  name?: string;
  url?: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: GReview[];
  attribution?: string;
  error?: string;
};

const AVATAR_FALLBACK =
  'https://www.gstatic.com/images/icons/material/system/2x/account_circle_grey600_24dp.png';

const normalizeAvatar = (u?: string) =>
  !u ? AVATAR_FALLBACK : u.startsWith('http') ? u : `https:${u}`;

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

export default function GoogleReviewsCarousel({
  autoPlayMs = 6000,
  title  = 'OPINIE KLIENTÓW',
}: {
  autoPlayMs?: number;
  title?: string;
}) {
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  // fetch
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/google-reviews', { cache: 'no-store' });
        const json: ApiResp = await res.json();
        if (mounted) setData(json);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const reviews = useMemo(() => data?.reviews?.filter(r => !!r.text) ?? [], [data]);

  // autoplay – przesuwamy indeks co autoPlayMs
  useEffect(() => {
    if (reviews.length <= 1 || autoPlayMs <= 0) return;
    const t = setInterval(() => {
      setIdx(prev => (prev + 1) % reviews.length);
    }, autoPlayMs);
    return () => clearInterval(t);
  }, [reviews.length, autoPlayMs]);

  // aktualna para (2 kafelki)
  const pair = useMemo(() => {
    if (!reviews.length) return [] as GReview[];
    if (reviews.length === 1) return [reviews[0]];
    return [reviews[idx % reviews.length], reviews[(idx + 1) % reviews.length]];
  }, [reviews, idx]);

  // skeleton
  if (loading) {
    return (
      <div className="w-full">
        <h3 className="text-2xl font-extrabold tracking-tight mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 rounded-xl bg-zinc-100" />
          <div className="h-40 rounded-xl bg-zinc-100" />
        </div>
      </div>
    );
  }

  // brak danych – nic nie rysujemy poza tytułem
  if (!data?.ok || pair.length === 0) {
    return (
      <div className="w-full">
        <h3 className="text-2xl font-extrabold tracking-tight mb-4">{title}</h3>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Nagłówek bez tła/ramek */}
      <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">{title}</h3>

      {/* DWA kafelki, bez tła sekcji, bez krawędzi kontenera */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pair.map((rv, i) => (
          <Card
            key={i}
            className="rounded-2xl border bg-white/90 shadow-sm transition"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={normalizeAvatar(rv.profile_photo_url)}
                  alt={rv.author_name}
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = AVATAR_FALLBACK; }}
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-900 truncate">{rv.author_name}</div>
                  <div className="flex items-center gap-2">
                    <Stars value={rv.rating} />
                    <span className="text-xs text-zinc-500">{rv.relative_time_description}</span>
                  </div>
                </div>
              </div>
              <p className="text-zinc-700 leading-relaxed line-clamp-6">{rv.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

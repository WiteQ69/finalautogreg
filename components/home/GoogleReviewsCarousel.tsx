'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

type GReview = {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  text?: string;
  relative_time_description?: string; // np. "2 tygodnie temu"
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

export default function GoogleReviewsCarousel({
  autoPlayMs = 6000,
  title = 'Opinie klientów (Google)',
}: {
  autoPlayMs?: number;
  title?: string;
}) {
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [i, setI] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

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

  const goTo = (idx: number) => {
    if (!wrapRef.current) return;
    const container = wrapRef.current;
    const card = container.children[idx] as HTMLElement | undefined;
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setI(idx);
  };

  useEffect(() => {
    if (!reviews.length || autoPlayMs <= 0) return;
    const t = setInterval(() => goTo((i + 1) % reviews.length), autoPlayMs);
    return () => clearInterval(t);
  }, [i, reviews.length, autoPlayMs]);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <div className="h-6 w-48 bg-zinc-200 rounded mb-4" />
        <div className="h-24 bg-zinc-100 rounded" />
      </div>
    );
  }

  if (!data?.ok || !reviews.length) {
    // Brak opinii -> pokaż link do Google
    return (
      <div className="rounded-2xl border bg-white p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-zinc-900">Opinie z Google</h3>
          <p className="text-zinc-600">Nie udało się wczytać opinii. Zobacz wszystkie w Google.</p>
        </div>
        {data?.url && (
          <Button asChild>
            <a href={data.url} target="_blank" rel="noopener noreferrer">Zobacz w Google</a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <section className="rounded-2xl border bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Google "G" */}
          <div className="h-8 w-8 rounded-full grid place-items-center font-bold text-white" style={{ backgroundColor: '#4285F4' }}>G</div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
            <p className="text-sm text-zinc-600">
              {data?.name} • {data?.rating?.toFixed?.(1)} / 5 • {data?.user_ratings_total} opinii
            </p>
          </div>
        </div>
        {data?.url && (
          <Button variant="outline" asChild>
            <a href={data.url} target="_blank" rel="noopener noreferrer">Zobacz w Google</a>
          </Button>
        )}
      </div>

      {/* Karuzela */}
      <div className="relative">
        <div
          ref={wrapRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {reviews.map((rv, idx) => (
            <Card
              key={idx}
              className="min-w-[320px] max-w-[420px] snap-center shrink-0 rounded-xl border bg-white"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={rv.profile_photo_url || 'https://www.gstatic.com/images/icons/material/system/2x/account_circle_grey600_24dp.png'}
                    alt={rv.author_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-zinc-900">{rv.author_name}</div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className={`h-4 w-4 ${s < (rv.rating || 0) ? 'fill-amber-400' : 'fill-zinc-200 text-zinc-200'}`} />
                      ))}
                      <span className="ml-2 text-xs text-zinc-500">{rv.relative_time_description}</span>
                    </div>
                  </div>
                </div>
                <p className="text-zinc-700 leading-relaxed">{rv.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nawigacja */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Przejdź do opinii ${idx + 1}`}
                className={`h-2.5 w-2.5 rounded-full ${i === idx ? 'bg-zinc-900' : 'bg-zinc-300'}`}
                onClick={() => goTo(idx)}
              />
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-zinc-500">{data.attribution}</p>
    </section>
  );
}

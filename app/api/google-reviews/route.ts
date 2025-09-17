// app/api/google-reviews/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Ile sekund cache'ować odpowiedź (Google nie lubi mocnego odpytywania)
const REVALIDATE_SECONDS = 60 * 60 * 6; // 6h

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    return NextResponse.json(
      { ok: false, error: 'Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID' },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
    place_id: placeId,
    // pola: ocena, liczba opinii, link do Maps, i same reviews
    fields: 'name,url,rating,user_ratings_total,reviews',
    reviews_sort: 'newest',
    key,
    language: 'pl',
    region: 'pl',
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;

  try {
    const res = await fetch(url, {
      // miękki cache po stronie Vercel/Next
      next: { revalidate: REVALIDATE_SECONDS },
    });
    const json = await res.json();

    if (!res.ok || json.status !== 'OK') {
      return NextResponse.json(
        { ok: false, error: json.error_message || json.status || 'Google error' },
        { status: 200 },
      );
    }

    const r = json.result || {};
    // Google zwykle daje max 5 reviews w tym polu
    const reviews = Array.isArray(r.reviews) ? r.reviews : [];

    return NextResponse.json({
      ok: true,
      name: r.name,
      url: r.url, // link „Zobacz w Google”
      rating: r.rating,
      user_ratings_total: r.user_ratings_total,
      reviews: reviews.map((rv: any) => ({
        author_name: rv.author_name,
        profile_photo_url: rv.profile_photo_url,
        rating: rv.rating,
        text: rv.text,
        relative_time_description: rv.relative_time_description,
        time: rv.time,
        language: rv.language,
      })),
      // zgodność: to są opinie z usługi Google
      attribution: 'Opinie pochodzą z Google',
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 200 });
  }
}

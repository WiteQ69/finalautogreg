import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REVALIDATE_SECONDS = 60 * 60 * 6;

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    return NextResponse.json(
      { ok: false, error: 'Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID' },
      { status: 200 }
    );
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'name,url,rating,user_ratings_total,reviews',
    reviews_sort: 'newest',
    language: 'pl',
    region: 'pl',
    key,
  });

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    const json = await res.json();

    if (!res.ok || json.status !== 'OK') {
      return NextResponse.json(
        { ok: false, error: json.error_message || json.status || `HTTP ${res.status}` },
        { status: 200 }
      );
    }

    const r = json.result || {};
    const reviews = Array.isArray(r.reviews) ? r.reviews : [];

    return NextResponse.json({
      ok: true,
      name: r.name,
      url: r.url,
      rating: r.rating,
      user_ratings_total: r.user_ratings_total,
      reviews: reviews.map((rv: any) => ({
        author_name: rv.author_name,
        profile_photo_url: rv.profile_photo_url,
        rating: rv.rating,
        text: rv.text,
        relative_time_description: rv.relative_time_description,
        time: rv.time,
      })),
      attribution: 'Opinie pochodzą z Google',
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 200 });
  }
}

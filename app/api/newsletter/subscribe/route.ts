import { NextResponse } from 'next/server';

async function readBody(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) { try { return await res.json(); } catch {} }
  try { return await res.text(); } catch {}
  return null;
}

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      const msg = 'Brak ENV: NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY';
      console.error('[SUBSCRIBE] ENV ERROR:', { url: !!url, key: !!key });
      return NextResponse.json({ ok: false, message: msg }, { status: 500 });
    }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ ok: false, message: 'Brak lub zły email' }, { status: 400 });
    }

    // 1) UPSERT po emailu (on_conflict=email)
    const insertRes = await fetch(`${url}/rest/v1/subscribers?on_conflict=email`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
        // te 2 nagłówki czasem są wymagane, gdy schema=public
        'Content-Profile': 'public',
        'Accept-Profile': 'public',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        name: name ?? null,
        active: true,
      }),
    });

    if (insertRes.ok) return NextResponse.json({ ok: true });

    // 2) konflikt → aktualizujemy (idempotentnie)
    if (insertRes.status === 409 || insertRes.status === 400) {
      const patchRes = await fetch(
        `${url}/rest/v1/subscribers?email=eq.${encodeURIComponent(email.toLowerCase())}`,
        {
          method: 'PATCH',
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
            'Content-Profile': 'public',
            'Accept-Profile': 'public',
          },
          body: JSON.stringify({ name: name ?? null, active: true }),
        }
      );
      if (patchRes.ok) return NextResponse.json({ ok: true });

      const patchBody = await readBody(patchRes);
      console.error('[SUBSCRIBE] PATCH ERR', patchRes.status, patchBody);
      return NextResponse.json(
        { ok: false, message: typeof patchBody === 'string' ? patchBody : patchBody?.message || 'Błąd PATCH' },
        { status: patchRes.status }
      );
    }

    const insertBody = await readBody(insertRes);
    console.error('[SUBSCRIBE] INSERT ERR', insertRes.status, insertBody);
    return NextResponse.json(
      { ok: false, message: typeof insertBody === 'string' ? insertBody : insertBody?.message || 'Błąd Supabase REST' },
      { status: insertRes.status }
    );
  } catch (e: any) {
    console.error('[SUBSCRIBE] FATAL', e);
    return NextResponse.json({ ok: false, message: e?.message || 'Błąd serwera' }, { status: 500 });
  }
}

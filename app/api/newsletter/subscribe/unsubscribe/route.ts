// app/api/newsletter/unsubscribe/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return new Response('Brak ENV Supabase', { status: 500 });
  if (!token) return new Response('Brak tokenu', { status: 400 });

  const res = await fetch(`${url}/rest/v1/subscribers?unsubscribe_token=eq.${token}`, {
    method: 'PATCH',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ active: false }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return new Response('Błąd: ' + (json?.message || 'REST'), { status: res.status });
  }
  if (!Array.isArray(json) || json.length === 0) {
    return new Response('Nieprawidłowy token', { status: 404 });
  }

  return new Response(`Adres ${json[0].email} został wypisany z newslettera.`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(URL, SERVICE, { auth: { persistSession: false } });

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'global_ad_image')
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { ok: true, url: (data?.value as string | null) ?? null },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function PUT(req: Request) {
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url) {
      return NextResponse.json({ ok: false, error: 'Missing url' }, { status: 400 });
    }

    const { error } = await supabase
      .from('settings')
      .upsert(
        { key: 'global_ad_image', value: url, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    // odczyt po zapisie – żeby mieć pewność
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'global_ad_image')
      .single();

    return NextResponse.json({ ok: true, url: (data?.value as string | null) ?? url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Invalid body' }, { status: 400 });
  }
}

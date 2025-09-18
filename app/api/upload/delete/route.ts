import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function extractPathFromPublicUrl(url: string): string | null {
  // Public URL looks like: https://.../storage/v1/object/public/cars/<filename>
  const idx = url.indexOf('/storage/v1/object/public/');
  if (idx === -1) return null;
  const sub = url.slice(idx + '/storage/v1/object/public/'.length);
  // sub = 'cars/<filename>'
  return sub;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    const path = extractPathFromPublicUrl(url);
    if (!path) return NextResponse.json({ error: 'Unsupported URL' }, { status: 400 });

    const [bucket, ...rest] = path.split('/');
    const filename = rest.join('/');
    if (bucket !== 'cars' || !filename) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.storage.from('cars').remove([filename]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

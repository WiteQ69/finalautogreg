// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Fallback, gdyby extension/filename było dziwne
function safeExtFromName(name: string) {
  const parts = name.split('.');
  if (parts.length < 2) return '';
  const ext = parts.pop()!.toLowerCase().trim();

  // dopuszczamy tylko proste rozszerzenia (bez spacji / znaków)
  if (!/^[a-z0-9]+$/.test(ext)) return '';
  return `.${ext}`;
}

function safeMimeToExt(mime: string) {
  // minimalny mapping – wystarczy na start
  switch (mime) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'video/mp4':
      return '.mp4';
    case 'video/webm':
      return '.webm';
    default:
      return '';
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file found (key: file)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Preferuj rozszerzenie z nazwy, a jak brak/krzaki to z MIME
    const extFromName = safeExtFromName(file.name || '');
    const ext = extFromName || safeMimeToExt(file.type) || '';

    // Najbezpieczniejszy key: UUID + ext (bez spacji, bez problemów z "Invalid key")
    const filename = `${crypto.randomUUID()}${ext}`;

    const supabase = getSupabaseServer();

    const { error: uploadError } = await supabase.storage
      .from('cars')
      .upload(filename, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      const msg = uploadError.message || 'Upload error';
      const status = msg.toLowerCase().includes('invalid key') ? 400 : 500;
      return NextResponse.json({ error: msg }, { status });
    }

    const { data } = supabase.storage.from('cars').getPublicUrl(filename);

    return NextResponse.json({ url: data.publicUrl, path: filename }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

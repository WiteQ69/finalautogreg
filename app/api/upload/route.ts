import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file found' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await getSupabaseServer()
      .storage.from('cars')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data } = await getSupabaseServer().storage.from('cars').getPublicUrl(filename);

    return NextResponse.json({ url: data.publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

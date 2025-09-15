import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const orig = (file as any).name || 'upload.bin';
    const ext = path.extname(orig) || '.bin';
    const name = path.basename(orig, ext);
    const fname = `${name}-${Date.now()}${ext}`;
    const fpath = path.join(uploadsDir, fname);

    await fs.writeFile(fpath, buffer);

    const url = `/uploads/${fname}`;
    return NextResponse.json({ ok: true, url });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 });
  }
}

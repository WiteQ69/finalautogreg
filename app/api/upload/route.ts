// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

function safeName(name: string) {
  const base = (name || 'file').toLowerCase().replace(/[^\w.-]+/g, '-').replace(/-+/g, '-');
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const ext = path.extname(base) || '';
  const stem = path.basename(base, ext);
  return `${stem}-${stamp}${ext}`;
}

export async function POST(req: Request) {
  try {
    await ensureUploadsDir();

    const form = await req.formData();
    const parts = form.getAll('files') as File[];

    if (!parts || parts.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of parts) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fname = safeName(file.name || 'file');
      const dest = path.join(UPLOADS_DIR, fname);
      await fs.writeFile(dest, buffer);
      urls.push(`/uploads/${fname}`);
    }

    return NextResponse.json({ urls });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

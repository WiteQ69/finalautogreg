import { NextResponse } from 'next/server';
import { readCars, writeCars } from '@/lib/file-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const cars = await readCars();
  return NextResponse.json(cars);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id || !body?.title) {
      return NextResponse.json({ error: 'id i title wymagane' }, { status: 400 });
    }
    const cars = await readCars();
    if (cars.find(c => String(c.id) === String(body.id))) {
      return NextResponse.json({ error: 'ID already exists' }, { status: 409 });
    }
    cars.unshift(body);
    await writeCars(cars);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Bad JSON' }, { status: 400 });
  }
}

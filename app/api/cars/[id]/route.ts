import { NextResponse } from 'next/server';
import { readCars, writeCars } from '@/lib/file-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const cars = await readCars();
  const car = cars.find(c => String(c.id) === String(params.id));
  if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const patch = await req.json();
    const cars = await readCars();
    const idx = cars.findIndex(c => String(c.id) === String(params.id));
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    cars[idx] = { ...cars[idx], ...patch, id: cars[idx].id };
    await writeCars(cars);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Bad JSON' }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const cars = await readCars();
  const next = cars.filter(c => String(c.id) !== String(params.id));
  if (next.length === cars.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await writeCars(next);
  return NextResponse.json({ ok: true });
}

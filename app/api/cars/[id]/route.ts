// app/api/cars/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'cars.json');
const SEED_PATH = path.join(process.cwd(), 'public', 'cars.json');

async function ensureDb() {
  try {
    const stats = await fs.stat(DB_PATH);
    // Check if file exists but is empty
    if (stats.size === 0) {
      throw new Error('Database file is empty');
    }
    // Check if file contains valid data
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Database file contains no data');
    }
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const seed = await fs.readFile(SEED_PATH, 'utf-8');
      await fs.writeFile(DB_PATH, seed, 'utf-8');
    } catch {
      await fs.writeFile(DB_PATH, '[]', 'utf-8');
    }
  }
}

async function readCars() {
  await ensureDb();
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeCars(cars: any[]) {
  await ensureDb();
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(cars, null, 2), 'utf-8');
}

type Ctx = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Ctx) {
  const cars = await readCars();
  const car = cars.find((c) => String(c.id) === String(params.id));
  if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const updates = await req.json();
    const cars = await readCars();
    const now = new Date().toISOString();
    const idx = cars.findIndex((c) => String(c.id) === String(params.id));

    if (idx === -1) {
      // UPSERT — jeśli nie ma, dodaj z danym ID
      const newCar = { id: String(params.id), createdAt: now, updatedAt: now, ...updates };
      await writeCars([newCar, ...cars]);
      return NextResponse.json(newCar, { status: 201 });
    }

    const next = { ...cars[idx], ...updates, id: cars[idx].id, updatedAt: now };
    cars[idx] = next;
    await writeCars(cars);
    return NextResponse.json(next);
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const cars = await readCars();
  const idx = cars.findIndex((c) => String(c.id) === String(params.id));
  if (idx === -1) return NextResponse.json({ error: 'Car not found' }, { status: 404 });
  cars.splice(idx, 1);
  await writeCars(cars);
  return NextResponse.json({ success: true });
}

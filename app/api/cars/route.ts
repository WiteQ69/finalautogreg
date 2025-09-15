// app/api/cars/route.ts
import { NextResponse } from 'next/server';
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
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeCars(cars: any[]) {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(cars, null, 2), 'utf-8');
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const cars = await readCars();
  const filtered = status ? cars.filter((c) => c.status === status) : cars;
  return NextResponse.json(filtered);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cars = await readCars();
    const now = new Date().toISOString();
    const newCar = {
      ...body,
      id: String(body.id ?? Date.now()),
      createdAt: now,
      updatedAt: now,
    };
    await writeCars([newCar, ...cars]);
    return NextResponse.json(newCar, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

// lib/cars-db.ts
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'cars.db.json');
const SEED_PATH = path.join(process.cwd(), 'public', 'cars.json');

export type CarRecord = any; // możesz podstawić swój typ `Car`

async function ensureDb() {
  try {
    await fs.stat(DB_PATH);
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

export async function readCars(): Promise<CarRecord[]> {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function writeCars(cars: CarRecord[]): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(cars, null, 2), 'utf-8');
}

import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CARS_JSON = path.join(DATA_DIR, 'cars.json');

export type Car = any;

async function ensureFile() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch {}
  try { await fs.access(CARS_JSON); }
  catch { await fs.writeFile(CARS_JSON, '[]', 'utf8'); }
}

export async function readCars(): Promise<Car[]> {
  await ensureFile();
  const raw = await fs.readFile(CARS_JSON, 'utf8');
  try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; }
  catch { return []; }
}

export async function writeCars(cars: Car[]) {
  await ensureFile();
  await fs.writeFile(CARS_JSON, JSON.stringify(cars, null, 2), 'utf8');
}

// app/api/cars/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

// treat empty string and "— wybierz —" as blank -> DON'T INSERT
const isBlank = (v: any) =>
  v === undefined ||
  v === null ||
  (typeof v === 'string' && (v.trim() === '' || v.trim() === '— wybierz —'));

function toDb(patch: any) {
  const out: Record<string, any> = {};

  const map: Record<string, string> = {
    title: 'title',
    brand: 'brand',
    model: 'model',
    year: 'year',
    mileage: 'mileage',
    engine: 'engine',
    transmission: 'transmission',
    drivetrain: 'drivetrain',
    color: 'color',
    doors: 'doors',
    seats: 'seats',
    condition: 'condition',
    origin: 'origin',
    price_text: 'price_text',
    images: 'images',
    video_url: 'video_url',
    equipment: 'equipment',
    main_image_path: 'main_image_path',
    status: 'status',
    createdAt: 'created_at',
    created_at: 'created_at',
    updatedAt: 'updated_at',
    updated_at: 'updated_at',
    sold_badge: 'sold_badge',
    soldBadge: 'sold_badge',
    description: 'description',

    // camelCase -> snake_case
    engineCapacityCcm: 'engine_capacity_ccm',
    powerKw: 'power_kw',
    fuelType: 'fuel_type',
    bodyType: 'body_type',
    registeredIn: 'registered_in',
    saleDocument: 'sale_document',
    firstOwner: 'first_owner',
  };

  const numericCols = new Set([
    'year',
    'mileage',
    'doors',
    'seats',
    'engine_capacity_ccm',
    'power_kw',
  ]);

  const booleanCols = new Set(['first_owner', 'sold_badge']);

  for (const [k, vRaw] of Object.entries(patch || {})) {
    const col = map[k];
    if (!col) continue;
    if (isBlank(vRaw)) continue;

    let v: any = vRaw;

    if (numericCols.has(col) && typeof v === 'string') {
      const n = Number(v);
      if (Number.isFinite(n)) v = n;
    }
    if (booleanCols.has(col) && typeof v === 'string') {
      if (v.toLowerCase() === 'true') v = true;
      else if (v.toLowerCase() === 'false') v = false;
    }
    if ((col === 'images' || col === 'equipment') && typeof v === 'string') {
      try { v = JSON.parse(v); } catch {}
    }

    out[col] = v;
  }

  return out;
}

async function readBody(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const obj: Record<string, any> = {};
    // ✅ bez for...of na iteratorze — działa na każdym targetcie
    form.forEach((value, key) => {
      if (typeof value === 'string') obj[key] = value;
      // Plików tu nie obsługujemy – przekazuj URL w main_image_path/images
    });
    return obj;
  }
  // default: JSON
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('id', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const incoming = await readBody(req);
    const payload = toDb(incoming);
    const now = new Date().toISOString();
    payload.created_at = payload.created_at ?? now;
    payload.updated_at = now;

    if (!payload.title || !payload.engine || !payload.year) {
      return NextResponse.json(
        { error: 'Brak wymaganych pól: title, engine, year' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('cars')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message, details: error.details }, { status: 400 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
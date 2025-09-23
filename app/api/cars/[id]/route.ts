// app/api/cars/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

// treat empty string and "— wybierz —" as blank -> DON'T UPDATE
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

  const booleanCols = new Set([
    'first_owner',
    'sold_badge',
  ]);

  for (const [k, vRaw] of Object.entries(patch || {})) {
    const col = map[k];
    if (!col) continue;
    if (isBlank(vRaw)) continue; // ⬅️ skip blank values entirely

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
      try { v = JSON.parse(v); } catch { /* ignore */ }
    }

    out[col] = v;
  }
  return out;
}

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.from('cars').select('*').eq('id', params.id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const patch = await req.json().catch(() => ({}));
    const supabase = getSupabaseServer();
    const payload = toDb(patch);

    // auto-update timestamp
    payload.updated_at = new Date().toISOString();

    if (Object.keys(payload).length === 0) {
      const { data, error } = await supabase.from('cars').select('*').eq('id', params.id).single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase
      .from('cars')
      .update(payload)
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message, details: error.details }, { status: 400 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

// allow PATCH as alias of PUT (partial update)
export async function PATCH(req: Request, ctx: Ctx) {
  return PUT(req, ctx);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const supabase = getSupabaseServer();
    // Return deleted row for convenience
    const { data, error } = await supabase
      .from('cars')
      .delete()
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message, details: error.details }, { status: 400 });
    return NextResponse.json({ ok: true, deleted: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
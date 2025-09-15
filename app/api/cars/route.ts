// app/api/cars/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// --- helper: lazy server client (service role) ---
function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'Missing SUPABASE env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'
    );
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

// camelCase -> snake_case (insert/update payload)
function toDb(patch: any) {
  return {
    ...(patch.id !== undefined && { id: patch.id }),
    ...(patch.title !== undefined && { title: patch.title }),
    ...(patch.brand !== undefined && { brand: patch.brand }),
    ...(patch.model !== undefined && { model: patch.model }),
    ...(patch.year !== undefined && { year: patch.year }),
    ...(patch.mileage !== undefined && { mileage: patch.mileage }),
    ...(patch.engine !== undefined && { engine: patch.engine }),
    ...(patch.engineCapacityCcm !== undefined && { engine_capacity_ccm: patch.engineCapacityCcm }),
    ...(patch.powerKw !== undefined && { power_kw: patch.powerKw }),
    ...(patch.fuelType !== undefined && { fuel_type: patch.fuelType }),
    ...(patch.transmission !== undefined && { transmission: patch.transmission }),
    ...(patch.drivetrain !== undefined && { drivetrain: patch.drivetrain }),
    ...(patch.bodyType !== undefined && { body_type: patch.bodyType }),
    ...(patch.color !== undefined && { color: patch.color }),
    ...(patch.doors !== undefined && { doors: patch.doors }),
    ...(patch.seats !== undefined && { seats: patch.seats }),
    ...(patch.condition !== undefined && { condition: patch.condition }),
    ...(patch.origin !== undefined && { origin: patch.origin }),
    ...(patch.registeredIn !== undefined && { registered_in: patch.registeredIn }),
    ...(patch.saleDocument !== undefined && { sale_document: patch.saleDocument }),
    ...(patch.price_text !== undefined && { price_text: patch.price_text }),
    ...(patch.status !== undefined && { status: patch.status }),
    ...(patch.firstOwner !== undefined && { first_owner: !!patch.firstOwner }),
    ...(patch.main_image_path !== undefined && { main_image_path: patch.main_image_path }),
    ...(patch.images !== undefined && {
      images: Array.isArray(patch.images) ? patch.images.map(String) : [],
    }),
    ...(patch.video_url !== undefined && { video_url: patch.video_url }),
    ...(patch.equipment !== undefined && {
      equipment: Array.isArray(patch.equipment) ? patch.equipment.map(String) : [],
    }),
    ...(patch.createdAt !== undefined && { created_at: patch.createdAt }),
    updated_at: new Date().toISOString(),
  };
}

// snake_case -> camelCase (response)
function fromDb(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    brand: row.brand,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    engine: row.engine,
    engineCapacityCcm: row.engine_capacity_ccm,
    powerKw: row.power_kw,
    fuelType: row.fuel_type,
    transmission: row.transmission,
    drivetrain: row.drivetrain,
    bodyType: row.body_type,
    color: row.color,
    doors: row.doors,
    seats: row.seats,
    condition: row.condition,
    origin: row.origin,
    registeredIn: row.registered_in,
    saleDocument: row.sale_document,
    price_text: row.price_text,
    status: row.status,
    firstOwner: row.first_owner,
    main_image_path: row.main_image_path,
    images: row.images ?? [],
    video_url: row.video_url,
    equipment: row.equipment ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ---------------- GET: lista aut ---------------- */
export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET /api/cars error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json((data ?? []).map(fromDb));
  } catch (e: any) {
    console.error('GET /api/cars fatal:', e);
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

/* ---------------- POST: dodaj auto ---------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // zapewnij ID jeśli nie ma
    const id = body?.id ?? String(Date.now());
    const payload = toDb({ ...body, id, createdAt: new Date().toISOString() });

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('cars')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('POST /api/cars insert error:', error, 'payload:', payload);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(fromDb(data), { status: 201 });
  } catch (e: any) {
    console.error('POST /api/cars catch:', e);
    return NextResponse.json({ error: e?.message || 'Bad request' }, { status: 400 });
  }
}

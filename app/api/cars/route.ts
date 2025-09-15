import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// camelCase -> snake_case (do bazy)
function toDb(car: any) {
  return {
    id: String(car.id ?? Date.now()),
    title: car.title ?? null,
    brand: car.brand ?? null,
    model: car.model ?? null,
    year: car.year ?? null,
    mileage: car.mileage ?? null,
    engine: car.engine ?? null,
    engine_capacity_ccm: car.engineCapacityCcm ?? null,
    power_kw: car.powerKw ?? null,
    fuel_type: car.fuelType ?? null,
    transmission: car.transmission ?? null,
    drivetrain: car.drivetrain ?? null,
    body_type: car.bodyType ?? null,
    color: car.color ?? null,
    doors: car.doors ?? null,
    seats: car.seats ?? null,
    condition: car.condition ?? null,
    origin: car.origin ?? null,
    registered_in: car.registeredIn ?? null,
    sale_document: car.saleDocument ?? null,
    price_text: car.price_text ?? null,
    status: car.status ?? null,
    first_owner: !!car.firstOwner,
    main_image_path: car.main_image_path ?? null,
    images: Array.isArray(car.images) ? car.images.map(String) : [],
    video_url: car.video_url ?? null,
    equipment: Array.isArray(car.equipment) ? car.equipment.map(String) : [],
    created_at: car.createdAt ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// snake_case -> camelCase (dla frontu)
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

export async function GET() {
  const { data, error } = await supabaseServer
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET /api/cars error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json((data ?? []).map(fromDb));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = toDb(body);

    const { data, error } = await supabaseServer
      .from('cars')
      .insert([payload])
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

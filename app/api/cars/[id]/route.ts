// app/api/cars/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

/** Supabase w trybie serwerowym (wymaga SERVICE ROLE KEY do INSERT/UPDATE/DELETE) */
function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // zostawiamy fallback na ANON, jeśli nie masz SERVICE ROLE (np. lokalnie)
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'Missing SUPABASE env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'
    );
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/** helpers */
function isNil(v: unknown) {
  return v === undefined || v === null;
}
function isBlank(v: unknown) {
  if (isNil(v)) return true;
  if (typeof v === 'string') return v.trim() === '';
  return false;
}
/** Jeżeli id jest liczbą w DB (BIGINT/INT), rzutujemy; jeśli string – zostawiamy string */
function normalizeId(id: string) {
  const n = Number(id);
  return Number.isFinite(n) ? n : id;
}

/** GET /api/cars/[id] – pojedynczy rekord */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const supabase = getSupabaseServer();
    const id = normalizeId(params.id);

    const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

/** PUT /api/cars/[id] – aktualizacja */
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const supabase = getSupabaseServer();
    const id = normalizeId(params.id);
    const patch = await req.json();

    // mapowanie pól camelCase -> snake_case + aliasy
    const map: Record<string, string> = {
      // aliasy 1:1 (gdy w body może przylecieć któraś wersja)
      id: 'id',
      title: 'title',
      brand: 'brand',
      model: 'model',
      year: 'year',
      mileage: 'mileage',
      engine: 'engine',
      color: 'color',
      status: 'status',
      images: 'images',
      equipment: 'equipment',
      description: 'description',
      price_text: 'price_text', // gdy ktoś poda już w snake
      main_image_path: 'main_image_path',
      video_url: 'video_url',
      created_at: 'created_at',
      updated_at: 'updated_at',
      imported_from: 'imported_from',
      registered_in: 'registered_in',
      sale_document: 'sale_document',
      first_owner: 'first_owner',
      sold_badge: 'sold_badge',

      // camelCase -> snake_case
      engineCapacityCcm: 'engine_capacity_ccm',
      powerKw: 'power_kw',
      fuelType: 'fuel_type',
      transmission: 'transmission',
      drivetrain: 'drivetrain',
      bodyType: 'body_type',
      priceText: 'price_text',
      mainImagePath: 'main_image_path',
      videoUrl: 'video_url',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      importedFrom: 'imported_from',
      registeredIn: 'registered_in',
      saleDocument: 'sale_document',
      firstOwner: 'first_owner',
      soldBadge: 'sold_badge',
    };

    // budujemy payload – pomijamy tylko wartości „puste” (undefined/""), ale
    // przepuszczamy 0/false/null jeśli explicite chcesz je zapisać.
    const payload: Record<string, any> = {};
    for (const [k, v] of Object.entries(patch || {})) {
      const col = map[k];
      if (!col) continue; // pomiń nieznane pola
      if (isBlank(v)) continue; // nie nadpisuj pustką
      payload[col] = v;
    }
    // automatyczne updated_at, jeśli nie przyszło
    if (isBlank(payload.updated_at)) payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('cars')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message, details: (error as any).details },
        { status: 400 }
      );
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

/** DELETE /api/cars/[id] – usuwanie */
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const supabase = getSupabaseServer();
    const id = normalizeId(params.id);

    const { error, count } = await supabase
      .from('cars')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message, details: (error as any).details },
        { status: 400 }
      );
    }
    if (!count) {
      return NextResponse.json({ error: 'Nie znaleziono auta do usunięcia.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: count });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
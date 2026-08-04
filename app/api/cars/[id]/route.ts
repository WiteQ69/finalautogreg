// app/api/cars/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

type CarImages = {
  id?: string | number;
  status?: string | null;
  images?: unknown;
  main_image_path?: string | null;
};

function imageUrls(car: CarImages | null | undefined): string[] {
  const rawImages = car?.images;
  const images = Array.isArray(rawImages)
    ? rawImages.filter((value): value is string => typeof value === 'string' && value.length > 0)
    : [];
  return Array.from(
    new Set(images.concat(car?.main_image_path || []).filter((value): value is string => !!value))
  );
}

function storagePath(url: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = '/storage/v1/object/public/cars/';
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    const path = decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));
    return path || null;
  } catch {
    return null;
  }
}

async function removeUnreferencedImages(
  supabase: SupabaseClient,
  urls: string[],
  excludedCarId: string
): Promise<number> {
  const candidates = new Set(urls.map(storagePath).filter((path): path is string => !!path));
  if (candidates.size === 0) return 0;

  // Nie usuwamy pliku, jeśli ten sam URL jest używany przez inne ogłoszenie.
  const { data: otherCars, error: referenceError } = await supabase
    .from('cars')
    .select('images,main_image_path')
    .neq('id', excludedCarId);
  if (referenceError) throw referenceError;

  for (const car of (otherCars ?? []) as CarImages[]) {
    for (const url of imageUrls(car)) {
      const path = storagePath(url);
      if (path) candidates.delete(path);
    }
  }

  const paths = Array.from(candidates);
  for (let index = 0; index < paths.length; index += 100) {
    const { error } = await supabase.storage.from('cars').remove(paths.slice(index, index + 100));
    if (error) throw error;
  }
  return paths.length;
}

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

// treat empty string and "— wybierz —" as blank -> DON'T UPDATE
// UWAGA: null normalnie jest "blank", ale dla video_url chcemy pozwolić na czyszczenie (null)
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
    reserved_badge: 'reserved_badge',
    reservedBadge: 'reserved_badge',

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

  const booleanCols = new Set(['first_owner', 'sold_badge', 'reserved_badge']);

  for (const [k, vRaw] of Object.entries(patch || {})) {
    const col = map[k];
    if (!col) continue;

    // ✅ WYJĄTEK: video_url można czyścić (null lub pusty string -> null)
    if (col === 'video_url') {
      if (vRaw === null) {
        out[col] = null;
        continue;
      }
      if (typeof vRaw === 'string' && vRaw.trim() === '') {
        out[col] = null;
        continue;
      }
      // jeśli jest "— wybierz —" też traktuj jako usunięcie
      if (typeof vRaw === 'string' && vRaw.trim() === '— wybierz —') {
        out[col] = null;
        continue;
      }
    }

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
      try {
        v = JSON.parse(v);
      } catch {}
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
    payload.updated_at = new Date().toISOString();
    let imagesToRemove: string[] = [];

    // Sprzątamy tylko w chwili przejścia na status "sold". Dzięki temu
    // wdrożenie nie ruszy istniejących sprzedanych ogłoszeń.
    if (payload.status === 'sold') {
      const { data: currentCar, error: currentError } = await supabase
        .from('cars')
        .select('id,status,images,main_image_path')
        .eq('id', params.id)
        .single();

      if (currentError) {
        return NextResponse.json({ error: currentError.message }, { status: 400 });
      }

      if (String(currentCar.status ?? '').toLowerCase() !== 'sold') {
        const currentImages = Array.isArray(currentCar.images)
          ? currentCar.images.filter((value: unknown): value is string => typeof value === 'string' && value.length > 0)
          : [];
        const cover = currentImages[0] || currentCar.main_image_path || null;
        imagesToRemove = imageUrls(currentCar).filter((url) => url !== cover);
        payload.images = cover ? [cover] : [];
        if (cover) payload.main_image_path = cover;
      }
    }

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

    if (imagesToRemove.length > 0) {
      try {
        await removeUnreferencedImages(supabase, imagesToRemove, params.id);
      } catch (cleanupError) {
        // Rekord jest już poprawnie zapisany z jednym zdjęciem. Ewentualny
        // błąd Storage zostawia tylko nieszkodliwy plik do późniejszego sprzątnięcia.
        console.error('[cars] Storage cleanup after marking sold failed:', cleanupError);
      }
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  return PUT(req, ctx);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('cars')
      .delete()
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message, details: error.details }, { status: 400 });

    let removedImages = 0;
    try {
      removedImages = await removeUnreferencedImages(supabase, imageUrls(data), params.id);
    } catch (cleanupError) {
      console.error('[cars] Storage cleanup after deleting car failed:', cleanupError);
    }

    return NextResponse.json({ ok: true, deleted: data, removedImages });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

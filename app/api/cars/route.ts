// app/api/cars/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// --- Supabase server client (wymaga SERVICE ROLE KEY) ---
function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // <- musi być ustawione w env (Vercel)
  if (!url || !serviceKey) {
    throw new Error(
      'Missing SUPABASE env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'
    );
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

// --- Helpers ---
function isNil(v: unknown) {
  return v === undefined || v === null;
}
function isBlank(v: unknown) {
  if (isNil(v)) return true;
  if (typeof v === 'string') return v.trim() === '';
  return false;
}

// ============ GET: lista aut ============
export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data ?? []);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

// ============ POST: dodawanie auta ============
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // mapowanie camelCase -> snake_case (tylko tam, gdzie DB ma snake_case)
    const map: Record<string, string> = {
      engineCapacityCcm: 'engine_capacity_ccm',
      powerKw: 'power_kw',
      fuelType: 'fuel_type',
      bodyType: 'body_type',
      registeredIn: 'registered_in',
      saleDocument: 'sale_document',
      firstOwner: 'first_owner',
      mainImagePath: 'main_image_path',
      videoUrl: 'video_url',
      priceText: 'price_text',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      sold_badge: 'sold_badge',
      soldBadge: 'sold_badge',
      description: 'description',
    };

    // zbuduj payload do insertu
    const payload: Record<string, any> = {};
    for (const [k, v] of Object.entries(body || {})) {
      if (v === undefined) continue; // pomiń tylko undefined; null i 0 przepuszczamy
      const col = map[k] || k; // jeśli nie w mapie — wstaw oryginalny klucz
      payload[col] = v;
    }

    // bezpieczne defaulty (tylko gdy nie przeszły w body)
    if (isBlank(payload.id)) payload.id = Date.now().toString();
    if (isBlank(payload.status)) payload.status = 'active';
    if (isBlank(payload.created_at)) payload.created_at = new Date().toISOString();
    if (isBlank(payload.updated_at)) payload.updated_at = new Date().toISOString();

    // insert
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('cars')
      .insert(payload)
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
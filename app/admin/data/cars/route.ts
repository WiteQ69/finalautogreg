// app/admin/data/cars/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type ExternalCar = {
  id: string | number; // <-- może być liczba lub string
  purchase_price_pln?: number | string | null;
  sale_price_pln?: number | string | null;
  [k: string]: unknown;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const base = `${url.protocol}//${url.host}`;

    const res = await fetch(`${base}/api/cars?admin=1`, {
      cache: 'no-store',
      headers: {
        cookie: req.headers.get('cookie') ?? '',
        authorization: req.headers.get('authorization') ?? '',
      },
    });

    const text = await res.text();
    let external: unknown;
    try { external = JSON.parse(text); } catch { external = []; }

    if (!res.ok) {
      const err = (external && typeof external === 'object' ? (external as any).error : undefined) ?? 'Błąd pobierania listy aut';
      return NextResponse.json({ error: err }, { status: res.status || 500 });
    }

    const list: ExternalCar[] = Array.isArray(external) ? (external as ExternalCar[]) : [];

    // 🔴 KLUCZ: rzutujemy ID na string, bo w Prisma `id` jest typu String
    const ids = list.map((c) => String(c?.id)).filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json(list, { status: 200 });
    }

    const prices = await prisma.car.findMany({
      where: { id: { in: ids } }, // teraz string[]
      select: { id: true, purchase_price_pln: true, sale_price_pln: true },
    });

    const pricesMap = new Map<string, { purchase_price_pln: number | null; sale_price_pln: number | null }>();
    for (const p of prices) {
      pricesMap.set(p.id, {
        purchase_price_pln: p.purchase_price_pln,
        sale_price_pln: p.sale_price_pln,
      });
    }

    const merged = list.map((c) => {
      const override = pricesMap.get(String(c.id));
      if (!override) return c;
      return {
        ...c,
        purchase_price_pln: override.purchase_price_pln ?? (c.purchase_price_pln ?? null),
        sale_price_pln: override.sale_price_pln ?? (c.sale_price_pln ?? null),
      };
    });

    return NextResponse.json(merged, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

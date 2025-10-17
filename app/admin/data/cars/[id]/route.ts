// app/admin/data/cars/[id]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = String(params.id); // <-- rzutowanie na string
    const body = await req.json().catch(() => ({}));

    const toNumOrNull = (v: any) =>
      v === null || v === '' || typeof v === 'undefined' ? null : Number(v);

    const purchase = toNumOrNull(body?.purchase_price_pln);
    const sale = toNumOrNull(body?.sale_price_pln);

    if ((purchase !== null && Number.isNaN(purchase)) || (sale !== null && Number.isNaN(sale))) {
      return NextResponse.json(
        { error: 'purchase_price_pln / sale_price_pln musi być liczbą lub null' },
        { status: 400 }
      );
    }

    const saved = await prisma.car.upsert({
      where: { id }, // string
      update: { purchase_price_pln: purchase, sale_price_pln: sale },
      create: { id, purchase_price_pln: purchase, sale_price_pln: sale },
      select: { id: true, purchase_price_pln: true, sale_price_pln: true },
    });

    return NextResponse.json(saved, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

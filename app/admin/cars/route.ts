export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        brand: true,
        model: true,
        year: true,
        price_text: true,
        status: true,
        purchase_price_pln: true,
        sale_price_pln: true,
      },
    });
    return NextResponse.json(cars, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

// app/api/admin/cars/route.ts
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, source: '/api/admin/cars GET minimal' }, { status: 200 });
}

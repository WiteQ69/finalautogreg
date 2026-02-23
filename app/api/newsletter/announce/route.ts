// app/api/newsletter/announce/route.ts  (albo src/app/…)
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function jsonOrText(res: Response) {
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export async function POST(req: Request) {
  try {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
      return NextResponse.json({ ok: false, message: 'Missing ADMIN_SECRET' }, { status: 500 });
    }
    const body = await req.json();
    const origin = new URL(req.url).origin;

    const res = await fetch(`${origin}/api/newsletter/send-new-car`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-cron-secret': secret },
      body: JSON.stringify(body),
    });

    const payload: any = await jsonOrText(res).catch(() => null);
    return NextResponse.json(
      typeof payload === 'string' ? { message: payload } : payload ?? {},
      { status: res.status }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'announce failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, message: 'Use POST' }, { status: 405 });
}

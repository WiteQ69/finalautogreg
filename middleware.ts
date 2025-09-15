// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

const ENV_USER = process.env.ADMIN_USER;
const ENV_PASS = process.env.ADMIN_PASS;

// Fallback - użyty TYLKO jeśli env-y nie są ustawione
const USER = ENV_USER && ENV_USER.length ? ENV_USER : 'admin';
const PASS = ENV_PASS && ENV_PASS.length ? ENV_PASS : 'Mojafirma2015!@!';

function unauthorized(reason?: string) {
  // UWAGA: reason dodajemy jako nagłówek tylko lokalnie, żeby debugować
  const headers: Record<string, string> = {
    'WWW-Authenticate': 'Basic realm="Admin Area"',
    'Cache-Control': 'no-store',
  };
  if (process.env.NODE_ENV !== 'production' && reason) {
    headers['x-auth-debug'] = reason;
  }
  return new NextResponse('Auth required.', { status: 401, headers });
}

export function middleware(req: NextRequest) {
  // chronimy /admin i wszystko pod nim
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) {
    return unauthorized('no basic header');
  }

  try {
    const base64 = auth.split(' ')[1] || '';
    // hasło może zawierać dwukropek, więc nie używamy prostego split(':', 2)
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    const user = idx >= 0 ? decoded.slice(0, idx) : decoded;
    const pass = idx >= 0 ? decoded.slice(idx + 1) : '';

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
    return unauthorized('bad creds');
  } catch (e) {
    return unauthorized('decode error');
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};

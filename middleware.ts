// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

const USER = process.env.ADMIN_USER!;
const PASS = process.env.ADMIN_PASS!;

function unauthorized() {
  return new NextResponse('Auth required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
  });
}

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) return unauthorized();

  try {
    const base64 = auth.split(' ')[1] || '';
    const [user, pass] = atob(base64).split(':');

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  } catch {
    // zły nagłówek
  }

  return unauthorized();
}

export const config = {
  matcher: ['/admin/:path*'],
};

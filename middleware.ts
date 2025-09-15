// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

const USER = process.env.NEXT_PUBLIC_ADMIN_USER!;
const PASS = process.env.NEXT_PUBLIC_ADMIN_PASS!;

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
    const [user, ...rest] = atob(base64).split(':');
    const pass = rest.join(':'); // hasło może zawierać dwukropek

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

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminPath = '__admin-auto-greg';
  
  // Check if accessing admin area
  if (request.nextUrl.pathname.startsWith(`/${adminPath}`)) {
    // Allow login page
    if (request.nextUrl.pathname === `/${adminPath}/login`) {
      return NextResponse.next();
    }
    
    // Check for admin session
    const sessionCookie = request.cookies.get('admin-session');
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL(`/${adminPath}/login`, request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|cars.json).*)',
  ],
};
// middleware.ts (Next.js / Edge Runtime)
import { NextResponse, NextRequest } from 'next/server'

// ==== KONFIG ====
const ADMIN_USER = process.env.ADMIN_USER || ''
const ADMIN_PASS = process.env.ADMIN_PASS || ''

// ==== POMOCNICZE ====
function unauthorized(reason?: string) {
  const headers: Record<string, string> = {
    'WWW-Authenticate': 'Basic realm="Admin Area"',
    'Cache-Control': 'no-store',
  }
  if (process.env.NODE_ENV !== 'production' && reason) {
    headers['x-auth-debug'] = reason
  }
  return new NextResponse('Auth required.', { status: 401, headers })
}

function decodeBasicAuth(authHeader: string) {
  // "Basic base64(user:pass)"
  const base64 = authHeader.split(' ')[1] || ''
  // Edge Runtime → atob jest dostępne (Web API)
  const decoded = globalThis.atob(base64) // "user:pass"
  const idx = decoded.indexOf(':')
  return {
    user: idx >= 0 ? decoded.slice(0, idx) : decoded,
    pass: idx >= 0 ? decoded.slice(idx + 1) : '',
  }
}

// ==== GŁÓWNA FUNKCJA ====
export async function middleware(req: NextRequest) {
  // Basic Auth dla /admin. Nie zapisujemy każdego wejścia do bazy —
  // analitykę zapewnia hosting, a tabela http_logs szybko rosła.
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!ADMIN_USER || !ADMIN_PASS) {
      return unauthorized('missing env creds')
    }
    const auth = req.headers.get('authorization') || ''
    if (!auth.startsWith('Basic ')) return unauthorized('no basic header')

    try {
      const { user, pass } = decodeBasicAuth(auth)
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        return NextResponse.next()
      }
      return unauthorized('bad creds')
    } catch {
      return unauthorized('decode error')
    }
  }

  return NextResponse.next()
}

// Matcher bez złożonych regexów – unika błędu builda
export const config = {
  matcher: ['/:path*'],
}

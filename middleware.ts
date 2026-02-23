// middleware.ts (Next.js / Edge Runtime)
import { NextResponse, NextRequest } from 'next/server'

// ==== KONFIG ====
const ADMIN_USER = process.env.ADMIN_USER || ''
const ADMIN_PASS = process.env.ADMIN_PASS || ''

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Rozsądny filtr assetów i technicznych ścieżek
const ASSET_EXT_RE = /\.(?:png|jpe?g|webp|svg|gif|css|js|mjs|map|ico|txt|woff2?|ttf|eot)$/i
const STATIC_PATHS = new Set(['/favicon.ico', '/robots.txt', '/sitemap.xml'])

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

function shouldSkipLogging(req: NextRequest) {
  const p = req.nextUrl.pathname
  if (p.startsWith('/_next')) return true
  if (STATIC_PATHS.has(p)) return true
  if (ASSET_EXT_RE.test(p)) return true
  // Opcjonalnie: pomiń preflighty CORS
  if (req.method === 'OPTIONS') return true
  return false
}

async function logToSupabase(req: NextRequest) {
  try {
    if (shouldSkipLogging(req)) return

    const url = new URL(req.url)
    const xff = req.headers.get('x-forwarded-for') || ''
    const ip = xff.split(',')[0]?.trim() || null

    const payload = {
      ip,
      method: req.method,
      path: url.pathname,
      search: url.search || '',
      host: url.host,
      referer: req.headers.get('referer') || null,
      ua: req.headers.get('user-agent') || null,
    }

    // „fire-and-forget” – bez await, żeby nie spowalniać requestu
    fetch(`${SUPABASE_URL}/rest/v1/http_logs`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'apikey': SUPABASE_ANON,
        'authorization': `Bearer ${SUPABASE_ANON}`,
        'prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // nic – nie blokujemy ruchu przez błąd logowania
  }
}

// ==== GŁÓWNA FUNKCJA ====
export async function middleware(req: NextRequest) {
  // 1) Loguj wszystkie żądania (poza assetami)
  logToSupabase(req)

  // 2) Basic Auth dla /admin
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

// middleware.ts (Edge Runtime)
import { NextResponse, NextRequest } from 'next/server'

const ENV_USER = process.env.ADMIN_USER || ''
const ENV_PASS = process.env.ADMIN_PASS || ''

// ——— USTAW TO W VERCEL ENV! ———
// W produkcji NIE używaj fallbacków:
const USER = ENV_USER
const PASS = ENV_PASS

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
  // Edge runtime: używamy atob (Web API), nie Buffer
  const decoded = globalThis.atob(base64) // zwraca "user:pass"
  const idx = decoded.indexOf(':')
  const user = idx >= 0 ? decoded.slice(0, idx) : decoded
  const pass = idx >= 0 ? decoded.slice(idx + 1) : ''
  return { user, pass }
}

async function logToSupabase(req: NextRequest) {
  // pomiń assety/_next itp.
  const p = req.nextUrl.pathname
  if (/^\/(_next|favicon\.ico|robots\.txt|sitemap\.xml|.*\.(png|jpg|jpeg|webp|svg|gif|css|js|ico|txt))$/i.test(p)) {
    return
  }

  const url = new URL(req.url)
  const xff = req.headers.get('x-forwarded-for') || ''
  const ip  = xff.split(',')[0]?.trim() || null

  const payload = {
    ip,
    method: req.method,
    path: url.pathname,
    search: url.search || '',
    host: url.host,
    referer: req.headers.get('referer') || null,
    ua: req.headers.get('user-agent') || null,
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // „fire-and-forget” + keepalive, by nie blokować odpowiedzi
  fetch(`${supabaseUrl}/rest/v1/http_logs`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'apikey': anon,
      'authorization': `Bearer ${anon}`,
      'prefer': 'return=minimal',
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}

export async function middleware(req: NextRequest) {
  // 1) logujemy KAŻDY request (poza assetami)
  logToSupabase(req) // bez await

  // 2) ochrona Basic Auth dla /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!USER || !PASS) {
      // brak poświadczeń w ENV — blokujemy w prod
      return unauthorized('missing env creds')
    }
    const auth = req.headers.get('authorization') || ''
    if (!auth.startsWith('Basic ')) return unauthorized('no basic header')

    try {
      const { user, pass } = decodeBasicAuth(auth)
      if (user === USER && pass === PASS) {
        return NextResponse.next()
      }
      return unauthorized('bad creds')
    } catch {
      return unauthorized('decode error')
    }
  }

  return NextResponse.next()
}

// matcher: logujemy wszystko, ale chronimy /admin
export const config = {
  matcher: ['/((?!_next|.*\\.(png|jpg|jpeg|webp|svg|gif|css|js|ico|txt)).*)'],
}

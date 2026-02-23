import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'

type SortField = 'created_at' | 'email' | 'name' | 'active'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const pageSize = Math.min(Math.max(1, Number(searchParams.get('pageSize') ?? '20')), 100)
    const sort = (searchParams.get('sort') ?? 'created_at') as SortField
    const dir = (searchParams.get('dir') ?? 'desc') as 'asc' | 'desc'
    const q = (searchParams.get('q') ?? '').trim()

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createAdminClient()

    let query = supabase
      .from('subscribers')
      // używamy istniejących kolumn: id (uuid), email, name, active, unsubscribe_token, created_at
      .select('id,email,name,active,unsubscribe_token,created_at', { count: 'exact' })
      .order(sort, { ascending: dir === 'asc' })
      .range(from, to)

    if (q) {
      query = query.or(`email.ilike.%${q}%,name.ilike.%${q}%`)
    }

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({
      page,
      pageSize,
      total: count ?? 0,
      rows: data ?? [],
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Unexpected error', rows: [], total: 0 },
      { status: 500 },
    )
  }
}

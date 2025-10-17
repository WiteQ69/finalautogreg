'use client'

import { useEffect, useState } from 'react'

type Row = {
  id: string
  email: string
  name: string | null
  active: boolean
  unsubscribe_token: string
  created_at: string
}

type ApiResp =
  | { page: number; pageSize: number; total: number; rows: Row[] }
  | { error: string; rows?: Row[]; total?: number }

export default function SubscribersAdminPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'created_at' | 'email' | 'name' | 'active'>('created_at')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sort,
      dir,
    })
    if (q.trim()) params.set('q', q.trim())

    try {
      const res = await fetch(`/api/subscribers?${params.toString()}`, { cache: 'no-store' })
      const json: ApiResp = await res.json()
      if (!res.ok || 'error' in json) {
        setRows([])
        setTotal(0)
        setError(('error' in json && json.error) || `Błąd API (${res.status})`)
      } else {
        setRows(Array.isArray(json.rows) ? json.rows : [])
        setTotal(Number(json.total ?? 0))
      }
    } catch (e: any) {
      setError(e?.message || 'Nieznany błąd')
      setRows([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sort, dir])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function toggleSort(field: 'created_at' | 'email' | 'name' | 'active') {
    if (sort === field) setDir(dir === 'asc' ? 'desc' : 'asc')
    else {
      setSort(field)
      setDir('asc')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Subskrybenci newslettera</h1>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Szukaj po emailu lub imieniu..."
          className="border rounded-xl px-3 py-2 w-64"
        />
        <button onClick={() => { setPage(1); load() }} className="px-3 py-2 rounded-xl border">
          Szukaj
        </button>
        <span className="ml-auto text-sm opacity-70">
          {loading ? 'Ładowanie…' : `${total} wyników`}
        </span>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto border rounded-2xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th onClick={() => toggleSort('created_at')} label="Dodano" active={sort === 'created_at'} dir={dir} />
              <Th onClick={() => toggleSort('email')} label="Email" active={sort === 'email'} dir={dir} />
              <Th onClick={() => toggleSort('name')} label="Imię i nazwisko" active={sort === 'name'} dir={dir} />
              <Th onClick={() => toggleSort('active')} label="Aktywny" active={sort === 'active'} dir={dir} />
              <th className="text-left p-3">Unsubscribe token</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3 font-medium">{r.email}</td>
                <td className="p-3">{r.name ?? '—'}</td>
                <td className="p-3">{r.active ? 'TRUE' : 'FALSE'}</td>
                <td className="p-3 text-xs">{r.unsubscribe_token}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="p-4" colSpan={5}>Brak danych</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-2 rounded-xl border"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Poprzednia
        </button>
        <span className="text-sm">Strona {page} / {totalPages}</span>
        <button
          className="px-3 py-2 rounded-xl border"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Następna →
        </button>
        <select
          className="ml-2 border rounded-xl px-2 py-2"
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}/stronę</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function Th({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active?: boolean
  dir: 'asc' | 'desc'
  onClick: () => void
}) {
  return (
    <th className="text-left p-3 select-none cursor-pointer" onClick={onClick}>
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (dir === 'asc' ? ' ↑' : ' ↓') : null}
      </span>
    </th>
  )
}

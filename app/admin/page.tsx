'use client';

import { useEffect, useMemo, useState } from 'react';

const fmtPLN = (n: number) =>
  n.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 });

type Car = {
  id: string;
  title?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  price_text?: string | null;
  status?: string | null;
  // ADMIN ONLY (pobieramy z API admin)
  purchase_price_pln?: number | string | null;
  sale_price_pln?: number | string | null;
  // lokalny stan w camelCase jako liczby
  purchasePricePLN?: number | null;
  salePricePLN?: number | null;
};

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      // DEDYKOWANY endpoint admina – zawiera prywatne kolumny
      const res = await fetch('/api/cars?admin=1', { cache: 'no-store', next: { revalidate: 0 } });
      const data: any[] = await res.json();
      if (!res.ok) throw new Error((data as any)?.error || 'Błąd pobierania');
      setCars(
        (Array.isArray(data) ? data : []).map((c: any) => ({
          ...c,
          purchasePricePLN:
            c.purchase_price_pln == null || c.purchase_price_pln === ''
              ? null
              : Number(c.purchase_price_pln),
          salePricePLN:
            c.sale_price_pln == null || c.sale_price_pln === ''
              ? null
              : Number(c.sale_price_pln),
        }))
      );
    } catch (e: any) {
      setError(e?.message || 'Nie udało się pobrać aut.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setLocalPrice = (
    id: string,
    field: 'purchasePricePLN' | 'salePricePLN',
    raw: string
  ) => {
    setCars((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [field]: raw === '' ? null : Number(raw) } : c
      )
    );
  };

  const savePrices = async (id: string) => {
    const car = cars.find((c) => c.id === id);
    if (!car) return;

    try {
      setSavingId(id);
      setError(null);

      const body = {
        // wysyłamy snake_case (DB) + camelCase (na wypadek innego handlera)
        purchase_price_pln: car.purchasePricePLN ?? null,
        sale_price_pln: car.salePricePLN ?? null,
        purchasePricePLN: car.purchasePricePLN ?? null,
        salePricePLN: car.salePricePLN ?? null,
      };

      const res = await fetch(`/api/cars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(body),
      });

      const data = (await res.json().catch(() => ({}))) as any;
      if (!res.ok) throw new Error(data?.error || 'Błąd zapisu');

      // po sukcesie odśwież dane z DB (żeby po F5 było identycznie)
      await load();
    } catch (e: any) {
      setError(e?.message || 'Nie udało się zapisać.');
    } finally {
      setSavingId(null);
    }
  };

  const totals = useMemo(() => {
    let purchase = 0;
    let sale = 0;
    for (const c of cars) {
      if (typeof c.purchasePricePLN === 'number') purchase += c.purchasePricePLN;
      if (typeof c.salePricePLN === 'number') sale += c.salePricePLN;
    }
    return { purchase, sale, profit: sale - purchase };
  }, [cars]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Panel Administracyjny</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Włożyłem w auta</p>
          <p className="text-2xl font-semibold mt-1">{fmtPLN(totals.purchase)}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Mam w autach</p>
          <p className="text-2xl font-semibold mt-1">{fmtPLN(totals.sale)}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Różnica (zarobek)</p>
          <p className={`text-2xl font-semibold mt-1 ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {fmtPLN(totals.profit)}
          </p>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">{error}</div>}

      {loading ? (
        <p>Ładowanie…</p>
      ) : (
        <div className="space-y-6">
          {cars.map((c) => (
            <div key={c.id} className="rounded-xl border p-4 shadow-sm bg-white">
              <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                {c.title || `${c.brand || ''} ${c.model || ''}`}{c.year ? ` (${c.year})` : ''}
              </h2>
              {c.price_text && <p className="text-sm text-zinc-500 mb-4">{c.price_text}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">Cena zakupu (PLN)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    value={c.purchasePricePLN ?? ''}
                    onChange={(e) => setLocalPrice(c.id, 'purchasePricePLN', e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">Cena sprzedaży (PLN)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    value={c.salePricePLN ?? ''}
                    onChange={(e) => setLocalPrice(c.id, 'salePricePLN', e.target.value)}
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
              </div>

              <button
                disabled={savingId === c.id}
                onClick={() => savePrices(c.id)}
                className="mt-4 px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 text-sm"
              >
                {savingId === c.id ? 'Zapisywanie…' : 'Zapisz'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

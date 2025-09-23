'use client';

import { useEffect, useMemo, useState } from 'react';

// Prosty formatter PLN
const fmtPLN = (n: number) =>
  n.toLocaleString('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  });

type CarRow = {
  id: string;
  title?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  price_text?: string | null;
  status?: string | null;
  purchasePricePLN?: number | null;
  purchase_price_pln?: number | null;
  salePricePLN?: number | null;
  sale_price_pln?: number | null;
};

export default function AdminDashboard() {
  const [cars, setCars] = useState<CarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/cars', { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const data: any[] = await res.json();
      setCars(
        (Array.isArray(data) ? data : []).map((c) => ({
          ...c,
          purchasePricePLN:
            c.purchasePricePLN ?? c.purchase_price_pln ?? null,
          salePricePLN: c.salePricePLN ?? c.sale_price_pln ?? null,
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

  const savePrices = async (id: string, purchase: string, sale: string) => {
    try {
      setSavingId(id);
      setError(null);
      const purchaseVal =
        purchase === '' || purchase == null
          ? null
          : Number(String(purchase).replace(/\s/g, ''));
      const saleVal =
        sale === '' || sale == null
          ? null
          : Number(String(sale).replace(/\s/g, ''));

      if (
        (purchaseVal !== null && !Number.isFinite(purchaseVal)) ||
        (saleVal !== null && !Number.isFinite(saleVal))
      ) {
        throw new Error('Wpisz liczby (PLN).');
      }

      const res = await fetch(`/api/cars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchasePricePLN: purchaseVal,
          salePricePLN: saleVal,
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      setCars((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                purchasePricePLN: purchaseVal,
                purchase_price_pln: purchaseVal,
                salePricePLN: saleVal,
                sale_price_pln: saleVal,
              }
            : c
        )
      );
    } catch (e: any) {
      setError(e?.message || 'Nie udało się zapisać.');
    } finally {
      setSavingId(null);
    }
  };

  const totals = useMemo(() => {
    let purchase = 0;
    let sale = 0;
    cars.forEach((c) => {
      const p =
        (c.purchasePricePLN ?? c.purchase_price_pln) as number | null;
      const s = (c.salePricePLN ?? c.sale_price_pln) as number | null;
      if (typeof p === 'number') purchase += p;
      if (typeof s === 'number') sale += s;
    });
    return { purchase, sale, profit: sale - purchase };
  }, [cars]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">
        Panel Administracyjny
      </h1>

      {/* Podsumowanie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Włożyłem w auta</p>
          <p className="text-2xl font-semibold mt-1">
            {fmtPLN(totals.purchase)}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Mam w autach</p>
          <p className="text-2xl font-semibold mt-1">
            {fmtPLN(totals.sale)}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Różnica (zarobek)</p>
          <p
            className={`text-2xl font-semibold mt-1 ${
              totals.profit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {fmtPLN(totals.profit)}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <div className="space-y-6">
          {cars.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border p-4 shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                {c.title || `${c.brand || ''} ${c.model || ''}`}{' '}
                {c.year ? `(${c.year})` : ''}
              </h2>
              <p className="text-sm text-zinc-500 mb-4">
                {c.price_text || ''}
              </p>

              {/* Pola cena zakupu / sprzedaży */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">
                    Cena zakupu (PLN)
                  </label>
                  <input
                    type="number"
                    defaultValue={
                      c.purchasePricePLN ?? c.purchase_price_pln ?? ''
                    }
                    onChange={(e) =>
                      setCars((prev) =>
                        prev.map((cc) =>
                          cc.id === c.id
                            ? {
                                ...cc,
                                purchasePricePLN: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              }
                            : cc
                        )
                      )
                    }
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-600 mb-1">
                    Cena sprzedaży (PLN)
                  </label>
                  <input
                    type="number"
                    defaultValue={
                      c.salePricePLN ?? c.sale_price_pln ?? ''
                    }
                    onChange={(e) =>
                      setCars((prev) =>
                        prev.map((cc) =>
                          cc.id === c.id
                            ? {
                                ...cc,
                                salePricePLN: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              }
                            : cc
                        )
                      )
                    }
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>
              </div>

              <button
                disabled={savingId === c.id}
                onClick={() =>
                  savePrices(
                    c.id,
                    String(c.purchasePricePLN ?? ''),
                    String(c.salePricePLN ?? '')
                  )
                }
                className="mt-4 px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 text-sm"
              >
                {savingId === c.id ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

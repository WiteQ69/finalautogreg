'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car as CarIcon, CheckCircle } from 'lucide-react';
import { useCarStore } from '@/store/car-store';
import { SimpleCarCard } from '@/components/ui/simple-car-card';
import type { Car } from '@/types/car';

function normStatus(v: unknown) {
  return String(v ?? '').trim().toLowerCase();
}

export default function AutaPage() {
  const { setCars } = useCarStore();
  const [list, setList] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`/api/cars?ts=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-store' },
        });
        const data: Car[] = res.ok ? await res.json() : [];
        if (!ignore) {
          setList(data);
          setCars(data);
        }
      } catch (e) {
        console.warn('API /api/cars not loaded:', e);
        if (!ignore) setList([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [setCars]);

  const activeCars = list.filter((c: any) => {
    const s = normStatus(c?.status);
    const badge = !!c?.sold_badge;
    return s === 'active' || (!s && !badge);
  });
  const soldCars = list.filter((c: any) => {
    const s = normStatus(c?.status);
    const badge = !!c?.sold_badge;
    return s === 'sold' || (!s && badge);
  });

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">Nasze samochody</h1>
          <p className="text-xl text-zinc-600">Przeglądaj dostępne oferty i zobacz nasze ostatnie sprzedaże</p>
        </motion.div>
<title>NASZE AUTA AUTOGREG GRZEGORZ PACZYŃSKI</title>

        {loading && <div className="text-center text-zinc-500 py-10">Ładuję…</div>}

        {!loading && activeCars.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 rounded-xl bg-blue-100"><CarIcon className="h-6 w-6 text-blue-600" /></div>
              <h2 className="text-3xl font-bold text-zinc-900">Dostępne auta</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCars.map((car, index) => (
                <motion.div key={car.id} layout>
                  <SimpleCarCard car={car} index={index} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && soldCars.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: activeCars.length > 0 ? 0.2 : 0.1 }} className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 rounded-xl bg-green-100"><CheckCircle className="h-6 w-6 text-green-600" /></div>
              <h2 className="text-3xl font-bold text-zinc-900">Sprzedane auta</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldCars.map((car, index) => (
                <motion.div key={car.id} layout>
                  <SimpleCarCard car={car} index={index} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && activeCars.length === 0 && soldCars.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-full bg-zinc-100 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CarIcon className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Brak samochodów</h3>
              <p className="text-zinc-600">Aktualnie nie mamy żadnych samochodów w ofercie. Sprawdź ponownie wkrótce.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

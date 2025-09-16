'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car as CarIcon, CheckCircle } from 'lucide-react';
import { useCarStore } from '@/store/car-store';
import { SimpleCarCard } from '@/components/ui/simple-car-card';

export default function AutaPage() {
  const { cars, setCars } = useCarStore();

  useEffect(() => {
    const load = async () => {
      try {
        if (!cars || cars.length === 0) {
          const res = await fetch('/api/cars', { cache: 'no-store' });
          if (res.ok) setCars(await res.json());
        }
      } catch (e) {
        console.warn('API /api/cars not loaded:', e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCars]);

  const activeCars = (cars ?? []).filter((c) => c.status === 'active');
  const soldCars = (cars ?? []).filter((c) => c.status === 'sold');

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">Nasze samochody</h1>
          <p className="text-xl text-zinc-600">Przeglądaj dostępne oferty i zobacz nasze ostatnie sprzedaże</p>
        </motion.div>

        {/* Dostępne */}
        {activeCars.length > 0 && (
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

        {/* Sprzedane */}
        {soldCars.length > 0 && (
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

        {/* Pusto */}
        {activeCars.length === 0 && soldCars.length === 0 && (
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

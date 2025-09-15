'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Car as CarIcon, CheckCircle, ArrowLeft, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCarStore } from '@/store/car-store';
import type { Car as CarType } from '@/types/car';

export default function AdminCarsListPage() {
  const { cars, setCars, deleteCar } = useCarStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadCars = async () => {
      try {
        const res = await fetch('/api/cars', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load /api/cars');
        const data = await res.json();
        if (!cancelled) setCars(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn('Error loading cars:', e);
        if (!cancelled) setCars([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadCars();
    return () => { cancelled = true; };
  }, [setCars]);

  const handleDelete = async (carId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten samochód?')) return;
    try {
      const res = await fetch(`/api/cars/${carId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API DELETE failed');
      deleteCar(carId);
    } catch (e) {
      console.error(e);
      alert('Nie udało się usunąć auta.');
    }
  };

  const getStatusBadge = (status: CarType['status']) =>
    status === 'active'
      ? <Badge className="bg-green-100 text-green-800">Dostępny</Badge>
      : <Badge className="bg-red-100 text-red-800">Sprzedany</Badge>;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-200 rounded mb-8 max-w-md"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-zinc-200 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
                Lista samochodów
              </h1>
              <p className="text-xl text-zinc-600">
                Wszystkie samochody ({cars.length})
              </p>
            </div>

            <Button asChild size="lg" className="bg-zinc-900 hover:bg-zinc-800">
              <Link href="/admin/cars/new" className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Dodaj auto</span>
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Lista */}
        {cars.length > 0 ? (
          <div className="space-y-4">
            {cars.map((car) => (
              <Card key={car.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Image */}
                      <div className="w-32 h-24 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden">
                        {car.main_image_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={car.main_image_path}
                            alt={car.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <CarIcon className="h-8 w-8 text-zinc-400" />
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-1">{car.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-zinc-600 mb-2">
                          <span>{car.year}</span>
                          <span>•</span>
                          <span>{car.mileage?.toLocaleString?.('pl-PL') ?? car.mileage} km</span>
                          <span>•</span>
                          <span>{car.engine}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-zinc-900">{car.price_text || 'Brak ceny'}</span>
                          {getStatusBadge(car.status)}
                          {car.firstOwner && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Pierwszy właściciel</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/samochod/${car.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Podgląd
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/cars/${car.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edytuj
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(String(car.id))}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Usuń
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-full bg-zinc-100 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CarIcon className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Brak samochodów</h3>
              <p className="text-zinc-600 mb-6">Rozpocznij dodając swój pierwszy samochód do bazy.</p>
              <Button asChild size="lg" className="bg-zinc-900 hover:bg-zinc-800">
                <Link href="/admin/cars/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Dodaj pierwszy samochód
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

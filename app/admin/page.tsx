'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, Plus, BarChart3, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCarStore } from '@/store/car-store';

export default function AdminDashboard() {
  const { cars, setCars } = useCarStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const response = await fetch('/cars.json');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error loading cars:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [setCars]);

  const stats = {
    total: cars.length,
    active: cars.filter(car => car.status === 'active').length,
    sold: cars.filter(car => car.status === 'sold').length,
    totalValue: cars
      .filter(car => car.status === 'active')
      .reduce((sum, car) => {
        if (car.price_text) {
          const price = parseInt(car.price_text.replace(/[^\d]/g, ''));
          return sum + (isNaN(price) ? 0 : price);
        }
        return sum;
      }, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-200 rounded mb-8 max-w-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
                Panel Administracyjny
              </h1>
              <p className="text-xl text-zinc-600">Zarządzaj swoimi samochodami</p>
            </div>
            
            <Button asChild size="lg" className="bg-zinc-900 hover:bg-zinc-800">
              <Link href="/__admin-auto-greg/cars/new" className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Dodaj auto</span>
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wszystkie auta</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                w bazie danych
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dostępne</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                aktywnych ofert
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sprzedane</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
              <p className="text-xs text-muted-foreground">
                sprzedanych aut
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wartość</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalValue.toLocaleString('pl-PL')} zł</div>
              <p className="text-xs text-muted-foreground">
                dostępnych aut
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Zarządzaj samochodami</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 mb-4">
                Przeglądaj, edytuj i usuwaj samochody z bazy danych
              </p>
              <Button asChild className="w-full">
                <Link href="/__admin-auto-greg/cars">
                  <Car className="h-4 w-4 mr-2" />
                  Zobacz wszystkie auta
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle>Dodaj nowe auto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 mb-4">
                Utwórz nową ofertę samochodu w systemie
              </p>
              <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800">
                <Link href="/__admin-auto-greg/cars/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj auto
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Eye, 
  Heart, 
  Edit, 
  Copy, 
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCarStore } from '@/store/car-store';
import { formatPrice, formatMileage } from '@/lib/format';
import { mockCars } from '@/data/mock-cars';
import { Car } from '@/types/car';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'sold'>('all');
  
  const { cars, addCar, deleteCar, updateCar } = useCarStore();

  // Initialize with mock data if empty
  useEffect(() => {
    if (cars.length === 0) {
      mockCars.forEach(car => addCar(car));
    }
  }, [cars.length, addCar]);

  const filteredCars = cars.filter(car => {
    const matchesSearch = (car.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (car.model || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: cars.length,
    active: cars.filter(c => c.status === 'active').length,
    draft: cars.filter(c => c.status === 'draft').length,
    totalViews: cars.reduce((sum, car) => sum + (car.views || 0), 0),
    totalFavorites: cars.reduce((sum, car) => sum + (car.favorites || 0), 0),
  };

  const duplicateCar = (car: Car) => {
    const newCar: Car = {
      ...car,
      id: Date.now().toString(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      favorites: 0,
    };
    addCar(newCar);
  };

  const getStatusBadge = (status: Car['status']) => {
  const variants: Record<Car['status'], string> = {
    active: 'bg-green-100 text-green-800',
    draft:  'bg-yellow-100 text-yellow-800',
    sold:   'bg-gray-200 text-gray-700',
  };

  const labels: Record<Car['status'], string> = {
    active: 'Aktywne',
    draft:  'Szkic',
    sold:   'Sprzedane',
  };

  return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
                Panel sprzedawcy
              </h1>
              <p className="text-xl text-zinc-600">Zarządzaj swoimi ofertami</p>
            </div>
            
            <Button asChild size="lg" className="bg-zinc-900 hover:bg-zinc-800">
              <Link href="/dashboard/new" className="flex items-center space-x-2">
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-zinc-900">{stats.total}</p>
              <p className="text-sm text-zinc-600">Wszystkich ogłoszeń</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-zinc-600">Aktywnych</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-zinc-900">{stats.totalViews}</p>
              <p className="text-sm text-zinc-600">Wyświetleń</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-red-500">{stats.totalFavorites}</p>
              <p className="text-sm text-zinc-600">Polubień</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Szukaj w ogłoszeniach..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-3">
                {(['all', 'active', 'draft', 'sold'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status === 'all' ? 'Wszystkie' : 
                     status === 'active' ? 'Aktywne' :
                     status === 'draft' ? 'Szkice' : 'Ukryte'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cars List */}
        {filteredCars.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      {/* Image */}
                      <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                        {car.images?.[0] && (
                          <img
                            src={car.images[0]}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-zinc-900">
                              {car.brand} {car.model}
                            </h3>
                            <p className="text-zinc-600 text-sm mb-2">
                              {car.year} • {formatMileage(car.mileage)} • {car.price_text || (car.price !== undefined ? formatPrice(car.price) : 'Brak ceny')}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-zinc-500">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{car.views || 0}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{car.favorites || 0}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {getStatusBadge(car.status)}
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/offer/${car.id}`}>Podgląd</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/${car.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edytuj
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicateCar(car)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplikuj
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteCar(car.id)}
                                  className="text-red-600"
                                >
                                  Usuń
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-full bg-zinc-100 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Plus className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Brak ogłoszeń</h3>
              <p className="text-zinc-600 mb-6">
                Rozpocznij sprzedaż, dodając swoje pierwsze auto.
              </p>
              <Button asChild size="lg" className="bg-zinc-900 hover:bg-zinc-800">
                <Link href="/dashboard/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Dodaj pierwsze auto
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
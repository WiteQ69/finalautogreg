'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, BarChart3, Fuel, Gauge, Calendar, Car as CarIcon } from 'lucide-react';
import { Car } from '@/types/car';
import { useCarStore } from '@/store/car-store';
import { formatPrice, formatMileage, getFuelTypeLabel, getTransmissionLabel } from '@/lib/format';
import { cn } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  const [imageError, setImageError] = useState(false);
  const { favorites, comparison, toggleFavorite, addToComparison, removeFromComparison } = useCarStore();
  
  const isFavorite = favorites.includes(car.id);
  const isInComparison = comparison.includes(car.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(car.id);
  };

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInComparison) {
      removeFromComparison(car.id);
    } else if (comparison.length < 3) {
      addToComparison(car.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/offer/${car.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={imageError ? '/autogreg-logo.png' : car.images?.[0] || '/autogreg-logo.png'}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleFavorite}
                className={cn(
                  'p-2 rounded-full backdrop-blur-sm transition-all duration-200',
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-zinc-600 hover:bg-white'
                )}
              >
                <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleComparison}
                disabled={!isInComparison && comparison.length >= 3}
                className={cn(
                  'p-2 rounded-full backdrop-blur-sm transition-all duration-200',
                  isInComparison
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/80 text-zinc-600 hover:bg-white',
                  !isInComparison && comparison.length >= 3 && 'opacity-50 cursor-not-allowed'
                )}
              >
                <BarChart3 className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Status Badge */}
            {car.status === 'draft' && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
                Szkic
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title & Price */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                {car.brand} {car.model}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-bold text-zinc-900">
                  {car.price != null ? formatPrice(car.price) : (car.price_text ?? 'Brak ceny')}
                </span>
                <span className="text-sm text-zinc-500">{car.year ?? ''}</span>
              </div>
            </div>

            {/* Key Specs */}
            <div className="flex flex-col gap-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
                  <Gauge className="h-3 w-3 text-zinc-500" />
                </div>
                <span>{formatMileage(car.mileage)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
                  <Fuel className="h-3 w-3 text-zinc-500" />
                </div>
                <span>{getFuelTypeLabel(car.fuelType ?? undefined)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
                  <CarIcon className="h-3 w-3 text-zinc-500" />
                </div>
                <span>{getTransmissionLabel(car.transmission ?? undefined)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
                  <Calendar className="h-3 w-3 text-zinc-500" />
                </div>
                <span>{car.power} KM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
                  <Calendar className="h-3 w-3 text-zinc-500" />
                </div>
                <span>{car.year}</span>
              </div>
            </div>

            {/* Location */}
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <span className="text-xs text-zinc-500">{car.location}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

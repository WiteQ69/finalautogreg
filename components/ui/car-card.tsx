'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Cog, Fuel, Gauge, CarFront, Flag, Workflow, CheckCircle2,
  Settings2, Navigation, ShieldCheck, Heart, BarChart3
} from 'lucide-react';
import { Car } from '@/types/car';
import { useCarStore } from '@/store/car-store';
import { formatPrice, formatMileage, getFuelTypeLabel } from '@/lib/format';
import { cn } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  index?: number;
}

// pomocnicze labelki
function docLabel(doc?: string) {
  if (!doc) return '-';
  const v = doc.toLowerCase();
  if (v.includes('vat') && v.includes('23')) return 'Faktura VAT 23%';
  if (v.includes('vat') && (v.includes('marza') || v.includes('marża'))) return 'Faktura VAT marża';
  if (v.includes('umowa')) return 'Umowa kupna-sprzedaży';
  return doc;
}
function boolLabel(v?: boolean) {
  return v ? 'tak' : 'nie';
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  const [imageError, setImageError] = useState(false);
  const { favorites, comparison, toggleFavorite, addToComparison, removeFromComparison } =
    useCarStore();

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

  // dane z różnymi możliwymi nazwami pól
  const engineCcm =
    (car as any).engineCapacityCcm ??
    (car as any).engine_capacity_ccm ??
    (car as any).engine_capacity ??
    undefined;

  const powerKm = (car as any).power ?? undefined;
  const powerKw = (car as any).powerKw ?? (car as any).power_kw ?? undefined;

  const bodyType = (car as any).bodyType ?? (car as any).body_type ?? undefined;

  const importedFrom = (car as any).importedFrom ?? (car as any).imported_from ?? undefined;

  const saleDocument =
    (car as any).saleDocument ?? (car as any).sale_document ?? (car as any).document ?? undefined;

  const registeredInPoland =
    (car as any).registeredInPoland ?? (car as any).registered_in_poland ?? undefined;

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
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-zinc-600 hover:bg-white'
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
                  isInComparison ? 'bg-blue-500 text-white' : 'bg-white/80 text-zinc-600 hover:bg-white',
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
                  {car.price != null ? formatPrice(car.price) : car.price_text ?? 'Brak ceny'}
                </span>
                <span className="text-sm text-zinc-500">{car.year ?? ''}</span>
              </div>
            </div>

          {/* === PARAMETRY – kolejność jak na screenie === */}
<div className="space-y-3 text-sm text-zinc-800">

  {/* 1. Poj. silnika */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <Cog className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{car.engineCapacityCcm ? `${car.engineCapacityCcm} cm³` : '-'}</span>
  </div>

  {/* 2. Paliwo */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <Fuel className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{getFuelTypeLabel(car.fuelType ?? undefined)}</span>
  </div>

  {/* 3. Moc (preferujemy kW jak na screenie) */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <Gauge className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{car.powerKw != null ? `${car.powerKw} kW` : '-'}</span>
  </div>

  {/* 4. Przebieg */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <Gauge className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{formatMileage(car.mileage)}</span>
  </div>

  {/* 5. Skrzynia (pole z panelu: car.transmission) */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <Settings2 className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{car.transmission ?? '-'}</span>
  </div>

  {/* 6. Napęd (pole z panelu: car.drivetrain) */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <Navigation className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{car.drivetrain ?? '-'}</span>
  </div>

  {/* 7. Stan techniczny (pole z panelu: car.condition) */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <ShieldCheck className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{car.condition ?? '-'}</span>
  </div>

  {/* 8. Nadwozie */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <CarFront className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{car.bodyType ?? '-'}</span>
  </div>

  {/* 9. Zarejestrowany (pole z panelu: car.registeredIn) */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <CheckCircle2 className="h-3 w-3 text-zinc-500" />
    </div>
    <span>
      {(() => {
        // jeśli masz bool w panelu
        if (typeof car.registeredIn === 'boolean') {
          return typeof boolLabel === 'function'
            ? boolLabel(car.registeredIn)
            : (car.registeredIn ? 'TAK' : 'NIE');
        }
        // jeśli wpisujesz tekst (np. "TAK"/"NIE" albo miasto) — pokaż jak jest
        return car.registeredIn ?? '-';
      })()}
    </span>
  </div>

  {/* 10. Sprowadzony z */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <Flag className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{car.origin ?? '-'}</span>
  </div>

  {/* 11. Dokument sprzedaży */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-zinc-100">
      <Workflow className="h-3 w-3 text-zinc-500" />
    </div>
    <span>{car.saleDocument ?? '-'}</span>
  </div>

  {/* 12. Pasek PCC (pokazuj, gdy w panelu wybrałeś fakturę VAT / VAT marża) */}
  {typeof car.saleDocument === 'string' &&
    car.saleDocument.toUpperCase().includes('VAT') && (
      <div className="mt-2 rounded-md bg-emerald-50 text-emerald-700 px-3 py-2 text-[13px] border border-emerald-100">
        Nie płacisz podatku PCC 2% w urzędzie skarbowym.
      </div>
  )}
</div>


            {/* Location */}
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <span className="text-xs text-zinc-500">{(car as any).location}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

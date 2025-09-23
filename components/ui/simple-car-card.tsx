'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Car } from '@/types/car';
import SoldBadge from '@/components/SoldBadge';
// Jeśli chcesz też REZERWACJA, odkomentuj i użyj:
// import StatusStamp from '@/components/StatusStamp';

function km(n?: number | string) {
  const v =
    typeof n === 'number'
      ? n
      : typeof n === 'string'
      ? Number(n.replace(/\s|,|\./g, (m) => (m === ',' ? '.' : '')))
      : NaN;
  return Number.isFinite(v) ? v.toLocaleString('pl-PL') : undefined;
}

export function SimpleCarCard({
  car,
  index = 0,
}: {
  car: Car & Record<string, any>;
  index?: number;
}) {
  const href = `/samochod/${car.id}`;

  const year = car.year ?? car['YEAR'] ?? '';
  const mileageText = km(car.mileage ?? car['MILEAGE']);
  const engine = car.engine ?? '';
  const fuel = (car.fuelType ?? car.fuel_type ?? '') as string;

  const specs = [
    year && String(year),
    mileageText && `${mileageText} km`,
    [engine, fuel].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(' • ');

  const priceLine =
    (car.price_text && String(car.price_text).trim()) ||
    (car.price && typeof car.price === 'number'
      ? `${car.price.toLocaleString('pl-PL')} PLN`
      : 'zapytaj o cenę - tel. 693632068');

  const cover =
    (Array.isArray(car.images) && car.images[0]) ||
    car.main_image_path ||
    car.coverUrl ||
    '/placeholder.png';

  // warunek na stempel SPRZEDANY
 const isSold = Boolean(car?.sold_badge);


  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="rounded-2xl border bg-white shadow-sm overflow-hidden"
    >
      <Link href={href} className="block">
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={cover}
            alt={car.title ?? 'Zdjęcie auta'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={index < 3}
          />

          {/* STEMPL SPRZEDANY */}
      {Boolean(car?.sold_badge) && (
  <SoldBadge
    position="center"
    className="
      w-[52%] md:w-[48%] lg:w-[46%] opacity-95
      translate-x-6 md:translate-x-8
      lg:translate-x-[calc(0.01rem+3cm)]
    "
  />
)}




          {/* REZERWACJA (opcjonalnie) */}
          {/* {car.reserved_badge && (
            <StatusStamp status="reserved" className="w-2/3 md:w-3/4 opacity-90" position="center" />
          )} */}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-extrabold tracking-tight text-zinc-900">
            {(car.title as string) ?? ''}
          </h3>

          {specs && (
            <p className="mt-1 text-sm text-zinc-600">{specs.toUpperCase()}</p>
          )}

          <p className="mt-3 text-sm font-semibold text-zinc-800">
            {priceLine}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

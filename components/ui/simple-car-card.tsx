'use client';

import Link from 'next/link';
import type { Car } from '@/types/car';

export function SimpleCarCard({ car, index }: { car: Car; index: number }) {
  return (
    <Link href={`/samochod/${car.id}`} className="block group">
      <div className="rounded-2xl border hover:shadow-md transition cursor-pointer overflow-hidden">
        <div className="aspect-video w-full bg-zinc-100">
          {car.main_image_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={car.main_image_path}
              alt={car.title}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              Brak zdjęcia
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-zinc-900">{car.title}</h3>
          <p className="text-sm text-zinc-600">
            {car.year} • {car.mileage?.toLocaleString?.('pl-PL') ?? car.mileage} km • {car.engine}
          </p>
          <p className="text-zinc-900 font-semibold mt-2">
            {car.price_text || 'Brak ceny'}
          </p>
          {car.status === 'sold' && (
            <span className="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
              Sprzedane
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

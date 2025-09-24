'use client';

import clsx from 'clsx';

/**
 * Nakładka "ZAREZERWOWANY" – 1:1 jak SoldBadge, tylko inny plik PNG.
 * Używa obrazka: /public/stamps/reservation.png
 */
export default function ReservationBadge({
  position = 'center',
  className,
}: {
  position?: 'center' | 'top-left' | 'top-right';
  className?: string;
}) {
  const pos =
    position === 'center'
      ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      : position === 'top-left'
      ? 'absolute left-3 top-3'
      : 'absolute right-3 top-3';

  return (
    <img
      src="/stamps/reservation.png"
      alt="Zarezerwowany"
      className={clsx('pointer-events-none select-none z-20', pos, className)}
      draggable={false}
    />
  );
}

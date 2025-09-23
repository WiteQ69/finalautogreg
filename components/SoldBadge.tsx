'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function SoldBadge({
  className,
  position = 'center',
}: {
  className?: string;
  position?: 'center' | 'top-right' | 'top-left';
}) {
  const pos =
    position === 'top-left'
      ? 'absolute top-3 left-3 rotate-6'
      : position === 'top-right'
      ? 'absolute top-3 right-3 -rotate-6'
      : 'absolute inset-0 flex items-center justify-center';

  return (
    <div
      className={cn(
        'pointer-events-none z-20 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]',
        pos,
        className
      )}
      aria-hidden
    >
      {/* obrazek 16:9/duży – jak Twój „sprzedany” */}
      <Image
        src="/stamps/sold.png"   // <-- wrzuć plik do public/stamps/sold.png
        alt="SPRZEDANY"
        width={1200}
        height={675}
        className="select-none max-w-full h-auto opacity-95"
        priority={false}
      />
    </div>
  );
}

// components/AdImage.tsx
import Image from 'next/image';
import ad from '@/public/REKLAMA.jpg'; // plik musi być w /public i NAZWA dokładnie taka

export default function AdImage() {
  return (
    <div className="rounded-2xl border overflow-hidden">
      <Image
        src={ad}
        alt="Reklama"
        width={1200}
        height={400}
        className="w-full h-64 sm:h-72 lg:h-80 object-cover"
        priority={false}
        sizes="(min-width: 1024px) 24rem, 100vw"
      />
    </div>
  );
}

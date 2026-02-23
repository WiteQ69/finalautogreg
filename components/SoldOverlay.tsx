import Image from 'next/image';

export default function SoldOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/15" />
      <Image
        src="/stamps/sold.png"
        alt="Samochód sprzedany"
        width={640}
        height={320}
        className="w-1/2 max-w-[360px] h-auto drop-shadow-2xl"
        priority
      />
    </div>
  );
}

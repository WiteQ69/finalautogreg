// components/Flag.tsx
type Props = { origin?: string | null; className?: string };

const ORIGIN_TO_FLAG: Record<string, string> = {
  // dopasowania do Twoich wartości w bazie
  'Austria': 'austria',
  'Belgia': 'belgia',
  'Francja': 'francja',
  'Holandia': 'holandia',
  'Niemcy': 'niemcy',
  'Norwegia': 'norwegia',
  'Szwajcaria': 'szwajcaria',
  'Szwecja': 'szwecja',
  'Włochy': 'wlochy',
  'Polska': 'polska',
  'Salon Polska': 'polska',
};

export default function Flag({ origin, className }: Props) {
  const slug = origin ? ORIGIN_TO_FLAG[origin] : undefined;
  if (!slug) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${slug}.png`}
      alt={origin || 'flaga'}
      className={className ?? 'h-5 w-5 object-contain'}
      loading="lazy"
    />
  );
}

// components/CountryFlag.tsx
type Props = { country?: string | null; className?: string };

const ORIGIN_TO_FLAG: Record<string, string> = {
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

export default function CountryFlag({ country, className }: Props) {
  if (!country) return null;
  const slug = ORIGIN_TO_FLAG[country];
  if (!slug) return null;

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={`/flags/${slug}.png`}
      alt={country}
      className={className ?? 'h-5 w-5 object-contain'}
      loading="lazy"
    />
  );
}

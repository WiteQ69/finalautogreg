// app/samochod/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Gallery from './Gallery';
import EquipTile from './EquipTile';
import {
  Gauge,
  Fuel,
  Workflow,
  CarFront,
  Cog,
  Bolt,
  Flag,
  CheckCircle2,
  Settings,
  Move,
  Wrench,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ---------- helpers ---------- */
function pick<T = any>(
  obj: Record<string, any>,
  keys: string[],
  fallback: T | undefined = undefined
): T | undefined {
  for (const k of keys) {
    if (k in obj) {
      const v = obj[k];
      if (v !== undefined && v !== null && (typeof v === 'string' ? v.trim() !== '' : true))
        return v as T;
      if (typeof v === 'boolean' || typeof v === 'number') return v as T;
    }
  }
  return fallback;
}
function num(val: any): number | undefined {
  const n = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(n) ? n : undefined;
}
/* ----------------------------- */

export default async function CarPage({ params }: { params: { id: string } }) {
  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !car) notFound();

  const mileageNum = num((car as any).mileage);
  const engineCapacityCcm =
    num((car as any).engineCapacityCcm) ??
    num((car as any).engine_capacity_ccm) ??
    num((car as any).engine_capacity);
  const powerKwNum = num((car as any).powerKw) ?? num((car as any).power_kw);

  const paliwo: string | undefined = (car as any).fuelType ?? (car as any).fuel_type;
  const nadwozieRaw: string | undefined = (car as any).bodyType ?? (car as any).body_type;

  const saleDocumentRaw: string | undefined =
    (car as any).saleDocument ?? (car as any).sale_document;

  const saleDocumentText =
    saleDocumentRaw?.toLowerCase?.() === 'umowa'
      ? 'Umowa kupna-sprzedaży'
      : saleDocumentRaw?.toLowerCase?.() === 'vat_marza' || saleDocumentRaw?.toLowerCase?.() === 'vat marża'
      ? 'Faktura VAT marża'
      : saleDocumentRaw?.toLowerCase?.() === 'vat23' || saleDocumentRaw?.toLowerCase?.() === 'vat 23'
      ? 'Faktura VAT 23%'
      : saleDocumentRaw ?? '-';

  const saleDocNormalized =
    saleDocumentRaw?.toLowerCase?.().replace(/\s+/g, '_') ?? undefined;

  const saleDocPccNote =
    saleDocNormalized === 'vat_marza'
      ? {
          text: 'Nie płacisz podatku PCC 2% w urzędzie skarbowym.',
          classes:
            'mt-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-2',
        }
      : saleDocNormalized === 'umowa'
      ? {
          text:
            'Musisz zapłacić podatek PCC 2% w urzędzie skarbowym w ciągu 14 dni od podpisania umowy (formularz PCC-3).',
          classes:
            'mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2',
        }
      : null;

  const importedFrom: string =
    pick<string>(car as any, ['ORIGINS', 'origins', 'Origins', 'origin', 'country', 'kraj'], '-') ??
    '-';

  const registeredText: string =
    pick<string>(
      car as any,
      ['REGISTERED_IN', 'registered_in', 'Registered_In', 'registered', 'zarejestrowany'],
      '-'
    ) ?? '-';

  const images: string[] =
    Array.isArray((car as any).images) && (car as any).images.length > 0
      ? (car as any).images
      : (car as any).main_image_path
      ? [(car as any).main_image_path]
      : [];

  const videoUrl: string | undefined = (car as any).video_url || undefined;
  const description: string | undefined = (car as any).description ?? undefined;
  const equipment: string[] = Array.isArray((car as any).equipment)
    ? (car as any).equipment
    : [];

  // Fakty — kolejność
  const facts = [
    {
      icon: <Cog className="h-5 w-5" />,
      label: 'Poj. silnika',
      value: engineCapacityCcm !== undefined ? `${engineCapacityCcm} cm³` : '-',
      raw: true,
    },
    { icon: <Fuel className="h-5 w-5" />, label: 'Paliwo', value: paliwo ?? '-' },
    {
      icon: <Bolt className="h-5 w-5" />,
      label: 'Moc',
      value: powerKwNum !== undefined ? `${powerKwNum} kW` : '-',
      raw: true,
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      label: 'Przebieg',
      value: mileageNum !== undefined ? `${mileageNum.toLocaleString('pl-PL')} km` : '-',
      raw: true,
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Skrzynia',
      value: (car as any).transmission ?? '-',
    },
    {
      icon: <Move className="h-5 w-5" />,
      label: 'Napęd',
      value: (car as any).drivetrain ?? '-',
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      label: 'Stan techniczny',
      value: (car as any).technicalCondition ?? (car as any).condition ?? '-',
    },
    { icon: <CarFront className="h-5 w-5" />, label: 'Nadwozie', value: nadwozieRaw ?? '-' },
  { icon: <CheckCircle2 className="h-5 w-5" />, label: 'Zarejestrowany', value: registeredText ?? '-' },
    { icon: <Flag className="h-5 w-5" />, label: 'Sprowadzony z', value: importedFrom ?? '-' },
    { icon: <Workflow className="h-5 w-5" />, label: 'Dokument sprzedaży', value: saleDocumentText },
    ];

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Galeria */}
          <div className="lg:col-span-8">
            <Gallery images={images} videoUrl={videoUrl} />
          </div>

          {/* Prawa kolumna */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-4">
              {/* Tytuł / cena */}
              <div className="rounded-2xl border p-5">
                <h1 className="text-2xl font-bold text-zinc-900">{(car as any).title}</h1>
                <p className="text-zinc-600 mt-1">
                  {(car as any).year}
                  {(car as any).engine ? ` • ${(car as any).engine}` : ''}
                </p>
                {(car as any).price_text && (
                  <div className="text-1xl font-semibold mt-4">{(car as any).price_text}</div>
                )}
              </div>

              {/* Fakty */}
              <div className="rounded-2xl border p-5">
                <dl className="space-y-2 text-sm">
                  {facts.map((f) => (
                    <div key={f.label} className="w-full">
                      <div className="flex items-start justify-between gap-4">
                        <dt className="flex items-center gap-2 text-zinc-600">
                          {f.icon}
                          <span>{f.label}</span>
                        </dt>
                        <dd className="font-medium text-zinc-900">
                          {f.raw
                            ? f.value // np. "2000 cm³", "85 kW", "150 000 km" — zostaje jak jest
                            : typeof f.value === 'string'
                            ? f.value.toUpperCase() // reszta pól capslock
                            : f.value}
                        </dd>
                      </div>
                      {f.label === 'Dokument sprzedaży' && saleDocPccNote && (
                        <p className={saleDocPccNote.classes}>{saleDocPccNote.text}</p>
                      )}
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </aside>
        </div>

        {/* Wyposażenie */}
        {equipment.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Wyposażenie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {equipment.map((code, idx) => (
                <div key={idx} className="rounded-xl border p-3">
                  <EquipTile code={code} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informacje dodatkowe */}
        {description && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">Informacje dodatkowe</h2>
            <div className="rounded-2xl border p-5 text-zinc-800 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
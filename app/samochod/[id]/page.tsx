// app/samochod/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Gallery from './Gallery';
import EquipTile from './EquipTile';
import { Gauge, Fuel, Workflow, CarFront, Cog, Bolt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Supabase client (server)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Stała ścieżka do reklamy z katalogu /public
const AD_SRC = '/REKLAMA.jpg';

export default async function CarPage({ params }: { params: { id: string } }) {
  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !car) notFound();

  // Liczby
  const mileageNum =
    typeof (car as any).mileage === 'number'
      ? (car as any).mileage
      : Number((car as any).mileage ?? NaN);

  const engineCapacityCcm =
    typeof (car as any).engineCapacityCcm === 'number'
      ? (car as any).engineCapacityCcm
      : Number((car as any).engine_capacity_ccm ?? NaN);

  const powerKwNum =
    typeof (car as any).powerKw === 'number'
      ? (car as any).powerKw
      : typeof (car as any).power_kw === 'number'
      ? (car as any).power_kw
      : Number((car as any).power_kw ?? NaN);

  // Tekstowe
  const paliwo: string | undefined =
    (car as any).fuelType ?? (car as any).fuel_type ?? (car as any).fueltype;

  const nadwozieRaw: string | undefined =
    (car as any).bodyType ?? (car as any).body_type ?? (car as any).bodytype;

  const saleDocumentRaw: string | undefined =
    (car as any).saleDocument ?? (car as any).sale_document ?? undefined;

  const saleDocumentText =
    saleDocumentRaw === 'umowa'
      ? 'Umowa kupna-sprzedaży'
      : saleDocumentRaw === 'vat_marza'
      ? 'Faktura VAT marża'
      : saleDocumentRaw === 'vat23'
      ? 'Faktura VAT 23%'
      : saleDocumentRaw ?? undefined;

  // Obrazy / wideo / opis / wyposażenie
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

  // Fakty do „po prawej”
  const facts = [
    {
      icon: <Gauge className="h-5 w-5" />,
      label: 'Przebieg',
      value: Number.isFinite(mileageNum)
        ? `${mileageNum.toLocaleString('pl-PL')} km`
        : undefined,
    },
    { icon: <Fuel className="h-5 w-5" />, label: 'Paliwo', value: paliwo },
    {
      icon: <CarFront className="h-5 w-5" />,
      label: 'Nadwozie',
      value: nadwozieRaw,
    },
    {
      icon: <Cog className="h-5 w-5" />,
      label: 'Poj. silnika',
      value: Number.isFinite(engineCapacityCcm)
        ? `${engineCapacityCcm} cm³`
        : undefined,
    },
    {
      icon: <Bolt className="h-5 w-5" />,
      label: 'Moc',
      value: Number.isFinite(powerKwNum) ? `${powerKwNum} kW` : undefined,
    },
    {
      icon: <Workflow className="h-5 w-5" />,
      label: 'Dokument sprzedaży',
      value: saleDocumentText,
    },
  ].filter((f) => !!f.value);

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
                <h1 className="text-2xl font-bold text-zinc-900">
                  {(car as any).title}
                </h1>
                <p className="text-zinc-600 mt-1">
                  {(car as any).year}
                  {(car as any).engine ? ` • ${(car as any).engine}` : ''}
                </p>
                {(car as any).price_text && (
                  <div className="text-1xl font-semibold mt-4">
                    {(car as any).price_text}
                  </div>
                )}
              </div>

              {/* Pochodzenie / rejestracja / dokument – fakty */}
              {facts.length > 0 && (
                <div className="rounded-2xl border p-5">
                  <dl className="space-y-2 text-sm">
                    {facts.map((f) => (
                      <div
                        key={f.label}
                        className="flex items-start justify-between gap-4"
                      >
                        <dt className="flex items-center gap-2 text-zinc-600">
                          {f.icon}
                          <span>{f.label}</span>
                        </dt>
                        <dd className="font-medium text-zinc-900">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* REKLAMA – proporcje jak w galerii */}
              <div className="rounded-2xl border overflow-hidden aspect-[16/9]">
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url('${AD_SRC}')` }}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Wyposażenie */}
        {equipment.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Wyposażenie
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {equipment.map((code, idx) => (
                <div key={idx} className="rounded-xl border p-3">
                  <EquipTile code={code} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informacje dodatkowe (poniżej wyposażenia) */}
        {description && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Informacje dodatkowe
            </h2>
            <div className="rounded-2xl border p-5 text-zinc-800 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

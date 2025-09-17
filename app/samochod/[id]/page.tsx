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
const AD_SRC = '/REKLAMA.JPG';

export default async function CarPage({ params }: { params: { id: string } }) {
  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !car) notFound();

  // --- liczby / normalizacja ---
  const mileageNum =
    typeof car.mileage === 'number' ? car.mileage : Number(car.mileage ?? NaN);

  const engineCcmNum =
    typeof (car as any).engineCapacityCcm === 'number'
      ? (car as any).engineCapacityCcm
      : typeof (car as any).engine_capacity_ccm === 'number'
      ? (car as any).engine_capacity_ccm
      : Number((car as any).engine_capacity_ccm ?? NaN);

  const powerKwNum =
    typeof (car as any).powerKw === 'number'
      ? (car as any).powerKw
      : typeof (car as any).power_kw === 'number'
      ? (car as any).power_kw
      : Number((car as any).power_kw ?? NaN);

  const paliwo: string | undefined =
    (car as any).fuelType ?? (car as any).fuel_type ?? (car as any).fueltype;

  const nadwozieRaw: string | undefined =
    (car as any).bodyType ?? (car as any).body_type ?? (car as any).bodytype;

  const facts = [
    {
      icon: <Gauge className="h-5 w-5" />,
      label: 'Przebieg',
      value: Number.isFinite(mileageNum)
        ? `${mileageNum.toLocaleString('pl-PL')} km`
        : undefined,
    },
    { icon: <Fuel className="h-5 w-5" />, label: 'Paliwo', value: paliwo },
    { icon: <Workflow className="h-5 w-5" />, label: 'Skrzynia', value: (car as any).transmission },
    {
      icon: <CarFront className="h-5 w-5" />,
      label: 'Nadwozie',
      value: nadwozieRaw ? nadwozieRaw.toUpperCase() : undefined,
    },
    {
      icon: <Cog className="h-5 w-5" />,
      label: 'Pojemność',
      value: Number.isFinite(engineCcmNum)
        ? `${engineCcmNum.toLocaleString('pl-PL')} ccm`
        : undefined,
    },
    {
      icon: <Bolt className="h-5 w-5" />,
      label: 'Moc',
      value: Number.isFinite(powerKwNum) ? `${powerKwNum} kW` : undefined,
    },
  ].filter((f) => !!f.value);

  // snake_case vs camelCase
  const registeredInVal =
    (car as any).registeredIn ?? (car as any).registered_in ?? undefined;

  const saleDocumentRaw =
    (car as any).saleDocument ?? (car as any).sale_document ?? undefined;

  const saleDocumentText =
    saleDocumentRaw === 'umowa'
      ? 'Umowa kupna-sprzedaży'
      : saleDocumentRaw === 'vat_marza'
      ? 'Faktura VAT marża'
      : saleDocumentRaw === 'vat23'
      ? 'Faktura VAT 23%'
      : saleDocumentRaw ?? undefined;

  const images: string[] =
    Array.isArray((car as any).images) && (car as any).images.length > 0
      ? (car as any).images
      : (car as any).main_image_path
      ? [(car as any).main_image_path]
      : [];

  const videoUrl: string | undefined = (car as any).video_url || undefined;
  const description: string | undefined = (car as any).description ?? undefined;

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Gallery images={images} videoUrl={videoUrl} />
          </div>

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
                  <div className="text-1xl font-semibold mt-4">
                    {(car as any).price_text}
                  </div>
                )}
              </div>

              {/* Pochodzenie / rejestracja / dokument */}
              <div className="rounded-2xl border p-5">
                <dl className="space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-zinc-600">Pochodzenie</dt>
                    <dd className="text-zinc-900 font-medium">{(car as any).origin ?? '—'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-zinc-600">Zarejestrowany</dt>
                    <dd className="text-zinc-900 font-medium">{registeredInVal ?? '—'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-zinc-600">Dokument sprzedaży</dt>
                    <dd className="text-zinc-900 font-medium">
                      {saleDocumentText ?? '—'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* --- REKLAMA: stały obraz z /public jako tło --- */}
              <div className="rounded-2xl border overflow-hidden h-64 sm:h-72 lg:h-80">
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url('${AD_SRC}')` }}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Najważniejsze */}
        {facts.length > 0 && (
          <section className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {facts.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition"
                >
                  <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                    {f.icon}
                  </div>
                  <div className="text-sm text-zinc-500">{f.label}</div>
                  <div
                    className={
                      f.label === 'Nadwozie'
                        ? 'text-lg font-semibold mt-1 uppercase tracking-wide'
                        : 'text-lg font-semibold mt-1'
                    }
                  >
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Informacje dodatkowe */}
        {description && (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle>Informacje dodatkowe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-zinc max-w-none whitespace-pre-wrap">
                {description}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wyposażenie */}
        {Array.isArray((car as any).equipment) && (car as any).equipment.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Wyposażenie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {(car as any).equipment.map((code: string) => (
                <div
                  key={code}
                  className="flex flex-col items-center justify-center p-4 border border-zinc-200 rounded-xl bg-white text-sm text-zinc-700 hover:shadow-md transition-shadow"
                >
                  <EquipTile code={code} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

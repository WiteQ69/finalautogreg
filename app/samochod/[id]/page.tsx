// app/samochod/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Gallery from './Gallery';
import EquipTile from './EquipTile';
import { Gauge, Fuel, Workflow, CarFront, Cog, Bolt } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CarPage({ params }: { params: { id: string } }) {
  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !car) notFound();

  // --- NORMALIZACJA (camel + snake) ---
const mileageNum =
  typeof car.mileage === 'number' ? car.mileage : Number(car.mileage ?? NaN);
const engineCcmNum =
  typeof car.engineCapacityCcm === 'number'
    ? car.engineCapacityCcm
    : typeof car.engine_capacity_ccm === 'number'
    ? car.engine_capacity_ccm
    : Number(car.engine_capacity_ccm ?? NaN);
const powerKwNum =
  typeof car.powerKw === 'number'
    ? car.powerKw
    : typeof car.power_kw === 'number'
    ? car.power_kw
    : Number(car.power_kw ?? NaN);

// ⬅️ kluczowa zmiana: dołóż fuel_type i body_type
const paliwo = car.fuelType ?? car.fuel_type ?? car.fueltype;
const nadwozieRaw = (car.bodyType ?? car.body_type ?? car.bodytype) as
  | string
  | undefined;

const facts = [
  {
    icon: <Gauge className="h-5 w-5" />,
    label: 'Przebieg',
    value: Number.isFinite(mileageNum)
      ? `${mileageNum.toLocaleString('pl-PL')} km`
      : undefined,
  },
  { icon: <Fuel className="h-5 w-5" />, label: 'Paliwo', value: paliwo },
  { icon: <Workflow className="h-5 w-5" />, label: 'Skrzynia', value: car.transmission },
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

  // Normalizacja pól snake_case vs camelCase
  const registeredInVal = (car as any).registeredIn ?? (car as any).registered_in ?? undefined;
  const saleDocumentRaw = (car as any).saleDocument ?? (car as any).sale_document ?? undefined;
  const saleDocumentText =
    saleDocumentRaw === 'umowa'
      ? 'Umowa kupna-sprzedaży'
      : saleDocumentRaw === 'vat_marza'
      ? 'Faktura VAT marża'
      : saleDocumentRaw === 'vat23'
      ? 'Faktura VAT 23%'
      : saleDocumentRaw ?? undefined;


  const images: string[] =
    Array.isArray(car.images) && car.images.length > 0
      ? car.images
      : car.main_image_path
      ? [car.main_image_path]
      : [];

  const videoUrl: string | undefined = car.video_url || undefined;

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Gallery images={images} videoUrl={videoUrl} />
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-4">
              <div className="rounded-2xl border p-5">
                <h1 className="text-2xl font-bold text-zinc-900">{car.title}</h1>
                <p className="text-zinc-600 mt-1">
                  {car.year}
                  {car.engine ? ` • ${car.engine}` : ''}
                </p>
                {car.price_text && (
                  <div className="text-3xl font-semibold mt-4">
                    {car.price_text}
                  </div>
                )}
              </div>
              <div className="rounded-2xl border p-5">
                <h3 className="text-lg font-semibold mb-3">Najważniejsze</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-zinc-600">Pochodzenie</dt>
                    <dd className="text-zinc-900 font-medium">{car.origin ?? '—'}</dd>
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

            </div>
          </aside>
        </div>

        {/* Najważniejsze */}
        {facts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Najważniejsze</h2>
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

        {/* Wyposażenie */}
        {Array.isArray(car.equipment) && car.equipment.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Wyposażenie</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {car.equipment.map((code: string) => (
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

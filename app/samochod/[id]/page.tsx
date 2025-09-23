// app/samochod/[id]/page.tsx
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Gallery from './Gallery';
import { EquipmentGrid } from "@/components/EquipTile"; // UI (client)
import type { EquipId } from "@/lib/equipment";        // typ ID wyposażenia

import Image from 'next/image';
import {
  Gauge,
  Fuel,
  Workflow,
  CarFront,
  Cog,
  Bolt,
  Flag,
  CheckCircle2,
  ShieldCheck,
  Settings2,
  Navigation,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AD_SRC = '/REKLAMA2.jpg';

/* ---------- helpers ---------- */
function pick<T = any>(
  obj: Record<string, any>,
  keys: string[],
  fallback: T | undefined = undefined
): T | undefined {
  for (const k of keys) {
    if (k in obj) {
      const v = obj[k];
      if (v !== undefined && v !== null && (typeof v === 'string' ? v.trim() !== '' : true)) return v as T;
      if (typeof v === 'boolean' || typeof v === 'number') return v as T;
    }
  }
  return fallback;
}
function num(val: any): number | undefined {
  const n = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(n) ? n : undefined;
}
function boolToTakNie(v: any): string {
  if (typeof v === 'boolean') return v ? 'tak' : 'nie';
  if (typeof v === 'number') return v === 1 ? 'tak' : v === 0 ? 'nie' : '-';
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (['tak', 'yes', 'true', '1', 'y', 't'].includes(s)) return 'tak';
    if (['nie', 'no', 'false', '0', 'n', 'f'].includes(s)) return 'nie';
  }
  return '-';
}
/* ----------------------------- */

export default async function CarPage({ params }: { params: { id: string } }) {
  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !car) notFound();

  // Liczbowe
  const mileageNum = num((car as any).mileage);
  const engineCapacityCcm =
    num((car as any).engineCapacityCcm) ??
    num((car as any).engine_capacity_ccm) ??
    num((car as any).engine_capacity);
  const powerKwNum =
    num((car as any).powerKw) ??
    num((car as any).power_kw);

  // Tekstowe
  const paliwo: string | undefined =
    (car as any).fuelType ?? (car as any).fuel_type;
  const nadwozieRaw: string | undefined =
    (car as any).bodyType ?? (car as any).body_type;

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
    pick<string>(car as any, ['ORIGINS', 'origins', 'Origins', 'origin', 'country', 'kraj'], '-') ?? '-';

  const registeredText: string =
    pick<string>(car as any, ['REGISTERED_IN', 'registered_in', 'Registered_In', 'registered', 'zarejestrowany'], '-') ?? '-';

  // Media / opis / wyposażenie
  const images: string[] =
    Array.isArray((car as any).images) && (car as any).images.length > 0
      ? (car as any).images
      : (car as any).main_image_path
      ? [(car as any).main_image_path]
      : [];

  const videoUrl: string | undefined = (car as any).video_url || undefined;
  const description: string | undefined = (car as any).description ?? undefined;

  // ⬇️ bierzemy tylko poprawne ID wyposażenia
  const equipment: EquipId[] = (Array.isArray((car as any).equipment) ? (car as any).equipment : [])
    .filter(Boolean) as EquipId[];

    
  // Fakty — KOLEJNOŚĆ (zawsze pokazujemy; gdy brak → '-')
const transmission = (car as any).transmission ?? (car as any).gearbox ?? (car as any).skrzynia;
const drivetrain = (car as any).drivetrain ?? (car as any).drive ?? (car as any).naped;
const condition = (car as any).condition ?? (car as any).technical_condition ?? (car as any).stan;
const bodyType = (car as any).bodyType ?? (car as any).body_type ?? nadwozieRaw;

  
  const facts = [
  {
    icon: <Cog className="h-5 w-5" />,
    label: 'Poj. silnika',
    value: engineCapacityCcm !== undefined ? `${engineCapacityCcm} cm³` : '-',
  },
  {
    icon: <Fuel className="h-5 w-5" />,
    label: 'Paliwo',
    value: paliwo ? paliwo.toString().toUpperCase() : '-',
  },
  {
    icon: <Bolt className="h-5 w-5" />,
    label: 'Moc',
    value: powerKwNum !== undefined ? `${powerKwNum} kW` : '-',
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    label: 'Przebieg',
    value: mileageNum !== undefined ? `${mileageNum.toLocaleString('pl-PL')} km` : '-',
  },
  // 5. Skrzynia
  {
    icon: <Settings2 className="h-5 w-5" />,
    label: 'Skrzynia',
    value: transmission ? transmission.toString().toUpperCase() : '-',
  },
  // 6. Napęd
  {
    icon: <Navigation className="h-5 w-5" />,
    label: 'Napęd',
    value: drivetrain ? drivetrain.toString().toUpperCase() : '-',
  },
  // 7. Stan techniczny
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    label: 'Stan techniczny',
    value: condition ? condition.toString().toUpperCase() : '-',
  },
  {
    icon: <CarFront className="h-5 w-5" />,
    label: 'Nadwozie',
    value: bodyType ? bodyType.toString().toUpperCase() : '-',
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    label: 'Zarejestrowany',
    value: registeredText ? registeredText.toString().toUpperCase() : '-',
  },
  {
    icon: <Flag className="h-5 w-5" />,
    label: 'Sprowadzony z',
    value: importedFrom ? importedFrom.toString().toUpperCase() : '-',
  },
  {
    icon: <Workflow className="h-5 w-5" />,
    label: 'Dokument sprzedaży',
    value: saleDocumentText ? saleDocumentText.toString().toUpperCase() : '-',
  },
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
                        <dd className="font-medium text-zinc-900">{f.value}</dd>
                      </div>

                      {/* Podpowiedź PCC bezpośrednio pod „Dokument sprzedaży” */}
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

        {/* Wyposażenie – siatka bez podwójnych ramek */}
        {equipment.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Wyposażenie
            </h2>

            {/* EquipmentGrid sam renderuje kafelki i układa w grid */}
            <EquipmentGrid items={equipment} />
          </section>
        )}

        {/* Informacje dodatkowe */}
        {(car as any).description && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Informacje dodatkowe
            </h2>
            <div className="rounded-2xl border p-5 text-zinc-800 leading-relaxed whitespace-pre-line">
              {(car as any).description}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

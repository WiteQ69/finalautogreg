// app/samochod/[id]/page.tsx
import { notFound } from 'next/navigation';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import Gallery from './Gallery';
import Specs from './Specs';
import EquipTile from './EquipTile';
import {
  Gauge,
  Fuel,
  Workflow,
  CarFront,
  Cog,
  Bolt,
} from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/* ---------------- helpers ---------------- */

async function readCarsFromDisk() {
  const DB_PATH = path.join(process.cwd(), 'data', 'cars.json');
  const SEED_PATH = path.join(process.cwd(), 'public', 'cars.json');

  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const json = JSON.parse(raw);
    if (Array.isArray(json)) return json;
  } catch {}

  try {
    const raw = await fs.readFile(SEED_PATH, 'utf-8');
    const json = JSON.parse(raw);
    if (Array.isArray(json)) return json;
  } catch {}

  return [];
}

/* ---------------- page ---------------- */

export default async function CarPage({ params }: { params: { id: string } }) {
  const all = await readCarsFromDisk();
  const car = all.find((c: any) => String(c?.id) === String(params.id));
  if (!car) notFound();

  const images: string[] =
    Array.isArray(car.images) && car.images.length > 0
      ? car.images
      : car.main_image_path
      ? [car.main_image_path]
      : [];

  const videoUrl: string | undefined = car.video_url || undefined;

  // „Najważniejsze"
  const facts: { icon: JSX.Element; label: string; value?: string }[] = [
    {
      icon: <Gauge className="h-5 w-5" />,
      label: 'Przebieg',
      value: car.mileage
        ? `${typeof car.mileage === 'number' ? car.mileage.toLocaleString('pl-PL') : car.mileage} km`
        : undefined,
    },
    { icon: <Fuel className="h-5 w-5" />, label: 'Paliwo', value: car.fuelType ? String(car.fuelType).replace('_', ' + ') : undefined },
    { icon: <Workflow className="h-5 w-5" />, label: 'Skrzynia', value: car.transmission },
    { icon: <CarFront className="h-5 w-5" />, label: 'Nadwozie', value: car.bodyType ? String(car.bodyType).toUpperCase() : undefined },
    { icon: <Cog className="h-5 w-5" />, label: 'Pojemność', value: car.engineCapacityCcm ? `${car.engineCapacityCcm.toLocaleString('pl-PL')} ccm` : undefined },
    { icon: <Bolt className="h-5 w-5" />, label: 'Moc', value: car.powerKw ? `${car.powerKw} kW` : undefined },
  ].filter((f) => !!f.value);

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Górny układ: galeria + panel oferty */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Galeria */}
          <div className="lg:col-span-8">
            <Gallery images={images} videoUrl={videoUrl} />
          </div>

          {/* Panel po prawej */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-4">
              <div className="rounded-2xl border p-5">
                <h1 className="text-2xl font-bold text-zinc-900">{car.title}</h1>
                <p className="text-zinc-600 mt-1">
                  {car.year}
                  {car.engine ? ` • ${car.engine}` : ''}
                </p>

                {car.price_text && (
                  <div className="text-3xl font-semibold mt-4">{car.price_text}</div>
                )}

                {car.status === 'sold' && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">
                    ✅ Sprzedane
                  </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button className="rounded-lg bg-zinc-900 text-white py-2.5 font-medium">
                    Napisz
                  </button>
                  <button className="rounded-lg border py-2.5 font-medium">
                    Wyświetl numer
                  </button>
                </div>
              </div>

              {(car.origin || car.registeredIn || car.firstOwner) && (
                <div className="rounded-2xl border p-5 text-sm text-zinc-700 space-y-1">
                  {car.origin && (
                    <div>
                      <span className="text-zinc-500">Pochodzenie: </span>
                      {car.origin}
                    </div>
                  )}
                  {car.registeredIn && (
                    <div>
                      <span className="text-zinc-500">Zarejestrowany: </span>
                      {car.registeredIn}
                    </div>
                  )}
                  {typeof car.firstOwner === 'boolean' && (
                    <div>
                      <span className="text-zinc-500">Pierwszy właściciel: </span>
                      {car.firstOwner ? 'Tak' : 'Nie'}
                    </div>
                  )}
                  {car.saleDocument && (
                    <div>
                      <span className="text-zinc-500">Dokument sprzedaży: </span>
                      {car.saleDocument === 'umowa'
                        ? 'Umowa kupna-sprzedaży'
                        : car.saleDocument === 'vat_marza'
                        ? 'Faktura VAT marża'
                        : car.saleDocument === 'vat23'
                        ? 'Faktura VAT 23%'
                        : ''}
                    </div>
                  )}
                </div>
              )}
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
                  <div className="text-lg font-semibold mt-1">{f.value}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Opis */}
        {car.description && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Opis</h2>
            <p className="text-zinc-700 whitespace-pre-line">{car.description}</p>
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

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  carFormSchema,
  type CarFormData,
  FUEL_TYPES,
  TRANSMISSIONS,
  DRIVETRAINS,
  BODY_TYPES,
  CONDITIONS,
  ORIGINS,
  REGISTERED_IN,
  SALE_DOCS,
  EQUIPMENT_LIST,
} from '@/lib/schemas';

/** ---------- helpery ---------- */
function s(v: any): string | undefined {
  return typeof v === 'string' && v.trim() !== '' ? v : undefined;
}
function n(v: any): number | undefined {
  const num = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(num) ? num : undefined;
}
function pick<T = any>(obj: Record<string, any>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (k in obj) {
      const v = obj[k];
      if (v === 0 || v === false) return v as T;
      if (v !== undefined && v !== null && (typeof v !== 'string' || v.trim() !== '')) return v as T;
    }
  }
  return undefined;
}
function norm<T extends readonly string[]>(
  v: any,
  allowed: T,
  aliases: Record<string, T[number]> = {}
): T[number] | undefined {
  if (!v) return undefined;
  const raw = String(v).trim();
  const al = aliases[raw.toLowerCase()];
  if (al) return al;
  const exact = (allowed as readonly string[]).find((x) => x === raw) as T[number] | undefined;
  if (exact) return exact;
  const ci = (allowed as readonly string[]).find((x) => x.toLowerCase() === raw.toLowerCase());
  return (ci as T[number]) ?? undefined;
}

const fuelAliases: Record<string, (typeof FUEL_TYPES)[number]> = {
  benzyna: 'Benzyna',
  diesel: 'Diesel',
  'benzyna+lpg': 'Benzyna_LPG',
  lpg: 'Benzyna_LPG',
  hybryda: 'Hybryda',
  phev: 'Hybryda_PHEV',
  'hybryda_phev': 'Hybryda_PHEV',
  elektryczny: 'Elektryczny',
};
const transmissionAliases: Record<string, (typeof TRANSMISSIONS)[number]> = {
  manualna: 'Manualna',
  automat: 'Automatyczna',
  automatyczna: 'Automatyczna',
  'pol-automat': 'Półautomatyczna',
  'półautomatyczna': 'Półautomatyczna',
};
const drivetrainAliases: Record<string, (typeof DRIVETRAINS)[number]> = {
  fwd: 'FWD',
  przod: 'FWD',
  'przód': 'FWD',
  rwd: 'RWD',
  tyl: 'RWD',
  'tył': 'RWD',
  awd: 'AWD',
  '4x4': '4x4',
};
const bodyAliases: Record<string, (typeof BODY_TYPES)[number]> = {
  sedan: 'sedan',
  hatchback: 'hatchback',
  kombi: 'kombi',
  suv: 'suv',
  coupe: 'coupe',
  kabriolet: 'kabriolet',
  minivan: 'minivan',
  pickup: 'pickup',
};
const conditionAliases: Record<string, (typeof CONDITIONS)[number]> = {
  'bardzo dobry': 'bardzo dobry',
  dobry: 'dobry',
  'do naprawy': 'do naprawy',
  uszkodzony: 'uszkodzony',
  nowy: 'nowy',
  'używany': 'używany',
  'uzywany': 'używany',
};
/** ----------------------------- */

type PageProps = {
  params: { id: string };
  // jeżeli wcześniej pobierasz auto jako props, zostaw – można też tutaj dociągnąć fetch
};

export default function EditCarPage({ params }: PageProps) {
  const router = useRouter();

  // 🔽 Tu załaduj swoje auto – dopasuj do tego jak je pobierasz (Supabase/API/route handler)
  const [car, setCar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // PRZYKŁAD – jeśli masz endpoint /api/cars/[id]
      const res = await fetch(`/api/cars?id=${encodeURIComponent(params.id)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCar(data || null);
      } else {
        setCar(null);
      }
      setLoading(false);
    })();
  }, [params.id]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: car
      ? {
          title: s(car.title) ?? `${car.brand ?? ''} ${car.model ?? ''} ${car.year ?? ''}`.trim(),
          brand: s(car.brand),
          model: s(car.model),
          year: n(car.year) ?? 0,
          engine: s(car.engine) ?? '',
          price: n(car.price),
          price_text: s(car.price_text),

          mileage: n(car.mileage) ?? 0,
          fuelType: norm(car.fuelType ?? car.fuel_type, FUEL_TYPES, fuelAliases),
          transmission: norm(car.transmission, TRANSMISSIONS, transmissionAliases),
          drivetrain: norm(car.drivetrain, DRIVETRAINS, drivetrainAliases),
          bodyType: norm(car.bodyType ?? car.body_type, BODY_TYPES, bodyAliases),

          engineCapacityCcm: n(pick(car, 'engineCapacityCcm', 'engine_capacity_ccm')),
          powerKw: n(pick(car, 'powerKw', 'power_kw')),

          color: s(car.color),
          doors: n(car.doors),
          seats: n(car.seats),
          condition: norm(car.technicalCondition ?? car.condition, CONDITIONS, conditionAliases),

          origin: s(pick(car, 'origin', 'country', 'kraj')),
          registeredIn: s(pick(car, 'registeredIn', 'registered', 'zarejestrowany')),
          saleDocument: s(pick(car, 'saleDocument', 'sale_document)) as any,

          description: s(car.description),

          firstOwner: Boolean(car.firstOwner),

          equipment: Array.isArray(car.equipment) ? car.equipment : [],
        }
      : undefined,
  });

  const saleDoc = watch('saleDocument');
  const equipment = watch('equipment') ?? [];

  async function onSubmit(data: CarFormData) {
    try {
      const payload = {
        ...car,
        title: data.title,
        brand: data.brand,
        model: data.model,
        year: data.year,
        engine: data.engine,

        price: data.price,
        price_text: data.price_text,

        mileage: data.mileage,
        fuelType: data.fuelType,
        transmission: data.transmission,
        drivetrain: data.drivetrain,
        bodyType: data.bodyType,

        engineCapacityCcm: data.engineCapacityCcm,
        powerKw: data.powerKw,

        color: data.color,
        doors: data.doors,
        seats: data.seats,
        condition: data.condition,

        origin: data.origin,
        registeredIn: data.registeredIn,
        saleDocument: data.saleDocument,

        description: data.description,
        firstOwner: data.firstOwner,

        equipment: data.equipment ?? [],
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('API PUT /api/cars failed');
      router.push('/admin/cars');
    } catch (e) {
      console.error(e);
      alert('Nie udało się zapisać zmian.');
    }
  }

  if (loading) {
    return <div className="p-8">Ładowanie…</div>;
  }
  if (!car) {
    return (
      <div className="p-8">
        <p>Nie znaleziono auta.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/cars">Wróć do listy</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/cars">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Lista samochodów
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Edytuj samochód</h1>
          <p className="text-xl text-zinc-600">Zmieniaj dane, dodawaj zdjęcia i (opcjonalnie) wideo</p>
        </motion.div>

        <Card>
          <CardHeader><CardTitle>Informacje o samochodzie</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* PODSTAWOWE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <Label htmlFor="title">Tytuł *</Label>
                  <Input id="title" {...register('title')} />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor="brand">Marka</Label>
                  <Input id="brand" {...register('brand')} />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" {...register('model')} />
                </div>

                <div>
                  <Label htmlFor="year">Rok produkcji *</Label>
                  <Input id="year" type="number" {...register('year', { valueAsNumber: true })} />
                  {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>}
                </div>

                <div>
                  <Label htmlFor="mileage">Przebieg (km) *</Label>
                  <Input id="mileage" type="number" {...register('mileage', { valueAsNumber: true })} />
                  {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage.message}</p>}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="engine">Opis silnika *</Label>
                  <Input id="engine" {...register('engine')} />
                  {errors.engine && <p className="text-sm text-red-500 mt-1">{errors.engine.message}</p>}
                </div>
              </div>

              {/* PARAMETRY */}
              <div>
                <h3 className="font-semibold text-zinc-900 mb-3">Parametry</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Typ paliwa</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('fuelType')}>
                      <option value="">— wybierz —</option>
                      {FUEL_TYPES.map((v) => (
                        <option key={v} value={v}>{v.replace('_',' + ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Skrzynia biegów</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('transmission')}>
                      <option value="">— wybierz —</option>
                      {TRANSMISSIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Napęd</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('drivetrain')}>
                      <option value="">— wybierz —</option>
                      {DRIVETRAINS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Typ nadwozia</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('bodyType')}>
                      <option value="">— wybierz —</option>
                      {BODY_TYPES.map((v) => <option key={v} value={v}>{v.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="engineCapacityCcm">Pojemność (ccm)</Label>
                    <Input id="engineCapacityCcm" type="number" {...register('engineCapacityCcm', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="powerKw">Moc (kW)</Label>
                    <Input id="powerKw" type="number" {...register('powerKw', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="color">Kolor</Label>
                    <Input id="color" {...register('color')} />
                  </div>
                  <div>
                    <Label htmlFor="doors">Drzwi</Label>
                    <Input id="doors" type="number" {...register('doors', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="seats">Miejsca</Label>
                    <Input id="seats" type="number" {...register('seats', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label>Stan techniczny</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('condition')}>
                      <option value="">— wybierz —</option>
                      {CONDITIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Kraj pochodzenia</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('origin')}>
                      <option value="">— wybierz —</option>
                      {ORIGINS.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Zarejestrowany</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('registeredIn')}>
                      <option value="">— wybierz —</option>
                      {REGISTERED_IN.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <Label>Dokument sprzedaży</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('saleDocument')}>
                      <option value="">— wybierz —</option>
                      {SALE_DOCS.map((v) => (
                        <option key={v} value={v}>
                          {v === 'umowa' ? 'Umowa kupna-sprzedaży' : v === 'vat_marza' ? 'Faktura VAT marża' : 'Faktura VAT 23%'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* CENA / OPIS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="price">Cena (liczba)</Label>
                  <Input id="price" type="number" {...register('price', { valueAsNumber: true })} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="price_text">Cena / opis ceny</Label>
                  <Input id="price_text" {...register('price_text')} />
                </div>
              </div>

              {/* WYPOSAŻENIE */}
              <div>
                <h3 className="font-semibold text-zinc-900 mb-3">Wyposażenie</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {EQUIPMENT_LIST.map((item) => {
                    const checked = equipment.includes(item.key);
                    return (
                      <label key={item.key} className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => {
                            const next = new Set(equipment);
                            c ? next.add(item.key) : next.delete(item.key);
                            setValue('equipment', Array.from(next), { shouldDirty: true });
                          }}
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* OPIS */}
              <div>
                <Label htmlFor="description">Opis</Label>
                <Input id="description" {...register('description')} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1 bg-zinc-900 hover:bg-zinc-800">
                  <Save className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
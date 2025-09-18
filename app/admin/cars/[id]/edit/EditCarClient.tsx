'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Trash2, CheckCircle2, Undo2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import SoldBadgeToggle from '@/components/admin/SoldBadgeToggle';

import { useCarStore } from '@/store/car-store';
import {
  carFormSchema,
  CarFormData,
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

type Props = { id: string };

export default function EditCarClient({ id }: Props) {
  const router = useRouter();
  const { cars, setCars, updateCar, deleteCar } = useCarStore();

  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDeleteImage(url: string) {
    try {
      setDeleting(url);
      // 1) delete from storage
      await fetch('/api/upload/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      // 2) remove from car.images in DB
      const next = (Array.isArray(car.images) ? car.images : []).filter((u: string) => u !== url);
      await updateCar(id, { images: next } as any);
      // mutate local state too
      (car as any).images = next;
    } catch (e) {
      alert('Nie udało się usunąć zdjęcia');
    } finally {
      setDeleting(null);
    }
  }
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

 // helpers (camel/snake + normalizacja + zawężanie unionów)
const pick = (obj: any, camel: string, snake: string) =>
  obj?.[camel] ?? obj?.[snake] ?? undefined;
const n = (v: any) => (v === '' || v == null ? undefined : Number(v));
const s = (v: any) => (v == null ? undefined : String(v));
const b = (v: any) =>
  typeof v === 'boolean' ? v : v == null ? undefined : Boolean(v);
const fromList = <T extends readonly string[]>(list: T, v: any): T[number] | undefined => {
  const val = s(v);
  return val && (list as readonly string[]).includes(val) ? (val as T[number]) : undefined;
};


  const clean = (obj: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    out[k] = v;
  }
  return out;
};

  // ===== Wczytanie listy aut do store =====
  useEffect(() => {
    const load = async () => {
      try {
        if (!cars || cars.length === 0) {
          const res = await fetch('/api/cars', { cache: 'no-store' });
          if (res.ok) setCars(await res.json());
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCars]);

  // znajdź auto (as any, bo ma camel + snake z Supabase)
  const car: any = cars.find((c) => String(c.id) === String(id));

  // istniejące zdjęcia
  useEffect(() => {
    if (car) setExistingImages(Array.isArray(car.images) ? car.images : []);
  }, [car]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: { firstOwner: false, equipment: [] },
  });

  const saleDoc = watch('saleDocument');
  const equipment = watch('equipment') ?? [];

  const handleRemoveImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ===== ZAŁADOWANIE WARTOŚCI DO FORMULARZA (camel lub snake) =====
  useEffect(() => {
    if (!car) return;

   reset({
  title: s(car.title) ?? '',
  brand: s(car.brand) ?? '',
  model: s(car.model) ?? '',
  year: n(pick(car, 'year', 'year')),
  mileage: n(pick(car, 'mileage', 'mileage')),
  engine: s(car.engine) ?? '',
description: s(car.description),

  engineCapacityCcm: n(pick(car, 'engineCapacityCcm', 'engine_capacity_ccm')),
  powerKw:           n(pick(car, 'powerKw', 'power_kw')),

  // ⬇⬇ KLUCZOWE – zawężanie do unionów:
  fuelType:     fromList(FUEL_TYPES,     pick(car, 'fuelType', 'fuel_type')),
  transmission: fromList(TRANSMISSIONS,  car.transmission),
  drivetrain:   fromList(DRIVETRAINS,    car.drivetrain),
  bodyType:     fromList(BODY_TYPES,     pick(car, 'bodyType', 'body_type')),
  condition:    fromList(CONDITIONS,     car.condition),
  origin:       fromList(ORIGINS,        car.origin),
  registeredIn: fromList(REGISTERED_IN,  pick(car, 'registeredIn', 'registered_in')),
  saleDocument: fromList(SALE_DOCS,      pick(car, 'saleDocument', 'sale_document')),

  color:  s(car.color),
  doors:  n(car.doors),
  seats:  n(car.seats),

  price_text: s(car.price_text),
  firstOwner: b(pick(car, 'firstOwner', 'first_owner')),
  equipment: Array.isArray(car.equipment) ? car.equipment : [],
});

  }, [car, reset]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-200 rounded mb-8 max-w-md"></div>
            <div className="bg-zinc-200 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-zinc-50 p-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Samochód nie znaleziony</h1>
          <p className="text-zinc-600 mb-6">
            ID: <code>{id}</code>
          </p>
          <Button asChild>
            <Link href="/admin/cars">Powrót do listy</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function uploadFiles(files: File[]) {
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      urls.push(data.url);
    }
    return urls;
  }

  // ===== ZAPIS =====
  const onSubmit = async (data: CarFormData) => {
    try {
      let newImages: string[] = [];
      if (imageFiles.length > 0) newImages = await uploadFiles(imageFiles);

      let videoUrl: string | undefined = car.video_url;
      if (videoFile) {
        const [url] = await uploadFiles([videoFile]);
        videoUrl = url;
      }

      // nie rozlewamy ...car; wysyłamy tylko czysty patch
      const patch = clean({
        title: data.title,
        brand: data.brand,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        engine: data.engine,
description: data.description,

        engineCapacityCcm: data.engineCapacityCcm,
        powerKw: data.powerKw,
        fuelType: data.fuelType,
        transmission: data.transmission,
        drivetrain: data.drivetrain,
        bodyType: data.bodyType,
        color: data.color,
        doors: data.doors,
        seats: data.seats,
        condition: data.condition,
        origin: data.origin,
        registeredIn: data.registeredIn,
        saleDocument: data.saleDocument,

        price_text: data.price_text,
        firstOwner: data.firstOwner,
        equipment: data.equipment ?? [],

        images: [...existingImages, ...newImages],
        video_url: videoUrl,
        main_image_path:
          (Array.isArray(car.images) && car.images[0]) ||
          newImages[0] ||
          car.main_image_path,

        updatedAt: new Date().toISOString(),
      });

      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error('API PUT failed');
      const saved = await res.json();
      updateCar(id, saved);
      router.push('/admin/cars');
    } catch (e) {
      console.error(e);
      alert('Nie udało się zapisać zmian.');
    }
  };

  // ===== Akcje dodatkowe =====
  const markAsSold = async () => {
    if (!confirm('Oznaczyć ten samochód jako SPRZEDANY?')) return;
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sold' }),
      });
      if (!res.ok) throw new Error('API PUT failed');
      const saved = await res.json();
      updateCar(id, saved);
      router.push('/admin/cars');
    } catch (e) {
      console.error(e);
      alert('Operacja nie powiodła się.');
    }
  };

  const undoSold = async () => {
    if (!confirm('Przywrócić status AKTYWNY?')) return;
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      if (!res.ok) throw new Error('API PUT failed');
      const saved = await res.json();
      updateCar(id, saved);
      router.push('/admin/cars');
    } catch (e) {
      console.error(e);
      alert('Operacja nie powiodła się.');
    }
  };

  const removeCar = async () => {
    if (!confirm('Na pewno usunąć to ogłoszenie?')) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API DELETE failed');
      deleteCar(id);
      router.push('/admin/cars');
    } catch (e) {
      console.error(e);
      alert('Usuwanie nie powiodło się.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/cars">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Lista samochodów
              </Link>
            </Button>

            <div className="flex-1" />

            <Button variant="secondary" size="sm" onClick={markAsSold}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Oznacz jako sprzedany
            </Button>
            <Button variant="secondary" size="sm" onClick={undoSold}>
              <Undo2 className="h-4 w-4 mr-2" />
              Przywróć aktywny
            </Button>
            <Button variant="destructive" size="sm" onClick={removeCar}>
              <Trash2 className="h-4 w-4 mr-2" />
              Usuń
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Edytuj samochód</h1>
          <p className="text-xl text-zinc-600">Zmień szczegóły, dodaj zdjęcia lub wideo</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Edytuj informacje</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* PODSTAWOWE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <Label htmlFor="title">Tytuł *</Label>
                  <Input id="title" placeholder="np. BMW X3 xDrive20d M Sport" {...register('title')} />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor="brand">Marka</Label>
                  <Input id="brand" placeholder="np. BMW" {...register('brand')} />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="np. X3" {...register('model')} />
                </div>

                <div>
                  <Label htmlFor="year">Rok produkcji *</Label>
                  <Input id="year" type="number" min="1950" max="2050" placeholder="2020" {...register('year', { valueAsNumber: true })} />
                  {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>}
                </div>

                <div>
                  <Label htmlFor="mileage">Przebieg (km) *</Label>
                  <Input id="mileage" type="number" min="0" placeholder="50000" {...register('mileage', { valueAsNumber: true })} />
                  {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage.message}</p>}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="engine">Opis silnika *</Label>
                  <Input id="engine" placeholder="np. 2.0 TDI 190 KM" {...register('engine')} />
                  {errors.engine && <p className="text-sm text-red-500 mt-1">{errors.engine.message}</p>}
                </div>
              </div>

              {/* PARAMETRY TECHNICZNE */}
              <div>
                <h3 className="font-semibold text-zinc-900 mb-3">Parametry techniczne</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="engineCapacityCcm">Pojemność silnika (ccm)</Label>
                    <Input id="engineCapacityCcm" type="number" placeholder="1995" {...register('engineCapacityCcm', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="powerKw">Moc silnika (kW)</Label>
                    <Input id="powerKw" type="number" placeholder="140" {...register('powerKw', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label>Typ paliwa</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('fuelType')}>
                      <option value="">— wybierz —</option>
                      {FUEL_TYPES.map((v) => (
                        <option key={v} value={v}>
                          {v.replace('_', ' + ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Skrzynia biegów</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('transmission')}>
                      <option value="">— wybierz —</option>
                      {TRANSMISSIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Napęd</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('drivetrain')}>
                      <option value="">— wybierz —</option>
                      {DRIVETRAINS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Typ nadwozia</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('bodyType')}>
                      <option value="">— wybierz —</option>
                      {BODY_TYPES.map((v) => (
                        <option key={v} value={v}>
                          {v.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="color">Kolor</Label>
                    <Input id="color" placeholder="np. Czarny metalik" {...register('color')} />
                  </div>
                  <div>
                    <Label htmlFor="doors">Liczba drzwi</Label>
                    <Input id="doors" type="number" min={2} max={6} placeholder="5" {...register('doors', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="seats">Liczba miejsc</Label>
                    <Input id="seats" type="number" min={2} max={9} placeholder="5" {...register('seats', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label>Stan techniczny</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('condition')}>
                      <option value="">— wybierz —</option>
                      {CONDITIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Kraj pochodzenia</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('origin')}>
                      <option value="">— wybierz —</option>
                      {ORIGINS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Zarejestrowany</Label>
                    <select className="w-full rounded-md border px-3 py-2" {...register('registeredIn')}>
                      <option value="">— wybierz —</option>
                      {REGISTERED_IN.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
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
                    {saleDoc === 'vat_marza' && (
                      <p className="mt-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-2">
                        Nie płacisz podatku PCC 2% w urzędzie skarbowym.
                      </p>
                    )}
                    {saleDoc === 'umowa' && (
                      <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                        Musisz zapłacić podatek PCC 2% w urzędzie skarbowym w ciągu 14 dni od podpisania umowy (formularz PCC-3).
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* CENA  */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="price_text">Cena / opis ceny</Label>
                  <Input id="price_text" placeholder="np. 189 000 PLN lub 'Cena do uzgodnienia'" {...register('price_text')} />
                </div>
              </div>

              {/* STEMPL „SPRZEDANY” – ręczny przełącznik */}
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-zinc-900 mb-2">Nakładka „SPRZEDANY” na zdjęciu</h3>
                <SoldBadgeToggle
                  carId={String(car.id)}
                  initial={!!car.sold_badge}
                  onChanged={(val) => {
                    try {
                      updateCar(id, { sold_badge: val } as any);
                    } catch {}
                  }}
                />
              </div>

              {/* Aktualne zdjęcia */}
              {Array.isArray(car.images) && car.images.length > 0 && (
                <div>
                  <Label>Aktualne zdjęcia</Label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.images.map((src: string, i: number) => (
  <div key={i} className="relative group">
    <img src={src} alt={`img-${i}`} className="rounded-lg border object-cover w-full h-32" />
    <button
      type="button"
      onClick={() => handleDeleteImage(src)}
      disabled={deleting === src}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white text-xs px-2 py-1 rounded"
      title="Usuń zdjęcie"
    >
      {deleting === src ? '...' : 'Usuń'}
    </button>
  </div>
))}
                  </div>
                </div>
              )}

              {/* ZDJĘCIA + WIDEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Dodaj zdjęcia (opcjonalnie)</Label>
                  <Input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))} />
                  {imageFiles.length > 0 && <p className="text-sm text-zinc-500 mt-1">{imageFiles.length} plików wybrano</p>}
                </div>
                <div>
                  <Label>Wideo (opcjonalnie)</Label>
                  <Input type="file" accept="video/*" onChange={(e) => setVideoFile((e.target.files && e.target.files[0]) || null)} />
                  {videoFile && <p className="text-sm text-zinc-500 mt-1">{videoFile.name}</p>}
                </div>
              </div>
{/* DODATKOWA INFORMACJA */}
<div>
  <h3 className="font-semibold text-zinc-900 mb-3">Krótka notatka</h3>
  <Label htmlFor="description">Własny tekst (opcjonalnie)</Label>
  <Textarea
    id="description"
    rows={4}
    placeholder="Świeżo po wymianie oleju, mega okazja, itp."
    {...register('description')}
  />
  <p className="text-xs text-zinc-500 mt-1">
    Ten tekst pojawi się w opisie auta.
  </p>
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

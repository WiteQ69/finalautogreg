'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';

import EquipmentField from '@/components/admin/EquipmentField';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useCarStore } from '@/store/car-store';
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
} from '@/lib/schemas';

export default function NewCarPage() {
  const router = useRouter();
  const { addCar } = useCarStore();

  const methods = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      firstOwner: false,
      equipment: [],
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = methods;

  const saleDoc = watch('saleDocument');

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  async function uploadFiles(files: File[]) {
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file); // klucz MUSI być 'file'
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      urls.push(data.url);
    }
    return urls;
  }

  const onSubmit = async (data: CarFormData) => {
    try {
      // uploady
      const imageUrls = imageFiles.length ? await uploadFiles(imageFiles) : [];
      let videoUrl: string | undefined = undefined;
      if (videoFile) {
        const [url] = await uploadFiles([videoFile]);
        videoUrl = url;
      }

      // nowy rekord auta
      const newCar = {
        id: Date.now().toString(),
        title: data.title,
        brand: data.brand,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        engine: data.engine,

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
        status: 'active' as const,
        firstOwner: data.firstOwner,

        description: (data.description ?? '').trim(),

        main_image_path: imageUrls[0] || '',
        images: imageUrls,
        video_url: videoUrl,

        equipment: data.equipment ?? [],

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        // jeżeli używasz ręcznych nakładek w przyszłości:
        sold_badge: false,
        reserved_badge: false,
      };

      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar),
      });
      if (!res.ok) throw new Error('API POST /api/cars failed');

      const saved = await res.json();
      addCar(saved);

    // --- [NEWSLETTER] powiadom subskrybentów o nowym aucie (bez blokowania UX) ---
try {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const link = saved?.slug ? `${origin}/auta/${saved.slug}` : `${origin}/auta`;

  const r = await fetch(`${origin}/api/newsletter/announce`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newCar.title,
      price_text: newCar.price_text || null,
      imageUrl: newCar.images?.[0] || null,
      link,
    }),
    keepalive: true,
  });

  // tymczasowe logi, żeby zobaczyć co się dzieje
  const txt = await r.text();
  console.log('[announce] status:', r.status, 'body:', txt);
} catch (e) {
  console.warn('Newsletter notify failed (non-blocking):', e);
}
// --- [END NEWSLETTER] ---


      router.push('/admin/cars');
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Nie udało się dodać auta.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/cars">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Lista samochodów
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Dodaj nowy samochód</h1>
          <p className="text-xl text-zinc-600">Uzupełnij szczegóły, dodaj zdjęcia i (opcjonalnie) wideo</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle>Informacje o samochodzie</CardTitle></CardHeader>
            <CardContent>
              <FormProvider {...methods}>
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
                      <Input id="year" type="number" min={1950} max={2050} placeholder="2020" {...register('year', { valueAsNumber: true })} />
                      {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="mileage">Przebieg (km) *</Label>
                      <Input id="mileage" type="number" min={0} placeholder="50000" {...register('mileage', { valueAsNumber: true })} />
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
                          {FUEL_TYPES.map((v) => <option key={v} value={v}>{v.replace('_', ' + ')}</option>)}
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

                  {/* CENA */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="price_text">Cena / opis ceny</Label>
                      <Input id="price_text" placeholder="np. 189 000 PLN lub 'Cena do uzgodnienia'" {...register('price_text')} />
                    </div>
                  </div>

                  {/* ZDJĘCIA + WIDEO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Zdjęcia (możesz wybrać wiele)</Label>
                      <Input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))} />
                      {imageFiles.length > 0 && (
                        <p className="text-sm text-zinc-500 mt-1">{imageFiles.length} plików wybrano</p>
                      )}
                    </div>
                    <div>
                      <Label>Wideo (opcjonalnie)</Label>
                      <Input type="file" accept="video/*" onChange={(e) => setVideoFile((e.target.files && e.target.files[0]) || null)} />
                      {videoFile && <p className="text-sm text-zinc-500 mt-1">{videoFile.name}</p>}
                    </div>
                  </div>

                  {/* WYPOSAŻENIE */}
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-3">Wyposażenie</h3>
                    <EquipmentField />
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

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1 bg-zinc-900 hover:bg-zinc-800">
                      <Save className="h-5 w-5 mr-2" />
                      {isSubmitting ? 'Dodawanie...' : 'Dodaj samochód'}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

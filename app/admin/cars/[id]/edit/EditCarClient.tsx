'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Trash2, CheckCircle2, Undo2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

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

  const car = cars.find((c) => String(c.id) === String(id));

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

  useEffect(() => {
    if (car) {
      reset({
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        mileage: car.mileage,
        engine: car.engine,
        engineCapacityCcm: car.engineCapacityCcm,
        powerKw: car.powerKw,
        fuelType: car.fuelType,
        transmission: car.transmission,
        drivetrain: car.drivetrain,
        bodyType: car.bodyType,
        color: car.color,
        doors: car.doors,
        seats: car.seats,
        condition: car.condition,
        origin: car.origin,
        registeredIn: car.registeredIn,
        saleDocument: car.saleDocument,
        price_text: car.price_text,
        firstOwner: car.firstOwner,
        equipment: car.equipment ?? [],
      });
    }
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
          <p className="text-zinc-600 mb-6">ID: <code>{id}</code></p>
          <Button asChild><Link href="/admin/cars">Powrót do listy</Link></Button>
        </div>
      </div>
    );
  }

  async function uploadFiles(files: File[]) {
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file); // klucz: 'file'
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      urls.push(data.url);
    }
    return urls;
  }

  const onSubmit = async (data: CarFormData) => {
    try {
      let newImages: string[] = [];
      if (imageFiles.length > 0) newImages = await uploadFiles(imageFiles);

      let videoUrl: string | undefined = car.video_url;
      if (videoFile) {
        const [url] = await uploadFiles([videoFile]);
        videoUrl = url;
      }

      const payload: any = {
        ...car,
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
        firstOwner: data.firstOwner,
        equipment: data.equipment ?? [],
        images: [...existingImages, ...newImages],
        video_url: videoUrl,
        main_image_path: (Array.isArray(car.images) && car.images[0]) || newImages[0] || car.main_image_path,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  // akcje dodatkowe
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
          <CardHeader><CardTitle>Edytuj informacje</CardTitle></CardHeader>
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
                      {FUEL_TYPES.map((v) => <option key={v} value={v}>{v.replace('_',' + ')}</option>)}
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
                    <Input id="doors" type="number" min="2" max="6" placeholder="5" {...register('doors', { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="seats">Liczba miejsc</Label>
                    <Input id="seats" type="number" min="2" max="9" placeholder="5" {...register('seats', { valueAsNumber: true })} />
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

              {/* CENA  */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="price_text">Cena / opis ceny</Label>
                  <Input id="price_text" placeholder="np. 189 000 PLN lub 'Cena do uzgodnienia'" {...register('price_text')} />
                </div>
                
              </div>

              {/* Aktualne zdjęcia */}
              {Array.isArray(car.images) && car.images.length > 0 && (
                <div>
                  <Label>Aktualne zdjęcia</Label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.images.map((src, i) => (
                      <img key={i} src={src} alt={`img-${i}`} className="rounded-lg border object-cover w-full h-32" />
                    ))}
                  </div>
                </div>
              )}

              {/* ZDJĘCIA + WIDEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Dodaj zdjęcia (opcjonalnie)</Label>
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

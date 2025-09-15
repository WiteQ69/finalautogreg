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
import { carFormSchema, CarFormData } from '@/lib/schemas';

type Props = { id: string };

export default function EditCarClient({ id }: Props) {
  const router = useRouter();
  const { cars, setCars, updateCar, deleteCar } = useCarStore();
  const [loading, setLoading] = useState(true);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<CarFormData>({ resolver: zodResolver(carFormSchema) });

  useEffect(() => {
    if (car) {
      reset({
        title: car.title,
        year: car.year,
        mileage: car.mileage,
        engine: car.engine,
        price_text: car.price_text,
        firstOwner: car.firstOwner,
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
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const { urls } = await res.json();
    return urls as string[];
  }

  // zapis formularza -> API + store
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
        ...data,
        images: Array.isArray(car.images) ? [...car.images, ...newImages] : newImages,
        video_url: videoUrl,
        main_image_path:
          (Array.isArray(car.images) && car.images[0]) ||
          newImages[0] ||
          car.main_image_path,
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

  // oznacz jako SPRZEDANE
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
      alert('Nie udało się oznaczyć jako sprzedane.');
    }
  };

  // przywróć do DOSTĘPNYCH
  const restoreToActive = async () => {
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
      alert('Nie udało się przywrócić.');
    }
  };

  // usuwanie
  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć ten samochód?')) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API DELETE failed');
      deleteCar(id);
      router.push('/admin/cars');
    } catch (e) {
      console.error(e);
      alert('Nie udało się usunąć auta.');
    }
  };

  const isSold = car.status === 'sold';

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/cars">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Lista samochodów
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              {!isSold ? (
                <Button variant="secondary" size="sm" onClick={markAsSold}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Oznacz jako sprzedane
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={restoreToActive}>
                  <Undo2 className="h-4 w-4 mr-2" />
                  Przywróć do dostępnych
                </Button>
              )}

              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Usuń
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Edytuj samochód</h1>
            <p className="text-xl text-zinc-600">
              {car.title} {isSold && <span className="ml-2 text-green-600 font-medium">(sprzedane)</span>}
            </p>
          </div>
        </motion.div>

        <Card>
          <CardHeader><CardTitle>Edytuj informacje</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Tytuł *</Label>
                  <Input id="title" placeholder="np. BMW X3 xDrive20d M Sport" {...register('title')} />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label htmlFor="year">Rok produkcji *</Label>
                  <Input id="year" type="number" min="1950" max="2025" {...register('year', { valueAsNumber: true })} />
                  {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>}
                </div>

                <div>
                  <Label htmlFor="mileage">Przebieg (km) *</Label>
                  <Input id="mileage" type="number" min="0" {...register('mileage', { valueAsNumber: true })} />
                  {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage.message}</p>}
                </div>

                <div>
                  <Label htmlFor="engine">Silnik *</Label>
                  <Input id="engine" placeholder="np. 2.0 TDI 190 KM" {...register('engine')} />
                  {errors.engine && <p className="text-sm text-red-500 mt-1">{errors.engine.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="price_text">Cena</Label>
                  <Input id="price_text" placeholder="np. 189 000 PLN" {...register('price_text')} />
                  {errors.price_text && <p className="text-sm text-red-500 mt-1">{errors.price_text.message}</p>}
                </div>

                {/* Istniejące zdjęcia – szybki podgląd */}
                {Array.isArray(car.images) && car.images.length > 0 && (
                  <div className="md:col-span-2">
                    <Label>Aktualne zdjęcia</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {car.images.map((src: string, i: number) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={src} alt={`img-${i}`} className="h-24 w-full object-cover rounded-lg border" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Dodaj nowe zdjęcia */}
                <div className="md:col-span-2">
                  <Label>Dodaj zdjęcia (opcjonalnie)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                  />
                  {imageFiles.length > 0 && (
                    <p className="text-sm text-zinc-500 mt-1">{imageFiles.length} plików wybrano</p>
                  )}
                </div>

                {/* Dodaj/zmień wideo */}
                <div className="md:col-span-2">
                  <Label>Wideo (opcjonalnie)</Label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile((e.target.files && e.target.files[0]) || null)}
                  />
                  {videoFile && <p className="text-sm text-zinc-500 mt-1">{videoFile.name}</p>}
                  {car.video_url && !videoFile && (
                    <p className="text-sm text-zinc-500 mt-1">Aktualne wideo istnieje – pozostanie bez zmian.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="firstOwner" checked={watch('firstOwner')} onCheckedChange={(c) => setValue('firstOwner', c as boolean)} />
                <Label htmlFor="firstOwner">Pierwszy właściciel</Label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
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

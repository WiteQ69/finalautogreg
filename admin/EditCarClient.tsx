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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // 🔽 trzymamy lokalny stan przełącznika, by na pewno wysłać go przy Save
  const [soldBadge, setSoldBadge] = useState<boolean>(false);

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
    if (car) {
      setExistingImages(Array.isArray(car.images) ? car.images : []);
      setSoldBadge(!!(car as any).sold_badge); // <— inicjalizacja z bazy
    }
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
      fd.append('file', file);
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

      let videoUrl: string | undefined = (car as any).video_url;
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
        main_image_path: (Array.isArray(car.images) && car.images[0]) || newImages[0] || (car as any).main_image_path,
        updatedAt: new Date().toISOString(),
        sold_badge: !!soldBadge, // ⬅️ ZAPISUJEMY PRZEŁĄCZNIK
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
              {/* ...pola formularza bez zmian... */}

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
                <p className="text-sm text-zinc-600 mb-2">Nie zmienia statusu ogłoszenia — tylko wyświetla napis na liście /auta.</p>
                <SoldBadgeToggle
                  carId={String(car.id)}
                  initial={soldBadge}
                  onChanged={(val) => {
                    setSoldBadge(!!val);
                    try { (updateCar as any)(id, { ...car, sold_badge: !!val }); } catch {}
                  }}
                />
              </div>

              {/* ...reszta formularza, zdjęcia, wyposażenie, przycisk zapisz... */}
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
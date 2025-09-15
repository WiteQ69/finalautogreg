'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useCarStore } from '@/store/car-store';
import { carFormSchema } from '@/lib/schemas';
import { CAR_BRANDS, CAR_MODELS, FUEL_TYPES, TRANSMISSIONS, BODY_TYPES, DRIVETRAINS, CAR_COLORS } from '@/lib/constants';
import { mockCars } from '@/data/mock-cars';
import type { CarFormData } from '@/lib/schemas';
import Link from 'next/link';

export default function EditCarPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [images, setImages] = useState<File[]>([]);
  
  const { cars, addCar, updateCar, deleteCar } = useCarStore();

  // Initialize with mock data if empty
  useEffect(() => {
    if (cars.length === 0) {
      mockCars.forEach(car => addCar(car));
    }
  }, [cars.length, addCar]);

  const car = cars.find(c => c.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: car ? {
      title: `${car.brand} ${car.model} ${car.year}`,
      brand: car.brand,
      model: car.model,
      year: car.year,
      engine: car.engine || '',
      price: car.price,
      mileage: car.mileage,
      fuelType: car.fuelType,
      transmission: car.transmission,
      bodyType: car.bodyType,
      drivetrain: car.drivetrain,
      power: car.power,
      displacement: car.displacement,
      color: car.color,
      owners: car.owners,
      accidentFree: car.accidentFree,
      serviceHistory: car.serviceHistory,
      vin: car.vin,
      location: car.location,
      status: car.status,
    } : undefined,
  });

  const watchedBrand = watch('brand');

  useEffect(() => {
    if (car) {
      reset({
        title: `${car.brand} ${car.model} ${car.year}`,
        brand: car.brand,
        model: car.model,
        year: car.year,
        engine: car.engine || '',
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        bodyType: car.bodyType,
        drivetrain: car.drivetrain,
        power: car.power,
        displacement: car.displacement,
        color: car.color,
        owners: car.owners,
        accidentFree: car.accidentFree,
        serviceHistory: car.serviceHistory,
        vin: car.vin,
        location: car.location,
        status: car.status,
      });
    }
  }, [car, reset]);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Oferta nie znaleziona</h1>
          <p className="text-zinc-600 mb-6">Nie można znaleźć tej oferty.</p>
          <Button asChild>
            <Link href="/dashboard">Powrót do panelu</Link>
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CarFormData) => {
    try {
      updateCar(id, {
        ...data,
        images: images.length > 0 
          ? images.map((_, index) => `https://images.pexels.com/photos/${1280560 + index}/pexels-photo-${1280560 + index}.jpeg`)
          : car.images,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  const handleDelete = () => {
    if (confirm('Czy na pewno chcesz usunąć tę ofertę?')) {
      deleteCar(id);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
                Edytuj ofertę
              </h1>
              <p className="text-xl text-zinc-600">
                {car.brand} {car.model} {car.year}
              </p>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="hidden sm:flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Usuń ofertę</span>
            </Button>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Podstawowe informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brand">Marka *</Label>
                  <Select value={watchedBrand} onValueChange={(value) => setValue('brand', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz markę" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAR_BRANDS.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand.message}</p>}
                </div>

                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Select 
                    value={watch('model')}
                    onValueChange={(value) => setValue('model', value)}
                    disabled={!watchedBrand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz model" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchedBrand && CAR_MODELS[watchedBrand]?.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model.message}</p>}
                </div>

                <div>
                  <Label htmlFor="year">Rok produkcji *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1950"
                    max="2025"
                    {...register('year', { valueAsNumber: true })}
                  />
                  {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>}
                </div>

                <div>
                  <Label htmlFor="price">Cena (PLN) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    {...register('price', { valueAsNumber: true })}
                  />
                  {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <Label htmlFor="mileage">Przebieg (km) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    {...register('mileage', { valueAsNumber: true })}
                  />
                  {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage.message}</p>}
                </div>

                <div>
                  <Label htmlFor="location">Lokalizacja *</Label>
                  <Input
                    id="location"
                    placeholder="np. Warszawa, Kraków, Gdańsk"
                    {...register('location')}
                  />
                  {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Zdjęcia samochodu</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload images={images} onImagesChange={setImages} />
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Opis</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Textarea
                  placeholder="Opisz stan techniczny, wyposażenie, historię samochodu..."
                  rows={6}
                  {...register('description')}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800"
            >
              <Save className="h-5 w-5 mr-2" />
              Zapisz zmiany
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="lg"
              onClick={handleDelete}
              className="sm:hidden"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Usuń ofertę
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
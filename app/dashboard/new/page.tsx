'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Eye } from 'lucide-react';
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
import type { CarFormData } from '@/lib/schemas';

export default function NewCarPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const { addCar } = useCarStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      title: '',
      engine: '',
      status: 'draft',
      accidentFree: false,
      serviceHistory: false,
      owners: 1,
    },
  });

  const watchedBrand = watch('brand');

  const onSubmit = async (data: CarFormData) => {
    try {
      const newCar = {
        id: Date.now().toString(),
        ...data,
        status: (data.status ?? 'draft') as 'active' | 'sold' | 'draft',
        images: images.map((_, index) => `https://images.pexels.com/photos/${1280560 + index}/pexels-photo-${1280560 + index}.jpeg`), // Mock URLs
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        favorites: 0,
      };

      addCar(newCar);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  const saveDraft = () => {
    handleSubmit((data) => onSubmit({ ...data, status: 'draft' }))();
  };

  const publish = () => {
    handleSubmit((data) => onSubmit({ ...data, status: 'active' }))();
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
          
          <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
            Dodaj nowe auto
          </h1>
          <p className="text-xl text-zinc-600">
            Wypełnij formularz, aby stworzyć nową ofertę
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(publish)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Podstawowe informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brand">Marka *</Label>
                  <Select onValueChange={(value) => setValue('brand', value)}>
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
                  <Label htmlFor="vin">Numer VIN *</Label>
                  <Input
                    id="vin"
                    maxLength={17}
                    {...register('vin')}
                    placeholder="17-znakowy numer VIN"
                  />
                  {errors.vin && <p className="text-sm text-red-500 mt-1">{errors.vin.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specyfikacja techniczna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fuelType">Rodzaj paliwa *</Label>
                  <Select onValueChange={(value: any) => setValue('fuelType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz paliwo" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((fuel) => (
                        <SelectItem key={fuel.value} value={fuel.value}>
                          {fuel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fuelType && <p className="text-sm text-red-500 mt-1">{errors.fuelType.message}</p>}
                </div>

                <div>
                  <Label htmlFor="transmission">Skrzynia biegów *</Label>
                  <Select onValueChange={(value: any) => setValue('transmission', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz skrzynię" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSMISSIONS.map((trans) => (
                        <SelectItem key={trans.value} value={trans.value}>
                          {trans.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.transmission && <p className="text-sm text-red-500 mt-1">{errors.transmission.message}</p>}
                </div>

                <div>
                  <Label htmlFor="bodyType">Typ nadwozia *</Label>
                  <Select onValueChange={(value: any) => setValue('bodyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz nadwozie" />
                    </SelectTrigger>
                    <SelectContent>
                      {BODY_TYPES.map((body) => (
                        <SelectItem key={body.value} value={body.value}>
                          {body.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bodyType && <p className="text-sm text-red-500 mt-1">{errors.bodyType.message}</p>}
                </div>

                <div>
                  <Label htmlFor="drivetrain">Napęd *</Label>
                  <Select onValueChange={(value: any) => setValue('drivetrain', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz napęd" />
                    </SelectTrigger>
                    <SelectContent>
                      {DRIVETRAINS.map((drive) => (
                        <SelectItem key={drive.value} value={drive.value}>
                          {drive.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.drivetrain && <p className="text-sm text-red-500 mt-1">{errors.drivetrain.message}</p>}
                </div>

                <div>
                  <Label htmlFor="power">Moc (KM) *</Label>
                  <Input
                    id="power"
                    type="number"
                    min="1"
                    {...register('power', { valueAsNumber: true })}
                  />
                  {errors.power && <p className="text-sm text-red-500 mt-1">{errors.power.message}</p>}
                </div>

                <div>
                  <Label htmlFor="displacement">Pojemność (cm³) *</Label>
                  <Input
                    id="displacement"
                    type="number"
                    min="1"
                    {...register('displacement', { valueAsNumber: true })}
                  />
                  {errors.displacement && <p className="text-sm text-red-500 mt-1">{errors.displacement.message}</p>}
                </div>

                <div>
                  <Label htmlFor="color">Kolor *</Label>
                  <Select onValueChange={(value) => setValue('color', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz kolor" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAR_COLORS.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.color && <p className="text-sm text-red-500 mt-1">{errors.color.message}</p>}
                </div>

                <div>
                  <Label htmlFor="owners">Liczba właścicieli *</Label>
                  <Input
                    id="owners"
                    type="number"
                    min="1"
                    max="10"
                    {...register('owners', { valueAsNumber: true })}
                  />
                  {errors.owners && <p className="text-sm text-red-500 mt-1">{errors.owners.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accidentFree"
                    onCheckedChange={(checked) => setValue('accidentFree', checked as boolean)}
                  />
                  <Label htmlFor="accidentFree">Bezwypadkowy</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="serviceHistory"
                    onCheckedChange={(checked) => setValue('serviceHistory', checked as boolean)}
                  />
                  <Label htmlFor="serviceHistory">Serwis ASO</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Description */}
          <Card>
            <CardHeader>
              <CardTitle>Lokalizacja i opis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="location">Lokalizacja *</Label>
                <Input
                  id="location"
                  placeholder="np. Warszawa, Kraków, Gdańsk"
                  {...register('location')}
                />
                {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Opis samochodu *</Label>
                <Textarea
                  id="description"
                  placeholder="Opisz stan techniczny, wyposażenie, historię samochodu... (minimum 50 znaków)"
                  rows={6}
                  {...register('description')}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={saveDraft}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-5 w-5 mr-2" />
              Zapisz szkic
            </Button>
            
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800"
            >
              <Eye className="h-5 w-5 mr-2" />
              Opublikuj ofertę
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  phone: z
    .string()
    .min(7, 'Numer telefonu musi mieć co najmniej 7 cyfr')
    .regex(/^[0-9\s+-]+$/, 'Numer telefonu może zawierać tylko cyfry, spacje, + i -'),
  message: z.string().min(10, 'Wiadomość musi mieć co najmniej 10 znaków'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function KontaktPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log('Dane z formularza kontaktowego:', data);
    setIsSubmitted(true);
    reset();

    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
            Skontaktuj się z nami
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Masz pytania o nasze samochody? Chcesz umówić się na oględziny? Napisz lub zadzwoń do nas!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Formularz kontaktowy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="p-4 rounded-full bg-green-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Wiadomość wysłana!</h3>
                    <p className="text-zinc-600">
                      Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Imię i nazwisko *</Label>
                      <Input
                        id="name"
                        placeholder="Wprowadź swoje imię i nazwisko"
                        {...register('name')}
                        className="mt-1"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Numer telefonu *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="123 456 789"
                        {...register('phone')}
                        className="mt-1"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">Wiadomość *</Label>
                      <Textarea
                        id="message"
                        placeholder="Opisz swoje pytanie lub zainteresowanie..."
                        rows={6}
                        {...register('message')}
                        className="mt-1"
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-zinc-900 hover:bg-zinc-800"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Informacje kontaktowe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-zinc-100">
                    <Phone className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Telefon</p>
                    <p className="text-zinc-600">+48 693 632 068</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-zinc-100">
                    <Mail className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Email</p>
                    <p className="text-zinc-600">autopaczynski@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-zinc-100">
                    <MapPin className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Adres</p>
                    <p className="text-zinc-600">
                      ul. Wenecja 6<br />34-100 Wadowice
                    </p>
                  </div>
                 
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Godziny otwarcia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Poniedziałek - Piątek</span>
                    <span className="font-medium text-zinc-900">06:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Sobota</span>
                    <span className="font-medium text-zinc-900">06:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Niedziela</span>
                    <span className="font-medium text-zinc-900">06:00 - 22:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

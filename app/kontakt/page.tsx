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

  const onSubmit = async (data: ContactFormData) => {
    try {
      const fd = new FormData();
      fd.append('access_key', '9ba5e0d7-4171-47bf-ae8e-b25e32214f30');
      fd.append('subject', `Nowa wiadomość z formularza: ${data.name}`);
      fd.append('from_name', 'Formularz kontaktowy (strona)');
      fd.append('name', data.name);
      fd.append('phone', data.phone);
      fd.append('message', data.message);
      fd.append('botcheck', '');

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
      });

      const json = await res.json();

      if (json.success) {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        alert('Błąd przy wysyłce: ' + (json.message || 'Spróbuj ponownie'));
      }
    } catch (e: any) {
      alert('Nie udało się wysłać wiadomości: ' + (e?.message || 'Spróbuj ponownie'));
    }
  };

  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
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

        {/* 3 kolumny */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Kolumna 1 — Formularz */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Formularz kontaktowy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
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
                        placeholder=""
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

          {/* Kolumna 2 — Informacje kontaktowe (rozciągnięta na wysokość) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
           <Card className="h-full flex flex-col">
  <CardHeader>
    <CardTitle>Informacje kontaktowe</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6 flex-1">
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
        <p className="font-semibold text-zinc-900">Lokalizacja</p>
        <p className="text-zinc-600">
          ul. Wenecja 6<br />34-100 Wadowice
        </p>
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-xl bg-zinc-100">
        <svg xmlns="http://www.w3.org/2000/svg" 
             className="h-6 w-6 text-zinc-600" 
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-zinc-900">Godziny otwarcia</p>
        <p className="text-zinc-600">codziennie 06:00 – 22:00</p>
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-xl bg-zinc-100">
        <svg xmlns="http://www.w3.org/2000/svg" 
             className="h-6 w-6 text-zinc-600" 
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 17v-2h6v2a2 2 0 002 2h1a2 2 0 002-2V7a2 2 0 00-2-2h-1V3h-4v2H9V3H5v2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-zinc-900">Dane firmy</p>
        <p className="text-zinc-600">
          SIGMA BEATA PACZYŃSKA<br />
          NIP 5492191680
        </p>
      </div>
    </div>
  </CardContent>
</Card>

          </motion.div>

          {/* Kolumna 3 — Mapa */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Gdzie nas znajdziesz</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="h-full rounded-2xl overflow-hidden shadow">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2571.210255634081!2d19.512565!3d49.87607800000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716892f4ae7ecf3%3A0x5128e2d2ba764766!2sAUTO-GREG%20GRZEGORZ%20PACZY%C5%83SKI%20-%20import%20i%20sprzeda%C5%BC%20samochod%C3%B3w%20z%20zagranicy%20AUTOPACZY%C5%83SKI%20BABICA%20WADOWICE!5e0!3m2!1spl!2spl!4v1758052066487!5m2!1spl!2spl"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    title="Mapa dojazdu"
                    className="block w-full h-full border-0"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

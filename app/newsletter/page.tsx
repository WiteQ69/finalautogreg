'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, Mail, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';

// 1) Schemat
const newsletterSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  email: z.string().email('Podaj poprawny adres e-mail'),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: 'Zaznacz zgodę na przetwarzanie danych' }),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { consent: false },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email }),
      });

      let payload: any = null;
      try {
        payload = await res.json();
      } catch {
        // brak JSON w odpowiedzi
      }

      if (res.ok && payload?.ok) {
        setIsSubmitted(true);
        reset({ name: '', email: '', consent: false });
        setTimeout(() => setIsSubmitted(false), 3000);
      } else {
        throw new Error(payload?.message || `HTTP ${res.status}`);
      }
    } catch (e: any) {
      alert('Błąd przy zapisie: ' + (e?.message || 'Spróbuj ponownie'));
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
            Zapisz się do newslettera
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Otrzymuj jako pierwszy nowe oferty, świeże dostawy i okazje specjalne.
          </p>
        </motion.div>

        {/* 3 kolumny – spójnie z „Kontakt” */}
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
                  <span>Formularz zapisu</span>
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
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Zapis przebiegł pomyślnie!</h3>
                    <p className="text-zinc-600">
                      Dziękujemy! Od teraz będziesz otrzymywać nasze aktualności i promocje.
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
                      <Label htmlFor="email">Adres e-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="np. jan.kowalski@example.com"
                        {...register('email')}
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        id="consent"
                        type="checkbox"
                        {...register('consent')}
                        className="mt-1 h-4 w-4 rounded border-zinc-300"
                      />
                      <Label htmlFor="consent" className="text-sm text-zinc-600 font-normal">
                        Wyrażam zgodę na przetwarzanie moich danych osobowych w celu otrzymywania
                        newslettera zgodnie z Polityką prywatności.
                      </Label>
                    </div>
                    {errors.consent && (
                      <p className="text-sm text-red-500 -mt-2">{errors.consent.message}</p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-zinc-900 hover:bg-zinc-800"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      {isSubmitting ? 'Zapisuję...' : 'Zapisz mnie'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Kolumna 2 — Korzyści / Bez spamu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Co zyskasz?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 flex-1">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-zinc-100">
                    <Sparkles className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Nowe oferty jako pierwszy</p>
                    <p className="text-zinc-600">Dostęp do świeżych dostaw i limitowanych okazji.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-zinc-100">
                    <Shield className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Zero spamu</p>
                    <p className="text-zinc-600">Tylko konkretne wiadomości, gdy faktycznie warto.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-zinc-100">
                    <Mail className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Proste wypisanie</p>
                    <p className="text-zinc-600">Możesz zrezygnować w każdej chwili jednym kliknięciem.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Kolumna 3 — Podgląd skrzynki / grafika placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Jak to działa</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="rounded-2xl border border-zinc-200 p-6 h-full flex flex-col justify-center">
                  <p className="text-zinc-700">
                    Po zapisie potwierdzimy Twój adres i od czasu do czasu wyślemy
                    Ci przejrzysty e-mail z nowościami i ofertami. Zadbamy o Twoją prywatność.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

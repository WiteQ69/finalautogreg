'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Clock, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GwarancjaPage() {
  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Nagłówek strony */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
            Gwarancja spokoju
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Masz możliwość wykupienia dodatkowej gwarancji, która zapewnia ochronę Twojego auta
            i daje Ci pewność, że w razie problemów nie zostaniesz sam.
          </p>
        </motion.div>

        {/* Sekcja kart z benefitami */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheck className="h-6 w-6 text-green-600" />
                <span>Pełna ochrona</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600">
                Wykupiona gwarancja obejmuje szeroki zakres usterek, dzięki czemu możesz czuć się
                pewnie i bezpiecznie każdego dnia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-6 w-6 text-blue-600" />
                <span>Darmowe naprawy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600">
                Jeśli w okresie obowiązywania gwarancji dojdzie do awarii – wszystkie naprawy w jej
                ramach wykonamy bez żadnych dodatkowych kosztów.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-purple-600" />
                <span>Szybka obsługa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600">
                Rozumiemy, jak ważne jest sprawne auto. Dlatego każdą naprawę realizujemy w możliwie
                najkrótszym czasie, abyś mógł szybko wrócić na drogę.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Podsumowanie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
            Zadbaj o swoje auto z wyprzedzeniem
          </h2>
          <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
            Dodatkowa gwarancja to inwestycja w spokój i bezpieczeństwo. To pewność, że niezależnie
            od sytuacji możesz liczyć na nasz profesjonalizm i wsparcie.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

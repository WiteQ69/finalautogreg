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
            12 miesięcy gwarancji
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Każdy samochód kupiony u nas objęty jest roczną gwarancją, abyś mógł cieszyć się spokojem
            i pełnym bezpieczeństwem.
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
                Otrzymujesz 12 miesięcy gwarancji od dnia zakupu samochodu. To pewność, że nawet po
                wyjeździe z placu nie zostajesz sam.
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
                Jeżeli w tym czasie coś się zepsuje – wszystkie naprawy objęte gwarancją wykonujemy
                całkowicie bezpłatnie.
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
                Wiemy, że auto to codzienna potrzeba. Dlatego naprawy staramy się realizować w
                możliwie najkrótszym czasie.
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
            Bezpieczeństwo i zaufanie ponad wszystko
          </h2>
          <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
            Nasza gwarancja to nie tylko dokument. To obietnica, że dbamy o Twój spokój i
            komfort. Wybierając nas, wybierasz pewność i profesjonalizm.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

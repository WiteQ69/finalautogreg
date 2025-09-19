'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function GwarancjaPage() {
  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Nagłówek */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-2xl md:text-5xl font-bold text-zinc-900 mb-1 tracking-tight">
            GWARANCJA
          </h1><br />
          <p className="text-lg md:text-xl text-zinc-600 max-w-1xl mx-auto">
            Zadbaj o swój samochód z wyprzedzeniem i zyskaj pewność, że w razie
            awarii nie zostaniesz sam. Wykup pakiet gwarancyjny na 12 miesięcy.
          
          </p>
        </motion.div>

        {/* Obrazek z pakietami gwarancji */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border overflow-hidden shadow-sm"
        >
          <Image
            src="/GWARANCJA - pakiety.jpg"
            alt="Pakiety gwarancji"
            width={1600}
            height={1200}
            className="w-full h-auto"
            priority
          />
        </motion.div>

        {/* Opis marketingowy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
            Pewność i bezpieczeństwo na każdy kilometr
          </h2>
          <p className="text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            Nasze pakiety gwarancyjne to realna ochrona przed niespodziewanymi
            kosztami napraw. W przypadku awarii możesz liczyć na bezgotówkową
            naprawę w warsztacie, pomoc drogową, a nawet samochód zastępczy.
            Dzięki temu podróżujesz spokojnie i bez stresu.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

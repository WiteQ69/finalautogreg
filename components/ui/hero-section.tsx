'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/tlo.jpg"
          alt="AKTUALNE OFERTY"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-zinc-1100 leading-tight tracking-tight mb-6">
  Twoje wymarzone auto czeka na Ciebie!<br />
  
</h1>

              
              <p className="text-xl text-zinc-600 leading-relaxed mb-8 max-w-lg">
                Nie sprowadzamy aut - my spełniamy Twoje marzenia o czterech kołach. Znajdź swój idealny samochód, sprawdzony, zadbany, przygotowany do jazdy, który posłuży Ci na długie lata.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
  <Button
    asChild
    size="lg"
    className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-4 h-auto"
  >
    <Link href="/auta" className="flex items-center space-x-2">
      <Search className="h-5 w-5" />
      <span className="font-medium">Przeglądaj samochody</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  </Button>

  <Button
    asChild
    size="lg"
    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 h-auto"
  >
    <Link href="/newsletter" className="flex items-center space-x-2">
      <Mail className="h-5 w-5" />
      <span className="font-medium">Zapisz się do newslettera</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  </Button>
</div>

                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from "next/image";



const navigation = [
  { name: 'STRONA GŁÓWNA', href: '/' },
  { name: 'AKTUALNA OFERTA', href: '/auta' },
  { name: 'UBEZPIECZENIA', href: 'https://www.ubezpieczeniaosiek.pl/' },
  { name: 'KONTAKT', href: '/kontakt' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-zinc-200/80"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
         {/* Logo */}
<Link href="/" className="flex items-center" aria-label="AUTO GREG — paczynski.pl">
  <Image
    src="/autogreg-logo.png"       // plik w public/
    alt="AUTO GREG — paczynski.pl"
    width={270}                    // ustaw rozmiar jak chcesz
    height={46}                    // proporcja zbliżona do oryginału
    className="h-13 w-left"         // h-8 / h-10 zależnie od paska
    priority
  />
</Link>


          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-zinc-100',
                  pathname === item.href
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                    : 'text-zinc-700 hover:text-zinc-900'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2"></div>
        </div>
      </div>
    </motion.header>
  );
}
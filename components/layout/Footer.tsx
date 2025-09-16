import Link from 'next/link';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-white">
                <Car className="h-6 w-6 text-zinc-900" />
              </div>
              
              <span className="text-xl font-bold tracking-tight"></span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
              
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Szybkie linki</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auta" className="text-zinc-400 hover:text-white transition-colors">
                  Nasze samochody
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-zinc-400 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-400">+48 693 632 068</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-zinc-400" />
                
                <span className="text-zinc-400">autopaczynski@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-400">ul. Wenecja 6, 34-100 Wadowice</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-zinc-400" />
                <span className="text-zinc-400">NIP: 5492191680</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-zinc-500 text-sm">
            © 2025 AutoGreg. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
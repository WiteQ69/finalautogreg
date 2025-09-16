import Link from 'next/link';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-white">
      <div className="border-t border-zinc-800 mt-10"> {/* ⬅️ większy margines od góry */}
        <div className="flex items-center justify-center py-6">
          <p className="text-zinc-500 text-sm">
            © 2025 AutoGreg. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}

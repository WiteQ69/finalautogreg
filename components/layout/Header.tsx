"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import FinancingModal from "@/components/lead/FinancingModal";

type NavItem = {
  name: string;
  href: string;
  action?: "openFinancing";
};

const navigation: NavItem[] = [
  { name: "STRONA GŁÓWNA", href: "/start" },
  { name: "AKTUALNA OFERTA", href: "/auta" },
  { name: "FINANSOWANIE", href: "/finansowanie" },
  { name: "GWARANCJE", href: "/gwarancje" },
  { name: "UBEZPIECZENIA", href: "https://www.ubezpieczeniaosiek.pl/" },
  { name: "KONTAKT", href: "/kontakt" },
  { name: "NEWSLETTER", href: "/newsletter" },
];

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [finOpen, setFinOpen] = useState(false);

  const handleNavClick =
    (item: NavItem) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (item.action === "openFinancing") {
        e.preventDefault();
        setFinOpen(true);
        setMenuOpen(false);
        return;
      }

      setMenuOpen(false);
    };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-zinc-200/80"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center" aria-label="AUTO GREG — paczynski.pl">
              <Image
                src="/autogreg-logo.png"
                alt="AUTO GREG GRZEGORZ PACZYŃSKI"
                width={270}
                height={46}
                className="h-13 w-left"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick(item)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-zinc-100",
                    pathname === item.href
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "text-zinc-700 hover:text-zinc-900"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border hover:bg-zinc-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              type="button"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4">
              <ul className="flex flex-col gap-2 rounded-lg border p-3 text-sm bg-white shadow-md">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={handleNavClick(item)}
                      className={cn(
                        "block rounded-md px-3 py-2 hover:bg-zinc-50",
                        pathname === item.href
                          ? "bg-zinc-900 text-white hover:bg-zinc-800"
                          : "text-zinc-700 hover:text-zinc-900"
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.header>

      <FinancingModal open={finOpen} onClose={() => setFinOpen(false)} />
    </>
  );
}
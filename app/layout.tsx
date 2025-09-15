'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <AdminLayoutWrapper>
          {children}
        </AdminLayoutWrapper>
      </body>
    </html>
  );
}

function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setIsAdminRoute(window.location.pathname.startsWith('/__admin-auto-greg'));
  }, []);

  if (isAdminRoute) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">{children}</main>
      <Footer />
    </>
  );
}
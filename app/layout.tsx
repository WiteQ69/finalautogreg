'use client';

import './globals.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Script from 'next/script'

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
      
      {/* Google tag (gtag.js) */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=G-CS30CQPKFB`} strategy="afterInteractive" />
      <Script id="ga-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CS30CQPKFB');
        `}
      </Script>

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
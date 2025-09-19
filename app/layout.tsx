'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = 'https://paczynski.pl';
  const title = 'AUTO GREG GRZEGORZ PACZYŃSKI';
  const description =
    'Sprowadzamy i sprzedajemy samochody z zagranicy. Działamy w okolicy Wadowic i Osieka — pewne auta, jasna historia, pomoc przy formalnościach.';
  const ogImage = `${siteUrl}/logo10.jpg`; // ← wrzuć plik do /public/og-image.jpg lub podmień URL

  return (
    <html lang="pl">
      <head>
        {/* SEO / Open Graph */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content="AUTO GREG" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="pl_PL" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </head>

      <body className={inter.className}>
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CS30CQPKFB"
          strategy="afterInteractive"
        />
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
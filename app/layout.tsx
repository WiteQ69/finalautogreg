import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Script from 'next/script';
import AdminLayoutWrapper from '@/components/layout/AdminLayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AUTO GREG GRZEGORZ PACZYŃSKI WADOWICE OSIEK',
  description:
    'Sprowadzamy i sprzedajemy samochody z zagranicy. Działamy w okolicy Wadowic i Osieka — pewne auta, jasna historia, pomoc przy formalnościach.',
  openGraph: {
    title: 'AUTO GREG GRZEGORZ PACZYŃSKI WADOWICE OSIEK',
    description:
      'Sprowadzamy i sprzedajemy samochody z zagranicy. Działamy w okolicy Wadowic i Osieka.',
    url: 'https://paczynski.pl',
    siteName: 'AUTO GREG',
    images: [
      {
        url: '/logo10.jpg',
        width: 1200,
        height: 630,
        alt: 'AUTO GREG GRZEGORZ PACZYŃSKI',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  icons: {
    icon: '/logo10.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" href="/logo10.jpg" type="image/jpeg" />
      </head>
      <body className={inter.className}>
        {/* wrapper klientowy rozpoznaje ścieżkę admina */}
        <AdminLayoutWrapper>
          {/* publiczna część strony ma Header/Footer,
              admin – sam <main>; logika w wrapperze */}
          <Header />
          <main className="min-h-screen bg-white">{children}</main>
          <Footer />
        </AdminLayoutWrapper>

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

import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import './psd.css';
import { ThemeManager } from '@/components/ThemeManager';
import { CapacitorBridge } from '@/components/CapacitorBridge';
import { getLocale } from '@/lib/i18n';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
});

const SITE_URL = 'https://portalservices.digital';

export const viewport: import('next').Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  // Tells the browser's content sniffing to start composition with our
  // brand color instead of flashing white between paint and React mount.
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zapli — Smart Turnover & Home Management',
    template: '%s | Zapli',
  },
  description:
    'Zapli — Smart Turnover & Home Management. Gestiona tu equipo, clientes y propiedades de Airbnb en tiempo real. Reemplaza WhatsApp y Excel.',
  applicationName: 'Zapli',
  keywords: [
    'software gestión limpieza hogar',
    'gestión limpieza Airbnb',
    'plataforma empresa de limpieza',
    'home cleaning software',
    'Airbnb cleaning management',
    'Zapli',
  ],
  authors: [{ name: 'Zapli' }],
  openGraph: {
    title: 'Zapli — Smart Turnover & Home Management',
    description:
      'Gestiona tu equipo, tus clientes y tus propiedades de Airbnb desde un solo lugar con Zapli. Foto de cada limpieza, check-in con GPS, valoraciones automáticas y portal del cliente.',
    url: SITE_URL,
    siteName: 'Zapli',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zapli — Smart Turnover & Home Management',
    description:
      'Zapli es la plataforma para empresas de limpieza de hogar y Airbnb. Reemplaza WhatsApp y Excel con una sola herramienta.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD: SoftwareApplication structured data
const softwareLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Zapli',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    'Plataforma para empresas de limpieza de hogar y gestión de Airbnb. Equipo, clientes y propiedades en tiempo real.',
  offers: {
    '@type': 'Offer',
    price: '39',
    priceCurrency: 'GBP',
    priceValidUntil: '2027-12-31',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '3',
    bestRating: '5',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Zapli',
    url: SITE_URL,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no"
        />
        {/* Warm the TLS connection to Supabase before the first query
            fires — meaningful on cold-start cellular when handshake
            adds ~200ms. */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
          <>
            <link
              rel="preconnect"
              href={process.env.NEXT_PUBLIC_SUPABASE_URL}
              crossOrigin=""
            />
            <link
              rel="dns-prefetch"
              href={process.env.NEXT_PUBLIC_SUPABASE_URL}
            />
          </>
        ) : null}
      </head>
      <body className="min-h-screen bg-ink-0 text-white antialiased">
        <ThemeManager />
        <CapacitorBridge />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
        />
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
          toastOptions={{
            classNames: {
              toast: 'font-sans',
            },
          }}
        />
      </body>
    </html>
  );
}

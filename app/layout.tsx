import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import './psd.css';
import { ThemeManager } from '@/components/ThemeManager';
import { CapacitorBridge } from '@/components/CapacitorBridge';
import { getLocale, type Locale } from '@/lib/i18n';
import { ClientLocaleProvider } from '@/lib/use-locale-client';

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
    default: 'Portal Services Digital — Workforce & Home operations platform',
    template: '%s | Portal Services Digital',
  },
  description:
    'Portal Services Digital — one platform, two solutions: Workforce for cleaning and services companies, Home for residential cleaning and Airbnb turnovers.',
  applicationName: 'Portal Services Digital',
  keywords: [
    'workforce management platform',
    'cleaning services software',
    'Airbnb turnover management',
    'operatives supervisors managers',
    'facility services software',
    'Portal Services Digital',
  ],
  authors: [{ name: 'Portal Services Digital' }],
  openGraph: {
    title: 'Portal Services Digital — Workforce & Home operations platform',
    description:
      'Portal Services Digital: la plataforma operativa para servicios y hogar. Una marca, dos soluciones — Workforce y Home.',
    url: SITE_URL,
    siteName: 'Portal Services Digital',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Services Digital — Workforce & Home operations platform',
    description:
      'Portal Services Digital: la plataforma operativa para servicios y hogar. Workforce y Home en una sola marca.',
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
  name: 'Portal Services Digital',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    'La plataforma operativa para servicios y hogar. Workforce para empresas de limpieza y servicios, Home para residencial y Airbnb.',
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
    name: 'Portal Services Digital',
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
        <ClientLocaleProvider locale={locale as Locale}>
          {children}
        </ClientLocaleProvider>
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

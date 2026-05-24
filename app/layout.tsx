import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import './psd.css';

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Portal Services Digital — Operational OS for facility teams',
    template: '%s | Portal Services Digital',
  },
  description:
    'One platform. One place. Everyone connected. The operational system for cleaning, facilities and field-service teams — used by Airbnb hosts, FM contractors and enterprise operations.',
  applicationName: 'Portal Services Digital',
  keywords: [
    'cleaning operations software',
    'Airbnb cleaning management',
    'facilities management platform',
    'property cleaning software UK',
    'cleaning company SaaS',
  ],
  authors: [{ name: 'Portal Services Digital' }],
  openGraph: {
    title: 'Portal Services Digital — Operational OS for facility teams',
    description:
      'Replace WhatsApp and Excel with one operational platform. Shift control, supervisor inbox, geo check-in, photo evidence, Airbnb iCal sync.',
    url: SITE_URL,
    siteName: 'Portal Services Digital',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Services Digital',
    description:
      'The operational platform for cleaning, facilities and Airbnb teams. Replace WhatsApp and Excel.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-ink-0 text-white antialiased">{children}</body>
    </html>
  );
}

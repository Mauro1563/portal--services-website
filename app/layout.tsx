import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portal Services Digital — Cleaning Management Software',
  description: 'The complete portal platform for cleaning companies. Manage supervisors, operatives, orders and reports in one place.',
  keywords: 'cleaning management software, cleaning portal, facility management, cleaning company software',
  openGraph: {
    title: 'Portal Services Digital',
    description: 'The complete management platform for cleaning companies.',
    url: 'https://portalservices.digital',
    siteName: 'Portal Services Digital',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

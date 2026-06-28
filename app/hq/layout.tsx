import type { Metadata } from 'next';
import '../hqx.css';

export const metadata: Metadata = {
  title: 'HQ · Zapli',
  description: 'Admin panel for the Zapli marketing site.',
  robots: 'noindex, nofollow',
};

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-graphite-1 antialiased">
      {children}
    </div>
  );
}

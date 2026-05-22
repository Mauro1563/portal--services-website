import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HQ · Portal Services',
  description: 'Admin panel for the Portal Services marketing site.',
  robots: 'noindex, nofollow',
};

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark-shell min-h-screen bg-ink-0 text-white antialiased">
      {children}
    </div>
  );
}

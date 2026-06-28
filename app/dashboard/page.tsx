import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ZapliNavbar } from '@/components/nav/ZapliNavbar';

export const metadata = {
  title: 'Dashboard · Zapli',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ZapliNavbar active="dashboard" />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Esta sección estará disponible próximamente.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

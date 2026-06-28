import { BarChart3, Building2, CreditCard, TrendingUp } from 'lucide-react';
import { ZapliNavbar } from '@/components/nav/ZapliNavbar';
import { requireOwner } from '@/lib/auth';

export const metadata = {
  title: 'Reports · Zapli',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type Tile = {
  key: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  description: string;
  tone: 'cyan' | 'emerald' | 'amber' | 'violet';
};

const TILES: Tile[] = [
  {
    key: 'revenue-by-month',
    icon: TrendingUp,
    title: 'Ingresos por mes',
    description:
      'Evolución mensual de facturación, comparada contra el mes anterior.',
    tone: 'emerald',
  },
  {
    key: 'top-cleaners',
    icon: BarChart3,
    title: 'Top cleaners',
    description:
      'Ranking por tareas completadas, horas reportadas y rating medio.',
    tone: 'cyan',
  },
  {
    key: 'property-performance',
    icon: Building2,
    title: 'Rendimiento por propiedad',
    description:
      'Tareas por propiedad, duración media y propiedades sin actividad.',
    tone: 'amber',
  },
  {
    key: 'payment-status',
    icon: CreditCard,
    title: 'Estado de pagos',
    description:
      'Pagadas vs. pendientes, antigüedad media de las pendientes y outliers.',
    tone: 'violet',
  },
];

const TONES = {
  cyan: 'bg-cyan-50 text-cyan-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  violet: 'bg-violet-50 text-violet-700',
} as const;

export default async function ReportsPage() {
  // Reports infra doesn't exist yet, but the page is still gated to the
  // signed-in owner so it sits cleanly inside the Zapli admin shell.
  await requireOwner();

  return (
    <div className="min-h-screen bg-slate-50">
      <ZapliNavbar active="reports" signedIn />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Reports
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Informes de operación y facturación. Estamos preparando estos
            módulos.
          </p>
        </div>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TILES.map(({ key, icon: Icon, title, description, tone }) => (
            <article
              key={key}
              aria-disabled
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${TONES[tone]}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  Próximamente
                </span>
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">
                {title}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </article>
          ))}
        </section>

        <p className="mt-6 text-xs text-slate-500">
          ¿Te falta algún informe? Escríbenos y lo priorizamos.
        </p>
      </main>
    </div>
  );
}

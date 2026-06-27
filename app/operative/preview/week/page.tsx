/**
 * Public, no-auth preview of the Cleaner /week page. Mock data only.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  PoundSterling,
  Star,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { BottomTabBar } from '@/components/operative/BottomTabBar';

export const metadata = {
  title: 'Demo · Cleaner',
  robots: { index: false, follow: false },
};

type MockWeekTask = {
  id: string;
  status: 'scheduled' | 'completed' | 'in_progress';
  service_name: string;
  price_pence: number;
  estimated_duration_min: number;
  property: { name: string; address: string };
};

const DAYS: Array<{
  label: string;
  isToday: boolean;
  tasks: MockWeekTask[];
}> = [
  {
    label: 'Lunes 23 Jun',
    isToday: false,
    tasks: [
      {
        id: 'w-1',
        status: 'completed',
        service_name: 'Limpieza profunda',
        price_pence: 6500,
        estimated_duration_min: 120,
        property: { name: 'Apto 4B', address: '12 Carrer del Sol' },
      },
    ],
  },
  {
    label: 'Martes 24 Jun',
    isToday: false,
    tasks: [
      {
        id: 'w-2',
        status: 'completed',
        service_name: 'Mantenimiento',
        price_pence: 4000,
        estimated_duration_min: 90,
        property: { name: 'Estudio Loft', address: '5 Av. Diagonal' },
      },
      {
        id: 'w-3',
        status: 'completed',
        service_name: 'Check-out',
        price_pence: 5500,
        estimated_duration_min: 105,
        property: { name: 'Casa Gómez', address: '47 Passeig de Gràcia' },
      },
    ],
  },
  {
    label: 'Miércoles 25 Jun',
    isToday: false,
    tasks: [],
  },
  {
    label: 'Jueves 26 Jun',
    isToday: false,
    tasks: [
      {
        id: 'w-4',
        status: 'completed',
        service_name: 'Limpieza estándar',
        price_pence: 4000,
        estimated_duration_min: 75,
        property: { name: 'Apto 2A', address: '12 Carrer del Sol' },
      },
    ],
  },
  {
    label: 'Viernes 27 Jun',
    isToday: true,
    tasks: [
      {
        id: 'w-5',
        status: 'completed',
        service_name: 'Limpieza estándar',
        price_pence: 4000,
        estimated_duration_min: 90,
        property: { name: 'Apto 2A', address: '12 Carrer del Sol' },
      },
      {
        id: 'w-6',
        status: 'in_progress',
        service_name: 'Mantenimiento',
        price_pence: 3500,
        estimated_duration_min: 60,
        property: { name: 'Estudio Loft', address: '5 Av. Diagonal' },
      },
      {
        id: 'w-7',
        status: 'scheduled',
        service_name: 'Check-out',
        price_pence: 6500,
        estimated_duration_min: 120,
        property: { name: 'Casa Gómez', address: '47 Passeig de Gràcia' },
      },
    ],
  },
  {
    label: 'Sábado 28 Jun',
    isToday: false,
    tasks: [
      {
        id: 'w-8',
        status: 'scheduled',
        service_name: 'Limpieza profunda',
        price_pence: 7500,
        estimated_duration_min: 150,
        property: { name: 'Villa Sol', address: '3 Carrer Mar' },
      },
    ],
  },
  {
    label: 'Domingo 29 Jun',
    isToday: false,
    tasks: [],
  },
];

function formatMoney(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

function formatHours(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

export default function OperativePreviewWeek() {
  const totalMinutes = 540;
  const totalEarnings = 28000;
  const avgStars = 4.8;
  const ratingCount = 6;

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas pb-24">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-2 px-4">
          <Link
            href="/operative/preview"
            aria-label="Back"
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-graphite-1 hover:bg-surface-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo size="sm" />
          <span className="-mr-2 flex h-9 w-9" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
          This week
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-graphite-1">
          23 Jun – 29 Jun
        </h1>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Kpi
            icon={<Clock className="h-3.5 w-3.5 text-brand-500" />}
            label="Worked"
            value={formatHours(totalMinutes)}
          />
          <Kpi
            icon={<PoundSterling className="h-3.5 w-3.5 text-emerald-600" />}
            label="Earnings"
            value={formatMoney(totalEarnings)}
          />
          <Kpi
            icon={<Star className="h-3.5 w-3.5 text-amber-500" />}
            label={`Rating (${ratingCount})`}
            value={avgStars.toFixed(1)}
          />
        </div>

        <section className="mt-6 space-y-4">
          {DAYS.map((day) => (
            <div key={day.label}>
              <h2
                className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                  day.isToday ? 'text-brand-600' : 'text-graphite-3'
                }`}
              >
                <Calendar className="h-3 w-3" />
                {day.label}
                {day.isToday ? ' · TODAY' : ''}
              </h2>
              {day.tasks.length === 0 ? (
                <p className="mt-1 ml-5 text-[11px] text-graphite-3">
                  No cleanings
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {day.tasks.map((t, idx) => (
                    <li key={t.id}>
                      <Link
                        href="/operative/preview"
                        className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-brand-400 hover:shadow-[0_4px_12px_-4px_rgba(37,99,235,0.18)]"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-semibold text-brand-700">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-sm font-semibold text-graphite-1">
                            {t.property.name}
                          </p>
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-brand-600">
                            <MapPin className="h-3 w-3" /> {t.property.address}
                          </span>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] text-graphite-3">
                            <span>{t.service_name}</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatHours(t.estimated_duration_min)}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                              <PoundSterling className="h-3 w-3" />
                              {formatMoney(t.price_pence)}
                            </span>
                          </div>
                        </div>
                        {t.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      </div>
      <BottomTabBar active="tareas" />
    </main>
  );
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-paper p-3 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1.5 font-display text-base font-bold text-graphite-1 tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-graphite-3">
        {label}
      </p>
    </div>
  );
}

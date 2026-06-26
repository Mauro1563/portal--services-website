import {
  CalendarPlus,
  PoundSterling,
  TrendingUp,
  Users,
} from 'lucide-react';

type StatProps = {
  label: string;
  value: string;
  hint?: string;
  /** Optional small delta chip (e.g. "+12% vs sem. pasada"). */
  delta?: { label: string; positive?: boolean };
  Icon: React.ComponentType<{ className?: string }>;
  accent: 'brand' | 'emerald' | 'amber';
};

const ACCENT: Record<
  StatProps['accent'],
  { iconBg: string; ring: string }
> = {
  brand: {
    iconBg: 'bg-gradient-to-br from-blue-600 to-blue-700',
    ring: 'ring-blue-100',
  },
  emerald: {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-100',
  },
  amber: {
    iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
    ring: 'ring-amber-100',
  },
};

function StatCard({ label, value, hint, delta, Icon, accent }: StatProps) {
  const cls = ACCENT[accent];
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${cls.iconBg} text-white shadow-sm ring-4 ${cls.ring}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              delta.positive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <TrendingUp
              className={`h-2.5 w-2.5 ${delta.positive ? '' : 'rotate-180'}`}
            />
            {delta.label}
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl font-bold tabular-nums text-slate-900">
          {value}
        </p>
        {hint ? (
          <p className="mt-0.5 text-[10.5px] text-slate-500">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Top metrics row — three big number cards per the Corporate Trust
 * mockup: cleaners activos / new bookings (semana) / revenue (mes).
 * Each card pairs a colored icon block with a big tabular number and
 * a tiny delta chip — same visual rhythm as Stripe / Linear dashboards.
 */
export function StatCardsRow({
  cleanersActive,
  bookingsWeek,
  revenueMonthPence,
  bookingsDelta,
  revenueDelta,
}: {
  cleanersActive: number;
  bookingsWeek: number;
  revenueMonthPence: number;
  bookingsDelta?: { label: string; positive: boolean };
  revenueDelta?: { label: string; positive: boolean };
}) {
  const fmtMoney = (p: number) =>
    `£${(p / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        label="Cleaners activos"
        value={String(cleanersActive)}
        hint="en tu equipo"
        Icon={Users}
        accent="brand"
      />
      <StatCard
        label="Nuevas tareas"
        value={String(bookingsWeek)}
        hint="esta semana"
        delta={bookingsDelta}
        Icon={CalendarPlus}
        accent="amber"
      />
      <StatCard
        label="Revenue"
        value={fmtMoney(revenueMonthPence)}
        hint="este mes"
        delta={revenueDelta}
        Icon={PoundSterling}
        accent="emerald"
      />
    </section>
  );
}

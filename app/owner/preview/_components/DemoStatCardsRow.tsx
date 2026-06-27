/**
 * Demo-only fork of components/owner/StatCardsRow. Identical visuals,
 * but each tile is wrapped in <Link> so the preview dashboard tiles
 * navigate to drill-down pages instead of sitting there inert.
 *
 * Kept as a separate file to avoid coupling the real (production)
 * shared StatCardsRow to demo URLs.
 */
import Link from 'next/link';
import {
  CalendarPlus,
  PiggyBank,
  PoundSterling,
  TrendingUp,
  Users,
} from 'lucide-react';

type StatProps = {
  label: string;
  value: string;
  hint?: string;
  delta?: { label: string; positive?: boolean };
  Icon: React.ComponentType<{ className?: string }>;
  accent: 'brand' | 'emerald' | 'amber' | 'violet' | 'rose';
  href?: string;
  title?: string;
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
  violet: {
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-700',
    ring: 'ring-violet-100',
  },
  rose: {
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-700',
    ring: 'ring-rose-100',
  },
};

function StatCardInner({
  label,
  value,
  hint,
  delta,
  Icon,
  accent,
}: Omit<StatProps, 'href' | 'title'>) {
  const cls = ACCENT[accent];
  return (
    <>
      <div className="flex items-start justify-between gap-1">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${cls.iconBg} text-white shadow-sm ring-2 sm:ring-4 ${cls.ring}`}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold sm:px-2 sm:text-[10px] ${
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
      <div className="min-w-0">
        <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-[10px] sm:tracking-[0.15em]">
          {label}
        </p>
        <p className="mt-0.5 font-display text-lg font-bold tabular-nums leading-none text-slate-900 sm:mt-1 sm:text-2xl">
          {value}
        </p>
        {hint ? (
          <p className="mt-0.5 truncate text-[9.5px] text-slate-500 sm:text-[10.5px]">
            {hint}
          </p>
        ) : null}
      </div>
    </>
  );
}

function StatCard(props: StatProps) {
  const wrapperCls =
    'flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition sm:gap-2 sm:p-4';
  if (props.href) {
    return (
      <Link
        href={props.href}
        title={props.title}
        className={`${wrapperCls} hover:border-blue-300 hover:shadow-md`}
      >
        <StatCardInner {...props} />
      </Link>
    );
  }
  return (
    <div className={wrapperCls}>
      <StatCardInner {...props} />
    </div>
  );
}

/**
 * Demo dashboard metrics row — each tile links to its drill-down page
 * so the demo feels alive instead of staring back at the visitor.
 */
export function DemoStatCardsRow({
  cleanersActive,
  bookingsWeek,
  revenueMonthPence,
  bookingsDelta,
  revenueDelta,
  profitMonthPence,
  profitDelta,
}: {
  cleanersActive: number;
  bookingsWeek: number;
  revenueMonthPence: number;
  bookingsDelta?: { label: string; positive: boolean };
  revenueDelta?: { label: string; positive: boolean };
  profitMonthPence?: number;
  profitDelta?: { label: string; positive: boolean };
}) {
  const fmtMoney = (p: number) => {
    const abs = Math.abs(p);
    const formatted = `£${(abs / 100).toLocaleString('en-GB', {
      maximumFractionDigits: 0,
    })}`;
    return p < 0 ? `-${formatted}` : formatted;
  };

  const showProfit = typeof profitMonthPence === 'number';

  return (
    <section
      className={
        showProfit
          ? 'grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4'
          : 'grid grid-cols-3 gap-2 sm:gap-3'
      }
    >
      <StatCard
        label="Cleaners activos"
        value={String(cleanersActive)}
        hint="en tu equipo"
        Icon={Users}
        accent="brand"
        href="/owner/preview/cleaners"
        title="Ver y gestionar los cleaners activos de tu equipo"
      />
      <StatCard
        label="Nuevas tareas"
        value={String(bookingsWeek)}
        hint="esta semana"
        delta={bookingsDelta}
        Icon={CalendarPlus}
        accent="amber"
        href="/owner/preview/tasks"
        title="Ver las limpiezas programadas esta semana"
      />
      <StatCard
        label="Revenue"
        value={fmtMoney(revenueMonthPence)}
        hint="este mes"
        delta={revenueDelta}
        Icon={PoundSterling}
        accent="emerald"
        href="/owner/preview/analytics"
        title="Ver tendencias de revenue y KPIs detallados"
      />
      {showProfit ? (
        <StatCard
          label="Profit"
          value={fmtMoney(profitMonthPence)}
          hint="revenue − pagado"
          delta={profitDelta}
          Icon={PiggyBank}
          accent={profitMonthPence >= 0 ? 'violet' : 'rose'}
          href="/owner/preview/analytics"
          title="Ver desglose de costes vs. ingresos"
        />
      ) : null}
    </section>
  );
}

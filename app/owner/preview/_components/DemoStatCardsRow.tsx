'use client';

/**
 * Demo-only fork of components/owner/StatCardsRow. Identical visuals,
 * but each tile is wrapped in <Link> so the preview dashboard tiles
 * navigate to drill-down pages instead of sitting there inert.
 *
 * Animated touches:
 *   - Revenue + Profit values tick from £0 → final using ease-out-expo
 *     with a 1-digit overshoot (useCountUp). IntersectionObserver gates
 *     the first run so it only fires when the card is on screen.
 *   - Delta chips "pop" in (scale 0.6 → 1, slate → emerald colour sweep)
 *     synchronized with the final landing of the digits.
 *   - When a new mock booking lands (revenueMonthPence changes), the
 *     number ticks up and the chip flashes once.
 *
 * Kept as a separate file from production StatCardsRow so demo URLs and
 * motion stay isolated from the real owner dashboard.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  CalendarPlus,
  PiggyBank,
  PoundSterling,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useCountUp } from './useCountUp';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    cleanersActive: 'Active cleaners',
    onYourTeam: 'on your team',
    cleanersTitle: 'See and manage the active cleaners on your team',
    newBookings: 'New bookings',
    vsLastWeek: 'vs. last week',
    bookingsTitle: 'See cleans scheduled this week',
    revenue: 'Revenue',
    vsLastMonth: 'vs. last month',
    revenueTitle: 'See revenue trends and detailed KPIs',
    profit: 'Profit',
    profitHint: 'revenue − paid',
    profitTitle: 'See breakdown of costs vs. revenue',
  },
  es: {
    cleanersActive: 'Cleaners activos',
    onYourTeam: 'en tu equipo',
    cleanersTitle: 'Ver y gestionar los cleaners activos de tu equipo',
    newBookings: 'Nuevas reservas',
    vsLastWeek: 'vs. semana pasada',
    bookingsTitle: 'Ver las limpiezas programadas esta semana',
    revenue: 'Ingresos',
    vsLastMonth: 'vs. mes pasado',
    revenueTitle: 'Ver tendencias de ingresos y KPIs detallados',
    profit: 'Beneficio',
    profitHint: 'ingresos − pagado',
    profitTitle: 'Ver desglose de costes vs. ingresos',
  },
  pt: {
    cleanersActive: 'Cleaners ativos',
    onYourTeam: 'na tua equipa',
    cleanersTitle: 'Ver e gerir os cleaners ativos da tua equipa',
    newBookings: 'Novas reservas',
    vsLastWeek: 'vs. semana passada',
    bookingsTitle: 'Ver as limpezas agendadas esta semana',
    revenue: 'Receitas',
    vsLastMonth: 'vs. mês passado',
    revenueTitle: 'Ver tendências de receitas e KPIs detalhados',
    profit: 'Lucro',
    profitHint: 'receitas − pago',
    profitTitle: 'Ver desagregação de custos vs. receitas',
  },
} as const;

type AnimatedValue =
  | { kind: 'text'; value: string }
  | { kind: 'money'; pence: number };

type StatProps = {
  label: string;
  hint?: string;
  delta?: { label: string; positive?: boolean };
  Icon: React.ComponentType<{ className?: string }>;
  accent: 'brand' | 'emerald' | 'amber' | 'violet' | 'rose';
  href?: string;
  title?: string;
  /** Either a static label or a money amount to animate. */
  value: AnimatedValue;
  /** Whether to drive the count-up + chip pop on this card. */
  animateMoney?: boolean;
};

// Per-card accent tile keyed to the metric family. Palette stays inside
// brand (blue/green) + softened secondaries (amber warning, rose loss) so
// the row reads as one system while each metric carries its own hint.
// The status colour role (delta chip) still lives separately in emerald/
// rose regardless of the tile accent.
const ACCENT: Record<
  StatProps['accent'],
  { iconBg: string; iconText: string; ring: string }
> = {
  brand: {
    iconBg: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]',
    iconText: 'text-[#2563EB]',
    ring: 'ring-[#2563EB]/15',
  },
  emerald: {
    iconBg: 'bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5]',
    iconText: 'text-[#10B981]',
    ring: 'ring-[#10B981]/15',
  },
  amber: {
    iconBg: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]',
    iconText: 'text-[#D97706]',
    ring: 'ring-[#D97706]/15',
  },
  violet: {
    iconBg: 'bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]',
    iconText: 'text-[#7C3AED]',
    ring: 'ring-[#7C3AED]/15',
  },
  rose: {
    iconBg: 'bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6]',
    iconText: 'text-[#E11D48]',
    ring: 'ring-[#E11D48]/15',
  },
};

function fmtMoney(p: number) {
  const abs = Math.abs(p);
  const formatted = `£${(abs / 100).toLocaleString('en-GB', {
    maximumFractionDigits: 0,
  })}`;
  return p < 0 ? `-${formatted}` : formatted;
}

function AnimatedMoney({ pence, run }: { pence: number; run: boolean }) {
  const target = run ? pence : 0;
  const v = useCountUp(target, { immediate: !run });
  return <>{fmtMoney(Math.round(v))}</>;
}

function StatCardInner({
  label,
  value,
  hint,
  delta,
  Icon,
  accent,
  animateMoney,
}: Omit<StatProps, 'href' | 'title'>) {
  const cls = ACCENT[accent];
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [chipFlash, setChipFlash] = useState(false);
  const lastValueRef = useRef<number | string | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visible) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visible]);

  // Trigger chip flash whenever the underlying money value changes
  // (post first-paint) — gives the "money arrived" effect.
  useEffect(() => {
    const current =
      value.kind === 'money' ? value.pence : value.value;
    if (lastValueRef.current === null) {
      lastValueRef.current = current;
      return;
    }
    if (lastValueRef.current !== current) {
      setChipFlash(true);
      const t = window.setTimeout(() => setChipFlash(false), 800);
      lastValueRef.current = current;
      return () => window.clearTimeout(t);
    }
  }, [value]);

  return (
    <>
      <div className="flex items-start justify-between gap-1">
        <span
          ref={sentinelRef}
          className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${cls.iconBg} ${cls.iconText} ring-1 ${cls.ring}`}
        >
          <Icon className="h-4 w-4" />
          {/* Green micro-accent dot — brand pulse on the tile. */}
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.6)]"
          />
        </span>
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums transition-all duration-300 ${
              visible ? 'scale-100 opacity-100' : 'scale-[0.6] opacity-0'
            } ${
              chipFlash
                ? 'ring-2 ring-emerald-300 ring-offset-1'
                : ''
            } ${
              delta.positive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <TrendingUp
              className={`h-2.5 w-2.5 ${delta.positive ? '' : 'rotate-180'}`}
            />
            {delta.label}
          </span>
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-slate-600 sm:text-[13px]">
          {label}
        </p>
        <p className="mt-1 font-display text-xl font-bold tabular-nums leading-none text-slate-900 sm:text-2xl">
          {value.kind === 'money' ? (
            <AnimatedMoney pence={value.pence} run={Boolean(animateMoney && visible)} />
          ) : (
            value.value
          )}
        </p>
        {hint ? (
          <p className="mt-1 text-[11.5px] text-slate-500 sm:text-[12px]">
            {hint}
          </p>
        ) : null}
      </div>
    </>
  );
}

function StatCard(props: StatProps) {
  const wrapperCls =
    'flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_4px_12px_-2px_rgba(15,23,42,0.06)] transition duration-200 sm:gap-2 sm:p-4';
  if (props.href) {
    return (
      <Link
        href={props.href}
        title={props.title}
        className={`${wrapperCls} hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md`}
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
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const showProfit = typeof profitMonthPence === 'number';

  return (
    <section
      className={
        showProfit
          ? 'grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4'
          : 'grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3'
      }
    >
      <StatCard
        label={t.cleanersActive}
        value={{ kind: 'text', value: String(cleanersActive) }}
        hint={t.onYourTeam}
        Icon={Users}
        accent="brand"
        href="/owner/preview/cleaners"
        title={t.cleanersTitle}
      />
      <StatCard
        label={t.newBookings}
        value={{ kind: 'text', value: String(bookingsWeek) }}
        hint={t.vsLastWeek}
        delta={bookingsDelta}
        Icon={CalendarPlus}
        accent="amber"
        href="/owner/preview/tasks"
        title={t.bookingsTitle}
      />
      <StatCard
        label={t.revenue}
        value={{ kind: 'money', pence: revenueMonthPence }}
        hint={t.vsLastMonth}
        delta={revenueDelta}
        Icon={PoundSterling}
        accent="emerald"
        href="/owner/preview/analytics"
        title={t.revenueTitle}
        animateMoney
      />
      {showProfit ? (
        <StatCard
          label={t.profit}
          value={{ kind: 'money', pence: profitMonthPence as number }}
          hint={t.profitHint}
          delta={profitDelta}
          Icon={PiggyBank}
          accent={(profitMonthPence as number) >= 0 ? 'violet' : 'rose'}
          href="/owner/preview/analytics"
          title={t.profitTitle}
          animateMoney
        />
      ) : null}
    </section>
  );
}

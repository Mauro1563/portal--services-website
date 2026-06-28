'use client';

/**
 * Demo-only fork of components/owner/StatCardsRow.
 *
 * 2026 refresh: press-print KPI cards. Hairline border, mono micro-label,
 * Instrument Serif numeral, optional mandarin delta. No icons, no shadows.
 *
 * Behaviour preserved:
 *   - Revenue + Profit values tick from £0 → final via useCountUp,
 *     IntersectionObserver gates the first run.
 *   - Delta chips pop in synchronized with the digits.
 *   - Each card still wraps in a Link to its drill-down page.
 *   - When the underlying money value changes, the chip flashes once.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { useCountUp } from './useCountUp';

type AnimatedValue =
  | { kind: 'text'; value: string }
  | { kind: 'money'; pence: number };

type StatProps = {
  label: string;
  hint?: string;
  delta?: { label: string; positive?: boolean };
  href?: string;
  title?: string;
  /** Either a static label or a money amount to animate. */
  value: AnimatedValue;
  /** Whether to drive the count-up + chip pop on this card. */
  animateMoney?: boolean;
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
  animateMoney,
}: Omit<StatProps, 'href' | 'title'>) {
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
      <div className="flex items-start justify-between gap-2">
        <span
          ref={sentinelRef}
          className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#54524D]"
        >
          {label}
        </span>
        {delta ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 font-mono text-[11px] tabular-nums transition-all ${
              visible ? 'scale-100 opacity-100' : 'scale-[0.6] opacity-0'
            } ${
              chipFlash ? 'ring-1 ring-[#FF5B1F]' : ''
            } ${
              delta.positive
                ? 'border-[#3F5B3A]/30 text-[#3F5B3A]'
                : 'border-[#FF5B1F]/40 text-[#FF5B1F]'
            }`}
            style={{
              transitionDuration: '280ms',
              transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            <TrendingUp
              className={`h-2.5 w-2.5 ${delta.positive ? '' : 'rotate-180'}`}
            />
            {delta.label}
          </span>
        ) : null}
      </div>
      <p
        className="mt-3 tabular-nums leading-[0.95] text-[#141414] sm:mt-4"
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontWeight: 400,
          fontSize: 'clamp(34px, 7vw, 56px)',
          letterSpacing: '-0.02em',
        }}
      >
        {value.kind === 'money' ? (
          <AnimatedMoney pence={value.pence} run={Boolean(animateMoney && visible)} />
        ) : (
          value.value
        )}
      </p>
      {hint ? (
        <p className="mt-2 font-mono text-[11px] text-[#54524D]">
          {hint}
        </p>
      ) : null}
    </>
  );
}

function StatCard(props: StatProps) {
  const wrapperCls =
    'ps-set flex flex-col rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 md:p-6';
  if (props.href) {
    return (
      <Link
        href={props.href}
        title={props.title}
        className={`${wrapperCls} transition-colors hover:bg-[#E4DACA]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5B1F]`}
        style={{ transitionDuration: '160ms' }}
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
  const showProfit = typeof profitMonthPence === 'number';

  return (
    <section
      className={
        showProfit
          ? 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'
          : 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4'
      }
    >
      <StatCard
        label="cleaners activos"
        value={{ kind: 'text', value: String(cleanersActive) }}
        hint="en tu equipo"
        href="/owner/preview/cleaners"
        title="Ver y gestionar los cleaners activos de tu equipo"
      />
      <StatCard
        label="nuevas reservas"
        value={{ kind: 'text', value: String(bookingsWeek) }}
        hint="vs. semana pasada"
        delta={bookingsDelta}
        href="/owner/preview/tasks"
        title="Ver las limpiezas programadas esta semana"
      />
      <StatCard
        label="ingresos"
        value={{ kind: 'money', pence: revenueMonthPence }}
        hint="vs. mes pasado"
        delta={revenueDelta}
        href="/owner/preview/analytics"
        title="Ver tendencias de ingresos y KPIs detallados"
        animateMoney
      />
      {showProfit ? (
        <StatCard
          label="beneficio"
          value={{ kind: 'money', pence: profitMonthPence as number }}
          hint="ingresos − pagado"
          delta={profitDelta}
          href="/owner/preview/analytics"
          title="Ver desglose de costes vs. ingresos"
          animateMoney
        />
      ) : null}
    </section>
  );
}

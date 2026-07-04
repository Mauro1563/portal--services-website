'use client';

/**
 * Cleaner (Operative) preview earnings card — "Efficient Work" mockup shape.
 *
 * Local to app/operative/preview/ so the shared PreviewEarningsStrip
 * (still used by preview-airbnb) stays untouched. Reuses the same
 * EarningsAnimationProvider hook so the coin-flip choreography continues
 * to land in the "Hoy" figure when a task is swiped complete.
 */
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ShoppingCart, Wallet } from 'lucide-react';
import { useEarningsAnimation } from '@/components/preview/EarningsCoinAnimator';

function formatMoney(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
}

export function CleanerEarningsCard({
  todayPence,
  weekPence,
  href = '/operative/earnings',
  todayLabel,
  weekLabel,
}: {
  todayPence: number;
  weekPence: number;
  href?: string;
  todayLabel: string;
  weekLabel: string;
}) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const { registerCounter } = useEarningsAnimation();

  useEffect(() => {
    registerCounter(spanRef.current);
    return () => registerCounter(null);
  }, [registerCounter]);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.textContent = formatMoney(todayPence);
    }
  }, [todayPence]);

  return (
    <Link
      href={href}
      prefetch={true}
      aria-label="Ver desglose de ganancias"
      className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_10px_24px_-12px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {todayLabel}
        </p>
        <p className="mt-1 font-display text-[30px] font-bold leading-none text-slate-900">
          <span
            ref={spanRef}
            data-earnings-counter
            className="tabular-nums inline-block origin-center"
            style={{ willChange: 'transform' }}
          >
            {formatMoney(todayPence)}
          </span>
        </p>
        <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
          {weekLabel} {formatMoney(weekPence)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-[#10B981] ring-1 ring-emerald-100">
          <Wallet className="h-4 w-4" />
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-[#10B981] ring-1 ring-emerald-100">
          <ShoppingCart className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

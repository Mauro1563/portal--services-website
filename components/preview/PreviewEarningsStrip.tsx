'use client';

/**
 * Preview-only earnings strip — mirrors components/operative/EarningsStrip
 * but exposes the "Hoy" figure to the EarningsAnimationProvider so the
 * coin-flip choreography can roll it via an rAF loop (no React re-render).
 *
 * The auth-gated /operative route keeps using the original EarningsStrip;
 * we only swap in this version on /operative/preview so the demo can
 * play the animation when a swipe completes a task.
 */
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ChevronRight, Coins, TrendingUp } from 'lucide-react';
import { useEarningsAnimation } from '@/components/preview/EarningsCoinAnimator';

function formatMoney(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function PreviewEarningsStrip({
  todayPence,
  weekPence,
  href = '/operative/earnings',
}: {
  todayPence: number;
  weekPence: number;
  href?: string;
}) {
  const isEmpty = todayPence === 0;
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const { registerCounter } = useEarningsAnimation();

  useEffect(() => {
    registerCounter(spanRef.current);
    return () => registerCounter(null);
  }, [registerCounter]);

  // Keep the span's textContent in sync when todayPence updates *without*
  // an animation (e.g. on initial mount or demo reset). The animator
  // overwrites this when it rolls, but React re-renders will reset it
  // back to the canonical value on the next paint.
  useEffect(() => {
    if (spanRef.current && !isEmpty) {
      spanRef.current.textContent = formatMoney(todayPence);
    }
  }, [todayPence, isEmpty]);

  return (
    <Link
      href={href}
      prefetch={true}
      aria-label="Ver desglose de ganancias"
      className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-card transition hover:border-emerald-300 hover:shadow-md"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.6)]">
        <Coins className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
          Ganado hoy
        </p>
        {isEmpty ? (
          <p className="mt-1 max-w-[18ch] text-[11px] leading-snug text-emerald-800/80">
            Empieza tu primera tarea para ver tus ganancias.
          </p>
        ) : (
          <>
            <p className="mt-0.5 font-display text-[40px] font-bold leading-none text-text-1">
              <span
                ref={spanRef}
                data-earnings-counter
                className="tabular-nums inline-block origin-center"
                style={{ willChange: 'transform' }}
              >
                {formatMoney(todayPence)}
              </span>
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-text-3">
              <TrendingUp className="h-3 w-3" />
              Semana {formatMoney(weekPence)}
            </p>
          </>
        )}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-emerald-700" />
    </Link>
  );
}

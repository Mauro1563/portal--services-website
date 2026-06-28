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
import { ChevronRight } from 'lucide-react';
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
      className="ps-set group mt-6 flex items-center gap-4 rounded-[12px] bg-[#3F5B3A] p-5 text-[#F4EFE6]"
    >
      <div className="min-w-0 flex-1">
        <p className="ps-mono text-[12px] text-[#F4EFE6]/75">
          ganado hoy
        </p>
        {isEmpty ? (
          <p className="ps-serif-italic mt-2 max-w-[22ch] text-[20px] leading-tight text-[#F4EFE6]/85">
            Empieza tu primera tarea para ver tus ganancias.
          </p>
        ) : (
          <>
            <p className="ps-serif mt-1 text-[56px] leading-[0.95] tracking-[-0.03em] text-[#F4EFE6]">
              <span
                ref={spanRef}
                data-earnings-counter
                className="tabular-nums inline-block origin-center"
                style={{ willChange: 'transform' }}
              >
                {formatMoney(todayPence)}
              </span>
            </p>
            <p className="ps-mono mt-2 text-[12px] text-[#F4EFE6]/70">
              semana <span className="tabular-nums text-[#F4EFE6]">{formatMoney(weekPence)}</span>
            </p>
          </>
        )}
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-[#F4EFE6]/70 transition-transform group-hover:translate-x-0.5"
        style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
      />
    </Link>
  );
}

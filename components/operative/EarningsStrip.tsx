import Link from 'next/link';
import { ChevronRight, Coins, TrendingUp } from 'lucide-react';

function formatMoney(pence: number): string {
  // Always show pence on the money screen — silent rounding erodes trust.
  // £12.50 must read as £12.50, not £13 or £12.
  return `£${(pence / 100).toFixed(2)}`;
}

/**
 * Big-number earnings card pinned high on the cleaner home — answers the
 * one question a cleaner asks mid-shift: "how much have I made today?"
 * Shows today + week so they get instant context without going to /week.
 *
 * The numbers are computed by the caller from
 *   actual_hours * cleaner_pay_rate_pence + tip_pence
 * (see lib/cleaner-earnings.ts). This component just renders.
 *
 * Tapping the strip opens /operative/earnings — the per-task breakdown
 * with tips listed individually, which is the "show me where this
 * number came from" follow-up question.
 */
export function EarningsStrip({
  todayPence,
  weekPence,
  href = '/operative/earnings',
}: {
  todayPence: number;
  weekPence: number;
  /** Destination for the strip. Defaults to the real /operative/earnings
   *  page. The /operative/preview home overrides this to point at the
   *  weekly summary, which is where the per-day breakdown lives in the
   *  no-auth demo. */
  href?: string;
}) {
  const isEmpty = todayPence === 0;
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
            <p className="mt-0.5 font-display text-[40px] font-bold leading-none tabular-nums text-text-1">
              {formatMoney(todayPence)}
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

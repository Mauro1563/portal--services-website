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
      className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_10px_24px_-12px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:shadow-md"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#0A0D18] text-white ring-1 ring-[#10B981]/40">
        <Coins className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          Ganado hoy
        </p>
        {isEmpty ? (
          <p className="mt-1 max-w-[18ch] text-[11px] leading-snug text-slate-500">
            Empieza tu primera tarea para ver tus ganancias.
          </p>
        ) : (
          <>
            <p className="mt-0.5 font-display text-[40px] font-bold leading-none tabular-nums text-[#0A0D18]">
              {formatMoney(todayPence)}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <TrendingUp className="h-3 w-3" />
              Semana {formatMoney(weekPence)}
            </p>
          </>
        )}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </Link>
  );
}

import Link from 'next/link';
import { ChevronRight, Coins, TrendingUp } from 'lucide-react';

function formatMoney(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
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
  return (
    <Link
      href={href}
      prefetch={true}
      aria-label="Ver desglose de ganancias"
      className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-4 shadow-card transition hover:border-emerald-300 hover:shadow-md"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-[0_8px_20px_-8px_rgba(5,150,105,0.6)]">
        <Coins className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          Ganado hoy
        </p>
        <p className="mt-0.5 font-display text-2xl font-bold tabular-nums text-text-1">
          {formatMoney(todayPence)}
        </p>
      </div>
      <div className="text-right">
        <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-text-3">
          <TrendingUp className="h-3 w-3" /> Semana
        </p>
        <p className="mt-0.5 font-display text-base font-bold tabular-nums text-text-1">
          {formatMoney(weekPence)}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-emerald-700" />
    </Link>
  );
}

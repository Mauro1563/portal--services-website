import { Coins, TrendingUp } from 'lucide-react';

function formatMoney(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
}

/**
 * Big-number earnings card pinned high on the cleaner home — answers the
 * one question a cleaner asks mid-shift: "how much have I made today?"
 * Shows today + week so they get instant context without going to /week.
 *
 * Mirrors the "Efficient Work" mockup's "$120 today" element but with
 * the secondary week figure baked in.
 */
export function EarningsStrip({
  todayPence,
  weekPence,
}: {
  todayPence: number;
  weekPence: number;
}) {
  return (
    <section className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-4 shadow-card">
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
    </section>
  );
}

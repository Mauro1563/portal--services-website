import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

function formatMoney(pence: number): string {
  // Always show pence on the money screen — silent rounding erodes trust.
  // £12.50 must read as £12.50, not £13 or £12.
  return `£${(pence / 100).toFixed(2)}`;
}

/**
 * Cleaner highlight card — the "one big thing" per cleaner screen.
 * Moss background (`#3F5B3A`) + paper text, Instrument Serif numeral.
 * Tapping the card opens the per-task earnings breakdown.
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
            <p className="ps-serif mt-1 text-[56px] leading-[0.95] tracking-[-0.03em] tabular-nums text-[#F4EFE6]">
              {formatMoney(todayPence)}
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

import Link from 'next/link';
import { ArrowRight, Clock, PoundSterling, Star } from 'lucide-react';

function formatMoney(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

function formatHours(minutes: number): string {
  if (minutes <= 0) return '0h';
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

/**
 * Compact week summary that lives on the home dashboard — same numbers as
 * /operative/week but as a single tappable card so the cleaner sees their
 * progress without leaving home. The whole card links to /week for detail.
 */
export function WeekStatsMini({
  minutesWorked,
  earningsPence,
  avgStars,
  ratingCount,
}: {
  minutesWorked: number;
  earningsPence: number;
  avgStars: number | null;
  ratingCount: number;
}) {
  const empty =
    minutesWorked === 0 && earningsPence === 0 && ratingCount === 0;

  return (
    <Link
      href="/operative/week"
      className="group mt-6 flex items-center gap-3 rounded-3xl border border-surface-2 bg-gradient-to-br from-paper via-paper to-brand-50/40 p-4 shadow-card transition hover:border-brand-400/50 hover:shadow-card-lg sm:p-5"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
          Esta semana
        </p>
        {empty ? (
          <p className="mt-1.5 text-xs text-text-3">
            Cuando completes tareas, verás tus horas, earnings y rating aquí.
          </p>
        ) : (
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <Stat
              icon={<Clock className="h-3.5 w-3.5 text-brand-500" />}
              value={formatHours(minutesWorked)}
              label="Horas"
            />
            <Stat
              icon={<PoundSterling className="h-3.5 w-3.5 text-emerald-600" />}
              value={formatMoney(earningsPence)}
              label="Ganado"
            />
            <Stat
              icon={<Star className="h-3.5 w-3.5 text-amber-500" />}
              value={avgStars == null ? '—' : avgStars.toFixed(1)}
              label={ratingCount > 0 ? `${ratingCount} review${ratingCount === 1 ? '' : 's'}` : 'rating'}
            />
          </div>
        )}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-text-3 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </Link>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1 font-display text-sm font-bold text-text-1 tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-3">
        {label}
      </p>
    </div>
  );
}

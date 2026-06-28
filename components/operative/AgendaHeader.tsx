import Link from 'next/link';
import { signOutOperative } from '@/app/operative/actions';
import { ThemeToggle } from '@/components/operative/ThemeToggle';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

const DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const DAY_FULL = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIÉRCOLES',
  'JUEVES',
  'VIERNES',
  'SÁBADO',
];
const MONTH = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

/**
 * "Tu Agenda Hoy" header — compact light card on the Zapli palette
 * (white surface + teal accents) so it sits in the same family as the
 * earnings card and "Next stop" card beneath it instead of crashing in
 * as a dark slab.
 */
export async function AgendaHeader({
  cleanerName,
  now,
  doneCount,
  totalCount,
  weekHref = '/operative/week',
  inProgressTaskId,
  decorationSlot,
}: {
  cleanerName: string;
  /** Pass `new Date()` from the server component — keeps SSR deterministic. */
  now: Date;
  doneCount: number;
  totalCount: number;
  /** Destination for the "doneCount/totalCount tareas" pill. */
  weekHref?: string;
  /** When set, the "En curso" chip becomes an anchor link to `#task-<id>` so
   *  tapping it scrolls the in-progress task card into view. When omitted,
   *  the chip is hidden (the per-task status pill already conveys it). */
  inProgressTaskId?: string;
  /** Optional decorative slot rendered directly under the "Cleaner · name"
   *  caption. The /operative/preview demo uses this to drop in the kintsugi
   *  progress thread. Prod /operative leaves it undefined. */
  decorationSlot?: React.ReactNode;
}) {
  const firstName = cleanerName.split(' ')[0];
  const dayFull = DAY_FULL[now.getDay()];
  const dayShort = DAY_NAMES[now.getDay()];
  const monthShort = MONTH[now.getMonth()];
  const dayNum = now.getDate();

  return (
    <header className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-[#F2FFFC] to-white px-4 pb-4 pt-4 text-slate-900 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06),_0_12px_28px_-12px_rgba(0,216,199,0.18)] sm:px-5 sm:pt-5">
      {/* Subtle teal corner glow to add depth without weight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-10 h-32 w-32 rounded-full bg-[#00D8C7]/15 blur-2xl"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#00B8A8]">
            Cleaner · {firstName}
          </p>
          <h1 className="mt-1 font-display text-[14px] font-medium text-slate-700">
            Tu agenda hoy
          </h1>
          {decorationSlot ? <div className="mt-1">{decorationSlot}</div> : null}
        </div>
        <div className="flex items-center gap-1.5">
          <LocaleSwitcher variant="premium" />
          <ThemeToggle />
          <form action={signOutOperative}>
            <button
              type="submit"
              className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 transition hover:border-[#00D8C7] hover:bg-[#00D8C7]/10 hover:text-[#0A0D18]"
            >
              Salir
            </button>
          </form>
        </div>
      </div>

      <div className="relative mt-3 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold leading-none tracking-tight text-[#0A0D18] tabular-nums">
            {dayNum}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {dayFull}
            </span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {monthShort}
            </span>
          </div>
        </div>
        <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:inline">
          {dayShort} · {String(dayNum).padStart(2, '0')}/{String(now.getMonth() + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative mt-3 flex items-center gap-2">
        <Link
          href={weekHref}
          title="Ver el resumen semanal de tareas"
          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-200"
        >
          {totalCount === 0
            ? 'Sin tareas hoy'
            : `${doneCount}/${totalCount} ${totalCount === 1 ? 'tarea' : 'tareas'}`}
        </Link>
        {totalCount > 0 && inProgressTaskId ? (
          <a
            href={`#task-${inProgressTaskId}`}
            title="Saltar a la tarea que tienes en curso ahora mismo"
            className="inline-flex items-center gap-1 rounded-full bg-[#00D8C7]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00B8A8] ring-1 ring-inset ring-[#00D8C7]/40 transition hover:bg-[#00D8C7]/25"
          >
            En curso
          </a>
        ) : null}
      </div>
    </header>
  );
}

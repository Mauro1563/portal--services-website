import Link from 'next/link';
import { signOutOperative } from '@/app/operative/actions';
import { ThemeToggle } from '@/components/operative/ThemeToggle';

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
 * "Tu Agenda Hoy" header — large display date in the Efficient Work
 * style. Three lines: portal label, agenda title, big date string
 * (MARTES 28 MAR). Sign-out + theme toggle on the right.
 */
export function AgendaHeader({
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
    <header className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-5 pb-5 pt-6 text-white shadow-card-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/90">
            Cleaner · {firstName}
          </p>
          <h1 className="mt-1 font-display text-[15px] font-medium text-white/85">
            Tu agenda hoy
          </h1>
          {decorationSlot ? <div className="mt-1">{decorationSlot}</div> : null}
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <form action={signOutOperative}>
            <button
              type="submit"
              className="rounded-full border border-white/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/85 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              Salir
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-bold leading-none tracking-tight text-white tabular-nums">
            {dayNum}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
              {dayFull}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {monthShort}
            </span>
          </div>
        </div>
        <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-white/55 sm:inline">
          {dayShort} · {String(dayNum).padStart(2, '0')}/{String(now.getMonth() + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={weekHref}
          title="Ver el resumen semanal de tareas"
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/85 transition hover:bg-white/20"
        >
          {totalCount === 0
            ? 'Sin tareas hoy'
            : `${doneCount}/${totalCount} ${totalCount === 1 ? 'tarea' : 'tareas'}`}
        </Link>
        {totalCount > 0 && inProgressTaskId ? (
          <a
            href={`#task-${inProgressTaskId}`}
            title="Saltar a la tarea que tienes en curso ahora mismo"
            className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200 transition hover:bg-emerald-400/25"
          >
            En curso
          </a>
        ) : null}
      </div>
    </header>
  );
}

import Link from 'next/link';
import { signOutOperative } from '@/app/operative/actions';
import { ThemeToggle } from '@/components/operative/ThemeToggle';

const DAY_NAMES = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const DAY_FULL = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];
const MONTH = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

/**
 * "Tu Agenda Hoy" header — editorial-paper rendition. A big Instrument
 * Serif day-of-month number anchors the block, with a single mandarin
 * underline on the cleaner's first name. Status chips sit underneath as
 * mono microcopy. Replaces the prior slate-gradient card.
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
    <header className="ps-set rounded-[12px] border border-[#1414141A] bg-[#E4DACA] px-5 pb-5 pt-6 text-[#141414]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="ps-mono text-[12px] text-[#54524D]">
            cleaner · <span className="ps-link-mandarin text-[#141414]">{firstName}</span>
          </p>
          <h1 className="ps-serif mt-1 text-[20px] leading-none tracking-[-0.015em] text-[#141414]">
            Tu agenda hoy
          </h1>
          {decorationSlot ? <div className="mt-1">{decorationSlot}</div> : null}
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <form action={signOutOperative}>
            <button
              type="submit"
              className="rounded-full border border-[#1414141A] px-3 py-1 text-[12px] font-medium text-[#54524D] transition-colors hover:border-[#141414] hover:text-[#141414]"
              style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
            >
              Salir
            </button>
          </form>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="ps-serif text-[88px] leading-[0.85] tracking-[-0.04em] tabular-nums text-[#141414]">
            {dayNum}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="ps-serif-italic text-[22px] leading-none tracking-[-0.02em] text-[#141414]">
              {dayFull}
            </span>
            <span className="ps-mono mt-1 text-[12px] text-[#54524D]">
              {monthShort} · {String(dayNum).padStart(2, '0')}/{String(now.getMonth() + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
        <span className="ps-mono hidden text-[12px] text-[#54524D] sm:inline">
          {dayShort}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link
          href={weekHref}
          title="Ver el resumen semanal de tareas"
          className="ps-mono inline-flex items-center gap-1 rounded-full border border-[#1414141A] bg-[#F4EFE6] px-3 py-1 text-[12px] text-[#141414] transition-colors hover:border-[#141414]"
          style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
        >
          {totalCount === 0
            ? 'sin tareas hoy'
            : `${doneCount}/${totalCount} ${totalCount === 1 ? 'tarea' : 'tareas'}`}
        </Link>
        {totalCount > 0 && inProgressTaskId ? (
          <a
            href={`#task-${inProgressTaskId}`}
            title="Saltar a la tarea que tienes en curso ahora mismo"
            className="ps-mono inline-flex items-center gap-1.5 rounded-full bg-[#FF5B1F] px-3 py-1 text-[12px] text-[#1A0A04] transition-colors"
            style={{ transitionDuration: 'var(--dur-fast)', transitionTimingFunction: 'var(--ease)' }}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#1A0A04] animate-pulse" />
            en curso
          </a>
        ) : null}
      </div>
    </header>
  );
}

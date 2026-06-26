import Link from 'next/link';
import { Clock, MapPin, Navigation2 } from 'lucide-react';
import { singleStopUrl, type Stop } from '@/lib/maps';

export type AgendaTask = {
  id: string;
  start_time: string | null;
  status: string;
  estimated_duration_min: number | null;
  property: { name: string | null; address: string | null } | null;
  client: { name: string | null; address: string | null; postcode: string | null } | null;
};

const STATUS: Record<
  string,
  { label: string; cls: string; dot: string }
> = {
  scheduled: {
    label: 'Pendiente',
    cls: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
  },
  in_progress: {
    label: 'En curso',
    cls: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-500 animate-pulse',
  },
  completed: {
    label: 'Completada',
    cls: 'bg-emerald-100 text-emerald-800',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelada',
    cls: 'bg-rose-100 text-rose-700',
    dot: 'bg-rose-400',
  },
};

function formatHours(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

function bestAddress(task: AgendaTask): {
  display: string | null;
  stop: Stop | null;
} {
  const address = task.client?.address ?? task.property?.address ?? null;
  const postcode = task.client?.postcode ?? null;
  if (!address) return { display: null, stop: null };
  return {
    display: postcode ? `${address}, ${postcode}` : address,
    stop: { address, postcode },
  };
}

/**
 * Vertical timeline of today's stops in "Efficient Work" style — big
 * time slot on the left, client + status + address on the right, single
 * tap "navigate" button per row. The connecting line + status dot makes
 * the day flow read like an agenda app (Calendar, Fantastical, …) rather
 * than a list.
 */
export function AgendaTimeline({ tasks }: { tasks: AgendaTask[] }) {
  if (tasks.length === 0) return null;

  return (
    <ol className="relative mt-4">
      {/* Vertical connecting line behind all dots. */}
      <span
        aria-hidden
        className="absolute left-[60px] top-3 bottom-3 w-px bg-surface-2"
      />

      {tasks.map((task, idx) => {
        const st = STATUS[task.status] ?? STATUS.scheduled;
        const addr = bestAddress(task);
        const headline =
          task.client?.name ?? task.property?.name ?? 'Sin destino';
        const duration = formatHours(task.estimated_duration_min);
        const time = task.start_time?.slice(0, 5) ?? '—';

        return (
          <li key={task.id} className="relative pb-3 last:pb-0">
            <Link
              href={`/operative/tasks/${task.id}`}
              className="group flex items-stretch gap-3"
            >
              {/* Time column */}
              <div className="flex w-[52px] shrink-0 flex-col items-end pt-2.5">
                <p className="font-display text-base font-bold tabular-nums text-text-1">
                  {time}
                </p>
                {duration ? (
                  <p className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] text-text-3">
                    <Clock className="h-2.5 w-2.5" /> {duration}
                  </p>
                ) : null}
              </div>

              {/* Status dot */}
              <span className="relative flex w-4 shrink-0 justify-center pt-3.5">
                <span
                  aria-hidden
                  className={`h-3 w-3 rounded-full ring-4 ring-surface-1 ${st.dot}`}
                />
              </span>

              {/* Card */}
              <div className="min-w-0 flex-1 rounded-2xl border border-surface-2 bg-paper p-3 shadow-card transition group-hover:border-brand-400/60 group-hover:shadow-card-lg">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-text-1">
                    {headline}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}
                  >
                    {st.label}
                  </span>
                </div>
                {addr.display ? (
                  <p className="mt-1 inline-flex items-center gap-1 truncate text-[11px] text-text-3">
                    <MapPin className="h-3 w-3 shrink-0 text-brand-600" />
                    <span className="truncate">{addr.display}</span>
                  </p>
                ) : null}
                {addr.stop ? (
                  <div className="mt-2 flex items-center justify-end">
                    <a
                      href={singleStopUrl(addr.stop)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700 transition hover:bg-brand-100"
                    >
                      <Navigation2 className="h-3 w-3" />
                      Ir
                    </a>
                  </div>
                ) : null}
              </div>
            </Link>

            {/* Step number badge on dot */}
            <span
              aria-hidden
              className="absolute left-[68px] top-[14px] text-[8px] font-bold text-white"
              style={{ width: 16, textAlign: 'center' }}
            >
              {idx + 1}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

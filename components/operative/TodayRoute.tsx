import Link from 'next/link';
import { Clock, MapPin, Navigation2, Route } from 'lucide-react';
import { routeUrl, singleStopUrl, type Stop } from '@/lib/maps';

export type RouteTask = {
  id: string;
  start_time: string | null;
  status: string;
  estimated_duration_min: number | null;
  property: { name: string | null; address: string | null } | null;
  client: { name: string | null; address: string | null; postcode: string | null } | null;
};

function statusDot(status: string): string {
  if (status === 'completed') return 'bg-emerald-500';
  if (status === 'in_progress') return 'bg-amber-500 animate-pulse';
  if (status === 'cancelled') return 'bg-rose-400';
  return 'bg-brand-600/40';
}

function statusLabel(status: string): string {
  if (status === 'completed') return 'Hecho';
  if (status === 'in_progress') return 'En curso';
  if (status === 'cancelled') return 'Cancelado';
  return 'Pendiente';
}

function formatHours(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

function bestAddress(task: RouteTask): {
  display: string | null;
  stop: Stop | null;
} {
  // Client address (house_cleaning) beats property address (airbnb). Postcode
  // appended for precision when present.
  const address = task.client?.address ?? task.property?.address ?? null;
  const postcode = task.client?.postcode ?? null;
  if (!address) return { display: null, stop: null };
  return {
    display: postcode ? `${address}, ${postcode}` : address,
    stop: { address, postcode },
  };
}

/**
 * Today's route — chronological list of stops plus a single "Open route"
 * button that chains every stop's address as Google Maps waypoints. Skips
 * already-completed stops in the route URL (only navigates to remaining
 * work) but still shows them in the list as checked off.
 */
export function TodayRoute({ tasks }: { tasks: RouteTask[] }) {
  if (tasks.length === 0) return null;

  // Remaining = anything not yet done — that's what we actually need to drive to.
  const remaining = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled',
  );
  const stops: Stop[] = remaining
    .map((t) => bestAddress(t).stop)
    .filter((s): s is Stop => s !== null);

  const route = routeUrl(stops);

  return (
    <section className="mt-6 rounded-3xl border border-surface-2 bg-surface-0 p-4 shadow-card sm:p-5">
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
            <Route className="h-3 w-3" /> Ruta de hoy
          </p>
          <h2 className="mt-1 font-display text-base font-semibold text-text-1">
            {tasks.length} {tasks.length === 1 ? 'parada' : 'paradas'}
            {remaining.length < tasks.length ? (
              <span className="text-text-3 font-normal">
                {' '}
                · {remaining.length} pendiente{remaining.length === 1 ? '' : 's'}
              </span>
            ) : null}
          </h2>
        </div>
        {route ? (
          <a
            href={route.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-brand-glow transition active:scale-[0.98] hover:brightness-110"
          >
            <Navigation2 className="h-3.5 w-3.5" />
            Abrir ruta
          </a>
        ) : null}
      </header>

      {route?.truncated ? (
        <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] text-amber-800">
          Google Maps acepta máximo 10 paradas — la ruta abrirá las primeras.
        </p>
      ) : null}

      <ol className="mt-4 space-y-2">
        {tasks.map((task, idx) => {
          const addr = bestAddress(task);
          const headline =
            task.client?.name ?? task.property?.name ?? 'Sin destino';
          const duration = formatHours(task.estimated_duration_min);
          return (
            <li key={task.id}>
              <Link
                href={`/operative/tasks/${task.id}`}
                className="flex items-start gap-3 rounded-2xl border border-surface-2 bg-paper px-3 py-2.5 transition hover:border-brand-400/50 hover:bg-brand-50/40"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="truncate font-display text-sm font-semibold text-text-1">
                      {headline}
                    </p>
                    {task.start_time ? (
                      <span className="shrink-0 text-[10px] tabular-nums text-text-3">
                        {task.start_time.slice(0, 5)}
                      </span>
                    ) : null}
                  </div>
                  {addr.display ? (
                    <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[11px] text-text-3">
                      <MapPin className="h-3 w-3 text-brand-600" />
                      <span className="truncate">{addr.display}</span>
                    </p>
                  ) : null}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-text-3">
                    <span className="inline-flex items-center gap-1">
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 rounded-full ${statusDot(task.status)}`}
                      />
                      {statusLabel(task.status)}
                    </span>
                    {duration ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {duration}
                      </span>
                    ) : null}
                  </div>
                </div>
                {addr.stop ? (
                  <a
                    href={singleStopUrl(addr.stop)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Navegar a ${headline}`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-1 text-brand-700 transition hover:bg-brand-50"
                  >
                    <Navigation2 className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

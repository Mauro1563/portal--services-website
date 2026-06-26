import Link from 'next/link';
import { MapPin, Radio } from 'lucide-react';

export type FieldCheckin = {
  taskId: string;
  cleanerName: string | null;
  propertyName: string | null;
  clientName: string | null;
  lat: number | null;
  lng: number | null;
  checkedInAt: string | null;
};

const RELATIVE = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

function relative(iso: string | null): string {
  if (!iso) return '—';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'justo ahora';
  if (minutes < 60) return RELATIVE.format(-minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (hours < 24) return RELATIVE.format(-hours, 'hour');
  const days = Math.round(hours / 24);
  return RELATIVE.format(-days, 'day');
}

/**
 * "Cleaners en campo" — stand-in for the live-map widget in the
 * Corporate Trust mockup. We don't have continuous GPS tracking yet
 * (only check-in snapshots), so we surface the freshest check-in per
 * cleaner with a one-tap "ver en mapa" link instead of rendering a
 * real map (which would need a Google Maps API key + JS bundle).
 */
export function CleanersField({ checkins }: { checkins: FieldCheckin[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            <Radio className="h-3 w-3 text-emerald-500" /> Cleaners en campo
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-slate-900">
            {checkins.length === 0
              ? 'Nadie checked in ahora'
              : `${checkins.length} ${checkins.length === 1 ? 'check-in' : 'check-ins'} en las últimas 8h`}
          </h2>
        </div>
        <Link
          href="/owner/tasks?status=in_progress"
          className="text-[11px] font-semibold text-blue-700 hover:text-blue-800"
        >
          Ver todos →
        </Link>
      </header>

      {checkins.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-4 py-6 text-center text-[12px] text-slate-500">
          Cuando un cleaner haga check-in en una tarea, aparecerá aquí con
          su ubicación.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {checkins.map((c) => {
            const headline = c.cleanerName ?? 'Cleaner';
            const where =
              c.clientName ?? c.propertyName ?? 'propiedad sin nombre';
            const mapHref =
              c.lat != null && c.lng != null
                ? `https://www.google.com/maps?q=${c.lat},${c.lng}`
                : null;
            return (
              <li key={c.taskId}>
                <Link
                  href={`/owner/tasks/${c.taskId}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 transition hover:border-blue-300 hover:bg-blue-50/30"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-[11px] font-bold text-white">
                    {headline
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((w) => w[0] ?? '')
                      .join('')
                      .toUpperCase() || 'C'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-slate-900">
                      {headline}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      {where} · {relative(c.checkedInAt)}
                    </p>
                  </div>
                  {mapHref ? (
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Ver en mapa"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

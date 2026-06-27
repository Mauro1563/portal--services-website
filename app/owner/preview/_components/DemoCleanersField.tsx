import Link from 'next/link';
import { MapPin, Radio } from 'lucide-react';

export type DemoFieldCheckin = {
  taskId: string;
  cleanerName: string;
  propertyName: string;
  clientName: string;
  relative: string;
  lat?: number;
  lng?: number;
};

/**
 * Preview-only version of CleanersField — same layout/colors as the
 * real component but routes link to /owner/preview/tasks/<id> so the
 * tour stays self-contained.
 */
export function DemoCleanersField({ checkins }: { checkins: DemoFieldCheckin[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            <Radio className="h-3 w-3 text-emerald-500" /> Cleaners en campo
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-slate-900">
            {checkins.length} check-ins en las últimas 8h
          </h2>
        </div>
        <Link
          href="/owner/preview/tasks"
          className="text-[11px] font-semibold text-blue-700 hover:text-blue-800"
        >
          Ver todos →
        </Link>
      </header>

      <ul className="mt-3 space-y-2">
        {checkins.map((c) => {
          const initials =
            c.cleanerName
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0] ?? '')
              .join('')
              .toUpperCase() || 'C';
          const mapHref =
            c.lat != null && c.lng != null
              ? `https://www.google.com/maps?q=${c.lat},${c.lng}`
              : null;
          return (
            <li key={c.taskId}>
              <Link
                href={`/owner/preview/tasks/${c.taskId}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 px-3 py-2.5 transition hover:border-blue-300 hover:bg-blue-50/30"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-[11px] font-bold text-white">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-900">
                    {c.cleanerName}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                    {c.clientName} · {c.propertyName} · {c.relative}
                  </p>
                </div>
                {mapHref ? (
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
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
    </section>
  );
}

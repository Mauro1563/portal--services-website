'use client';

import Link from 'next/link';
import { MapPin, Radio } from 'lucide-react';
import { DemoLiveOpsPulse } from './DemoLiveOpsPulse';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

export type DemoFieldCheckin = {
  taskId: string;
  cleanerName: string;
  propertyName: string;
  clientName: string;
  relative: string;
  lat?: number;
  lng?: number;
};

const COPY = {
  en: {
    title: 'Field operatives',
    visitsCount: (n: number) => `${n} visits in the last 8 hours`,
    seeAll: 'See all →',
    viewOnMap: (property: string) => `See ${property} on the map`,
    openInMaps: 'Open location in Google Maps',
  },
  es: {
    title: 'Operarios en campo',
    visitsCount: (n: number) => `${n} visitas en las últimas 8 horas`,
    seeAll: 'Ver todos →',
    viewOnMap: (property: string) => `Ver ${property} en el mapa`,
    openInMaps: 'Abrir ubicación en Google Maps',
  },
  pt: {
    title: 'Operacionais no terreno',
    visitsCount: (n: number) => `${n} visitas nas últimas 8 horas`,
    seeAll: 'Ver todos →',
    viewOnMap: (property: string) => `Ver ${property} no mapa`,
    openInMaps: 'Abrir localização no Google Maps',
  },
} as const;

/**
 * Preview-only version of CleanersField — same layout/colors as the
 * real component but routes link to /owner/preview/tasks/<id> so the
 * tour stays self-contained.
 */
export function DemoCleanersField({ checkins }: { checkins: DemoFieldCheckin[] }) {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
            <Radio className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
            {t.title}
          </h2>
          <p className="mt-0.5 text-[12.5px] text-slate-600">
            {t.visitsCount(checkins.length)}
          </p>
        </div>
        <Link
          href="/owner/preview/tasks"
          className="shrink-0 text-[12px] font-semibold text-slate-900 hover:text-slate-700"
        >
          {t.seeAll}
        </Link>
      </header>

      <DemoLiveOpsPulse />

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
            <li
              key={c.taskId}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 transition hover:border-slate-300 hover:bg-slate-50 focus-within:border-slate-300"
            >
              <Link
                href={`/owner/preview/tasks/${c.taskId}`}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-l-xl px-3 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00D8C7]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-[12px] font-bold text-slate-700 ring-1 ring-slate-200">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-900">
                    {c.cleanerName}
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] text-slate-600">
                    {c.clientName} · {c.propertyName} · {c.relative}
                  </p>
                </div>
              </Link>
              {mapHref ? (
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.viewOnMap(c.propertyName)}
                  title={t.openInMaps}
                  className="mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0A0D18] text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D8C7]"
                >
                  <MapPin className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

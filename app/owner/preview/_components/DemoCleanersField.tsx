'use client';

import Link from 'next/link';
import { MapPin, Minus, Plus, Radio } from 'lucide-react';
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
    realtimeLocations: 'Real-time Cleaner locations',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  },
  es: {
    title: 'Operarios en campo',
    visitsCount: (n: number) => `${n} visitas en las últimas 8 horas`,
    seeAll: 'Ver todos →',
    viewOnMap: (property: string) => `Ver ${property} en el mapa`,
    openInMaps: 'Abrir ubicación en Google Maps',
    realtimeLocations: 'Ubicación de cleaners en vivo',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
  },
  pt: {
    title: 'Operacionais no terreno',
    visitsCount: (n: number) => `${n} visitas nas últimas 8 horas`,
    seeAll: 'Ver todos →',
    viewOnMap: (property: string) => `Ver ${property} no mapa`,
    openInMaps: 'Abrir localização no Google Maps',
    realtimeLocations: 'Localização dos cleaners em tempo real',
    zoomIn: 'Aproximar',
    zoomOut: 'Afastar',
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

      {/* Map-style panel: subtle Google-Maps grid backdrop with a
          "Real-time Cleaner locations" chip pinned top-left and fake
          zoom controls bottom-right, layered over the live ops pulse. */}
      <div
        className="relative mt-3 overflow-hidden rounded-xl ring-1 ring-slate-200"
        style={{
          backgroundColor: '#F1F5F9',
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className="absolute left-2 top-2 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[#2563EB] shadow-[0_0_6px_rgba(37,99,235,0.55)]"
            />
            <MapPin className="h-3 w-3 text-[#2563EB]" />
            {t.realtimeLocations}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 z-10 flex flex-col overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200">
          <button
            type="button"
            aria-label={t.zoomIn}
            className="grid h-6 w-6 place-items-center text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#10B981]"
          >
            <Plus className="h-3 w-3" />
          </button>
          <span aria-hidden className="h-px w-full bg-slate-200" />
          <button
            type="button"
            aria-label={t.zoomOut}
            className="grid h-6 w-6 place-items-center text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#10B981]"
          >
            <Minus className="h-3 w-3" />
          </button>
        </div>
        <div className="px-2 pb-2 pt-8">
          <DemoLiveOpsPulse />
        </div>
      </div>

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
                className="flex min-w-0 flex-1 items-center gap-3 rounded-l-xl px-3 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#10B981]"
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
                  className="mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0A0D18] text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981]"
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

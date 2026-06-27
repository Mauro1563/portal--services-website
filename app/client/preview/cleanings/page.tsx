/**
 * Public preview: Client → Cleanings list. Mocked reservas (upcoming
 * + past). No auth, no Supabase. Each entry is tied to a London
 * property and completed cleanings show a real thumbnail photo so
 * the prospect sees the visual richness of the portal.
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { DEMO_PHOTOS, LONDON_PROPERTIES, MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

type Status = 'upcoming' | 'done';

type Reserva = {
  id: string;
  service: string;
  cleaner: string;
  when: string;
  duration: string;
  status: Status;
  address: string;
  thumb?: string;
};

const RESERVAS: Reserva[] = [
  {
    id: 'r1',
    service: 'Limpieza estándar',
    cleaner: 'Ana Ruiz',
    when: 'Mañana · 10:00',
    duration: '~2 h',
    status: 'upcoming',
    address: LONDON_PROPERTIES.soho.address,
  },
  {
    id: 'r2',
    service: 'Cristales',
    cleaner: 'Luis Pérez',
    when: 'Fri 5 Jul · 12:30',
    duration: '~1 h',
    status: 'upcoming',
    address: LONDON_PROPERTIES.camden.address,
  },
  {
    id: 'r3',
    service: 'Limpieza profunda',
    cleaner: 'Ana Ruiz',
    when: 'Sat 14 Jun · 09:00',
    duration: '~4 h',
    status: 'done',
    address: LONDON_PROPERTIES.soho.address,
    thumb: DEMO_PHOTOS.kitchen,
  },
  {
    id: 'r4',
    service: 'Limpieza estándar',
    cleaner: 'Ana Ruiz',
    when: 'Wed 4 Jun · 10:00',
    duration: '~2 h',
    status: 'done',
    address: LONDON_PROPERTIES.notting.address,
    thumb: DEMO_PHOTOS.living,
  },
  {
    id: 'r5',
    service: 'Mudanza',
    cleaner: 'Luis Pérez',
    when: 'Mon 12 May · 08:00',
    duration: '~5 h',
    status: 'done',
    address: LONDON_PROPERTIES.mayfair.address,
    thumb: DEMO_PHOTOS.bedroom,
  },
];

function ReservaCard({ r }: { r: Reserva }) {
  const isUpcoming = r.status === 'upcoming';
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(r.address)}`;
  return (
    <li>
      <Link
        href={isUpcoming ? `/client/${PREVIEW_TOKEN}/cleaning` : `/client/${PREVIEW_TOKEN}/cleaning`}
        className="block rounded-3xl bg-white p-4 ring-1 ring-inset ring-slate-100 transition hover:ring-blue-200"
        title={isUpcoming ? 'Ver detalle de la próxima visita' : 'Ver detalle y fotos de la limpieza'}
      >
        <div className="flex items-start gap-3">
          {r.thumb ? (
            <img
              src={r.thumb}
              alt={`Foto de ${r.service}`}
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-inset ring-slate-200"
            />
          ) : (
            <span
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${
                isUpcoming
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isUpcoming ? (
                <CalendarCheck className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                isUpcoming ? 'text-blue-700' : 'text-slate-400'
              }`}
            >
              {r.when}
            </p>
            <p className="mt-0.5 font-display text-sm font-bold text-slate-900">
              {r.service}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Con {r.cleaner} · {r.duration}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{r.address}</span>
            </p>
          </div>
          <span
            className={`shrink-0 self-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              isUpcoming
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isUpcoming ? 'Próxima' : 'Hecha'}
          </span>
        </div>
        {!isUpcoming && (
          <div className="mt-3 flex justify-end">
            <span
              onClick={(e) => {
                e.preventDefault();
                window.open(mapsUrl, '_blank');
              }}
              className="cursor-pointer rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
              title="Abrir dirección en Google Maps"
            >
              Mapa
            </span>
          </div>
        )}
      </Link>
    </li>
  );
}

type FilterKey = 'all' | 'upcoming' | 'done';

export default function ClientCleaningsPreview() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const visible = RESERVAS.filter((r) => filter === 'all' || r.status === filter);
  const upcoming = visible.filter((r) => r.status === 'upcoming');
  const done = visible.filter((r) => r.status === 'done');

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="reservas"
      title="Reservas"
    >
      {/* Filter toolbar */}
      <div
        className="mb-4 flex items-center gap-2 rounded-2xl bg-white p-1.5 ring-1 ring-inset ring-slate-100"
        title="Filtra las reservas que ves abajo"
      >
        <span className="ml-1 grid h-7 w-7 place-items-center rounded-xl bg-slate-100 text-slate-500">
          <Filter className="h-3.5 w-3.5" />
        </span>
        {(
          [
            { key: 'all', label: 'Todas' },
            { key: 'upcoming', label: 'Próximas' },
            { key: 'done', label: 'Hechas' },
          ] as { key: FilterKey; label: string }[]
        ).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setFilter(opt.key)}
            title={`Mostrar solo ${opt.label.toLowerCase()}`}
            className={`flex-1 rounded-xl px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
              filter === opt.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            Próximas
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {upcoming.map((r) => (
              <ReservaCard key={r.id} r={r} />
            ))}
          </ul>
        </section>
      )}

      {done.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Hechas
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {done.map((r) => (
              <ReservaCard key={r.id} r={r} />
            ))}
          </ul>
        </section>
      )}

      {visible.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-100">
          No hay reservas para este filtro.
        </p>
      )}

      <Link
        href={`/client/${PREVIEW_TOKEN}/book`}
        title="Crear una nueva reserva"
        className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition hover:bg-blue-700"
      >
        Reservar nueva limpieza
      </Link>
    </ClientShell>
  );
}

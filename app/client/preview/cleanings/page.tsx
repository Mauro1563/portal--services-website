/**
 * Public preview: Client → Cleanings list. Mocked reservas (upcoming
 * + past). No auth, no Supabase. Each entry is tied to a London
 * property; completed cleanings show a real thumbnail photo so the
 * prospect sees the visual richness of the portal.
 *
 * Filter chips and a search input work in real time. Tapping a
 * past cleaning opens a rich detail sheet with photos, a rating
 * slider, comment box and a "Reservar otra vez" shortcut.
 */
'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { DemoSheet, DemoToast } from '@/components/preview/DemoSheet';
import { DemoLightbox } from '@/components/preview/DemoLightbox';
import { DEMO_PHOTOS, LONDON_PROPERTIES, MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

type Status = 'upcoming' | 'done';

type Reserva = {
  id: string;
  service: string;
  serviceId: string;
  cleaner: string;
  when: string;
  duration: string;
  status: Status;
  address: string;
  thumb?: string;
  photos: string[];
};

const RESERVAS: Reserva[] = [
  {
    id: 'r1',
    service: 'Limpieza estándar',
    serviceId: 'standard',
    cleaner: 'Ana Ruiz',
    when: 'Mañana · 10:00',
    duration: '~2 h',
    status: 'upcoming',
    address: LONDON_PROPERTIES.soho.address,
    photos: [],
  },
  {
    id: 'r2',
    service: 'Cristales',
    serviceId: 'cristales',
    cleaner: 'Luis Pérez',
    when: 'Fri 5 Jul · 12:30',
    duration: '~1 h',
    status: 'upcoming',
    address: LONDON_PROPERTIES.camden.address,
    photos: [],
  },
  {
    id: 'r3',
    service: 'Limpieza profunda',
    serviceId: 'profunda',
    cleaner: 'Ana Ruiz',
    when: 'Sat 14 Jun · 09:00',
    duration: '~4 h',
    status: 'done',
    address: LONDON_PROPERTIES.soho.address,
    thumb: DEMO_PHOTOS.kitchen,
    photos: [DEMO_PHOTOS.kitchen, DEMO_PHOTOS.bathroom, DEMO_PHOTOS.bedroom, DEMO_PHOTOS.living],
  },
  {
    id: 'r4',
    service: 'Limpieza estándar',
    serviceId: 'standard',
    cleaner: 'Ana Ruiz',
    when: 'Wed 4 Jun · 10:00',
    duration: '~2 h',
    status: 'done',
    address: LONDON_PROPERTIES.notting.address,
    thumb: DEMO_PHOTOS.living,
    photos: [DEMO_PHOTOS.living, DEMO_PHOTOS.floor, DEMO_PHOTOS.sink],
  },
  {
    id: 'r5',
    service: 'Mudanza',
    serviceId: 'mudanza',
    cleaner: 'Luis Pérez',
    when: 'Mon 12 May · 08:00',
    duration: '~5 h',
    status: 'done',
    address: LONDON_PROPERTIES.mayfair.address,
    thumb: DEMO_PHOTOS.bedroom,
    photos: [DEMO_PHOTOS.bedroom, DEMO_PHOTOS.vacuum, DEMO_PHOTOS.kitchen],
  },
];

type FilterKey = 'all' | 'upcoming' | 'done';

function ReservaCard({
  r,
  onOpen,
}: {
  r: Reserva;
  onOpen: (r: Reserva) => void;
}) {
  const isUpcoming = r.status === 'upcoming';
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(r)}
        title={
          isUpcoming
            ? 'Ver detalle de la próxima visita'
            : 'Ver detalle, fotos y valorar este servicio'
        }
        className="block w-full rounded-3xl bg-white p-4 text-left ring-1 ring-inset ring-slate-100 transition hover:ring-blue-200"
      >
        <div className="flex items-start gap-3">
          {r.thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
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
      </button>
    </li>
  );
}

function CleaningsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialFilter = (params.get('status') as FilterKey | null) ?? 'all';
  const [filter, setFilter] = useState<FilterKey>(
    initialFilter === 'upcoming' || initialFilter === 'done' ? initialFilter : 'all',
  );
  const [query, setQuery] = useState('');

  // Per-reserva detail sheet state.
  const [detail, setDetail] = useState<Reserva | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [draftComment, setDraftComment] = useState('');
  const [draftStars, setDraftStars] = useState(0);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function openDetail(r: Reserva) {
    setDetail(r);
    setDraftComment(comments[r.id] ?? '');
    setDraftStars(ratings[r.id] ?? 0);
    setPhotoIndex(null);
  }

  function saveRating() {
    if (!detail) return;
    setRatings((prev) => ({ ...prev, [detail.id]: draftStars }));
    setComments((prev) => ({ ...prev, [detail.id]: draftComment }));
    showToast('Valoración guardada');
    setDetail(null);
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESERVAS.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (q) {
        const hay =
          `${r.service} ${r.cleaner} ${r.address}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filter, query]);

  const upcoming = visible.filter((r) => r.status === 'upcoming');
  const done = visible.filter((r) => r.status === 'done');

  const detailPhotos = detail
    ? detail.photos.map((src) => ({ src, label: detail.service }))
    : [];

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="reservas"
      title="Reservas"
    >
      {/* Search */}
      <div className="mb-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por servicio, cleaner o dirección…"
            title="Filtra las reservas en tiempo real"
            className="block h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </div>

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
              <ReservaCard key={r.id} r={r} onOpen={openDetail} />
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
              <ReservaCard key={r.id} r={r} onOpen={openDetail} />
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

      {/* Detail sheet */}
      <DemoSheet
        open={detail != null}
        onClose={() => setDetail(null)}
        title={detail?.service}
      >
        {detail && (
          <div>
            <p className="text-[12px] text-slate-500">
              {detail.when} · Con {detail.cleaner} · {detail.duration}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{detail.address}</span>
            </p>

            {/* Photos for completed cleanings */}
            {detail.status === 'done' && detail.photos.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Fotos del trabajo
                </p>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {detail.photos.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      title="Ver foto en grande"
                      className="aspect-square overflow-hidden rounded-xl ring-1 ring-inset ring-slate-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={detail.service}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rating slider (done only) */}
            {detail.status === 'done' && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Tu valoración
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDraftStars(n)}
                      title={`Dar ${n} estrella${n === 1 ? '' : 's'}`}
                      className="transition hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          n <= draftStars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={draftComment}
                  onChange={(e) => setDraftComment(e.target.value)}
                  placeholder="Comentar (opcional)…"
                  title="Deja un comentario sobre este servicio"
                  className="mt-3 block h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2">
              {detail.status === 'done' && (
                <button
                  type="button"
                  onClick={saveRating}
                  disabled={draftStars === 0}
                  title="Guardar tu valoración"
                  className="flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-blue-700 disabled:opacity-40"
                >
                  Guardar valoración
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setDetail(null);
                  router.push(
                    `/client/${PREVIEW_TOKEN}/book?service=${detail.serviceId}`,
                  );
                }}
                title="Reservar otra vez este mismo servicio"
                className="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-4 text-[12px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-200"
              >
                <Sparkles className="h-3.5 w-3.5" /> Reservar otra vez
              </button>
              {detail.status === 'upcoming' && (
                <Link
                  href={`/client/${PREVIEW_TOKEN}/cleaning`}
                  onClick={() => setDetail(null)}
                  title="Ver pantalla completa con todos los detalles"
                  className="flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-slate-700"
                >
                  Ver detalle completo
                </Link>
              )}
            </div>

            {ratings[detail.id] && (
              <p className="mt-3 text-center text-[11px] text-emerald-700">
                Ya valoraste este servicio con {ratings[detail.id]} estrellas.
              </p>
            )}
          </div>
        )}
      </DemoSheet>

      {/* Photo lightbox inside detail */}
      <DemoLightbox
        photos={detailPhotos}
        index={photoIndex}
        onClose={() => setPhotoIndex(null)}
        onChange={setPhotoIndex}
      />

      <DemoToast show={toast != null} message={toast ?? ''} />
    </ClientShell>
  );
}

export default function ClientCleaningsPreview() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate-500">Cargando…</p>}>
      <CleaningsInner />
    </Suspense>
  );
}

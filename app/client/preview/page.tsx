/**
 * Public, no-auth PREVIEW of the client portal home — same components
 * as the real /client/<token> page, fed with mock data so anyone
 * (sales, the team, the user) can click through the experience
 * without a magic-link token.
 *
 * The home page is a client component so we can layer interactive
 * sheets (referral, cleaner profile, service detail, search filter,
 * stat chip drill-downs, photo lightbox) on top of the existing
 * shared display components without modifying them.
 */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  Copy,
  Hand,
  HelpCircle,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { FeaturedCleaners } from '@/components/client/FeaturedCleaners';
import { PromoBanner } from '@/components/client/PromoBanner';
import { ServiceCatalog } from '@/components/client/ServiceCatalog';
import { DemoPhotoStrip, DEMO_PHOTOS } from '@/components/preview/DemoPhotoStrip';
import { DemoSheet, DemoToast } from '@/components/preview/DemoSheet';
import { DemoLightbox } from '@/components/preview/DemoLightbox';
import {
  LONDON_PROPERTIES,
  MOCK_CLEANERS,
  MOCK_CTX,
  MOCK_SERVICES,
  PREVIEW_TOKEN,
} from './_mock';

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
  emphasis = 'neutral',
  dotTone,
  title,
  onClick,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: string;
  tone: 'blue' | 'emerald' | 'amber';
  /**
   * 'accent' — the single live/primary metric (filled tone surface).
   * 'neutral' — secondary metrics rendered as quiet pills with a
   *             tone-colored dot, so the accent metric leads.
   */
  emphasis?: 'accent' | 'neutral';
  dotTone?: 'blue' | 'emerald' | 'amber';
  title?: string;
  onClick?: () => void;
}) {
  const accentTones: Record<typeof tone, string> = {
    blue: 'bg-blue-50 text-blue-800 ring-blue-100 hover:bg-blue-100',
    emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-100 hover:bg-emerald-100',
    amber: 'bg-amber-50 text-amber-800 ring-amber-100 hover:bg-amber-100',
  };
  const dotColors: Record<NonNullable<typeof dotTone>, string> = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  };
  const isAccent = emphasis === 'accent';
  const surface = isAccent
    ? accentTones[tone]
    : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex flex-1 items-center gap-2 rounded-2xl px-3 py-2.5 text-left ring-1 ring-inset transition ${surface}`}
    >
      {isAccent ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : (
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full ${
            dotColors[dotTone ?? tone]
          }`}
        />
      )}
      <div className="min-w-0">
        <p
          className={`text-[11.5px] font-semibold ${
            isAccent ? '' : 'text-slate-500'
          }`}
        >
          {label}
        </p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </button>
  );
}

const PROPERTY = LONDON_PROPERTIES.soho;

/**
 * Accessible help affordance — a real button with aria-label and a
 * visible tooltip on hover/focus, sized for touch (≥44px hit area
 * via padding) so it works on mobile.
 */
function HelpTip({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="group relative -m-2 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <HelpCircle className="h-3.5 w-3.5" />
    </button>
  );
}

// Service-type and availability filter options used in the filter sheet.
const SERVICE_FILTERS = ['Estándar', 'Profunda', 'Cristales', 'Mudanza'];
const AVAIL_FILTERS = ['Hoy', 'Esta semana', 'Este mes'];

// Mocked recent ratings (used in the Rating stat-chip sheet).
const RECENT_RATINGS = [
  { id: 'rr1', cleaner: 'Ana Ruiz',   service: 'Limpieza estándar',  stars: 5, when: 'Hace 3 días' },
  { id: 'rr2', cleaner: 'Luis Pérez', service: 'Cristales',          stars: 5, when: 'Hace 1 semana' },
  { id: 'rr3', cleaner: 'Ana Ruiz',   service: 'Limpieza profunda',  stars: 4, when: 'Hace 2 semanas' },
  { id: 'rr4', cleaner: 'Luis Pérez', service: 'Mudanza',            stars: 5, when: 'Hace 1 mes' },
];

export default function ClientPreview() {
  const router = useRouter();
  // resetKey lets us re-mount everything below via key prop.
  const [resetKey, setResetKey] = useState(0);
  return <ClientPreviewInner key={resetKey} onReset={() => setResetKey((k) => k + 1)} router={router} />;
}

function ClientPreviewInner({
  onReset,
  router,
}: {
  onReset: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [referralOpen, setReferralOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cleanerOpen, setCleanerOpen] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<
    'pending' | 'accepted' | 'done' | 'rejected'
  >('pending');
  const [toast, setToast] = useState<string | null>(null);

  // Search + filter state for Categorías and Tu equipo.
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string[]>([]);
  const [minStars, setMinStars] = useState(0);
  const [availFilter, setAvailFilter] = useState<string | null>(null);

  // Stat-chip drill-downs.
  const [ratingsOpen, setRatingsOpen] = useState(false);

  // Lightbox state for the "Limpiezas anteriores" strip.
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const lightboxPhotos = useMemo(
    () => DEMO_PHOTOS.map((p) => ({ src: p.src, label: p.label })),
    [],
  );

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  const openCleaner = cleanerOpen
    ? MOCK_CLEANERS.find((c) => c.id === cleanerOpen)
    : null;

  function copyReferral() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('PREVIEW').catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Apply search query + filters to services and cleaners shown below.
  const visibleServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_SERVICES.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (
        serviceFilter.length > 0 &&
        !serviceFilter.some((f) => s.name.toLowerCase().includes(f.toLowerCase()))
      )
        return false;
      return true;
    });
  }, [query, serviceFilter]);

  const visibleCleaners = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_CLEANERS.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (minStars > 0 && (c.avgStars ?? 0) < minStars) return false;
      return true;
    });
  }, [query, minStars]);

  const activeFilterCount =
    serviceFilter.length + (minStars > 0 ? 1 : 0) + (availFilter ? 1 : 0);

  function toggleServiceFilter(f: string) {
    setServiceFilter((prev) =>
      prev.includes(f) ? prev.filter((p) => p !== f) : [...prev, f],
    );
  }

  function clearFilters() {
    setServiceFilter([]);
    setMinStars(0);
    setAvailFilter(null);
  }

  return (
    <ClientShell ctx={MOCK_CTX} token={PREVIEW_TOKEN} activeTab="home" hideHeader>
      {/* Header: greeting + search/filter — wired to local state, not a
          GET-navigation, so the input actually filters the lists below. */}
      <section className="px-1 pt-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-slate-900">
              Sofía
              <Hand className="h-5 w-5 -rotate-12 text-amber-400" />
            </p>
            <p className="mt-0.5 text-[13px] text-slate-600">
              Empecemos tu próxima limpieza
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              title="Reiniciar la demo a su estado inicial"
              className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Reiniciar demo"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white">
              S
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <label className="relative block flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="text"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servicio…"
              title="Filtra las categorías y el equipo abajo por nombre"
              className="block h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            aria-label="Filtros"
            title="Filtrar por tipo de servicio, valoración y disponibilidad"
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Primary action — owns the first viewport. The blue gradient is
          reserved for this CTA only; secondary surfaces stay neutral. */}
      <Link
        href="/client/preview/book"
        title="Reservar una nueva limpieza"
        className="mt-5 flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-[0_14px_32px_-14px_rgba(37,99,235,0.65)] transition hover:from-blue-700 hover:to-blue-900"
      >
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-blue-100">
            Listo en 30 segundos
          </p>
          <p className="mt-1 font-display text-xl font-bold leading-tight">
            Reservar limpieza
          </p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
          <ArrowRight className="h-5 w-5" />
        </span>
      </Link>

      {/* Promo banner overlay — intercepts the click to open our sheet.
          Demoted to a quiet row below the primary CTA. */}
      <div onClickCapture={(e) => { e.preventDefault(); setReferralOpen(true); }}>
        <PromoBanner token={PREVIEW_TOKEN} />
      </div>

      <div className="mt-3 flex gap-2">
        <StatChip
          icon={CalendarCheck}
          tone="blue"
          emphasis="accent"
          label="Próximas"
          value="2"
          title="Ver las limpiezas programadas en los próximos días"
          onClick={() => router.push('/client/preview/cleanings?status=upcoming')}
        />
        <StatChip
          icon={CheckCircle2}
          tone="emerald"
          emphasis="neutral"
          dotTone="emerald"
          label="Hechas"
          value="12"
          title="Ver el historial de limpiezas completadas"
          onClick={() => router.push('/client/preview/cleanings?status=done')}
        />
        <StatChip
          icon={Star}
          tone="amber"
          emphasis="neutral"
          dotTone="amber"
          label="Rating"
          value="4.8"
          title="Ver las valoraciones recientes que has dado"
          onClick={() => setRatingsOpen(true)}
        />
      </div>

      {/* Categorías — filtered by local search + filter sheet */}
      {visibleServices.length > 0 ? (
        <ServiceCatalog token={PREVIEW_TOKEN} services={visibleServices} />
      ) : (
        <section className="mt-6">
          <h2 className="text-[13px] font-bold text-slate-900">Categorías</h2>
          <p className="mt-3 rounded-2xl bg-white p-4 text-center text-[12px] text-slate-500 ring-1 ring-inset ring-slate-100">
            No hay servicios que coincidan con tu búsqueda.
          </p>
        </section>
      )}

      {/* FeaturedCleaners overlay — intercept clicks to open profile sheet */}
      <div
        onClickCapture={(e) => {
          const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
          if (!link) return;
          // The shared component renders one card per cleaner without
          // an id attribute; match by initials in the card text.
          const card = link.textContent ?? '';
          const match = MOCK_CLEANERS.find((c) => card.includes(c.name));
          if (match) {
            e.preventDefault();
            setCleanerOpen(match.id);
          }
        }}
      >
        {visibleCleaners.length > 0 ? (
          <FeaturedCleaners token={PREVIEW_TOKEN} cleaners={visibleCleaners} />
        ) : (
          <section className="mt-6">
            <h2 className="text-[13px] font-bold text-slate-900">Tu equipo</h2>
            <p className="mt-3 rounded-2xl bg-white p-4 text-center text-[12px] text-slate-500 ring-1 ring-inset ring-slate-100">
              No hay cleaners que coincidan con los filtros.
            </p>
          </section>
        )}
      </div>

      {/* Limpiezas anteriores — thumbnails open lightbox */}
      <div
        onClickCapture={(e) => {
          const fig = (e.target as HTMLElement).closest('figure');
          if (!fig) return;
          e.preventDefault();
          // Find the figure's index in the strip.
          const figs = Array.from(fig.parentElement?.children ?? []);
          const idx = figs.indexOf(fig);
          if (idx >= 0) setPhotoIndex(idx);
        }}
        title="Toca una foto para verla en grande"
        className="cursor-pointer"
      >
        <DemoPhotoStrip
          title="Limpiezas anteriores"
          caption="Mira el resultado de servicios recientes — toca para abrir en grande."
        />
      </div>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-slate-900">Próxima visita</h2>
          <HelpTip label="Las visitas aceptadas aparecen aquí; las pendientes te pediremos confirmación." />
        </div>
        {nextStatus === 'rejected' ? (
          <div className="mt-3 rounded-3xl bg-white p-4 text-center ring-1 ring-inset ring-slate-100">
            <p className="text-[12px] font-semibold text-slate-700">
              Cancelaste esta visita.
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              El equipo te propondrá una nueva fecha por chat.
            </p>
            <button
              type="button"
              onClick={() => setNextStatus('pending')}
              title="Restaurar la visita para probar otra acción"
              className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-700"
            >
              Restaurar (demo)
            </button>
          </div>
        ) : (
          <div className="mt-3 rounded-3xl bg-white p-4 ring-1 ring-inset ring-slate-100">
            <Link
              href="/client/preview/cleaning"
              title="Toca para ver el detalle completo de la visita"
              className="group -m-1 flex items-start gap-3 rounded-2xl p-1 transition hover:bg-slate-50"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  Mañana · 10:00
                </p>
                <p className="mt-0.5 font-display text-sm font-bold text-slate-900">
                  Limpieza estándar
                </p>
                <p className="mt-0.5 text-[12px] text-slate-600">
                  Con Ana Ruiz · ~2 h
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{PROPERTY.address}</span>
                </p>
              </div>
              <span className="shrink-0 self-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition group-hover:bg-slate-700">
                Ver
              </span>
            </Link>

            {/* Quick actions: state transitions */}
            <div className="mt-3 flex gap-2">
              {nextStatus === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNextStatus('accepted');
                      showToast('Visita confirmada');
                    }}
                    title="Confirmar esta visita"
                    className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNextStatus('rejected');
                      showToast('Visita cancelada');
                    }}
                    title="Rechazar esta visita — el equipo te propondrá otra fecha"
                    className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
                  >
                    Rechazar
                  </button>
                </>
              )}
              {nextStatus === 'accepted' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNextStatus('done');
                    showToast('Marcada como completada');
                  }}
                  title="Marcar la limpieza como completada"
                  className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
                >
                  Marcar completada
                </button>
              )}
              {nextStatus === 'done' && (
                <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Completada · ahora
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Referral sheet */}
      <DemoSheet
        open={referralOpen}
        onClose={() => setReferralOpen(false)}
        title="Invita a un amigo"
      >
        <p className="text-[13px] text-slate-600">
          Cuando tu amigo reserve su primera limpieza, ambos recibís £10 de
          crédito.
        </p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Tu código de referido
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <code className="font-mono text-2xl font-bold tracking-widest text-blue-700">
              PREVIEW
            </code>
            <button
              type="button"
              onClick={copyReferral}
              title="Copiar código al portapapeles"
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-slate-700"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copiar código
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-slate-400">
          Compártelo por WhatsApp, email o SMS — quien lo use al registrarse
          activa el descuento automáticamente.
        </p>
      </DemoSheet>

      {/* Cleaner profile sheet — always carries a title so the dialog
          is announced by assistive tech and the visible h3 acts as the
          labelledby anchor. */}
      <DemoSheet
        open={openCleaner != null}
        onClose={() => setCleanerOpen(null)}
        title={openCleaner ? openCleaner.name : 'Cleaner'}
      >
        {openCleaner && (
          <>
            <div className="flex items-center gap-3 pr-8">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-700 text-lg font-bold text-white">
                {openCleaner.name.split(' ').map((w) => w[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="inline-flex items-center gap-1 text-[12px] text-amber-700">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {openCleaner.avgStars?.toFixed(1) ?? '—'} ·{' '}
                  {openCleaner.ratingCount} reviews
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Trabajos recientes
              </p>
              <ul className="mt-2 space-y-1.5 text-[12.5px] text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  Limpieza profunda · {LONDON_PROPERTIES.soho.address}
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  Limpieza estándar · {LONDON_PROPERTIES.notting.address}
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  Cristales · {LONDON_PROPERTIES.camden.address}
                </li>
              </ul>
            </div>
            <Link
              href="/client/preview/book"
              title={`Pedir que ${openCleaner.name} sea tu cleaner asignado`}
              className="mt-4 flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] hover:bg-blue-700"
              onClick={() => setCleanerOpen(null)}
            >
              Pedir esta persona
            </Link>
          </>
        )}
      </DemoSheet>

      {/* Filters sheet */}
      <DemoSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filtros"
      >
        <p className="mt-1 text-[12px] text-slate-500">
          Afina lo que ves en Categorías y Tu equipo.
        </p>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Tipo de servicio
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SERVICE_FILTERS.map((f) => {
              const on = serviceFilter.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleServiceFilter(f)}
                  title={`Mostrar servicios de ${f.toLowerCase()}`}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                    on
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Valoración mínima del cleaner
          </p>
          <div className="mt-2 flex gap-2">
            {[0, 3, 4, 4.5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMinStars(n)}
                title={n === 0 ? 'Sin filtro de rating' : `Mostrar solo ${n}+`}
                className={`flex-1 rounded-xl px-2 py-1.5 text-[11px] font-bold transition ${
                  minStars === n
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n === 0 ? 'Todos' : `${n}+ ★`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Disponibilidad
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAIL_FILTERS.map((f) => {
              const on = availFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setAvailFilter(on ? null : f)}
                  title={`Filtrar por disponibilidad: ${f.toLowerCase()}`}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                    on
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={clearFilters}
            title="Quitar todos los filtros"
            className="flex-1 rounded-2xl bg-slate-100 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            title="Aplicar y cerrar"
            className="flex-1 rounded-2xl bg-blue-600 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-blue-700"
          >
            Aplicar
          </button>
        </div>
      </DemoSheet>

      {/* Recent ratings drill-down */}
      <DemoSheet
        open={ratingsOpen}
        onClose={() => setRatingsOpen(false)}
        title="Valoraciones recientes"
      >
        <p className="text-[12px] text-slate-500">
          Promedio: <span className="font-bold text-slate-900">4.8</span> ·{' '}
          {RECENT_RATINGS.length} valoraciones
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {RECENT_RATINGS.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-100"
            >
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold text-slate-900">
                  {r.cleaner}
                </p>
                <p className="text-[11px] text-slate-500">
                  {r.service} · {r.when}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-3.5 w-3.5 ${
                      n <= r.stars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </DemoSheet>

      {/* Photo lightbox for the strip */}
      <DemoLightbox
        photos={lightboxPhotos}
        index={photoIndex}
        onClose={() => setPhotoIndex(null)}
        onChange={setPhotoIndex}
      />

      {/* Floating toast */}
      <DemoToast show={toast != null} message={toast ?? ''} />
    </ClientShell>
  );
}


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
import { CompletionSeal } from './_components/CompletionSeal';
import { ConciergeSheet } from './_components/ConciergeSheet';
import { FlippableCleanerCard } from './_components/FlippableCleanerCard';
import { RollingStat } from './_components/RollingStat';
import { SwipeVisitCard } from './_components/SwipeVisitCard';
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
  emphasis = 'neutral',
  title,
  onClick,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: string;
  /**
   * Per design brief: three competing chip colors (blue/emerald/amber) are
   * killed. Chips collapse to a single neutral language — clay surface,
   * hairline border, mono micro-label, serif numeral. The 'accent' chip
   * is the only one allowed a mandarin pulse (the "live" metric).
   */
  emphasis?: 'accent' | 'neutral';
  title?: string;
  onClick?: () => void;
}) {
  const isAccent = emphasis === 'accent';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="ps-set flex flex-1 items-center gap-2.5 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] px-3 py-3 text-left text-[#141414] transition hover:bg-[#141414] hover:text-[#F4EFE6]"
      style={{ transitionDuration: '160ms' }}
    >
      {isAccent ? (
        <span
          aria-hidden
          className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full"
          style={{ backgroundColor: '#FF5B1F', color: '#1A0A04' }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: '#54524D' }}
        />
      )}
      <div className="min-w-0">
        <p className="ps-mono text-[11px] text-[#54524D]">{label.toLowerCase()}</p>
        <p className="ps-serif mt-0.5 text-[22px] leading-none tabular-nums">
          <RollingStat value={value} pulse={isAccent} />
        </p>
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
      className="group relative -m-2 grid h-8 w-8 place-items-center rounded-full text-[#54524D] hover:bg-[#E4DACA] hover:text-[#141414] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF5B1F]"
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
  // Drives the wax-seal celebration overlay on the visit card. Decoupled
  // from `nextStatus` so the seal can auto-dismiss (~2.4s) while the
  // status stays 'done' for the rest of the session.
  const [sealVisible, setSealVisible] = useState(false);
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
          GET-navigation, so the input actually filters the lists below.
          Hand-wave emoji killed; the name carries a mandarin underline
          instead, per the design brief. */}
      <section className="ps-set px-1 pt-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="ps-serif text-[44px] leading-[0.92] tracking-[-0.04em] text-[#141414]">
              <span
                style={{
                  backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 1px',
                  backgroundPosition: '0 calc(100% + 2px)',
                  paddingBottom: '4px',
                }}
              >
                Sofía
              </span>
            </p>
            <p className="ps-mono mt-3 text-[12px] text-[#54524D]">
              empecemos tu próxima limpieza
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              title="Reiniciar la demo a su estado inicial"
              className="grid h-10 w-10 place-items-center rounded-full text-[#54524D] hover:bg-[#E4DACA] hover:text-[#141414]"
              aria-label="Reiniciar demo"
              style={{ transitionDuration: '160ms' }}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <span
              className="ps-serif grid h-11 w-11 shrink-0 place-items-center rounded-full text-[18px] text-[#1A0A04]"
              style={{ backgroundColor: '#E8C8C0' }}
            >
              S
            </span>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <label className="relative block flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#54524D]"
              aria-hidden
            />
            <input
              type="text"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servicio…"
              title="Filtra las categorías y el equipo abajo por nombre"
              className="block h-11 w-full rounded-[12px] border border-[#1414141A] bg-[#E4DACA] pl-10 pr-3 text-[14px] text-[#141414] placeholder:text-[#54524D] focus:border-[#FF5B1F] focus:outline-none focus:ring-1 focus:ring-[#FF5B1F]"
            />
          </label>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            aria-label="Filtros"
            title="Filtrar por tipo de servicio, valoración y disponibilidad"
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border border-[#1414141A] bg-[#E4DACA] text-[#141414] transition hover:bg-[#141414] hover:text-[#F4EFE6]"
            style={{ transitionDuration: '160ms' }}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span
                className="ps-mono absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] text-[#1A0A04]"
                style={{ backgroundColor: '#FF5B1F', boxShadow: '0 0 0 2px #F4EFE6' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Primary action — the single per-portal mandarin highlight card.
          Editorial / press-print: serif headline, mono micro-label, no
          gradient, no blur shadow, hairline-free (mandarin fill = the
          accent). */}
      <Link
        href="/client/preview/book"
        title="Reservar una nueva limpieza"
        className="ps-set mt-6 flex items-center justify-between gap-4 rounded-[12px] p-6 transition"
        style={{ backgroundColor: '#FF5B1F', color: '#1A0A04', transitionDuration: '160ms' }}
      >
        <div className="min-w-0">
          <p className="ps-mono text-[11px] text-[#1A0A04]/70">
            listo en 30 segundos
          </p>
          <p className="ps-serif mt-1 text-[32px] leading-[0.95] tracking-[-0.03em]">
            Reservar <em>limpieza</em>
          </p>
        </div>
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#1A0A04]/15"
          style={{ backgroundColor: 'rgba(26, 10, 4, 0.08)' }}
        >
          <ArrowRight className="h-5 w-5" />
        </span>
      </Link>

      {/* Promo banner overlay — intercepts the click to open our sheet.
          Demoted to a quiet row below the primary CTA. */}
      <div onClickCapture={(e) => { e.preventDefault(); setReferralOpen(true); }}>
        <PromoBanner token={PREVIEW_TOKEN} />
      </div>

      <div className="mt-4 flex gap-2">
        <StatChip
          icon={CalendarCheck}
          emphasis="accent"
          label="Próximas"
          value="2"
          title="Ver las limpiezas programadas en los próximos días"
          onClick={() => router.push('/client/preview/cleanings?status=upcoming')}
        />
        <StatChip
          icon={CheckCircle2}
          emphasis="neutral"
          label="Hechas"
          value="12"
          title="Ver el historial de limpiezas completadas"
          onClick={() => router.push('/client/preview/cleanings?status=done')}
        />
        <StatChip
          icon={Star}
          emphasis="neutral"
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
        <section className="mt-8">
          <h2 className="ps-serif text-[28px] leading-[0.95] tracking-[-0.03em] text-[#141414]">
            Categorías
          </h2>
          <p className="ps-mono mt-4 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 text-center text-[12px] text-[#54524D]">
            no hay servicios que coincidan con tu búsqueda.
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
          <section className="mt-8">
            <h2 className="ps-serif text-[28px] leading-[0.95] tracking-[-0.03em] text-[#141414]">
              Tu equipo
            </h2>
            <p className="ps-mono mt-4 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 text-center text-[12px] text-[#54524D]">
              no hay cleaners que coincidan con los filtros.
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

      <section className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="ps-serif text-[28px] leading-[0.95] tracking-[-0.03em] text-[#141414]">
            Próxima visita
          </h2>
          <HelpTip label="Las visitas aceptadas aparecen aquí; las pendientes te pediremos confirmación." />
        </div>
        {nextStatus === 'rejected' ? (
          <div className="ps-set mt-4 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 text-center">
            <p className="ps-serif text-[20px] tracking-[-0.015em] text-[#141414]">
              Cancelaste esta visita.
            </p>
            <p className="ps-mono mt-2 text-[12px] text-[#54524D]">
              el equipo te propondrá una nueva fecha por chat.
            </p>
            <button
              type="button"
              onClick={() => setNextStatus('pending')}
              title="Restaurar la visita para probar otra acción"
              className="ps-mono mt-4 rounded-full bg-[#141414] px-4 py-2 text-[11px] text-[#F4EFE6] hover:bg-[#1A0A04]"
              style={{ transitionDuration: '160ms' }}
            >
              restaurar (demo)
            </button>
          </div>
        ) : (
          <div className="ps-set relative mt-4 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5">
            {/* Wax-seal celebration overlay — only when status flips to
                'done'. Auto-dismisses; the underlying status sticks. */}
            <CompletionSeal
              visible={sealVisible && nextStatus === 'done'}
              onDone={() => setSealVisible(false)}
            />

            {(() => {
              const visitCardBody = (
                <Link
                  href="/client/preview/cleaning"
                  title="Toca para ver el detalle completo de la visita"
                  className="group -m-1 flex items-start gap-3 rounded-[12px] p-1 transition"
                  style={{ transitionDuration: '160ms' }}
                >
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] border border-[#1414141A] text-[#141414]"
                    style={{ backgroundColor: '#F4EFE6' }}
                  >
                    <CalendarCheck className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="ps-mono text-[11px] text-[#54524D]">
                      <span
                        style={{
                          backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '100% 1px',
                          backgroundPosition: '0 calc(100% + 3px)',
                          paddingBottom: '3px',
                        }}
                      >
                        mañana · 10:00
                      </span>
                    </p>
                    <p className="ps-serif mt-1.5 text-[20px] leading-tight tracking-[-0.015em] text-[#141414]">
                      Limpieza estándar
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#54524D]">
                      Con Ana Ruiz · <span className="tabular-nums">~2</span> h
                    </p>
                    <p className="ps-mono mt-1.5 flex items-center gap-1 text-[11px] text-[#54524D]">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{PROPERTY.address}</span>
                    </p>
                  </div>
                  <span
                    className="ps-mono shrink-0 self-center rounded-full bg-[#141414] px-3 py-1.5 text-[11px] text-[#F4EFE6] transition group-hover:bg-[#1A0A04]"
                    style={{ transitionDuration: '160ms' }}
                  >
                    ver
                  </span>
                </Link>
              );

              // Legacy fallback row — keyboard / reduced-motion users get the
              // classic two-button accept/reject. Both go mandarin (action)
              // per design brief; the green emerald accept is killed.
              const fallbackRow = (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNextStatus('accepted');
                      showToast('Visita confirmada');
                    }}
                    title="Confirmar esta visita"
                    className="ps-mono flex-1 rounded-full px-3 py-2 text-[11px] text-[#1A0A04] transition"
                    style={{ backgroundColor: '#FF5B1F', transitionDuration: '160ms' }}
                  >
                    aceptar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNextStatus('rejected');
                      showToast('Visita cancelada');
                    }}
                    title="Rechazar esta visita — el equipo te propondrá otra fecha"
                    className="ps-mono flex-1 rounded-full border border-[#1414141A] bg-transparent px-3 py-2 text-[11px] text-[#141414] hover:bg-[#141414] hover:text-[#F4EFE6]"
                    style={{ transitionDuration: '160ms' }}
                  >
                    rechazar
                  </button>
                </div>
              );

              return (
                <>
                  {nextStatus === 'pending' ? (
                    <SwipeVisitCard
                      enabled
                      onAccept={() => {
                        setNextStatus('accepted');
                        showToast('Visita confirmada');
                      }}
                      onReject={() => {
                        setNextStatus('rejected');
                        showToast('Visita cancelada');
                      }}
                      fallback={fallbackRow}
                    >
                      {visitCardBody}
                    </SwipeVisitCard>
                  ) : (
                    visitCardBody
                  )}

                  {/* Quick actions: state transitions for non-pending. */}
                  {nextStatus === 'accepted' && (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNextStatus('done');
                          setSealVisible(true);
                          showToast('Marcada como completada');
                        }}
                        title="Marcar la limpieza como completada"
                        className="ps-mono flex-1 rounded-full px-3 py-2 text-[11px] text-[#1A0A04] transition"
                        style={{ backgroundColor: '#FF5B1F', transitionDuration: '160ms' }}
                      >
                        marcar completada
                      </button>
                    </div>
                  )}
                  {nextStatus === 'done' && (
                    <div className="mt-4 flex gap-2">
                      <div
                        className="ps-mono flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#1414141A] px-3 py-2 text-[11px]"
                        style={{ backgroundColor: 'rgba(63, 91, 58, 0.12)', color: '#3F5B3A' }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> completada · ahora
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </section>

      {/* Referral sheet */}
      <DemoSheet
        open={referralOpen}
        onClose={() => setReferralOpen(false)}
        title="Invita a un amigo"
      >
        <p className="text-[14px] text-[#54524D]">
          Cuando tu amigo reserve su primera limpieza, ambos recibís{' '}
          <span className="ps-serif text-[#141414]">£10</span> de crédito.
        </p>
        <div className="mt-4 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5">
          <p className="ps-mono text-[11px] text-[#54524D]">
            tu código de referido
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <code
              className="ps-serif text-[40px] leading-none tracking-tight text-[#141414]"
              style={{
                backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 1px',
                backgroundPosition: '0 calc(100% + 4px)',
                paddingBottom: '4px',
              }}
            >
              PREVIEW
            </code>
            <button
              type="button"
              onClick={copyReferral}
              title="Copiar código al portapapeles"
              className="ps-mono inline-flex items-center gap-1 rounded-full bg-[#141414] px-3 py-2 text-[11px] text-[#F4EFE6] hover:bg-[#1A0A04]"
              style={{ transitionDuration: '160ms' }}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" /> copiado
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> copiar código
                </>
              )}
            </button>
          </div>
        </div>
        <p className="ps-mono mt-4 text-[11px] text-[#54524D]">
          compártelo por whatsapp, email o sms — quien lo use al registrarse
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
            {/* Flippable cleaner card — front is the existing facts;
                back is the "cómo trabaja" personality side reached via
                the discrete "Conócela" chip in the corner. */}
            <FlippableCleanerCard
              cleanerName={openCleaner.name}
              front={
                <div className="rounded-[12px] p-1">
                  <div className="flex items-center gap-3 pr-8">
                    <div className="ps-serif grid h-14 w-14 place-items-center rounded-full text-[22px] text-[#F4EFE6]" style={{ backgroundColor: '#141414' }}>
                      {openCleaner.name.split(' ').map((w) => w[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="ps-mono inline-flex items-center gap-1 text-[12px] text-[#141414]">
                        <Star className="h-3 w-3" style={{ fill: '#FF5B1F', color: '#FF5B1F' }} />
                        <span className="tabular-nums">{openCleaner.avgStars?.toFixed(1) ?? '—'}</span>{' '}
                        ·{' '}
                        <span className="tabular-nums">{openCleaner.ratingCount}</span> reviews
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] p-4">
                    <p className="ps-mono text-[11px] text-[#54524D]">
                      trabajos recientes
                    </p>
                    <ul className="mt-2 space-y-2 text-[13px] text-[#141414]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: '#3F5B3A' }} />
                        Limpieza profunda · {LONDON_PROPERTIES.soho.address}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: '#3F5B3A' }} />
                        Limpieza estándar · {LONDON_PROPERTIES.notting.address}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: '#3F5B3A' }} />
                        Cristales · {LONDON_PROPERTIES.camden.address}
                      </li>
                    </ul>
                  </div>
                </div>
              }
            />
            <Link
              href="/client/preview/book"
              title={`Pedir que ${openCleaner.name} sea tu cleaner asignado`}
              className="ps-mono mt-4 flex h-11 items-center justify-center rounded-full px-4 text-[12px] text-[#1A0A04] transition"
              style={{ backgroundColor: '#FF5B1F', transitionDuration: '160ms' }}
              onClick={() => setCleanerOpen(null)}
            >
              pedir esta persona
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
        <p className="mt-1 text-[13px] text-[#54524D]">
          Afina lo que ves en Categorías y Tu equipo.
        </p>

        <div className="mt-5">
          <p className="ps-mono text-[11px] text-[#54524D]">
            tipo de servicio
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
                  className="ps-mono rounded-full px-3 py-1.5 text-[11px] transition"
                  style={{
                    backgroundColor: on ? '#141414' : 'transparent',
                    color: on ? '#F4EFE6' : '#141414',
                    border: on ? '1px solid #141414' : '1px solid #1414141A',
                    transitionDuration: '160ms',
                  }}
                >
                  {f.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="ps-mono text-[11px] text-[#54524D]">
            valoración mínima del cleaner
          </p>
          <div className="mt-2 flex gap-2">
            {[0, 3, 4, 4.5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMinStars(n)}
                title={n === 0 ? 'Sin filtro de rating' : `Mostrar solo ${n}+`}
                className="ps-mono flex-1 rounded-[12px] px-2 py-1.5 text-[11px] tabular-nums transition"
                style={{
                  backgroundColor: minStars === n ? '#141414' : 'transparent',
                  color: minStars === n ? '#F4EFE6' : '#141414',
                  border: minStars === n ? '1px solid #141414' : '1px solid #1414141A',
                  transitionDuration: '160ms',
                }}
              >
                {n === 0 ? 'todos' : `${n}+ ★`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="ps-mono text-[11px] text-[#54524D]">
            disponibilidad
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
                  className="ps-mono rounded-full px-3 py-1.5 text-[11px] transition"
                  style={{
                    backgroundColor: on ? '#141414' : 'transparent',
                    color: on ? '#F4EFE6' : '#141414',
                    border: on ? '1px solid #141414' : '1px solid #1414141A',
                    transitionDuration: '160ms',
                  }}
                >
                  {f.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={clearFilters}
            title="Quitar todos los filtros"
            className="ps-mono flex-1 rounded-full border border-[#1414141A] px-4 py-2.5 text-[12px] text-[#141414] hover:bg-[#E4DACA]"
            style={{ transitionDuration: '160ms' }}
          >
            limpiar
          </button>
          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            title="Aplicar y cerrar"
            className="ps-mono flex-1 rounded-full px-4 py-2.5 text-[12px] text-[#1A0A04]"
            style={{ backgroundColor: '#FF5B1F', transitionDuration: '160ms' }}
          >
            aplicar
          </button>
        </div>
      </DemoSheet>

      {/* Recent ratings drill-down */}
      <DemoSheet
        open={ratingsOpen}
        onClose={() => setRatingsOpen(false)}
        title="Valoraciones recientes"
      >
        <p className="ps-mono text-[12px] text-[#54524D]">
          promedio:{' '}
          <span className="ps-serif text-[18px] tabular-nums text-[#141414]">
            4.8
          </span>{' '}
          · <span className="tabular-nums">{RECENT_RATINGS.length}</span>{' '}
          valoraciones
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {RECENT_RATINGS.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-4"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#141414]">
                  {r.cleaner}
                </p>
                <p className="ps-mono mt-0.5 text-[11px] text-[#54524D]">
                  {r.service} · {r.when}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className="h-3.5 w-3.5"
                    style={
                      n <= r.stars
                        ? { fill: '#FF5B1F', color: '#FF5B1F' }
                        : { color: '#1414141A' }
                    }
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

      {/* Floating "Pregúntame algo" pill that morphs into the Sofía
          AI concierge bottom sheet. Lives above the tab bar. */}
      <ConciergeSheet />

      {/* Floating toast */}
      <DemoToast show={toast != null} message={toast ?? ''} />
    </ClientShell>
  );
}


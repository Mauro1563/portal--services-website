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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
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

const COPY = {
  en: {
    greetingName: 'Sofía',
    greetingTagline: "Let's start your next cleaning",
    resetTitle: 'Reset the demo to the initial state',
    resetAria: 'Reset demo',
    searchPlaceholder: 'Search a service…',
    searchTitle: 'Filter the categories and team below by name',
    filtersAria: 'Filters',
    filtersTitle: 'Filter by service type, rating and availability',
    bookCtaKicker: 'Ready in 30 seconds',
    bookCtaTitle: 'Book a new cleaning',
    bookCtaLabel: 'Book a clean',
    statUpcomingLabel: 'Upcoming',
    statUpcomingTitle: 'See cleanings scheduled in the coming days',
    statDoneLabel: 'Done',
    statDoneTitle: 'See the history of completed cleanings',
    statRatingLabel: 'Rating',
    statRatingTitle: 'See the recent ratings you have given',
    categoriesHeading: 'Categories',
    categoriesEmpty: 'No services match your search.',
    teamHeading: 'Your team',
    teamEmpty: 'No cleaners match the filters.',
    photoStripTitle: 'Previous cleanings',
    photoStripCaption: 'See the result of recent services — tap to open large.',
    photoStripDeckTitle: 'Tap a photo to see it large',
    nextVisitHeading: 'Next visit',
    nextVisitHelp: 'Accepted visits appear here; for pending ones we ask you to confirm.',
    cancelledLine: 'You cancelled this visit.',
    cancelledSubLine: 'The team will propose a new date by chat.',
    restoreDemo: 'Restore (demo)',
    restoreDemoTitle: 'Restore the visit to try another action',
    visitCardTitle: 'Tap to see the full visit details',
    tomorrowKicker: 'Tomorrow · 10:00',
    standardClean: 'Standard clean',
    withAnaDuration: 'With Ana Ruiz · ~2 h',
    see: 'View',
    accept: 'Accept',
    acceptTitle: 'Confirm this visit',
    reject: 'Reject',
    rejectTitle: 'Reject this visit — the team will propose another date',
    markCompleted: 'Mark completed',
    markCompletedTitle: 'Mark the cleaning as completed',
    completedNow: 'Completed · just now',
    visitConfirmed: 'Visit confirmed',
    visitCancelled: 'Visit cancelled',
    visitMarkedComplete: 'Marked as completed',
    referralTitle: 'Invite a friend',
    referralBody: 'When your friend books their first cleaning, you both get £10 in credit.',
    yourReferralCode: 'Your referral code',
    copyCodeTitle: 'Copy code to clipboard',
    copied: 'Copied',
    copyCodeLabel: 'Copy code',
    referralShare: 'Share it via WhatsApp, email or SMS — whoever uses it when signing up activates the discount automatically.',
    cleanerSheetFallback: 'Cleaner',
    recentJobs: 'Recent jobs',
    standardCleanLabel: 'Standard clean',
    deepCleanLabel: 'Deep clean',
    windowsLabel: 'Windows',
    requestCleanerCta: 'Request this person',
    requestCleanerTitle: (name: string) => `Ask for ${name} to be your assigned cleaner`,
    filtersHeading: 'Filters',
    filtersBody: 'Refine what you see in Categories and Your team.',
    serviceTypeHeading: 'Service type',
    serviceFilterTitle: (f: string) => `Show ${f.toLowerCase()} services`,
    minRatingHeading: 'Minimum cleaner rating',
    minRatingAll: 'All',
    minRatingNoFilter: 'No rating filter',
    minRatingShow: (n: number) => `Show only ${n}+`,
    availabilityHeading: 'Availability',
    availabilityTitle: (f: string) => `Filter by availability: ${f.toLowerCase()}`,
    clearFilters: 'Clear',
    clearFiltersTitle: 'Remove all filters',
    apply: 'Apply',
    applyTitle: 'Apply and close',
    ratingsSheetTitle: 'Recent ratings',
    averageLabel: 'Average:',
    ratingsCount: (n: number) => `${n} ratings`,
    serviceFilters: ['Standard', 'Deep', 'Windows', 'Move'],
    availFilters: ['Today', 'This week', 'This month'],
    recentRatings: [
      { id: 'rr1', cleaner: 'Ana Ruiz',   service: 'Standard clean', stars: 5, when: '3 days ago' },
      { id: 'rr2', cleaner: 'Luis Pérez', service: 'Windows',        stars: 5, when: '1 week ago' },
      { id: 'rr3', cleaner: 'Ana Ruiz',   service: 'Deep clean',     stars: 4, when: '2 weeks ago' },
      { id: 'rr4', cleaner: 'Luis Pérez', service: 'Move',           stars: 5, when: '1 month ago' },
    ],
  },
  es: {
    greetingName: 'Sofía',
    greetingTagline: 'Empecemos tu próxima limpieza',
    resetTitle: 'Reiniciar la demo a su estado inicial',
    resetAria: 'Reiniciar demo',
    searchPlaceholder: 'Buscar servicio…',
    searchTitle: 'Filtra las categorías y el equipo abajo por nombre',
    filtersAria: 'Filtros',
    filtersTitle: 'Filtrar por tipo de servicio, valoración y disponibilidad',
    bookCtaKicker: 'Listo en 30 segundos',
    bookCtaTitle: 'Reservar una nueva limpieza',
    bookCtaLabel: 'Reservar limpieza',
    statUpcomingLabel: 'Próximas',
    statUpcomingTitle: 'Ver las limpiezas programadas en los próximos días',
    statDoneLabel: 'Hechas',
    statDoneTitle: 'Ver el historial de limpiezas completadas',
    statRatingLabel: 'Rating',
    statRatingTitle: 'Ver las valoraciones recientes que has dado',
    categoriesHeading: 'Categorías',
    categoriesEmpty: 'No hay servicios que coincidan con tu búsqueda.',
    teamHeading: 'Tu equipo',
    teamEmpty: 'No hay cleaners que coincidan con los filtros.',
    photoStripTitle: 'Limpiezas anteriores',
    photoStripCaption: 'Mira el resultado de servicios recientes — toca para abrir en grande.',
    photoStripDeckTitle: 'Toca una foto para verla en grande',
    nextVisitHeading: 'Próxima visita',
    nextVisitHelp: 'Las visitas aceptadas aparecen aquí; las pendientes te pediremos confirmación.',
    cancelledLine: 'Cancelaste esta visita.',
    cancelledSubLine: 'El equipo te propondrá una nueva fecha por chat.',
    restoreDemo: 'Restaurar (demo)',
    restoreDemoTitle: 'Restaurar la visita para probar otra acción',
    visitCardTitle: 'Toca para ver el detalle completo de la visita',
    tomorrowKicker: 'Mañana · 10:00',
    standardClean: 'Limpieza estándar',
    withAnaDuration: 'Con Ana Ruiz · ~2 h',
    see: 'Ver',
    accept: 'Aceptar',
    acceptTitle: 'Confirmar esta visita',
    reject: 'Rechazar',
    rejectTitle: 'Rechazar esta visita — el equipo te propondrá otra fecha',
    markCompleted: 'Marcar completada',
    markCompletedTitle: 'Marcar la limpieza como completada',
    completedNow: 'Completada · ahora',
    visitConfirmed: 'Visita confirmada',
    visitCancelled: 'Visita cancelada',
    visitMarkedComplete: 'Marcada como completada',
    referralTitle: 'Invita a un amigo',
    referralBody: 'Cuando tu amigo reserve su primera limpieza, ambos recibís £10 de crédito.',
    yourReferralCode: 'Tu código de referido',
    copyCodeTitle: 'Copiar código al portapapeles',
    copied: 'Copiado',
    copyCodeLabel: 'Copiar código',
    referralShare: 'Compártelo por WhatsApp, email o SMS — quien lo use al registrarse activa el descuento automáticamente.',
    cleanerSheetFallback: 'Cleaner',
    recentJobs: 'Trabajos recientes',
    standardCleanLabel: 'Limpieza estándar',
    deepCleanLabel: 'Limpieza profunda',
    windowsLabel: 'Cristales',
    requestCleanerCta: 'Pedir esta persona',
    requestCleanerTitle: (name: string) => `Pedir que ${name} sea tu cleaner asignado`,
    filtersHeading: 'Filtros',
    filtersBody: 'Afina lo que ves en Categorías y Tu equipo.',
    serviceTypeHeading: 'Tipo de servicio',
    serviceFilterTitle: (f: string) => `Mostrar servicios de ${f.toLowerCase()}`,
    minRatingHeading: 'Valoración mínima del cleaner',
    minRatingAll: 'Todos',
    minRatingNoFilter: 'Sin filtro de rating',
    minRatingShow: (n: number) => `Mostrar solo ${n}+`,
    availabilityHeading: 'Disponibilidad',
    availabilityTitle: (f: string) => `Filtrar por disponibilidad: ${f.toLowerCase()}`,
    clearFilters: 'Limpiar',
    clearFiltersTitle: 'Quitar todos los filtros',
    apply: 'Aplicar',
    applyTitle: 'Aplicar y cerrar',
    ratingsSheetTitle: 'Valoraciones recientes',
    averageLabel: 'Promedio:',
    ratingsCount: (n: number) => `${n} valoraciones`,
    serviceFilters: ['Estándar', 'Profunda', 'Cristales', 'Mudanza'],
    availFilters: ['Hoy', 'Esta semana', 'Este mes'],
    recentRatings: [
      { id: 'rr1', cleaner: 'Ana Ruiz',   service: 'Limpieza estándar', stars: 5, when: 'Hace 3 días' },
      { id: 'rr2', cleaner: 'Luis Pérez', service: 'Cristales',         stars: 5, when: 'Hace 1 semana' },
      { id: 'rr3', cleaner: 'Ana Ruiz',   service: 'Limpieza profunda', stars: 4, when: 'Hace 2 semanas' },
      { id: 'rr4', cleaner: 'Luis Pérez', service: 'Mudanza',           stars: 5, when: 'Hace 1 mes' },
    ],
  },
  pt: {
    greetingName: 'Sofía',
    greetingTagline: 'Vamos começar a sua próxima limpeza',
    resetTitle: 'Reiniciar a demo ao estado inicial',
    resetAria: 'Reiniciar demo',
    searchPlaceholder: 'Procurar serviço…',
    searchTitle: 'Filtra as categorias e a equipa abaixo por nome',
    filtersAria: 'Filtros',
    filtersTitle: 'Filtrar por tipo de serviço, avaliação e disponibilidade',
    bookCtaKicker: 'Pronto em 30 segundos',
    bookCtaTitle: 'Reservar uma nova limpeza',
    bookCtaLabel: 'Reservar limpeza',
    statUpcomingLabel: 'Próximas',
    statUpcomingTitle: 'Ver as limpezas agendadas nos próximos dias',
    statDoneLabel: 'Feitas',
    statDoneTitle: 'Ver o histórico de limpezas concluídas',
    statRatingLabel: 'Rating',
    statRatingTitle: 'Ver as avaliações recentes que deu',
    categoriesHeading: 'Categorias',
    categoriesEmpty: 'Não há serviços que correspondam à sua pesquisa.',
    teamHeading: 'A sua equipa',
    teamEmpty: 'Não há limpadoras que correspondam aos filtros.',
    photoStripTitle: 'Limpezas anteriores',
    photoStripCaption: 'Veja o resultado de serviços recentes — toque para abrir em grande.',
    photoStripDeckTitle: 'Toque numa foto para a ver em grande',
    nextVisitHeading: 'Próxima visita',
    nextVisitHelp: 'As visitas aceites aparecem aqui; nas pendentes pediremos confirmação.',
    cancelledLine: 'Cancelou esta visita.',
    cancelledSubLine: 'A equipa proporá uma nova data por chat.',
    restoreDemo: 'Restaurar (demo)',
    restoreDemoTitle: 'Restaurar a visita para testar outra ação',
    visitCardTitle: 'Toque para ver o detalhe completo da visita',
    tomorrowKicker: 'Amanhã · 10:00',
    standardClean: 'Limpeza padrão',
    withAnaDuration: 'Com Ana Ruiz · ~2 h',
    see: 'Ver',
    accept: 'Aceitar',
    acceptTitle: 'Confirmar esta visita',
    reject: 'Recusar',
    rejectTitle: 'Recusar esta visita — a equipa proporá outra data',
    markCompleted: 'Marcar concluída',
    markCompletedTitle: 'Marcar a limpeza como concluída',
    completedNow: 'Concluída · agora',
    visitConfirmed: 'Visita confirmada',
    visitCancelled: 'Visita cancelada',
    visitMarkedComplete: 'Marcada como concluída',
    referralTitle: 'Convide um amigo',
    referralBody: 'Quando o seu amigo reservar a primeira limpeza, recebem ambos £10 de crédito.',
    yourReferralCode: 'O seu código de referência',
    copyCodeTitle: 'Copiar código para a área de transferência',
    copied: 'Copiado',
    copyCodeLabel: 'Copiar código',
    referralShare: 'Partilhe-o por WhatsApp, email ou SMS — quem o usar ao registar-se ativa o desconto automaticamente.',
    cleanerSheetFallback: 'Limpadora',
    recentJobs: 'Trabalhos recentes',
    standardCleanLabel: 'Limpeza padrão',
    deepCleanLabel: 'Limpeza profunda',
    windowsLabel: 'Vidros',
    requestCleanerCta: 'Pedir esta pessoa',
    requestCleanerTitle: (name: string) => `Pedir que ${name} seja a sua limpadora atribuída`,
    filtersHeading: 'Filtros',
    filtersBody: 'Refine o que vê em Categorias e A sua equipa.',
    serviceTypeHeading: 'Tipo de serviço',
    serviceFilterTitle: (f: string) => `Mostrar serviços de ${f.toLowerCase()}`,
    minRatingHeading: 'Avaliação mínima da limpadora',
    minRatingAll: 'Todos',
    minRatingNoFilter: 'Sem filtro de rating',
    minRatingShow: (n: number) => `Mostrar apenas ${n}+`,
    availabilityHeading: 'Disponibilidade',
    availabilityTitle: (f: string) => `Filtrar por disponibilidade: ${f.toLowerCase()}`,
    clearFilters: 'Limpar',
    clearFiltersTitle: 'Remover todos os filtros',
    apply: 'Aplicar',
    applyTitle: 'Aplicar e fechar',
    ratingsSheetTitle: 'Avaliações recentes',
    averageLabel: 'Média:',
    ratingsCount: (n: number) => `${n} avaliações`,
    serviceFilters: ['Padrão', 'Profunda', 'Vidros', 'Mudança'],
    availFilters: ['Hoje', 'Esta semana', 'Este mês'],
    recentRatings: [
      { id: 'rr1', cleaner: 'Ana Ruiz',   service: 'Limpeza padrão',   stars: 5, when: 'Há 3 dias' },
      { id: 'rr2', cleaner: 'Luis Pérez', service: 'Vidros',           stars: 5, when: 'Há 1 semana' },
      { id: 'rr3', cleaner: 'Ana Ruiz',   service: 'Limpeza profunda', stars: 4, when: 'Há 2 semanas' },
      { id: 'rr4', cleaner: 'Luis Pérez', service: 'Mudança',          stars: 5, when: 'Há 1 mês' },
    ],
  },
} as const satisfies Record<ClientLocale, unknown>;

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
   * The accent chip also fires a single quiet ring pulse after the
   * digit-flip tally finishes on first mount.
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
      className={`flex flex-1 items-center gap-2 rounded-2xl px-3 py-2.5 text-left ring-1 ring-inset shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_4px_12px_-2px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 ${surface}`}
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
        <p className="text-sm font-bold">
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
      className="group relative -m-2 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <HelpCircle className="h-3.5 w-3.5" />
    </button>
  );
}

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
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const SERVICE_FILTERS = t.serviceFilters;
  const AVAIL_FILTERS = t.availFilters;
  const RECENT_RATINGS = t.recentRatings;
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
      {/* Ambient depth: sky/indigo blob top-center — sits behind content. */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 -z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-br from-sky-300 to-indigo-400 opacity-30 blur-3xl"
      />
      {/* Header: greeting + search/filter — wired to local state, not a
          GET-navigation, so the input actually filters the lists below. */}
      <section className="relative px-1 pt-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-slate-900">
              {t.greetingName}
              <Hand className="h-5 w-5 -rotate-12 text-amber-400" />
            </p>
            <p className="mt-0.5 text-[13px] text-slate-600">
              {t.greetingTagline}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              title={t.resetTitle}
              className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label={t.resetAria}
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
              placeholder={t.searchPlaceholder}
              title={t.searchTitle}
              className="block h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            aria-label={t.filtersAria}
            title={t.filtersTitle}
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
        title={t.bookCtaTitle}
        className="mt-5 flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-[0_14px_32px_-14px_rgba(37,99,235,0.65)] transition hover:from-blue-700 hover:to-blue-900"
      >
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-blue-100">
            {t.bookCtaKicker}
          </p>
          <p className="mt-1 font-display text-xl font-bold leading-tight">
            {t.bookCtaLabel}
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

      <div className="relative mt-3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-4 h-24 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.05),_transparent_60%)]"
        />
        <div className="relative flex gap-2">
        <StatChip
          icon={CalendarCheck}
          tone="blue"
          emphasis="accent"
          label={t.statUpcomingLabel}
          value="2"
          title={t.statUpcomingTitle}
          onClick={() => router.push('/client/preview/cleanings?status=upcoming')}
        />
        <StatChip
          icon={CheckCircle2}
          tone="emerald"
          emphasis="neutral"
          dotTone="emerald"
          label={t.statDoneLabel}
          value="12"
          title={t.statDoneTitle}
          onClick={() => router.push('/client/preview/cleanings?status=done')}
        />
        <StatChip
          icon={Star}
          tone="amber"
          emphasis="neutral"
          dotTone="amber"
          label={t.statRatingLabel}
          value="4.8"
          title={t.statRatingTitle}
          onClick={() => setRatingsOpen(true)}
        />
        </div>
      </div>

      {/* Categorías — filtered by local search + filter sheet */}
      {visibleServices.length > 0 ? (
        <ServiceCatalog token={PREVIEW_TOKEN} services={visibleServices} />
      ) : (
        <section className="mt-6">
          <h2 className="text-[13px] font-bold text-slate-900">{t.categoriesHeading}</h2>
          <p className="mt-3 rounded-2xl bg-white p-4 text-center text-[12px] text-slate-500 ring-1 ring-inset ring-slate-100">
            {t.categoriesEmpty}
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
            <h2 className="text-[13px] font-bold text-slate-900">{t.teamHeading}</h2>
            <p className="mt-3 rounded-2xl bg-white p-4 text-center text-[12px] text-slate-500 ring-1 ring-inset ring-slate-100">
              {t.teamEmpty}
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
        title={t.photoStripDeckTitle}
        className="cursor-pointer"
      >
        <DemoPhotoStrip
          title={t.photoStripTitle}
          caption={t.photoStripCaption}
        />
      </div>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-slate-900">{t.nextVisitHeading}</h2>
          <HelpTip label={t.nextVisitHelp} />
        </div>
        {nextStatus === 'rejected' ? (
          <div className="mt-3 rounded-3xl bg-white p-4 text-center ring-1 ring-inset ring-slate-100">
            <p className="text-[12px] font-semibold text-slate-700">
              {t.cancelledLine}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {t.cancelledSubLine}
            </p>
            <button
              type="button"
              onClick={() => setNextStatus('pending')}
              title={t.restoreDemoTitle}
              className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white hover:bg-slate-700"
            >
              {t.restoreDemo}
            </button>
          </div>
        ) : (
          <div className="mt-3 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 p-[1px] shadow-[0_2px_4px_rgba(15,23,42,0.04),_0_10px_24px_-8px_rgba(15,23,42,0.08)]">
          <div className="relative rounded-3xl bg-white p-4 ring-1 ring-inset ring-slate-100">
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
                  title={t.visitCardTitle}
                  className="group -m-1 flex items-start gap-3 rounded-2xl p-1 transition hover:bg-slate-50"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <CalendarCheck className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-blue-700">
                      {t.tomorrowKicker}
                    </p>
                    <p className="mt-0.5 font-display text-sm font-bold text-slate-900">
                      {t.standardClean}
                    </p>
                    <p className="mt-0.5 text-[12px] text-slate-600">
                      {t.withAnaDuration}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{PROPERTY.address}</span>
                    </p>
                  </div>
                  <span className="shrink-0 self-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition group-hover:bg-slate-700">
                    {t.see}
                  </span>
                </Link>
              );

              // Legacy fallback row — keyboard / reduced-motion users
              // get the classic two-button accept/reject as before.
              const fallbackRow = (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNextStatus('accepted');
                      showToast(t.visitConfirmed);
                    }}
                    title={t.acceptTitle}
                    className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
                  >
                    {t.accept}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNextStatus('rejected');
                      showToast(t.visitCancelled);
                    }}
                    title={t.rejectTitle}
                    className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
                  >
                    {t.reject}
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
                        showToast(t.visitConfirmed);
                      }}
                      onReject={() => {
                        setNextStatus('rejected');
                        showToast(t.visitCancelled);
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
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNextStatus('done');
                          setSealVisible(true);
                          showToast(t.visitMarkedComplete);
                        }}
                        title={t.markCompletedTitle}
                        className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
                      >
                        {t.markCompleted}
                      </button>
                    </div>
                  )}
                  {nextStatus === 'done' && (
                    <div className="mt-3 flex gap-2">
                      <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {t.completedNow}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          </div>
        )}
      </section>

      {/* Referral sheet */}
      <DemoSheet
        open={referralOpen}
        onClose={() => setReferralOpen(false)}
        title={t.referralTitle}
      >
        <p className="text-[13px] text-slate-600">
          {t.referralBody}
        </p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {t.yourReferralCode}
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <code className="font-mono text-2xl font-bold tracking-widest text-blue-700">
              PREVIEW
            </code>
            <button
              type="button"
              onClick={copyReferral}
              title={t.copyCodeTitle}
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-slate-700"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" /> {t.copied}
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> {t.copyCodeLabel}
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-slate-400">
          {t.referralShare}
        </p>
      </DemoSheet>

      {/* Cleaner profile sheet — always carries a title so the dialog
          is announced by assistive tech and the visible h3 acts as the
          labelledby anchor. */}
      <DemoSheet
        open={openCleaner != null}
        onClose={() => setCleanerOpen(null)}
        title={openCleaner ? openCleaner.name : t.cleanerSheetFallback}
      >
        {openCleaner && (
          <>
            {/* Flippable cleaner card — front is the existing facts;
                back is the "cómo trabaja" personality side reached via
                the discrete "Conócela" chip in the corner. */}
            <FlippableCleanerCard
              cleanerName={openCleaner.name}
              front={
                <div className="rounded-2xl p-1">
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
                      {t.recentJobs}
                    </p>
                    <ul className="mt-2 space-y-1.5 text-[12.5px] text-slate-700">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {t.deepCleanLabel} · {LONDON_PROPERTIES.soho.address}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {t.standardCleanLabel} · {LONDON_PROPERTIES.notting.address}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        {t.windowsLabel} · {LONDON_PROPERTIES.camden.address}
                      </li>
                    </ul>
                  </div>
                </div>
              }
            />
            <Link
              href="/client/preview/book"
              title={t.requestCleanerTitle(openCleaner.name)}
              className="mt-4 flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] hover:bg-blue-700"
              onClick={() => setCleanerOpen(null)}
            >
              {t.requestCleanerCta}
            </Link>
          </>
        )}
      </DemoSheet>

      {/* Filters sheet */}
      <DemoSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title={t.filtersHeading}
      >
        <p className="mt-1 text-[12px] text-slate-500">
          {t.filtersBody}
        </p>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {t.serviceTypeHeading}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SERVICE_FILTERS.map((f) => {
              const on = serviceFilter.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleServiceFilter(f)}
                  title={t.serviceFilterTitle(f)}
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
            {t.minRatingHeading}
          </p>
          <div className="mt-2 flex gap-2">
            {[0, 3, 4, 4.5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMinStars(n)}
                title={n === 0 ? t.minRatingNoFilter : t.minRatingShow(n)}
                className={`flex-1 rounded-xl px-2 py-1.5 text-[11px] font-bold transition ${
                  minStars === n
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n === 0 ? t.minRatingAll : `${n}+ ★`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {t.availabilityHeading}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAIL_FILTERS.map((f) => {
              const on = availFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setAvailFilter(on ? null : f)}
                  title={t.availabilityTitle(f)}
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
            title={t.clearFiltersTitle}
            className="flex-1 rounded-2xl bg-slate-100 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
          >
            {t.clearFilters}
          </button>
          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            title={t.applyTitle}
            className="flex-1 rounded-2xl bg-blue-600 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-blue-700"
          >
            {t.apply}
          </button>
        </div>
      </DemoSheet>

      {/* Recent ratings drill-down */}
      <DemoSheet
        open={ratingsOpen}
        onClose={() => setRatingsOpen(false)}
        title={t.ratingsSheetTitle}
      >
        <p className="text-[12px] text-slate-500">
          {t.averageLabel} <span className="font-bold text-slate-900">4.8</span> ·{' '}
          {t.ratingsCount(RECENT_RATINGS.length)}
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

      {/* Floating "Pregúntame algo" pill that morphs into the Sofía
          AI concierge bottom sheet. Lives above the tab bar. */}
      <ConciergeSheet />

      {/* Floating toast */}
      <DemoToast show={toast != null} message={toast ?? ''} />
    </ClientShell>
  );
}


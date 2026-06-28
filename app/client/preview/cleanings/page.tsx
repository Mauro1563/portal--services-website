/**
 * Public preview: Client → "Tu calendario" view.
 *
 * Reads from the shared preview schedule (lib/preview-schedule.ts) so
 * any change the owner makes in /owner/preview/scheduler appears here
 * on refresh / navigation. The client persona is Mr. Thompson
 * (c-thompson) — we filter the shared schedule down to only the
 * visits booked for him.
 */
'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
import { MOCK_CTX, PREVIEW_TOKEN } from '../_mock';
import {
  DAY_LABELS,
  DEMO_CLEANERS,
  WEEK_DAYS,
  loadSchedule,
  type ScheduledTask,
  type WeekDay,
} from '@/lib/preview-schedule';

/** Persona for the client demo — Mr. Thompson owns the Soho Loft. */
const CURRENT_CLIENT_ID = 'c-thompson';

const COPY = {
  en: {
    title: 'Your calendar',
    serviceEstandar: 'Standard clean',
    serviceProfunda: 'Deep clean',
    serviceCristales: 'Windows',
    serviceMudanza: 'End-of-tenancy clean',
    statusScheduled: 'Upcoming',
    statusInProgress: 'In progress',
    statusCompleted: 'Done',
    visitTitle: (svc: string, name: string) => `${svc} with ${name}`,
    managerBannerTitle: 'Your manager has organised your whole week',
    managerBannerBody: 'Your manager organised your whole week. No surprises!',
    noneConfirmed: "You don't have any cleanings confirmed yet.",
    countOne: 'cleaning confirmed',
    countMany: 'cleanings confirmed',
    byPrefix: ' by ',
    upcoming: 'Upcoming visits',
    past: 'Past visits',
    emptyTitle: 'No visits scheduled for you yet.',
    bookNew: 'Book a new cleaning',
    bookNewTitle: 'Create a new booking',
    loading: 'Loading…',
    withPrefix: 'With',
    joinerAnd: 'and',
    formatDuration: (h: number, m: number) =>
      m > 0 ? (h ? `${h}h ${m}m` : `${m}m`) : `${h}h`,
    formatMins: (m: number) => `${m}m`,
  },
  es: {
    title: 'Tu calendario',
    serviceEstandar: 'Limpieza estándar',
    serviceProfunda: 'Limpieza profunda',
    serviceCristales: 'Cristales',
    serviceMudanza: 'Mudanza fin de contrato',
    statusScheduled: 'Próxima',
    statusInProgress: 'En curso',
    statusCompleted: 'Hecha',
    visitTitle: (svc: string, name: string) => `${svc} con ${name}`,
    managerBannerTitle: 'Tu manager te organizó toda la semana',
    managerBannerBody: 'Tu manager organizó toda tu semana. ¡Sin sorpresas!',
    noneConfirmed: 'Todavía no tienes limpiezas confirmadas.',
    countOne: 'limpieza confirmada',
    countMany: 'limpiezas confirmadas',
    byPrefix: ' por ',
    upcoming: 'Próximas visitas',
    past: 'Visitas pasadas',
    emptyTitle: 'Aún no hay visitas programadas para ti.',
    bookNew: 'Reservar nueva limpieza',
    bookNewTitle: 'Crear una nueva reserva',
    loading: 'Cargando…',
    withPrefix: 'Con',
    joinerAnd: 'y',
    formatDuration: (h: number, m: number) =>
      m > 0 ? (h ? `${h}h ${m}m` : `${m}m`) : `${h}h`,
    formatMins: (m: number) => `${m}m`,
  },
  pt: {
    title: 'O seu calendário',
    serviceEstandar: 'Limpeza padrão',
    serviceProfunda: 'Limpeza profunda',
    serviceCristales: 'Vidros',
    serviceMudanza: 'Limpeza de fim de contrato',
    statusScheduled: 'Próxima',
    statusInProgress: 'Em curso',
    statusCompleted: 'Feita',
    visitTitle: (svc: string, name: string) => `${svc} com ${name}`,
    managerBannerTitle: 'O seu gestor organizou-lhe a semana toda',
    managerBannerBody: 'O seu gestor organizou-lhe a semana toda. Sem surpresas!',
    noneConfirmed: 'Ainda não tem limpezas confirmadas.',
    countOne: 'limpeza confirmada',
    countMany: 'limpezas confirmadas',
    byPrefix: ' por ',
    upcoming: 'Próximas visitas',
    past: 'Visitas passadas',
    emptyTitle: 'Ainda não há visitas agendadas para si.',
    bookNew: 'Reservar nova limpeza',
    bookNewTitle: 'Criar uma nova reserva',
    loading: 'A carregar…',
    withPrefix: 'Com',
    joinerAnd: 'e',
    formatDuration: (h: number, m: number) =>
      m > 0 ? (h ? `${h}h ${m}m` : `${m}m`) : `${h}h`,
    formatMins: (m: number) => `${m}m`,
  },
} as const satisfies Record<ClientLocale, unknown>;

type CopyShape = (typeof COPY)['en'];

function buildServiceLabel(t: CopyShape): Record<ScheduledTask['service'], string> {
  return {
    estandar: t.serviceEstandar,
    profunda: t.serviceProfunda,
    cristales: t.serviceCristales,
    mudanza: t.serviceMudanza,
  };
}

function buildStatusPill(
  t: CopyShape,
): Record<ScheduledTask['status'], { label: string; cls: string }> {
  return {
    scheduled: { label: t.statusScheduled, cls: 'bg-blue-100 text-blue-700' },
    in_progress: { label: t.statusInProgress, cls: 'bg-amber-100 text-amber-800' },
    completed: { label: t.statusCompleted, cls: 'bg-emerald-100 text-emerald-800' },
  };
}

function formatHours(minutes: number, t: CopyShape): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return t.formatDuration(h, m);
  }
  return t.formatMins(minutes);
}

function cleanerMeta(id: string) {
  return (
    DEMO_CLEANERS.find((c) => c.id === id) ?? {
      id,
      name: id,
      initials: '?',
      color: '#64748b',
    }
  );
}

function VisitCard({
  t,
  copy,
  serviceLabel,
  statusPill,
}: {
  t: ScheduledTask;
  copy: CopyShape;
  serviceLabel: Record<ScheduledTask['service'], string>;
  statusPill: Record<ScheduledTask['status'], { label: string; cls: string }>;
}) {
  const cleaner = cleanerMeta(t.cleanerId);
  const pill = statusPill[t.status];
  const isDone = t.status === 'completed';
  return (
    <li>
      <article
        title={copy.visitTitle(serviceLabel[t.service], t.cleanerName)}
        className="block w-full rounded-3xl bg-white p-4 text-left ring-1 ring-inset ring-slate-100"
      >
        <div className="flex items-start gap-3">
          {/* Day badge */}
          <div
            className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-center ${
              isDone
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.18em]">
              {DAY_LABELS[t.day].slice(0, 3)}
            </span>
            <span className="mt-0.5 font-display text-base font-bold leading-none">
              {t.startTime}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-slate-900">
              {serviceLabel[t.service]}
            </p>
            {/* Cleaner row with avatar */}
            <div className="mt-1 flex items-center gap-1.5">
              <span
                aria-hidden
                className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white"
                style={{ backgroundColor: cleaner.color }}
              >
                {cleaner.initials}
              </span>
              <p className="text-[12px] text-slate-600">
                {copy.withPrefix} <span className="font-semibold text-slate-900">{t.cleanerName}</span>
                {' · '}
                <span className="text-slate-500">{formatHours(t.durationMin, copy)}</span>
              </p>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{t.propertyAddress}</span>
            </p>
          </div>

          <span
            className={`shrink-0 self-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${pill.cls}`}
          >
            {pill.label}
          </span>
        </div>
      </article>
    </li>
  );
}

function CleaningsInner() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const SERVICE_LABEL = useMemo(() => buildServiceLabel(t), [t]);
  const STATUS_PILL = useMemo(() => buildStatusPill(t), [t]);
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);

  useEffect(() => {
    const all = loadSchedule();
    setTasks(all.filter((t) => t.clientId === CURRENT_CLIENT_ID));
  }, []);

  // Order by week day then start time, splitting future vs past.
  const ordered = useMemo(() => {
    const dayOrder: Record<WeekDay, number> = WEEK_DAYS.reduce(
      (acc, key, i) => {
        acc[key] = i;
        return acc;
      },
      {} as Record<WeekDay, number>,
    );
    return [...tasks].sort((a, b) => {
      const d = dayOrder[a.day] - dayOrder[b.day];
      if (d !== 0) return d;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [tasks]);

  const upcoming = useMemo(
    () => ordered.filter((t) => t.status !== 'completed'),
    [ordered],
  );
  const past = useMemo(
    () => ordered.filter((t) => t.status === 'completed'),
    [ordered],
  );

  // Header phrase — unique cleaner first names assigned to this client.
  const cleanerFirstNames = useMemo(() => {
    const names = Array.from(new Set(tasks.map((t) => t.cleanerName.split(' ')[0])));
    return names;
  }, [tasks]);

  const headerCleanerList = useMemo(() => {
    if (cleanerFirstNames.length === 0) return '';
    if (cleanerFirstNames.length === 1) return cleanerFirstNames[0];
    if (cleanerFirstNames.length === 2) return `${cleanerFirstNames[0]} ${t.joinerAnd} ${cleanerFirstNames[1]}`;
    return `${cleanerFirstNames.slice(0, -1).join(', ')} ${t.joinerAnd} ${cleanerFirstNames[cleanerFirstNames.length - 1]}`;
  }, [cleanerFirstNames, t]);

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="reservas"
      title={t.title}
    >
      {/* Manager banner */}
      <div
        className="mb-4 flex items-start gap-2 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/80 p-3 ring-1 ring-inset ring-amber-200/70"
        title={t.managerBannerTitle}
      >
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-[12px] font-semibold leading-snug text-amber-900">
          {t.managerBannerBody}
        </p>
      </div>

      {/* Header */}
      <header className="mb-4">
        <h1 className="font-display text-lg font-bold text-slate-900">
          {t.title}
        </h1>
        <p className="mt-0.5 text-[12px] text-slate-500">
          {tasks.length === 0
            ? t.noneConfirmed
            : (
              <>
                <span className="font-semibold text-slate-900">{tasks.length}</span>{' '}
                {tasks.length === 1 ? t.countOne : t.countMany}
                {headerCleanerList ? <>{t.byPrefix}<span className="font-semibold text-slate-900">{headerCleanerList}</span></> : null}
              </>
            )}
        </p>
      </header>

      {upcoming.length > 0 && (
        <section>
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            {t.upcoming}
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {upcoming.map((task) => (
              <VisitCard key={task.id} t={task} copy={t} serviceLabel={SERVICE_LABEL} statusPill={STATUS_PILL} />
            ))}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section className="mt-6">
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            {t.past}
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {past.map((task) => (
              <VisitCard key={task.id} t={task} copy={t} serviceLabel={SERVICE_LABEL} statusPill={STATUS_PILL} />
            ))}
          </ul>
        </section>
      )}

      {tasks.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-inset ring-slate-100">
          <CalendarCheck className="mx-auto mb-2 h-5 w-5 text-slate-300" />
          {t.emptyTitle}
        </p>
      )}

      <Link
        href="/client/preview/book"
        title={t.bookNewTitle}
        className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition hover:bg-blue-700"
      >
        {t.bookNew}
      </Link>
    </ClientShell>
  );
}

function CleaningsLoadingFallback() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  return <p className="p-6 text-sm text-slate-500">{t.loading}</p>;
}

export default function ClientCleaningsPreview() {
  return (
    <Suspense fallback={<CleaningsLoadingFallback />}>
      <CleaningsInner />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    schedule: 'Schedule',
    weeklyCalendar: 'Weekly calendar',
    scheduleTitle: 'Assign cleaners to properties each day of the week',
    cleans: 'Cleans',
    cleansHint: '4 scheduled today',
    cleansTitle: 'See all cleans (scheduled, in progress and completed)',
    team: 'Team',
    teamHint: '4 operatives active',
    teamTitle: 'See the cleaner team and reassign tasks',
    properties: 'Properties',
    propertiesHint: '6 sites',
    propertiesTitle: 'Manage your clients’ properties',
    clients: 'Clients',
    clientsHint: '6 active',
    clientsTitle: 'List of clients and access to their portals',
    branding: 'Branding',
    brandingHint: 'Logo and colours',
    brandingTitle: 'Customise the name, logo and colours of your clients’ portal',
    marketing: 'Marketing',
    marketingHint: 'QR, promos, social',
    marketingTitle: 'Share your link, create promo codes and download materials',
    quickAccess: 'Quick access',
    newTaskBtn: 'New task',
    newTaskTitle: 'Create a new cleaning from the dashboard',
    schedulingTitle: 'Schedule cleaning',
    close: 'Close',
    propertyLabel: 'Property',
    selectProperty: 'Select property…',
    timeLabel: 'Time',
    addToPlan: 'Add to plan',
    demoOnly: 'Data only stays in the demo.',
  },
  es: {
    schedule: 'Programar',
    weeklyCalendar: 'Calendario semanal',
    scheduleTitle: 'Asigna cleaners a propiedades cada día de la semana',
    cleans: 'Limpiezas',
    cleansHint: '4 programadas hoy',
    cleansTitle: 'Ver todas las limpiezas (programadas, en curso y completadas)',
    team: 'Equipo',
    teamHint: '4 operarios activos',
    teamTitle: 'Ver el equipo de cleaners y reasignar tareas',
    properties: 'Propiedades',
    propertiesHint: '6 sitios',
    propertiesTitle: 'Gestionar las propiedades de tus clientes',
    clients: 'Clientes',
    clientsHint: '6 activos',
    clientsTitle: 'Lista de clientes y acceso a sus portales',
    branding: 'Branding',
    brandingHint: 'Logo y colores',
    brandingTitle: 'Personaliza el nombre, logo y colores del portal de tus clientes',
    marketing: 'Marketing',
    marketingHint: 'QR, promos, redes',
    marketingTitle: 'Comparte tu enlace, crea códigos promocionales y descarga material',
    quickAccess: 'Accesos rápidos',
    newTaskBtn: 'Nueva tarea',
    newTaskTitle: 'Crear una nueva limpieza desde el dashboard',
    schedulingTitle: 'Programar limpieza',
    close: 'Cerrar',
    propertyLabel: 'Propiedad',
    selectProperty: 'Selecciona propiedad…',
    timeLabel: 'Hora',
    addToPlan: 'Añadir al planning',
    demoOnly: 'Los datos se quedan sólo en la demo.',
  },
  pt: {
    schedule: 'Programar',
    weeklyCalendar: 'Calendário semanal',
    scheduleTitle: 'Atribui cleaners a propriedades em cada dia da semana',
    cleans: 'Limpezas',
    cleansHint: '4 agendadas hoje',
    cleansTitle: 'Ver todas as limpezas (agendadas, em curso e concluídas)',
    team: 'Equipa',
    teamHint: '4 operacionais ativos',
    teamTitle: 'Ver a equipa de cleaners e reatribuir tarefas',
    properties: 'Propriedades',
    propertiesHint: '6 locais',
    propertiesTitle: 'Gerir as propriedades dos teus clientes',
    clients: 'Clientes',
    clientsHint: '6 ativos',
    clientsTitle: 'Lista de clientes e acesso aos portais deles',
    branding: 'Branding',
    brandingHint: 'Logótipo e cores',
    brandingTitle: 'Personaliza o nome, logótipo e cores do portal dos teus clientes',
    marketing: 'Marketing',
    marketingHint: 'QR, promos, redes',
    marketingTitle: 'Partilha o teu link, cria códigos promocionais e descarrega material',
    quickAccess: 'Acessos rápidos',
    newTaskBtn: 'Nova tarefa',
    newTaskTitle: 'Criar uma nova limpeza a partir do dashboard',
    schedulingTitle: 'Agendar limpeza',
    close: 'Fechar',
    propertyLabel: 'Propriedade',
    selectProperty: 'Seleciona propriedade…',
    timeLabel: 'Hora',
    addToPlan: 'Adicionar ao planeamento',
    demoOnly: 'Os dados ficam só na demo.',
  },
} as const;
import {
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Info,
  ListChecks,
  Megaphone,
  Palette,
  Plus,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type Tile = {
  href: string;
  label: string;
  hint: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconText: string;
  title: string;
};

type CopyT = (typeof COPY)['en'];

// Every quick-action tile shares the same neutral slate icon chip — the
// brand colour budget is reserved for status (success/warn/error) and
// teal micro-accents, not for decorative per-tile tinting.
const NEUTRAL_ICON = { iconBg: 'bg-slate-100', iconText: 'text-slate-700' };

function buildPrimary(t: CopyT): Tile[] {
  return [
    {
      href: '/owner/preview/scheduler',
      label: t.schedule,
      hint: t.weeklyCalendar,
      Icon: CalendarDays,
      ...NEUTRAL_ICON,
      title: t.scheduleTitle,
    },
    {
      href: '/owner/preview/tasks',
      label: t.cleans,
      hint: t.cleansHint,
      Icon: ListChecks,
      ...NEUTRAL_ICON,
      title: t.cleansTitle,
    },
    {
      href: '/owner/preview/cleaners',
      label: t.team,
      hint: t.teamHint,
      Icon: Users,
      ...NEUTRAL_ICON,
      title: t.teamTitle,
    },
  ];
}

function buildSecondary(t: CopyT): Tile[] {
  return [
    {
      href: '/owner/preview/properties',
      label: t.properties,
      hint: t.propertiesHint,
      Icon: Building2,
      ...NEUTRAL_ICON,
      title: t.propertiesTitle,
    },
    {
      href: '/owner/preview/clients',
      label: t.clients,
      hint: t.clientsHint,
      Icon: BarChart3,
      ...NEUTRAL_ICON,
      title: t.clientsTitle,
    },
    {
      href: '/owner/preview/branding',
      label: t.branding,
      hint: t.brandingHint,
      Icon: Palette,
      ...NEUTRAL_ICON,
      title: t.brandingTitle,
    },
    {
      href: '/owner/preview/marketing',
      label: t.marketing,
      hint: t.marketingHint,
      Icon: Megaphone,
      ...NEUTRAL_ICON,
      title: t.marketingTitle,
    },
  ];
}

const PROPERTY_OPTIONS = [
  'Soho Loft',
  'Camden House',
  'Notting Hill Flat',
  'Shoreditch Studio',
  'Kensington Mews',
  'Bermondsey Apartment',
];

type DraftTask = {
  id: string;
  property: string;
  time: string;
};

export function DemoQuickActions() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const PRIMARY = buildPrimary(t);
  const SECONDARY = buildSecondary(t);
  const [showNew, setShowNew] = useState(false);
  const [property, setProperty] = useState('');
  const [time, setTime] = useState('');
  const [added, setAdded] = useState<DraftTask[]>([]);

  function add() {
    if (!property.trim() || !time.trim()) return;
    setAdded((prev) => [
      ...prev,
      { id: `draft-${prev.length + 1}`, property: property.trim(), time: time.trim() },
    ]);
    setProperty('');
    setTime('');
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="font-display text-base font-semibold text-slate-900">
          {t.quickAccess}
        </h2>
        <button
          type="button"
          onClick={() => setShowNew((s) => !s)}
          title={t.newTaskTitle}
          className="inline-flex items-center gap-1 rounded-full bg-[#0A0D18] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D8C7]"
        >
          <Plus className="h-3.5 w-3.5" /> {t.newTaskBtn}
        </button>
      </div>

      {showNew ? (
        <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
              <Sparkles className="h-3.5 w-3.5 text-[#00D8C7]" /> {t.schedulingTitle}
            </p>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              aria-label={t.close}
              className="rounded-full p-1 text-slate-500 hover:bg-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-[2fr_1fr]">
            <label className="sr-only" htmlFor="quick-property">
              {t.propertyLabel}
            </label>
            <select
              id="quick-property"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            >
              <option value="">{t.selectProperty}</option>
              {PROPERTY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="quick-time">
              {t.timeLabel}
            </label>
            <input
              id="quick-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={add}
            disabled={!property || !time}
            className="mt-2 h-9 rounded-lg bg-[#0A0D18] px-3 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {t.addToPlan}
          </button>
          {added.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {added.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-[12px] text-slate-700 ring-1 ring-slate-200"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span className="font-semibold">{t.time}</span>
                  <span aria-hidden>·</span>
                  <span>{t.property}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-slate-600">
              <Info className="h-3 w-3" /> {t.demoOnly}
            </p>
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {PRIMARY.map((t) => {
          const Icon = t.Icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              title={t.title}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D8C7]"
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${t.iconBg} ${t.iconText}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-slate-900">
                  {t.label}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-slate-600">
                  {t.hint}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
            </Link>
          );
        })}
      </div>

      <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {SECONDARY.map((t) => {
          const Icon = t.Icon;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                title={t.title}
                className="group flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00D8C7]"
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${t.iconBg} ${t.iconText}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-slate-900">
                    {t.label}
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] text-slate-600">
                    {t.hint}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

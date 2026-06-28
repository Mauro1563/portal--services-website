'use client';

import { useState } from 'react';
import Link from 'next/link';
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

const PRIMARY: Tile[] = [
  {
    href: '/owner/preview/scheduler',
    label: 'Programar',
    hint: 'Calendario semanal',
    Icon: CalendarDays,
    iconBg: 'bg-indigo-50',
    iconText: 'text-indigo-700',
    title: 'Asigna cleaners a propiedades cada día de la semana',
  },
  {
    href: '/owner/preview/tasks',
    label: 'Limpiezas',
    hint: '4 programadas hoy',
    Icon: ListChecks,
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-700',
    title: 'Ver todas las limpiezas (programadas, en curso y completadas)',
  },
  {
    href: '/owner/preview/cleaners',
    label: 'Equipo',
    hint: '4 operarios activos',
    Icon: Users,
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-700',
    title: 'Ver el equipo de cleaners y reasignar tareas',
  },
];

const SECONDARY: Tile[] = [
  {
    href: '/owner/preview/properties',
    label: 'Propiedades',
    hint: '6 sitios',
    Icon: Building2,
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-700',
    title: 'Gestionar las propiedades de tus clientes',
  },
  {
    href: '/owner/preview/clients',
    label: 'Clientes',
    hint: '6 activos',
    Icon: BarChart3,
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-700',
    title: 'Lista de clientes y acceso a sus portales',
  },
  {
    href: '/owner/preview/branding',
    label: 'Branding',
    hint: 'Logo y colores',
    Icon: Palette,
    iconBg: 'bg-fuchsia-50',
    iconText: 'text-fuchsia-700',
    title: 'Personaliza el nombre, logo y colores del portal de tus clientes',
  },
  {
    href: '/owner/preview/marketing',
    label: 'Marketing',
    hint: 'QR, promos, redes',
    Icon: Megaphone,
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-700',
    title: 'Comparte tu enlace, crea códigos promocionales y descarga material',
  },
];

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
          Accesos rápidos
        </h2>
        <button
          type="button"
          onClick={() => setShowNew((s) => !s)}
          title="Crear una nueva limpieza desde el dashboard"
          className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <Plus className="h-3.5 w-3.5" /> Nueva tarea
        </button>
      </div>

      {showNew ? (
        <div className="mb-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-3">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Programar limpieza
            </p>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              aria-label="Cerrar"
              className="rounded-full p-1 text-slate-500 hover:bg-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-[2fr_1fr]">
            <label className="sr-only" htmlFor="quick-property">
              Propiedad
            </label>
            <select
              id="quick-property"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900"
            >
              <option value="">Selecciona propiedad…</option>
              {PROPERTY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="quick-time">
              Hora
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
            className="mt-2 h-9 rounded-lg bg-blue-600 px-3 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Añadir al planning
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
              <Info className="h-3 w-3" /> Los datos se quedan sólo en la demo.
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
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
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
                className="group flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-500"
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

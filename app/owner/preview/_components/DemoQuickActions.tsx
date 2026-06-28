'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Info,
  ListChecks,
  Megaphone,
  Palette,
  Plus,
  Users,
  X,
} from 'lucide-react';

type Tile = {
  href: string;
  label: string;
  hint: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
};

const PRIMARY: Tile[] = [
  {
    href: '/owner/preview/tasks',
    label: 'Limpiezas',
    hint: '4 programadas hoy',
    Icon: ListChecks,
    title: 'Ver todas las limpiezas (programadas, en curso y completadas)',
  },
  {
    href: '/owner/preview/cleaners',
    label: 'Equipo',
    hint: '4 operarios activos',
    Icon: Users,
    title: 'Ver el equipo de cleaners y reasignar tareas',
  },
];

const SECONDARY: Tile[] = [
  {
    href: '/owner/preview/properties',
    label: 'Propiedades',
    hint: '6 sitios',
    Icon: Building2,
    title: 'Gestionar las propiedades de tus clientes',
  },
  {
    href: '/owner/preview/clients',
    label: 'Clientes',
    hint: '6 activos',
    Icon: BarChart3,
    title: 'Lista de clientes y acceso a sus portales',
  },
  {
    href: '/owner/preview/branding',
    label: 'Branding',
    hint: 'Logo y colores',
    Icon: Palette,
    title: 'Personaliza el nombre, logo y colores del portal de tus clientes',
  },
  {
    href: '/owner/preview/marketing',
    label: 'Marketing',
    hint: 'QR, promos, redes',
    Icon: Megaphone,
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
    <section className="ps-set">
      <div className="mb-4 flex items-end justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="font-mono text-[12px] text-[#54524D]">
            accesos
            <span className="ml-1 inline-block h-[1px] w-5 align-middle bg-[#FF5B1F]" />
          </p>
          <h2
            className="mt-1 text-[28px] leading-[1] tracking-[-0.02em] text-[#141414] md:text-[32px]"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            Accesos rápidos
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowNew((s) => !s)}
          title="Crear una nueva limpieza desde el dashboard"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF5B1F] px-4 py-2 text-[12px] font-semibold text-[#1A0A04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
          style={{ transitionDuration: '160ms' }}
        >
          <Plus className="h-3.5 w-3.5" /> Nueva tarea
        </button>
      </div>

      {showNew ? (
        <div className="ps-set mb-4 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[12px] text-[#54524D]">
              programar limpieza
              <span className="ml-1 inline-block h-[1px] w-5 align-middle bg-[#FF5B1F]" />
            </p>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              aria-label="Cerrar"
              className="rounded-full p-1 text-[#54524D] hover:bg-[#F4EFE6]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-[2fr_1fr]">
            <label className="sr-only" htmlFor="quick-property">
              Propiedad
            </label>
            <select
              id="quick-property"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="h-10 rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] px-3 text-[13px] text-[#141414] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5B1F]"
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
              className="h-10 rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] px-3 text-[13px] text-[#141414] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5B1F]"
            />
          </div>
          <button
            type="button"
            onClick={add}
            disabled={!property || !time}
            className="mt-3 h-10 rounded-full bg-[#141414] px-4 text-[12px] font-semibold text-[#F4EFE6] disabled:cursor-not-allowed disabled:opacity-40"
            style={{ transitionDuration: '160ms' }}
          >
            Añadir al planning
          </button>
          {added.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {added.map((t) => (
                <li
                  key={t.id}
                  className="ps-set flex items-center gap-2 rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] px-3 py-2 font-mono text-[12px] text-[#141414]"
                >
                  <CheckCircle2 className="h-3 w-3 text-[#3F5B3A]" />
                  <span className="font-semibold">{t.time}</span>
                  <span aria-hidden className="text-[#54524D]">·</span>
                  <span>{t.property}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-[#54524D]">
              <Info className="h-3 w-3" /> Los datos se quedan sólo en la demo.
            </p>
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PRIMARY.map((t) => {
          const Icon = t.Icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              title={t.title}
              className="ps-set group flex items-center gap-4 rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 transition-colors hover:bg-[#E4DACA]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5B1F] md:p-6"
              style={{ transitionDuration: '160ms' }}
            >
              <Icon className="h-5 w-5 shrink-0 text-[#141414]" />
              <div className="min-w-0 flex-1">
                <p
                  className="text-[20px] leading-tight tracking-[-0.015em] text-[#141414] md:text-[24px]"
                  style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
                >
                  {t.label}
                </p>
                <p className="mt-1 font-mono text-[11px] text-[#54524D]">
                  {t.hint}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#54524D] transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>

      <ul className="ps-set mt-3 divide-y divide-[#1414141A] overflow-hidden rounded-[12px] border border-[#1414141A] bg-[#E4DACA]">
        {SECONDARY.map((t) => {
          const Icon = t.Icon;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                title={t.title}
                className="group flex min-h-[64px] items-center gap-4 px-5 py-4 transition-colors hover:bg-[#E4DACA]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#FF5B1F]"
                style={{ transitionDuration: '160ms' }}
              >
                <Icon className="h-4 w-4 shrink-0 text-[#141414]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#141414]">
                    {t.label}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-[#54524D]">
                    {t.hint}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#54524D] transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

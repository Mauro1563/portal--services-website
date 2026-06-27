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
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type Tile = {
  href: string;
  label: string;
  hint: string;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;
  title: string;
};

const TILES: Tile[] = [
  {
    href: '/owner/preview/tasks',
    label: 'Limpiezas',
    hint: '4 hoy',
    Icon: ListChecks,
    accent: 'from-blue-600 to-blue-700',
    title: 'Ver todas las limpiezas (programadas, en curso y completadas)',
  },
  {
    href: '/owner/preview/properties',
    label: 'Propiedades',
    hint: '6 sitios',
    Icon: Building2,
    accent: 'from-emerald-500 to-emerald-700',
    title: 'Gestionar las propiedades de tus clientes',
  },
  {
    href: '/owner/preview/cleaners',
    label: 'Cleaners',
    hint: '4 en equipo',
    Icon: Users,
    accent: 'from-amber-500 to-amber-600',
    title: 'Ver el equipo de cleaners y reasignar tareas',
  },
  {
    href: '/owner/preview/clients',
    label: 'Clientes',
    hint: '6 activos',
    Icon: BarChart3,
    accent: 'from-slate-700 to-slate-900',
    title: 'Lista de clientes y acceso a sus portales',
  },
  {
    href: '/owner/preview/branding',
    label: 'Branding',
    hint: 'logo y colores',
    Icon: Palette,
    accent: 'from-fuchsia-500 to-purple-600',
    title: 'Personaliza el nombre, logo y colores del portal de tus clientes',
  },
  {
    href: '/owner/preview/marketing',
    label: 'Marketing',
    hint: 'QR, promos, redes',
    Icon: Megaphone,
    accent: 'from-rose-500 to-pink-600',
    title: 'Comparte tu enlace, crea códigos promocionales y descarga material',
  },
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
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Accesos rápidos
        </p>
        <button
          type="button"
          onClick={() => setShowNew((s) => !s)}
          title="Crear una nueva limpieza desde el dashboard"
          className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-3 w-3" /> Nueva tarea
        </button>
      </div>

      {showNew ? (
        <div className="mb-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-3">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900">
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
            <input
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              placeholder="Propiedad (ej. Soho Loft)"
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs"
            />
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Hora (ej. 12:30)"
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs"
            />
          </div>
          <button
            type="button"
            onClick={add}
            className="mt-2 h-8 rounded-lg bg-blue-600 px-3 text-[11px] font-semibold text-white hover:bg-blue-700"
          >
            Añadir al planning
          </button>
          {added.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {added.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-[11px] text-slate-700 ring-1 ring-slate-200"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span className="font-semibold">{t.time}</span>
                  <span>·</span>
                  <span>{t.property}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-500">
              <Info className="h-3 w-3" /> Los datos se quedan sólo en la demo.
            </p>
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {TILES.map((t) => {
          const Icon = t.Icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              title={t.title}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow"
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${t.accent} text-white shadow-sm`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {t.label}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {t.hint}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

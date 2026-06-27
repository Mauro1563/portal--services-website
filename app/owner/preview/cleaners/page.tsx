/**
 * Public preview: Owner → Cleaners list. Mocked data.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Search,
  Star,
  UserPlus,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

export const metadata = {
  title: 'Demo · Owner',
  robots: { index: false, follow: false },
};

type Cleaner = {
  id: string;
  name: string;
  initials: string;
  pin: string;
  rating: number;
  cleaningsMonth: number;
  status: 'active' | 'in_field' | 'off';
  accent: string;
};

const cleaners: Cleaner[] = [
  {
    id: 'c1',
    name: 'Carmen Ruiz',
    initials: 'CR',
    pin: '026389',
    rating: 4.9,
    cleaningsMonth: 32,
    status: 'in_field',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    id: 'c2',
    name: 'Lucía Vega',
    initials: 'LV',
    pin: '041572',
    rating: 5.0,
    cleaningsMonth: 28,
    status: 'active',
    accent: 'from-rose-400 to-rose-600',
  },
  {
    id: 'c3',
    name: 'Pedro Kovac',
    initials: 'PK',
    pin: '093821',
    rating: 4.7,
    cleaningsMonth: 21,
    status: 'in_field',
    accent: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'c4',
    name: 'María Reyes',
    initials: 'MR',
    pin: '058914',
    rating: 4.8,
    cleaningsMonth: 19,
    status: 'off',
    accent: 'from-emerald-400 to-emerald-600',
  },
];

const STATUS: Record<Cleaner['status'], { label: string; cls: string }> = {
  in_field: { label: 'En campo', cls: 'bg-emerald-100 text-emerald-700' },
  active: { label: 'Activa', cls: 'bg-blue-100 text-blue-700' },
  off: { label: 'Off', cls: 'bg-slate-100 text-slate-600' },
};

export default function OwnerCleanersPreview() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
          <Link
            href="/owner/preview"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Demo · Cleaners
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Cleaners
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {cleaners.length} en tu equipo.
            </p>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]">
            <UserPlus className="h-4 w-4" /> Invitar cleaner
          </button>
        </div>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cleaner…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {cleaners.map((c) => {
            const st = STATUS[c.status];
            return (
              <Link
                key={c.id}
                href="/owner/preview"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow"
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${c.accent} text-base font-bold text-white shadow-sm ring-2 ring-white`}
                >
                  {c.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{c.name}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${st.cls}`}
                    >
                      {st.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">PIN {c.pin}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-semibold text-slate-700">{c.rating}</span>
                    </span>
                    <span>·</span>
                    <span>{c.cleaningsMonth} limpiezas/mes</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
              </Link>
            );
          })}
        </div>
      </div>

      <DemoBottomTabBar active="cleaners" />
    </main>
  );
}

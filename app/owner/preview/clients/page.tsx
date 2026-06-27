/**
 * Public preview: Owner → Clients list. Mocked data.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  Plus,
  Search,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

export const metadata = {
  title: 'Demo · Owner',
  robots: { index: false, follow: false },
};

type Client = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  properties: number;
  cleaningsMonth: number;
  spentMonthPence: number;
  accent: string;
};

const clients: Client[] = [
  { id: 'cli-1', name: 'María García', initials: 'MG', email: 'maria@example.com', phone: '+34 612 345 678', properties: 1, cleaningsMonth: 3, spentMonthPence: 18000, accent: 'from-cyan-400 to-blue-600' },
  { id: 'cli-2', name: 'Ana Romero', initials: 'AR', email: 'ana@example.com', phone: '+34 698 222 111', properties: 1, cleaningsMonth: 2, spentMonthPence: 12000, accent: 'from-rose-400 to-rose-600' },
  { id: 'cli-3', name: 'David Lopez', initials: 'DL', email: 'david@example.com', phone: '+34 645 999 000', properties: 2, cleaningsMonth: 5, spentMonthPence: 30000, accent: 'from-emerald-400 to-emerald-600' },
  { id: 'cli-4', name: 'Sofía Martín', initials: 'SM', email: 'sofia@example.com', phone: '+34 611 777 333', properties: 1, cleaningsMonth: 4, spentMonthPence: 22000, accent: 'from-amber-400 to-orange-500' },
  { id: 'cli-5', name: 'Javier Ruiz', initials: 'JR', email: 'javier@example.com', phone: '+34 633 444 555', properties: 1, cleaningsMonth: 1, spentMonthPence: 6500, accent: 'from-indigo-400 to-indigo-600' },
  { id: 'cli-6', name: 'Elena Vidal', initials: 'EV', email: 'elena@example.com', phone: '+34 677 888 999', properties: 1, cleaningsMonth: 2, spentMonthPence: 11000, accent: 'from-violet-400 to-violet-600' },
];

const fmtMoney = (p: number) =>
  `£${(p / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

export default function OwnerClientsPreview() {
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
            Demo · Clientes
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Clientes
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {clients.length} clientes activos · cada uno tiene su portal.
            </p>
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]">
            <Plus className="h-4 w-4" /> Nuevo cliente
          </button>
        </div>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cliente…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {clients.map((c) => (
            <article
              key={c.id}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${c.accent} text-base font-bold text-white shadow-sm ring-2 ring-white`}
                >
                  {c.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                    <Mail className="h-3 w-3 shrink-0" /> {c.email}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                    <Phone className="h-3 w-3 shrink-0" /> {c.phone}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-600">
                <div>
                  <p className="font-bold text-slate-900">{c.properties}</p>
                  <p>sitios</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{c.cleaningsMonth}</p>
                  <p>limpiezas/mes</p>
                </div>
                <div>
                  <p className="font-bold text-emerald-700">
                    {fmtMoney(c.spentMonthPence)}
                  </p>
                  <p>este mes</p>
                </div>
              </div>
              <Link
                href="/client/preview"
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50/40"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Portal del cliente
                </span>
                <ChevronRight className="h-4 w-4 text-blue-500" />
              </Link>
            </article>
          ))}
        </div>
      </div>

      <DemoBottomTabBar active="more" />
    </main>
  );
}

/**
 * Public preview: Owner → Cleaners list. Mocked data.
 * Interactive: search filter + per-cleaner chat + reassign sheet.
 */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Info,
  MessageSquare,
  Repeat,
  Search,
  Send,
  Star,
  UserPlus,
  X,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

type Cleaner = {
  id: string;
  name: string;
  initials: string;
  pin: string;
  rating: number;
  cleaningsMonth: number;
  status: 'active' | 'in_field' | 'off';
  accent: string;
  assignedProperty: string;
};

const initialCleaners: Cleaner[] = [
  {
    id: 'c1',
    name: 'Carmen Ruiz',
    initials: 'CR',
    pin: '026389',
    rating: 4.9,
    cleaningsMonth: 32,
    status: 'in_field',
    accent: 'from-amber-400 to-orange-500',
    assignedProperty: 'Soho Loft',
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
    assignedProperty: 'Camden House',
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
    assignedProperty: 'Notting Hill Flat',
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
    assignedProperty: 'Mayfair Studio',
  },
];

const PROPERTY_OPTIONS = [
  'Soho Loft',
  'Camden House',
  'Notting Hill Flat',
  'Mayfair Studio',
  'Shoreditch Penthouse',
  'Hackney Studio',
];

const STATUS: Record<Cleaner['status'], { label: string; cls: string }> = {
  in_field: { label: 'En campo', cls: 'bg-emerald-100 text-emerald-700' },
  active: { label: 'Activa', cls: 'bg-blue-100 text-blue-700' },
  off: { label: 'Off', cls: 'bg-slate-100 text-slate-600' },
};

type ChatMsg = { from: 'owner' | 'cleaner'; text: string };

export default function OwnerCleanersPreview() {
  const [cleaners, setCleaners] = useState<Cleaner[]>(initialCleaners);
  const [query, setQuery] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [reassignId, setReassignId] = useState<string | null>(null);
  const [chatDraft, setChatDraft] = useState('');
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({
    c1: [{ from: 'cleaner', text: 'Voy en camino al Soho Loft.' }],
    c2: [{ from: 'cleaner', text: 'Camden House terminado.' }],
    c3: [],
    c4: [],
  });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cleaners;
    return cleaners.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.assignedProperty.toLowerCase().includes(q),
    );
  }, [cleaners, query]);

  const chatCleaner = cleaners.find((c) => c.id === chatId);
  const reassignCleaner = cleaners.find((c) => c.id === reassignId);

  function sendChat() {
    if (!chatId || !chatDraft.trim()) return;
    setChats((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), { from: 'owner', text: chatDraft.trim() }],
    }));
    setChatDraft('');
  }

  function reassign(property: string) {
    if (!reassignId) return;
    setCleaners((prev) =>
      prev.map((c) =>
        c.id === reassignId ? { ...c, assignedProperty: property } : c,
      ),
    );
    setReassignId(null);
  }

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
          <button
            type="button"
            title="Invitar un nuevo cleaner por email/SMS"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]"
          >
            <UserPlus className="h-4 w-4" /> Invitar cleaner
          </button>
        </div>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cleaner…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="h-3 w-3" /> Cada cleaner tiene chat directo y puedes
          reasignar su propiedad sin salir de la pantalla.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {visible.map((c) => {
            const st = STATUS[c.status];
            return (
              <article
                key={c.id}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300"
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
                  <p className="mt-2 text-[11px] text-slate-500">
                    Asignada a:{' '}
                    <span className="font-semibold text-slate-700">
                      {c.assignedProperty}
                    </span>
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setChatId(c.id)}
                      title={`Abrir chat con ${c.name}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700"
                    >
                      <MessageSquare className="h-3 w-3" /> Mensaje
                    </button>
                    <button
                      type="button"
                      onClick={() => setReassignId(c.id)}
                      title="Reasignar este cleaner a otra propiedad"
                      className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      <Repeat className="h-3 w-3" /> Reasignar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-500">
            Sin coincidencias.
          </p>
        ) : null}
      </div>

      {/* Chat modal */}
      {chatCleaner ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Chat con {chatCleaner.name}
              </p>
              <button
                type="button"
                onClick={() => setChatId(null)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto bg-slate-50/50 p-4">
              {(chats[chatCleaner.id] ?? []).map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'owner' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      m.from === 'owner'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-800 ring-1 ring-slate-200'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {(chats[chatCleaner.id] ?? []).length === 0 ? (
                <p className="text-center text-xs text-slate-400">
                  Sin mensajes todavía.
                </p>
              ) : null}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendChat();
              }}
              className="flex items-center gap-2 border-t border-slate-200 p-3"
            >
              <input
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                placeholder="Escribe un mensaje…"
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <button
                type="submit"
                title="Enviar mensaje"
                className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {/* Reassign sheet */}
      {reassignCleaner ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Reasignar a {reassignCleaner.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  Selecciona la nueva propiedad
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReassignId(null)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="divide-y divide-slate-100">
              {PROPERTY_OPTIONS.map((opt) => {
                const current = opt === reassignCleaner.assignedProperty;
                return (
                  <li key={opt}>
                    <button
                      type="button"
                      onClick={() => reassign(opt)}
                      className="flex w-full items-center justify-between px-4 py-3 text-sm text-slate-800 hover:bg-blue-50/40"
                    >
                      <span>{opt}</span>
                      {current ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          Actual
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      <DemoBottomTabBar active="cleaners" />
    </main>
  );
}

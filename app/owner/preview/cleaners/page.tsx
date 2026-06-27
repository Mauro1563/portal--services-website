/**
 * Public preview: Owner → Cleaners list. Mocked data.
 * Interactive: search filter + per-cleaner chat + reassign sheet.
 */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  MessageSquare,
  Pencil,
  Repeat,
  Search,
  Send,
  Star,
  Trash2,
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
  /** Hourly pay rate the owner pays this cleaner, in £. */
  payPerHour: number;
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
    payPerHour: 14,
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
    payPerHour: 15,
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
    payPerHour: 13,
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
    payPerHour: 14,
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

const ACCENT_POOL = [
  'from-amber-400 to-orange-500',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-blue-600',
  'from-emerald-400 to-emerald-600',
  'from-indigo-400 to-indigo-600',
  'from-violet-400 to-violet-600',
];

function genPin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] ?? '')
      .join('')
      .toUpperCase() || 'NC'
  );
}

export default function OwnerCleanersPreview() {
  const [cleaners, setCleaners] = useState<Cleaner[]>(initialCleaners);
  const [query, setQuery] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [reassignId, setReassignId] = useState<string | null>(null);
  const [payId, setPayId] = useState<string | null>(null);
  const [payDraft, setPayDraft] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [chatDraft, setChatDraft] = useState('');
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({
    c1: [{ from: 'cleaner', text: 'Voy en camino al Soho Loft.' }],
    c2: [{ from: 'cleaner', text: 'Camden House terminado.' }],
    c3: [],
    c4: [],
  });
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePin, setInvitePin] = useState(genPin());
  const [toast, setToast] = useState<string | null>(null);

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 1800);
  }

  function invite() {
    if (!inviteName.trim()) return;
    const id = `new-${cleaners.length + 1}`;
    setCleaners((prev) => [
      ...prev,
      {
        id,
        name: inviteName.trim(),
        initials: initialsOf(inviteName.trim()),
        pin: invitePin,
        rating: 5.0,
        cleaningsMonth: 0,
        status: 'active',
        accent: ACCENT_POOL[prev.length % ACCENT_POOL.length],
        assignedProperty: 'Sin asignar',
        payPerHour: 14,
      },
    ]);
    setInviteName('');
    setInviteEmail('');
    setInvitePin(genPin());
    setShowInvite(false);
    showToast(`Invitación enviada a ${inviteName.trim()}`);
  }

  function deleteCleaner(id: string) {
    if (!confirm('¿Quitar este cleaner del equipo?')) return;
    setCleaners((prev) => prev.filter((c) => c.id !== id));
    if (detailId === id) setDetailId(null);
    showToast('Cleaner eliminado del equipo');
  }

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
  const payCleaner = cleaners.find((c) => c.id === payId);
  const detailCleaner = cleaners.find((c) => c.id === detailId);

  function openPaySheet(c: Cleaner) {
    setPayId(c.id);
    setPayDraft(String(c.payPerHour));
  }

  function savePay() {
    if (!payId) return;
    const n = Number(payDraft);
    if (!Number.isFinite(n) || n < 0) return;
    const rounded = Math.round(n * 100) / 100;
    setCleaners((prev) =>
      prev.map((c) => (c.id === payId ? { ...c, payPerHour: rounded } : c)),
    );
    setPayId(null);
    showToast(`Pago actualizado a £${rounded}/h`);
  }

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
            onClick={() => {
              setInvitePin(genPin());
              setShowInvite(true);
            }}
            title="Invitar un nuevo cleaner por email o SMS — se genera un PIN automático"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]"
          >
            <UserPlus className="h-4 w-4" /> Invitar cleaner
          </button>
        </div>

        {showInvite ? (
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Invitar cleaner
              </h3>
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Nombre completo"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email o móvil (opcional)"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <div className="flex items-center gap-2">
                <input
                  value={invitePin}
                  readOnly
                  className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 font-mono text-sm tabular-nums tracking-widest text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setInvitePin(genPin())}
                  title="Generar otro PIN aleatorio"
                  className="h-10 rounded-lg bg-white px-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Regenerar PIN
                </button>
              </div>
            </div>
            {!inviteName.trim() ? (
              <p className="mt-2 text-[10.5px] text-rose-600">
                Indica el nombre del cleaner.
              </p>
            ) : null}
            <button
              type="button"
              onClick={invite}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Enviar invitación
            </button>
          </div>
        ) : null}

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
                <button
                  type="button"
                  onClick={() => setDetailId(c.id)}
                  title={`Ver el perfil completo de ${c.name}`}
                  aria-label={`Abrir perfil de ${c.name}`}
                  className="shrink-0"
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${c.accent} text-base font-bold text-white shadow-sm ring-2 ring-white transition hover:scale-105`}
                  >
                    {c.initials}
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailId(c.id)}
                      title={`Ver el perfil completo de ${c.name}`}
                      className="truncate text-left font-semibold text-slate-900 hover:text-blue-700"
                    >
                      {c.name}
                    </button>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${st.cls}`}
                    >
                      {st.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">PIN {c.pin}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="font-semibold text-slate-700">{c.rating}</span>
                    </span>
                    <span>·</span>
                    <span>{c.cleaningsMonth} limpiezas/mes</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-100">
                      Pago £{c.payPerHour}/h
                      <button
                        type="button"
                        onClick={() => openPaySheet(c)}
                        title={`Editar el pago por hora de ${c.name}`}
                        aria-label={`Editar pago de ${c.name}`}
                        className="ml-0.5 rounded p-0.5 text-emerald-700 hover:bg-emerald-100"
                      >
                        <Pencil className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Asignada a:{' '}
                    <span className="font-semibold text-slate-700">
                      {c.assignedProperty}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailId(c.id)}
                      title={`Ver perfil completo y tareas recientes de ${c.name}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
                    >
                      Ver perfil
                    </button>
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
                    <button
                      type="button"
                      onClick={() => deleteCleaner(c.id)}
                      title="Quitar este cleaner del equipo"
                      aria-label={`Eliminar ${c.name}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1.5 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3 w-3" />
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

      {/* Edit pay sheet */}
      {payCleaner ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Pago de {payCleaner.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  Tarifa por hora que se aplica al payroll del cleaner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPayId(null)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                savePay();
              }}
              className="space-y-3 p-4"
            >
              <label className="block text-xs font-semibold text-slate-700">
                Pago por hora (£)
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-slate-500">£</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={payDraft}
                    onChange={(e) => setPayDraft(e.target.value)}
                    autoFocus
                    className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm tabular-nums"
                  />
                  <span className="text-xs text-slate-400">/h</span>
                </div>
              </label>
              <p className="text-[10.5px] text-slate-500">
                Cambia sólo el pago de este cleaner. No afecta lo que cobras al
                cliente.
              </p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Guardar pago
                </button>
                <button
                  type="button"
                  onClick={() => setPayId(null)}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Cleaner detail drawer */}
      {detailCleaner ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${detailCleaner.accent} text-base font-bold text-white shadow-sm ring-2 ring-white`}
                >
                  {detailCleaner.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {detailCleaner.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    PIN {detailCleaner.pin} ·{' '}
                    {STATUS[detailCleaner.status].label}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Rating
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-slate-900">
                    {detailCleaner.rating}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Mes
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-slate-900">
                    {detailCleaner.cleaningsMonth}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Asignada
                  </p>
                  <p className="mt-1 truncate text-[11px] font-semibold text-slate-700">
                    {detailCleaner.assignedProperty}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Últimas tareas
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span>Hoy · {detailCleaner.assignedProperty}</span>
                    <span className="text-[10px] font-semibold text-emerald-700">
                      En curso
                    </span>
                  </li>
                  <li className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span>Ayer · Mayfair Studio</span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Completada
                    </span>
                  </li>
                  <li className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span>2d atrás · Camden House</span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Completada
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDetailId(null);
                    setChatId(detailCleaner.id);
                  }}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Enviar mensaje
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDetailId(null);
                    setReassignId(detailCleaner.id);
                  }}
                  className="flex-1 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Reasignar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            ✓ {toast}
          </div>
        </div>
      ) : null}

      <DemoBottomTabBar active="cleaners" />
    </main>
  );
}

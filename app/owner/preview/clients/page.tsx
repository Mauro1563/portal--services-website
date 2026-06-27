/**
 * Public preview: Owner → Clients list. Mocked data.
 * Interactive: search + inline edit panel + chat modal per client.
 */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Info,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

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

const initialClients: Client[] = [
  { id: 'cli-1', name: 'María García', initials: 'MG', email: 'maria@example.com', phone: '+44 7700 900123', properties: 1, cleaningsMonth: 3, spentMonthPence: 18000, accent: 'from-cyan-400 to-blue-600' },
  { id: 'cli-2', name: 'Ana Romero', initials: 'AR', email: 'ana@example.com', phone: '+44 7700 900456', properties: 1, cleaningsMonth: 2, spentMonthPence: 12000, accent: 'from-rose-400 to-rose-600' },
  { id: 'cli-3', name: 'David Lopez', initials: 'DL', email: 'david@example.com', phone: '+44 7700 900789', properties: 2, cleaningsMonth: 5, spentMonthPence: 30000, accent: 'from-emerald-400 to-emerald-600' },
  { id: 'cli-4', name: 'Sofía Martín', initials: 'SM', email: 'sofia@example.com', phone: '+44 7700 900111', properties: 1, cleaningsMonth: 4, spentMonthPence: 22000, accent: 'from-amber-400 to-orange-500' },
  { id: 'cli-5', name: 'Javier Ruiz', initials: 'JR', email: 'javier@example.com', phone: '+44 7700 900222', properties: 1, cleaningsMonth: 1, spentMonthPence: 6500, accent: 'from-indigo-400 to-indigo-600' },
  { id: 'cli-6', name: 'Elena Vidal', initials: 'EV', email: 'elena@example.com', phone: '+44 7700 900333', properties: 1, cleaningsMonth: 2, spentMonthPence: 11000, accent: 'from-violet-400 to-violet-600' },
];

const fmtMoney = (p: number) =>
  `£${(p / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

type ChatMsg = { from: 'owner' | 'client'; text: string };

const ACCENT_POOL = [
  'from-cyan-400 to-blue-600',
  'from-rose-400 to-rose-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-orange-500',
  'from-indigo-400 to-indigo-600',
  'from-violet-400 to-violet-600',
];

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

export default function OwnerClientsPreview() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [query, setQuery] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [draftEmail, setDraftEmail] = useState('');
  const [draftPhone, setDraftPhone] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [spendId, setSpendId] = useState<string | null>(null);
  const [chatDraft, setChatDraft] = useState('');
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({});
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 1800);
  }

  function addClient() {
    if (!newName.trim()) return;
    setClients((prev) => [
      ...prev,
      {
        id: `cli-${prev.length + 1}-new`,
        name: newName.trim(),
        initials: initialsOf(newName.trim()),
        email: newEmail.trim() || 'pendiente@example.com',
        phone: newPhone.trim() || '+44 7700 900000',
        properties: 0,
        cleaningsMonth: 0,
        spentMonthPence: 0,
        accent: ACCENT_POOL[prev.length % ACCENT_POOL.length],
      },
    ]);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setShowNew(false);
    showToast('Cliente añadido');
  }

  function deleteClient(id: string) {
    if (!confirm('¿Eliminar este cliente?')) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast('Cliente eliminado');
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [clients, query]);

  function openEdit(c: Client) {
    setEditId(c.id);
    setDraftEmail(c.email);
    setDraftPhone(c.phone);
  }

  function saveEdit() {
    if (!editId) return;
    setClients((prev) =>
      prev.map((c) =>
        c.id === editId ? { ...c, email: draftEmail, phone: draftPhone } : c,
      ),
    );
    setEditId(null);
    showToast('Cliente actualizado');
  }

  function sendChat() {
    if (!chatId || !chatDraft.trim()) return;
    setChats((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), { from: 'owner', text: chatDraft.trim() }],
    }));
    setChatDraft('');
  }

  const chatClient = clients.find((c) => c.id === chatId);
  const spendClient = clients.find((c) => c.id === spendId);

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
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            title="Añadir un cliente nuevo al panel"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]"
          >
            <Plus className="h-4 w-4" /> Nuevo cliente
          </button>
        </div>

        {showNew ? (
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Nuevo cliente
              </h3>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre completo"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Teléfono"
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
            </div>
            {!newName.trim() ? (
              <p className="mt-2 text-[10.5px] text-rose-600">
                El nombre es obligatorio.
              </p>
            ) : null}
            <button
              type="button"
              onClick={addClient}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Guardar cliente
            </button>
          </div>
        ) : null}

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cliente…"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="h-3 w-3" /> Edita email/teléfono al vuelo o
          escribe directamente al cliente desde aquí.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {visible.map((c) => {
            const isEditing = editId === c.id;
            return (
              <article
                key={c.id}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${c.accent} text-base font-bold text-white shadow-sm ring-2 ring-white`}
                  >
                    {c.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">{c.name}</h3>
                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <input
                          value={draftEmail}
                          onChange={(e) => setDraftEmail(e.target.value)}
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs"
                          placeholder="Email"
                        />
                        <input
                          value={draftPhone}
                          onChange={(e) => setDraftPhone(e.target.value)}
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs"
                          placeholder="Teléfono"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="h-7 rounded-md bg-blue-600 px-2 text-[11px] font-semibold text-white hover:bg-blue-700"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditId(null)}
                            className="h-7 rounded-md bg-white px-2 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                          <Mail className="h-3 w-3 shrink-0" /> {c.email}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                          <Phone className="h-3 w-3 shrink-0" /> {c.phone}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 px-1 py-1 text-center text-[11px] text-slate-600">
                  <Link
                    href={`/owner/preview/properties?client=${encodeURIComponent(c.name)}`}
                    title={`Ver las propiedades gestionadas para ${c.name}`}
                    className="rounded-lg px-2 py-1 transition hover:bg-white hover:ring-1 hover:ring-blue-200"
                  >
                    <p className="font-bold text-slate-900">{c.properties}</p>
                    <p>sitios</p>
                  </Link>
                  <Link
                    href={`/owner/preview/tasks?cleaner=${encodeURIComponent(c.name)}`}
                    title={`Ver las limpiezas de este mes para ${c.name}`}
                    className="rounded-lg px-2 py-1 transition hover:bg-white hover:ring-1 hover:ring-blue-200"
                  >
                    <p className="font-bold text-slate-900">{c.cleaningsMonth}</p>
                    <p>limpiezas/mes</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSpendId(c.id)}
                    title={`Ver desglose de facturación de ${c.name} este mes`}
                    className="rounded-lg px-2 py-1 transition hover:bg-white hover:ring-1 hover:ring-emerald-200"
                  >
                    <p className="font-bold text-emerald-700">
                      {fmtMoney(c.spentMonthPence)}
                    </p>
                    <p>este mes</p>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    title="Editar email y teléfono del cliente"
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    <Pencil className="h-3 w-3" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatId(c.id)}
                    title={`Enviar mensaje a ${c.name}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700"
                  >
                    <MessageSquare className="h-3 w-3" /> Enviar mensaje
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteClient(c.id)}
                    title={`Eliminar a ${c.name} del panel`}
                    aria-label={`Eliminar ${c.name}`}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1.5 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <Link
                  href="/client/preview"
                  title="Abrir el portal personal del cliente"
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Portal del cliente
                  </span>
                  <ChevronRight className="h-4 w-4 text-blue-500" />
                </Link>
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
      {chatClient ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Chat con {chatClient.name}
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
              {(chats[chatClient.id] ?? []).map((m, i) => (
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
              {(chats[chatClient.id] ?? []).length === 0 ? (
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

      {/* Spending breakdown sheet */}
      {spendClient ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Facturación de {spendClient.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {fmtMoney(spendClient.spentMonthPence)} este mes ·{' '}
                  {spendClient.cleaningsMonth} limpiezas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSpendId(null)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-1.5 p-4 text-xs text-slate-700">
              {(() => {
                const total = spendClient.spentMonthPence;
                const lines = [
                  { date: 'Esta semana', desc: 'Limpieza estándar · 3h', amount: Math.round(total * 0.28) },
                  { date: 'Hace 1 sem', desc: 'Limpieza estándar · 3h', amount: Math.round(total * 0.24) },
                  { date: 'Hace 2 sem', desc: 'Limpieza profunda · 5h', amount: Math.round(total * 0.32) },
                  { date: 'Hace 3 sem', desc: 'Limpieza estándar · 3h', amount: Math.round(total * 0.16) },
                ];
                return lines.map((l, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{l.desc}</p>
                      <p className="text-[10px] text-slate-500">{l.date}</p>
                    </div>
                    <span className="font-semibold text-emerald-700 tabular-nums">
                      {fmtMoney(l.amount)}
                    </span>
                  </li>
                ));
              })()}
            </ul>
            <div className="border-t border-slate-200 p-4">
              <Link
                href="/owner/preview/analytics"
                title="Ver tendencias completas de facturación en analytics"
                className="flex items-center justify-between rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <span>Ver analytics completos</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
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

      <DemoBottomTabBar active="more" />
    </main>
  );
}

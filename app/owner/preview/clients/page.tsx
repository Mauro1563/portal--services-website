/**
 * Public preview: Owner → Clients list. Mocked data.
 * Interactive: search + inline edit panel + chat modal per client.
 */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
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

export default function OwnerClientsPreview() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [query, setQuery] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [draftEmail, setDraftEmail] = useState('');
  const [draftPhone, setDraftPhone] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatDraft, setChatDraft] = useState('');
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({});

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
            title="Añadir un cliente nuevo al panel"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.5)]"
          >
            <Plus className="h-4 w-4" /> Nuevo cliente
          </button>
        </div>

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

      <DemoBottomTabBar active="more" />
    </main>
  );
}

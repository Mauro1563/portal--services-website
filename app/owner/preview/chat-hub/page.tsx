/**
 * Public, no-auth preview of the Owner → Chat hub. Mocked inbox of
 * conversations the manager holds with their clients and cleaners
 * across London. Tapping a row opens the full thread; the composer
 * appends new messages to local in-memory state so prospects can
 * feel the experience without an account.
 */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, MessageCircle, RotateCcw, Search, Send } from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

type Participant = 'owner' | 'them';

type ChatMessage = {
  id: string;
  from: Participant;
  body: string;
  time: string;
};

type Thread = {
  id: string;
  otherName: string;
  role: string;
  initials: string;
  accent: string;
  unread: number;
  lastAt: string;
  messages: ChatMessage[];
};

const INITIAL_THREADS: Thread[] = [
  {
    id: 't-thompson',
    otherName: 'Mr. Thompson',
    role: 'Cliente · Soho Loft',
    initials: 'MT',
    accent: 'from-cyan-400 to-blue-600',
    unread: 2,
    lastAt: '09:42',
    messages: [
      {
        id: 'tm1',
        from: 'them',
        body: 'Hi Alan — the cleaner forgot to lock the back door yesterday. Could you remind the team?',
        time: 'Ayer 18:12',
      },
      {
        id: 'tm2',
        from: 'owner',
        body: 'So sorry about that, Mr. Thompson. I will brief Carmen before tomorrow’s visit.',
        time: 'Ayer 18:25',
      },
      {
        id: 'tm3',
        from: 'them',
        body: 'Thanks. Also — can we move the Friday clean to 11am instead of 10?',
        time: '09:30',
      },
      {
        id: 'tm4',
        from: 'them',
        body: 'My builders arrive early so I need the place clear.',
        time: '09:42',
      },
    ],
  },
  {
    id: 't-patel',
    otherName: 'Ms. Patel',
    role: 'Cliente · Notting Hill Flat',
    initials: 'NP',
    accent: 'from-rose-400 to-rose-600',
    unread: 0,
    lastAt: 'Ayer',
    messages: [
      {
        id: 'pm1',
        from: 'them',
        body: 'Hola Alan, ¿podría Pedro traer producto sin perfume? Tengo alergia.',
        time: 'Lun 11:02',
      },
      {
        id: 'pm2',
        from: 'owner',
        body: 'Anotado, Ms. Patel. Lo añadimos a las notas permanentes de la propiedad.',
        time: 'Lun 11:08',
      },
      {
        id: 'pm3',
        from: 'them',
        body: 'Perfecto, mil gracias!',
        time: 'Lun 11:10',
      },
    ],
  },
  {
    id: 't-carmen',
    otherName: 'Carmen Ruiz',
    role: 'Cleaner · Soho route',
    initials: 'CR',
    accent: 'from-emerald-400 to-emerald-600',
    unread: 1,
    lastAt: '08:58',
    messages: [
      {
        id: 'cm1',
        from: 'them',
        body: 'Alan, el lockbox de Old Compton no abre. ¿Tienes el código nuevo?',
        time: '08:55',
      },
      {
        id: 'cm2',
        from: 'them',
        body: '(estoy en la puerta)',
        time: '08:58',
      },
    ],
  },
  {
    id: 't-walker',
    otherName: 'Ms. Walker',
    role: 'Cliente · Camden Studio',
    initials: 'EW',
    accent: 'from-amber-400 to-orange-500',
    unread: 0,
    lastAt: 'Vie',
    messages: [
      {
        id: 'wm1',
        from: 'owner',
        body: 'Hi Ms. Walker — the deep clean is booked for next Saturday at 9am.',
        time: 'Vie 17:30',
      },
      {
        id: 'wm2',
        from: 'them',
        body: 'Wonderful, see you then. Ana will be the one coming?',
        time: 'Vie 17:35',
      },
      {
        id: 'wm3',
        from: 'owner',
        body: 'Yes — Ana Ruiz, she did your last visit.',
        time: 'Vie 17:36',
      },
    ],
  },
];

const CANNED_REPLIES = [
  'Mil gracias, lo confirmo en un momento.',
  'Recibido — te aviso cuando esté hecho.',
  'Perfecto, lo anoto en tu ficha.',
  'OK, se lo paso al equipo ahora mismo.',
];

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function lastPreview(t: Thread): string {
  const last = t.messages[t.messages.length - 1];
  if (!last) return 'Sin mensajes todavía';
  return last.from === 'owner' ? `Tú: ${last.body}` : last.body;
}

export default function OwnerChatHubPreview() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const openThread = openId ? threads.find((t) => t.id === openId) ?? null : null;

  useEffect(() => {
    if (openThread) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [openThread?.messages.length, openId]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (t) =>
        t.otherName.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        lastPreview(t).toLowerCase().includes(q),
    );
  }, [threads, query]);

  function handleOpen(id: string) {
    setOpenId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)),
    );
  }

  function handleSend() {
    const body = draft.trim();
    if (!body || !openId) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      from: 'owner',
      body,
      time: nowHHMM(),
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === openId
          ? { ...t, messages: [...t.messages, newMsg], lastAt: 'Ahora' }
          : t,
      ),
    );
    setDraft('');
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `m-${Date.now()}-r`,
        from: 'them',
        body: CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)] ?? '👍',
        time: nowHHMM(),
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === openId
            ? { ...t, messages: [...t.messages, reply], lastAt: 'Ahora' }
            : t,
        ),
      );
    }, 950);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    setThreads(INITIAL_THREADS);
    setOpenId(null);
    setDraft('');
    setQuery('');
  }

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

  return (
    <main className="relative min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
          {openThread ? (
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
              aria-label="Volver a la bandeja"
              title="Volver a la lista de conversaciones"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700">
              <MessageCircle className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            {openThread ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {openThread.role}
                </p>
                <h1 className="font-display text-sm font-semibold text-slate-900">
                  {openThread.otherName}
                </h1>
              </>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Bandeja
                </p>
                <h1 className="font-display text-sm font-semibold text-slate-900">
                  Chat {totalUnread > 0 ? `· ${totalUnread} sin leer` : ''}
                </h1>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500 hover:text-slate-800"
            title="Reiniciar la demo a su estado inicial"
          >
            <RotateCcw className="h-3 w-3" />
            Reiniciar
          </button>
        </div>
      </header>

      {!openThread ? (
        <section className="mx-auto max-w-md px-4 pt-4">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar conversación…"
              title="Filtra la lista por nombre, rol o último mensaje"
              className="block h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          <ul className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-slate-100 divide-y divide-slate-100">
            {visible.length === 0 ? (
              <li className="px-4 py-12 text-center text-[12px] text-slate-400">
                No hay conversaciones que coincidan.
              </li>
            ) : (
              visible.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => handleOpen(t.id)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-slate-50"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.accent} text-sm font-bold text-white`}
                    >
                      {t.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`truncate text-sm ${
                            t.unread > 0
                              ? 'font-bold text-slate-900'
                              : 'font-semibold text-slate-800'
                          }`}
                        >
                          {t.otherName}
                        </span>
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {t.lastAt}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span
                          className={`truncate text-[12px] ${
                            t.unread > 0 ? 'text-slate-700' : 'text-slate-500'
                          }`}
                        >
                          {lastPreview(t)}
                        </span>
                        {t.unread > 0 ? (
                          <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 px-1.5 text-[11px] font-bold text-white">
                            {t.unread}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
                        {t.role}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>

          <p className="mt-4 text-center text-[10.5px] text-slate-400">
            Una bandeja con tus clientes y cleaners — sin perder mensajes en
            WhatsApp.
          </p>
        </section>
      ) : (
        <section className="mx-auto flex max-w-md flex-col px-3 pb-32 pt-3">
          <ol className="flex flex-col gap-2">
            {openThread.messages.map((m) => {
              const mine = m.from === 'owner';
              return (
                <li
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl px-3.5 py-2 text-[13.5px] leading-relaxed shadow-sm ${
                      mine
                        ? 'rounded-br-md bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                        : 'rounded-bl-md bg-white text-slate-900 ring-1 ring-inset ring-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        mine ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div ref={bottomRef} />

          <div
            className="fixed inset-x-0 bottom-14 z-30 mx-auto max-w-md border-t border-slate-200 bg-white px-3 py-2.5"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Mensaje para ${openThread.otherName}…`}
                title="Escribe un mensaje y pulsa enviar (o Enter)"
                className="block max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim()}
                aria-label="Enviar"
                title={`Enviar el mensaje a ${openThread.otherName}`}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)] transition active:scale-95 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <DemoBottomTabBar active="chat" />
    </main>
  );
}

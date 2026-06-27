/**
 * Public, no-auth preview of the Client → Chat hub. Mocked inbox of
 * conversations between Sofía (the client) and the manager + her
 * assigned cleaners. Tapping a row opens the thread; sending appends
 * to local state and fires a canned auto-reply so the demo feels
 * conversational.
 */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, MessageCircle, RotateCcw, Search, Send } from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

type Participant = 'me' | 'them';

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
    id: 't-business',
    otherName: 'London Sparkle',
    role: 'Equipo · Alan (manager)',
    initials: 'LS',
    accent: 'from-cyan-400 to-blue-600',
    unread: 1,
    lastAt: 'Hoy 09:03',
    messages: [
      {
        id: 'bm1',
        from: 'them',
        body: '¡Hola Sofía! Ana llega mañana a las 10:00 a Old Compton St. ¿Necesitas algo especial?',
        time: 'Ayer 18:42',
      },
      {
        id: 'bm2',
        from: 'me',
        body: 'Hola! Sí, por favor que revise bien la cocina. ¡Gracias!',
        time: 'Ayer 19:01',
      },
      {
        id: 'bm3',
        from: 'them',
        body: 'Hecho, anotado. También dejamos el baño con tratamiento anticalcáreo.',
        time: 'Ayer 19:03',
      },
      {
        id: 'bm4',
        from: 'them',
        body: 'Pequeño aviso: subimos la tarifa de profunda £5 desde mayo. Tu próxima estándar no cambia.',
        time: 'Hoy 09:03',
      },
    ],
  },
  {
    id: 't-carmen',
    otherName: 'Carmen Ruiz',
    role: 'Cleaner asignada · Soho',
    initials: 'CR',
    accent: 'from-emerald-400 to-emerald-600',
    unread: 2,
    lastAt: '08:54',
    messages: [
      {
        id: 'cm1',
        from: 'them',
        body: 'Hola Sofía, estoy de camino. Llego en 10 min.',
        time: '08:50',
      },
      {
        id: 'cm2',
        from: 'them',
        body: '¿La llave sigue en el lockbox o me abres tú?',
        time: '08:54',
      },
    ],
  },
  {
    id: 't-thompson',
    otherName: 'Mr. Thompson',
    role: 'Vecino · referido',
    initials: 'MT',
    accent: 'from-amber-400 to-orange-500',
    unread: 0,
    lastAt: 'Vie',
    messages: [
      {
        id: 'mtm1',
        from: 'them',
        body: 'Hi Sofía, thanks for the referral code — we just booked our first clean for Saturday!',
        time: 'Vie 12:30',
      },
      {
        id: 'mtm2',
        from: 'me',
        body: '¡Qué bien! Ana es genial, vas a quedar encantado.',
        time: 'Vie 12:42',
      },
      {
        id: 'mtm3',
        from: 'them',
        body: 'Brilliant. See you around the block!',
        time: 'Vie 12:43',
      },
    ],
  },
  {
    id: 't-walker',
    otherName: 'Ms. Walker',
    role: 'Vecina · Camden',
    initials: 'EW',
    accent: 'from-rose-400 to-rose-600',
    unread: 0,
    lastAt: 'Jue',
    messages: [
      {
        id: 'wm1',
        from: 'them',
        body: 'Sofía, did London Sparkle ever do a move-out clean for you? Looking for someone reliable.',
        time: 'Jue 16:05',
      },
      {
        id: 'wm2',
        from: 'me',
        body: 'Sí, hicieron la salida del piso anterior, impecable. Te paso el contacto.',
        time: 'Jue 16:12',
      },
    ],
  },
];

const CANNED_REPLIES = [
  '¡Recibido! Te confirmamos en unos minutos.',
  'Genial, gracias por avisar.',
  'Anotado, lo vemos enseguida.',
  'Perfecto, te respondemos pronto.',
];

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function lastPreview(t: Thread): string {
  const last = t.messages[t.messages.length - 1];
  if (!last) return 'Sin mensajes todavía';
  return last.from === 'me' ? `Tú: ${last.body}` : last.body;
}

export default function ClientChatHubPreview() {
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

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const body = draft.trim();
    if (!body || !openId) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      from: 'me',
      body,
      time: `Ahora ${nowHHMM()}`,
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
        time: `Ahora ${nowHHMM()}`,
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === openId
            ? { ...t, messages: [...t.messages, reply], lastAt: 'Ahora' }
            : t,
        ),
      );
    }, 900);
  }

  function handleReset() {
    setThreads(INITIAL_THREADS);
    setOpenId(null);
    setDraft('');
    setQuery('');
  }

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="messages"
      title={openThread ? openThread.otherName : `Chat${totalUnread > 0 ? ` · ${totalUnread} sin leer` : ''}`}
      showBack={Boolean(openThread)}
      backHref="/client/preview/chat-hub"
      unreadMessages={totalUnread}
    >
      {!openThread ? (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Bandeja
                </p>
                <p className="font-display text-sm font-bold text-slate-900">
                  Tus conversaciones
                </p>
              </div>
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

          <label className="relative mt-3 block">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar conversación…"
              title="Filtra la lista por nombre o último mensaje"
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
            Tu equipo de limpieza, en un solo chat — sin perder mensajes.
          </p>
        </>
      ) : (
        <>
          <p className="mb-3 text-[11px] text-slate-500">{openThread.role}</p>
          <ul className="flex flex-col gap-3 pb-32">
            {openThread.messages.map((m) => {
              const mine = m.from === 'me';
              return (
                <li
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${mine ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-3xl px-4 py-2.5 text-[13.5px] leading-snug ${
                        mine
                          ? 'rounded-br-md bg-blue-600 text-white shadow-[0_6px_16px_-10px_rgba(37,99,235,0.55)]'
                          : 'rounded-bl-md bg-white text-slate-900 ring-1 ring-inset ring-slate-100'
                      }`}
                    >
                      {m.body}
                    </div>
                    <p
                      className={`mt-1 text-[10px] text-slate-400 ${
                        mine ? 'text-right' : 'text-left'
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div ref={bottomRef} />

          <form
            onSubmit={handleSend}
            className="fixed inset-x-0 bottom-14 z-30 mx-auto max-w-md border-t border-slate-200 bg-white px-3 py-2.5"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-end gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Mensaje para ${openThread.otherName}…`}
                title="Escribe un mensaje y pulsa enviar"
                className="block h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Enviar"
                title={`Enviar el mensaje a ${openThread.otherName}`}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)] transition active:scale-95 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </ClientShell>
  );
}

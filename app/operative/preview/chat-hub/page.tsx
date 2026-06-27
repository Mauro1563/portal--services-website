/**
 * Public, no-auth preview of the Cleaner → Chat hub. Mocked inbox of
 * conversations between the cleaner (Carmen) and her manager + a
 * couple of London clients she sees regularly. Tapping a row opens
 * the thread; sending appends to local state and triggers a canned
 * auto-reply so the demo feels alive.
 */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, MessageCircle, RotateCcw, Search, Send } from 'lucide-react';
import { PreviewBottomTabBar } from '@/components/preview/PreviewBottomTabBar';

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
    id: 't-alan',
    otherName: 'Alan',
    role: 'Manager · London Sparkle',
    initials: 'A',
    accent: 'from-cyan-400 to-blue-600',
    unread: 1,
    lastAt: '09:21',
    messages: [
      {
        id: 'am1',
        from: 'them',
        body: 'Hola Carmen, mañana hay una limpieza extra a las 16:00 en el apto de Shoreditch. ¿Puedes?',
        time: '09:12',
      },
      {
        id: 'am2',
        from: 'me',
        body: 'Hola Alan! Sí, sin problema. Llevo las llaves del lockbox.',
        time: '09:18',
      },
      {
        id: 'am3',
        from: 'them',
        body: 'Perfecto, gracias. Los huéspedes salen a las 11:00, tienes margen de sobra.',
        time: '09:21',
      },
    ],
  },
  {
    id: 't-thompson',
    otherName: 'Mr. Thompson',
    role: 'Cliente · Soho Loft',
    initials: 'MT',
    accent: 'from-emerald-400 to-emerald-600',
    unread: 2,
    lastAt: '08:47',
    messages: [
      {
        id: 'tm1',
        from: 'them',
        body: 'Hi Carmen — please use the eco spray under the sink, not the bleach.',
        time: 'Ayer 19:50',
      },
      {
        id: 'tm2',
        from: 'me',
        body: 'Of course, Mr. Thompson. I will use only the eco products.',
        time: 'Ayer 20:02',
      },
      {
        id: 'tm3',
        from: 'them',
        body: 'Also — could you water the basil on the windowsill?',
        time: '08:45',
      },
      {
        id: 'tm4',
        from: 'them',
        body: 'Thanks!',
        time: '08:47',
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
    lastAt: 'Mar',
    messages: [
      {
        id: 'pm1',
        from: 'them',
        body: 'Carmen, esta semana cambiamos las sábanas, ¿verdad? Las dejé limpias en el armario del pasillo.',
        time: 'Mar 14:20',
      },
      {
        id: 'pm2',
        from: 'me',
        body: 'Sí, Ms. Patel, todo listo. También dejé los productos sin perfume como pidió.',
        time: 'Mar 14:35',
      },
      {
        id: 'pm3',
        from: 'them',
        body: 'Eres un sol, gracias!',
        time: 'Mar 14:36',
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
    lastAt: 'Lun',
    messages: [
      {
        id: 'wm1',
        from: 'them',
        body: 'Carmen, the spare key is now in the lockbox — code 4421. The previous spot under the mat is gone.',
        time: 'Lun 11:10',
      },
      {
        id: 'wm2',
        from: 'me',
        body: 'Got it, thank you. I will use the lockbox from Saturday.',
        time: 'Lun 11:14',
      },
    ],
  },
];

const CANNED_REPLIES = [
  'Perfecto, gracias!',
  'Anotado, sin falta.',
  'Te confirmo en un rato.',
  'Genial, todo en orden por aquí.',
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

export default function OperativeChatHubPreview() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [query, setQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const openThread = openId ? threads.find((t) => t.id === openId) ?? null : null;

  useEffect(() => {
    if (openThread) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [openThread?.messages.length, openId, typing]);

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
      from: 'me',
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
    setTyping(true);
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `m-${Date.now()}-r`,
        from: 'them',
        body: CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)] ?? '👍',
        time: nowHHMM(),
      };
      setTyping(false);
      setThreads((prev) =>
        prev.map((t) =>
          t.id === openId
            ? { ...t, messages: [...t.messages, reply], lastAt: 'Ahora' }
            : t,
        ),
      );
    }, 900);
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
    setTyping(false);
    setQuery('');
  }

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

  return (
    <main className="relative min-h-screen bg-canvas pb-24">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
          {openThread ? (
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-text-2 hover:bg-surface-1"
              aria-label="Volver a la bandeja"
              title="Volver a la lista de conversaciones"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600">
              <MessageCircle className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            {openThread ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
                  {openThread.role}
                </p>
                <h1 className="font-display text-sm font-semibold text-text-1">
                  {openThread.otherName}
                </h1>
              </>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
                  Bandeja
                </p>
                <h1 className="font-display text-sm font-semibold text-text-1">
                  Chat {totalUnread > 0 ? `· ${totalUnread} sin leer` : ''}
                </h1>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-semibold text-text-3 hover:text-text-1"
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
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3"
              aria-hidden
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar conversación…"
              title="Filtra la lista por nombre, rol o último mensaje"
              className="block h-11 w-full rounded-2xl border border-surface-2 bg-paper pl-10 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </label>

          <ul className="mt-4 overflow-hidden rounded-2xl bg-paper ring-1 ring-inset ring-surface-2 divide-y divide-surface-2">
            {visible.length === 0 ? (
              <li className="px-4 py-12 text-center text-[12px] text-text-3">
                No hay conversaciones que coincidan.
              </li>
            ) : (
              visible.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => handleOpen(t.id)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-surface-1"
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
                              ? 'font-bold text-text-1'
                              : 'font-semibold text-text-1'
                          }`}
                        >
                          {t.otherName}
                        </span>
                        <span className="shrink-0 text-[10px] text-text-3">
                          {t.lastAt}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span
                          className={`truncate text-[12px] ${
                            t.unread > 0 ? 'text-text-2' : 'text-text-3'
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
                      <p className="mt-0.5 truncate text-[10.5px] text-text-3">
                        {t.role}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>

          <p className="mt-4 text-center text-[10.5px] text-text-3">
            Todo en un sitio — manager y clientes, sin mezclar con tu WhatsApp
            personal.
          </p>
        </section>
      ) : (
        <section className="mx-auto flex max-w-md flex-col px-3 pb-32 pt-3">
          <ol className="flex flex-col gap-2">
            {openThread.messages.map((m) => {
              const mine = m.from === 'me';
              return (
                <li
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed shadow-sm ${
                      mine
                        ? 'rounded-br-md bg-gradient-to-br from-brand-600 to-brand-700 text-white'
                        : 'rounded-bl-md border border-surface-2 bg-paper text-text-1'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        mine ? 'text-white/70' : 'text-text-3'
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </li>
              );
            })}
            {typing ? (
              <li className="flex justify-start">
                <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-surface-2 bg-paper px-3.5 py-2.5 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-3 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-3 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-3" />
                </div>
              </li>
            ) : null}
          </ol>
          <div ref={bottomRef} />

          <div
            className="fixed inset-x-0 bottom-14 z-30 mx-auto max-w-md border-t border-line bg-paper px-3 py-2.5"
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
                className="block max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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

      <PreviewBottomTabBar active="chat" />
    </main>
  );
}

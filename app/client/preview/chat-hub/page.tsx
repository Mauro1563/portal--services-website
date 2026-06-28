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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
import { MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

const COPY = {
  en: {
    titleBase: 'Chat',
    unreadSuffix: (n: number) => ` · ${n} unread`,
    inboxKicker: 'Inbox',
    conversationsLabel: 'Your conversations',
    reset: 'Reset',
    resetTitle: 'Reset the demo to the initial state',
    searchPlaceholder: 'Search conversation…',
    searchTitle: 'Filter the list by name or last message',
    noResults: 'No conversations match.',
    footnote: 'Your cleaning team, in one chat — never lose a message.',
    youPrefix: (body: string) => `You: ${body}`,
    noMessages: 'No messages yet',
    composerPlaceholder: (name: string) => `Message for ${name}…`,
    composerTitle: 'Write a message and tap send',
    sendAria: 'Send',
    sendTitle: (name: string) => `Send the message to ${name}`,
    nowPrefix: (t: string) => `Now ${t}`,
    cannedReplies: [
      'Got it! We will confirm in a few minutes.',
      'Great, thanks for letting us know.',
      'Noted, we will check it right away.',
      'Perfect, we will reply shortly.',
    ],
    thread_business: {
      otherName: 'London Sparkle',
      role: 'Team · Alan (manager)',
      lastAt: 'Today 09:03',
      messages: [
        { body: 'Hi Sofía! Ana arrives tomorrow at 10:00 at Old Compton St. Do you need anything in particular?', time: 'Yesterday 18:42' },
        { body: 'Hi! Yes, could she give the kitchen a proper going-over please. Thanks!', time: 'Yesterday 19:01' },
        { body: 'Done, noted. We will also do the bathroom with anti-limescale treatment.', time: 'Yesterday 19:03' },
        { body: 'Quick heads-up: deep clean rate goes up by £5 from May. Your next standard is unchanged.', time: 'Today 09:03' },
      ],
    },
    thread_carmen: {
      otherName: 'Carmen Ruiz',
      role: 'Assigned cleaner · Soho',
      lastAt: '08:54',
      messages: [
        { body: 'Hi Sofía, I am on my way. Arriving in 10 min.', time: '08:50' },
        { body: 'Is the key still in the lockbox or will you open up?', time: '08:54' },
      ],
    },
    thread_thompson: {
      otherName: 'Mr. Thompson',
      role: 'Neighbour · referred',
      lastAt: 'Fri',
      messages: [
        { body: 'Hi Sofía, thanks for the referral code — we just booked our first clean for Saturday!', time: 'Fri 12:30' },
        { body: "That's great! Ana is brilliant, you will love her.", time: 'Fri 12:42' },
        { body: 'Brilliant. See you around the block!', time: 'Fri 12:43' },
      ],
    },
    thread_walker: {
      otherName: 'Ms. Walker',
      role: 'Neighbour · Camden',
      lastAt: 'Thu',
      messages: [
        { body: 'Sofía, did London Sparkle ever do a move-out clean for you? Looking for someone reliable.', time: 'Thu 16:05' },
        { body: 'Yes, they did the move-out at my previous flat, spotless. I will pass on the contact.', time: 'Thu 16:12' },
      ],
    },
  },
  es: {
    titleBase: 'Chat',
    unreadSuffix: (n: number) => ` · ${n} sin leer`,
    inboxKicker: 'Bandeja',
    conversationsLabel: 'Tus conversaciones',
    reset: 'Reiniciar',
    resetTitle: 'Reiniciar la demo a su estado inicial',
    searchPlaceholder: 'Buscar conversación…',
    searchTitle: 'Filtra la lista por nombre o último mensaje',
    noResults: 'No hay conversaciones que coincidan.',
    footnote: 'Tu equipo de limpieza, en un solo chat — sin perder mensajes.',
    youPrefix: (body: string) => `Tú: ${body}`,
    noMessages: 'Sin mensajes todavía',
    composerPlaceholder: (name: string) => `Mensaje para ${name}…`,
    composerTitle: 'Escribe un mensaje y pulsa enviar',
    sendAria: 'Enviar',
    sendTitle: (name: string) => `Enviar el mensaje a ${name}`,
    nowPrefix: (t: string) => `Ahora ${t}`,
    cannedReplies: [
      '¡Recibido! Te confirmamos en unos minutos.',
      'Genial, gracias por avisar.',
      'Anotado, lo vemos enseguida.',
      'Perfecto, te respondemos pronto.',
    ],
    thread_business: {
      otherName: 'London Sparkle',
      role: 'Equipo · Alan (manager)',
      lastAt: 'Hoy 09:03',
      messages: [
        { body: '¡Hola Sofía! Ana llega mañana a las 10:00 a Old Compton St. ¿Necesitas algo especial?', time: 'Ayer 18:42' },
        { body: 'Hola! Sí, por favor que revise bien la cocina. ¡Gracias!', time: 'Ayer 19:01' },
        { body: 'Hecho, anotado. También dejamos el baño con tratamiento anticalcáreo.', time: 'Ayer 19:03' },
        { body: 'Pequeño aviso: subimos la tarifa de profunda £5 desde mayo. Tu próxima estándar no cambia.', time: 'Hoy 09:03' },
      ],
    },
    thread_carmen: {
      otherName: 'Carmen Ruiz',
      role: 'Cleaner asignada · Soho',
      lastAt: '08:54',
      messages: [
        { body: 'Hola Sofía, estoy de camino. Llego en 10 min.', time: '08:50' },
        { body: '¿La llave sigue en el lockbox o me abres tú?', time: '08:54' },
      ],
    },
    thread_thompson: {
      otherName: 'Mr. Thompson',
      role: 'Vecino · referido',
      lastAt: 'Vie',
      messages: [
        { body: 'Hi Sofía, thanks for the referral code — we just booked our first clean for Saturday!', time: 'Vie 12:30' },
        { body: '¡Qué bien! Ana es genial, vas a quedar encantado.', time: 'Vie 12:42' },
        { body: 'Brilliant. See you around the block!', time: 'Vie 12:43' },
      ],
    },
    thread_walker: {
      otherName: 'Ms. Walker',
      role: 'Vecina · Camden',
      lastAt: 'Jue',
      messages: [
        { body: 'Sofía, did London Sparkle ever do a move-out clean for you? Looking for someone reliable.', time: 'Jue 16:05' },
        { body: 'Sí, hicieron la salida del piso anterior, impecable. Te paso el contacto.', time: 'Jue 16:12' },
      ],
    },
  },
  pt: {
    titleBase: 'Chat',
    unreadSuffix: (n: number) => ` · ${n} por ler`,
    inboxKicker: 'Caixa de entrada',
    conversationsLabel: 'As suas conversas',
    reset: 'Reiniciar',
    resetTitle: 'Reiniciar a demo ao estado inicial',
    searchPlaceholder: 'Procurar conversa…',
    searchTitle: 'Filtre a lista por nome ou última mensagem',
    noResults: 'Não há conversas correspondentes.',
    footnote: 'A sua equipa de limpeza, num só chat — sem perder mensagens.',
    youPrefix: (body: string) => `Você: ${body}`,
    noMessages: 'Ainda sem mensagens',
    composerPlaceholder: (name: string) => `Mensagem para ${name}…`,
    composerTitle: 'Escreva uma mensagem e toque em enviar',
    sendAria: 'Enviar',
    sendTitle: (name: string) => `Enviar a mensagem para ${name}`,
    nowPrefix: (t: string) => `Agora ${t}`,
    cannedReplies: [
      'Recebido! Confirmamos dentro de minutos.',
      'Ótimo, obrigada por avisar.',
      'Anotado, vemos já.',
      'Perfeito, respondemos em breve.',
    ],
    thread_business: {
      otherName: 'London Sparkle',
      role: 'Equipa · Alan (gestor)',
      lastAt: 'Hoje 09:03',
      messages: [
        { body: 'Olá Sofía! A Ana chega amanhã às 10:00 a Old Compton St. Precisa de algo especial?', time: 'Ontem 18:42' },
        { body: 'Olá! Sim, por favor que reveja bem a cozinha. Obrigada!', time: 'Ontem 19:01' },
        { body: 'Feito, anotado. Também deixamos a casa de banho com tratamento anticalcário.', time: 'Ontem 19:03' },
        { body: 'Pequeno aviso: subimos a tarifa de profunda £5 desde maio. A sua próxima padrão não muda.', time: 'Hoje 09:03' },
      ],
    },
    thread_carmen: {
      otherName: 'Carmen Ruiz',
      role: 'Limpadora atribuída · Soho',
      lastAt: '08:54',
      messages: [
        { body: 'Olá Sofía, estou a caminho. Chego em 10 min.', time: '08:50' },
        { body: 'A chave continua no cofre ou abre-me?', time: '08:54' },
      ],
    },
    thread_thompson: {
      otherName: 'Mr. Thompson',
      role: 'Vizinho · referido',
      lastAt: 'Sex',
      messages: [
        { body: 'Hi Sofía, thanks for the referral code — we just booked our first clean for Saturday!', time: 'Sex 12:30' },
        { body: 'Que bom! A Ana é fantástica, vai adorar.', time: 'Sex 12:42' },
        { body: 'Brilliant. See you around the block!', time: 'Sex 12:43' },
      ],
    },
    thread_walker: {
      otherName: 'Ms. Walker',
      role: 'Vizinha · Camden',
      lastAt: 'Qui',
      messages: [
        { body: 'Sofía, did London Sparkle ever do a move-out clean for you? Looking for someone reliable.', time: 'Qui 16:05' },
        { body: 'Sim, fizeram a saída do apartamento anterior, impecável. Passo-te o contacto.', time: 'Qui 16:12' },
      ],
    },
  },
} as const satisfies Record<ClientLocale, unknown>;

type CopyShape = (typeof COPY)['en'];

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

function buildInitialThreads(t: CopyShape): Thread[] {
  return [
    {
      id: 't-business',
      otherName: t.thread_business.otherName,
      role: t.thread_business.role,
      initials: 'LS',
      accent: 'from-cyan-400 to-blue-600',
      unread: 1,
      lastAt: t.thread_business.lastAt,
      messages: t.thread_business.messages.map((m, i) => ({
        id: `bm${i + 1}`,
        from: i === 1 ? 'me' : 'them',
        body: m.body,
        time: m.time,
      })),
    },
    {
      id: 't-carmen',
      otherName: t.thread_carmen.otherName,
      role: t.thread_carmen.role,
      initials: 'CR',
      accent: 'from-emerald-400 to-emerald-600',
      unread: 2,
      lastAt: t.thread_carmen.lastAt,
      messages: t.thread_carmen.messages.map((m, i) => ({
        id: `cm${i + 1}`,
        from: 'them',
        body: m.body,
        time: m.time,
      })),
    },
    {
      id: 't-thompson',
      otherName: t.thread_thompson.otherName,
      role: t.thread_thompson.role,
      initials: 'MT',
      accent: 'from-amber-400 to-orange-500',
      unread: 0,
      lastAt: t.thread_thompson.lastAt,
      messages: t.thread_thompson.messages.map((m, i) => ({
        id: `mtm${i + 1}`,
        from: i === 1 ? 'me' : 'them',
        body: m.body,
        time: m.time,
      })),
    },
    {
      id: 't-walker',
      otherName: t.thread_walker.otherName,
      role: t.thread_walker.role,
      initials: 'EW',
      accent: 'from-rose-400 to-rose-600',
      unread: 0,
      lastAt: t.thread_walker.lastAt,
      messages: t.thread_walker.messages.map((m, i) => ({
        id: `wm${i + 1}`,
        from: i === 1 ? 'me' : 'them',
        body: m.body,
        time: m.time,
      })),
    },
  ];
}

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function lastPreview(t: Thread, copy: CopyShape): string {
  const last = t.messages[t.messages.length - 1];
  if (!last) return copy.noMessages;
  return last.from === 'me' ? copy.youPrefix(last.body) : last.body;
}

export default function ClientChatHubPreview() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const [threads, setThreads] = useState<Thread[]>(() => buildInitialThreads(t));
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
      (th) =>
        th.otherName.toLowerCase().includes(q) ||
        th.role.toLowerCase().includes(q) ||
        lastPreview(th, t).toLowerCase().includes(q),
    );
  }, [threads, query, t]);

  function handleOpen(id: string) {
    setOpenId(id);
    setThreads((prev) =>
      prev.map((th) => (th.id === id ? { ...th, unread: 0 } : th)),
    );
  }

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const body = draft.trim();
    if (!body || !openId) return;
    const nowLabel = t.nowPrefix(nowHHMM());
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      from: 'me',
      body,
      time: nowLabel,
    };
    setThreads((prev) =>
      prev.map((th) =>
        th.id === openId
          ? { ...th, messages: [...th.messages, newMsg], lastAt: nowLabel }
          : th,
      ),
    );
    setDraft('');
    window.setTimeout(() => {
      const replies = t.cannedReplies;
      const reply: ChatMessage = {
        id: `m-${Date.now()}-r`,
        from: 'them',
        body: replies[Math.floor(Math.random() * replies.length)] ?? '👍',
        time: t.nowPrefix(nowHHMM()),
      };
      setThreads((prev) =>
        prev.map((th) =>
          th.id === openId
            ? { ...th, messages: [...th.messages, reply], lastAt: t.nowPrefix(nowHHMM()) }
            : th,
        ),
      );
    }, 900);
  }

  function handleReset() {
    setThreads(buildInitialThreads(t));
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
      title={openThread ? openThread.otherName : `${t.titleBase}${totalUnread > 0 ? t.unreadSuffix(totalUnread) : ''}`}
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
                  {t.inboxKicker}
                </p>
                <p className="font-display text-sm font-bold text-slate-900">
                  {t.conversationsLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500 hover:text-slate-800"
              title={t.resetTitle}
            >
              <RotateCcw className="h-3 w-3" />
              {t.reset}
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
              placeholder={t.searchPlaceholder}
              title={t.searchTitle}
              className="block h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          <ul className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-slate-100 divide-y divide-slate-100">
            {visible.length === 0 ? (
              <li className="px-4 py-12 text-center text-[12px] text-slate-400">
                {t.noResults}
              </li>
            ) : (
              visible.map((th) => (
                <li key={th.id}>
                  <button
                    type="button"
                    onClick={() => handleOpen(th.id)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-slate-50"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${th.accent} text-sm font-bold text-white`}
                    >
                      {th.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`truncate text-sm ${
                            th.unread > 0
                              ? 'font-bold text-slate-900'
                              : 'font-semibold text-slate-800'
                          }`}
                        >
                          {th.otherName}
                        </span>
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {th.lastAt}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span
                          className={`truncate text-[12px] ${
                            th.unread > 0 ? 'text-slate-700' : 'text-slate-500'
                          }`}
                        >
                          {lastPreview(th, t)}
                        </span>
                        {th.unread > 0 ? (
                          <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 px-1.5 text-[11px] font-bold text-white">
                            {th.unread}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
                        {th.role}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>

          <p className="mt-4 text-center text-[10.5px] text-slate-400">
            {t.footnote}
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
                placeholder={t.composerPlaceholder(openThread.otherName)}
                title={t.composerTitle}
                className="block h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label={t.sendAria}
                title={t.sendTitle(openThread.otherName)}
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

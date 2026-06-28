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
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
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

const COPY = {
  en: {
    roleManager: 'Manager · London Sparkle',
    roleSohoLoft: 'Client · Soho Loft',
    roleNottingHill: 'Client · Notting Hill Flat',
    roleCamden: 'Client · Camden Studio',
    yesterday: 'Yesterday',
    dayTue: 'Tue',
    dayMon: 'Mon',
    backAria: 'Back to inbox',
    backTitle: 'Back to the conversation list',
    inbox: 'Inbox',
    chat: 'Chat',
    unread: (n: number) => `${n} unread`,
    resetTitle: 'Reset the demo to its initial state',
    reset: 'Reset',
    searchPlaceholder: 'Search conversation…',
    searchTitle: 'Filter the list by name, role or last message',
    noMatch: 'No matching conversations.',
    footer: 'Everything in one place — manager and clients, separate from your personal WhatsApp.',
    composerPlaceholderFor: (name: string) => `Message for ${name}…`,
    composerTitle: 'Type a message and tap send (or Enter)',
    sendAria: 'Send',
    sendTitleFor: (name: string) => `Send the message to ${name}`,
    noMessages: 'No messages yet',
    youPrefix: 'You:',
    now: 'Now',
    threadAlanMessages: [
      { id: 'am1', from: 'them' as const, body: "Hi Carmen, there's an extra clean tomorrow at 16:00 at the Shoreditch flat. Can you do it?", time: '09:12' },
      { id: 'am2', from: 'me' as const, body: "Hi Alan! Yes, no problem. I'll take the lockbox keys.", time: '09:18' },
      { id: 'am3', from: 'them' as const, body: 'Perfect, thanks. The guests check out at 11:00, so you have plenty of time.', time: '09:21' },
    ],
    threadThompsonMessages: [
      { id: 'tm1', from: 'them' as const, body: 'Hi Carmen — please use the eco spray under the sink, not the bleach.', time: 'Yesterday 19:50' },
      { id: 'tm2', from: 'me' as const, body: 'Of course, Mr. Thompson. I will use only the eco products.', time: 'Yesterday 20:02' },
      { id: 'tm3', from: 'them' as const, body: 'Also — could you water the basil on the windowsill?', time: '08:45' },
      { id: 'tm4', from: 'them' as const, body: 'Thanks!', time: '08:47' },
    ],
    threadPatelMessages: [
      { id: 'pm1', from: 'them' as const, body: "Carmen, we're changing the sheets this week, right? I left fresh ones in the hallway cupboard.", time: 'Tue 14:20' },
      { id: 'pm2', from: 'me' as const, body: 'Yes, Ms. Patel, all sorted. I also left the unscented products as you asked.', time: 'Tue 14:35' },
      { id: 'pm3', from: 'them' as const, body: "You're a star, thank you!", time: 'Tue 14:36' },
    ],
    threadWalkerMessages: [
      { id: 'wm1', from: 'them' as const, body: 'Carmen, the spare key is now in the lockbox — code 4421. The previous spot under the mat is gone.', time: 'Mon 11:10' },
      { id: 'wm2', from: 'me' as const, body: 'Got it, thank you. I will use the lockbox from Saturday.', time: 'Mon 11:14' },
    ],
    cannedReplies: [
      'Perfect, thanks!',
      'Noted, without fail.',
      "I'll confirm in a bit.",
      'Brilliant, everything is in order here.',
    ] as ReadonlyArray<string>,
  },
  es: {
    roleManager: 'Manager · London Sparkle',
    roleSohoLoft: 'Cliente · Soho Loft',
    roleNottingHill: 'Cliente · Notting Hill Flat',
    roleCamden: 'Cliente · Camden Studio',
    yesterday: 'Ayer',
    dayTue: 'Mar',
    dayMon: 'Lun',
    backAria: 'Volver a la bandeja',
    backTitle: 'Volver a la lista de conversaciones',
    inbox: 'Bandeja',
    chat: 'Chat',
    unread: (n: number) => `${n} sin leer`,
    resetTitle: 'Reiniciar la demo a su estado inicial',
    reset: 'Reiniciar',
    searchPlaceholder: 'Buscar conversación…',
    searchTitle: 'Filtra la lista por nombre, rol o último mensaje',
    noMatch: 'No hay conversaciones que coincidan.',
    footer: 'Todo en un sitio — manager y clientes, sin mezclar con tu WhatsApp personal.',
    composerPlaceholderFor: (name: string) => `Mensaje para ${name}…`,
    composerTitle: 'Escribe un mensaje y pulsa enviar (o Enter)',
    sendAria: 'Enviar',
    sendTitleFor: (name: string) => `Enviar el mensaje a ${name}`,
    noMessages: 'Sin mensajes todavía',
    youPrefix: 'Tú:',
    now: 'Ahora',
    threadAlanMessages: [
      { id: 'am1', from: 'them' as const, body: 'Hola Carmen, mañana hay una limpieza extra a las 16:00 en el apto de Shoreditch. ¿Puedes?', time: '09:12' },
      { id: 'am2', from: 'me' as const, body: 'Hola Alan! Sí, sin problema. Llevo las llaves del lockbox.', time: '09:18' },
      { id: 'am3', from: 'them' as const, body: 'Perfecto, gracias. Los huéspedes salen a las 11:00, tienes margen de sobra.', time: '09:21' },
    ],
    threadThompsonMessages: [
      { id: 'tm1', from: 'them' as const, body: 'Hi Carmen — please use the eco spray under the sink, not the bleach.', time: 'Ayer 19:50' },
      { id: 'tm2', from: 'me' as const, body: 'Of course, Mr. Thompson. I will use only the eco products.', time: 'Ayer 20:02' },
      { id: 'tm3', from: 'them' as const, body: 'Also — could you water the basil on the windowsill?', time: '08:45' },
      { id: 'tm4', from: 'them' as const, body: 'Thanks!', time: '08:47' },
    ],
    threadPatelMessages: [
      { id: 'pm1', from: 'them' as const, body: 'Carmen, esta semana cambiamos las sábanas, ¿verdad? Las dejé limpias en el armario del pasillo.', time: 'Mar 14:20' },
      { id: 'pm2', from: 'me' as const, body: 'Sí, Ms. Patel, todo listo. También dejé los productos sin perfume como pidió.', time: 'Mar 14:35' },
      { id: 'pm3', from: 'them' as const, body: 'Eres un sol, gracias!', time: 'Mar 14:36' },
    ],
    threadWalkerMessages: [
      { id: 'wm1', from: 'them' as const, body: 'Carmen, the spare key is now in the lockbox — code 4421. The previous spot under the mat is gone.', time: 'Lun 11:10' },
      { id: 'wm2', from: 'me' as const, body: 'Got it, thank you. I will use the lockbox from Saturday.', time: 'Lun 11:14' },
    ],
    cannedReplies: [
      'Perfecto, gracias!',
      'Anotado, sin falta.',
      'Te confirmo en un rato.',
      'Genial, todo en orden por aquí.',
    ] as ReadonlyArray<string>,
  },
  pt: {
    roleManager: 'Gestor · London Sparkle',
    roleSohoLoft: 'Cliente · Soho Loft',
    roleNottingHill: 'Cliente · Notting Hill Flat',
    roleCamden: 'Cliente · Camden Studio',
    yesterday: 'Ontem',
    dayTue: 'Ter',
    dayMon: 'Seg',
    backAria: 'Voltar à caixa de entrada',
    backTitle: 'Voltar à lista de conversas',
    inbox: 'Caixa',
    chat: 'Chat',
    unread: (n: number) => `${n} por ler`,
    resetTitle: 'Reiniciar a demo para o estado inicial',
    reset: 'Reiniciar',
    searchPlaceholder: 'Procurar conversa…',
    searchTitle: 'Filtre a lista por nome, função ou última mensagem',
    noMatch: 'Não há conversas correspondentes.',
    footer: 'Tudo num só sítio — gestor e clientes, sem misturar com o seu WhatsApp pessoal.',
    composerPlaceholderFor: (name: string) => `Mensagem para ${name}…`,
    composerTitle: 'Escreva uma mensagem e toque em enviar (ou Enter)',
    sendAria: 'Enviar',
    sendTitleFor: (name: string) => `Enviar a mensagem a ${name}`,
    noMessages: 'Ainda sem mensagens',
    youPrefix: 'Você:',
    now: 'Agora',
    threadAlanMessages: [
      { id: 'am1', from: 'them' as const, body: 'Olá Carmen, amanhã há uma limpeza extra às 16:00 no apartamento de Shoreditch. Pode fazer?', time: '09:12' },
      { id: 'am2', from: 'me' as const, body: 'Olá Alan! Sim, sem problema. Levo as chaves do cofre.', time: '09:18' },
      { id: 'am3', from: 'them' as const, body: 'Perfeito, obrigado. Os hóspedes saem às 11:00, tem tempo de sobra.', time: '09:21' },
    ],
    threadThompsonMessages: [
      { id: 'tm1', from: 'them' as const, body: 'Hi Carmen — please use the eco spray under the sink, not the bleach.', time: 'Ontem 19:50' },
      { id: 'tm2', from: 'me' as const, body: 'Of course, Mr. Thompson. I will use only the eco products.', time: 'Ontem 20:02' },
      { id: 'tm3', from: 'them' as const, body: 'Also — could you water the basil on the windowsill?', time: '08:45' },
      { id: 'tm4', from: 'them' as const, body: 'Thanks!', time: '08:47' },
    ],
    threadPatelMessages: [
      { id: 'pm1', from: 'them' as const, body: 'Carmen, esta semana mudamos os lençóis, certo? Deixei lençóis limpos no armário do corredor.', time: 'Ter 14:20' },
      { id: 'pm2', from: 'me' as const, body: 'Sim, Ms. Patel, está tudo tratado. Também deixei os produtos sem perfume como pediu.', time: 'Ter 14:35' },
      { id: 'pm3', from: 'them' as const, body: 'É uma querida, obrigado!', time: 'Ter 14:36' },
    ],
    threadWalkerMessages: [
      { id: 'wm1', from: 'them' as const, body: 'Carmen, the spare key is now in the lockbox — code 4421. The previous spot under the mat is gone.', time: 'Seg 11:10' },
      { id: 'wm2', from: 'me' as const, body: 'Got it, thank you. I will use the lockbox from Saturday.', time: 'Seg 11:14' },
    ],
    cannedReplies: [
      'Perfeito, obrigada!',
      'Anotado, sem falta.',
      'Confirmo daqui a pouco.',
      'Ótimo, está tudo em ordem por aqui.',
    ] as ReadonlyArray<string>,
  },
} as const satisfies Record<ClientLocale, unknown>;

function buildInitialThreads(t: (typeof COPY)['en']): Thread[] {
  return [
    {
      id: 't-alan',
      otherName: 'Alan',
      role: t.roleManager,
      initials: 'A',
      accent: 'from-cyan-400 to-blue-600',
      unread: 1,
      lastAt: '09:21',
      messages: [...t.threadAlanMessages],
    },
    {
      id: 't-thompson',
      otherName: 'Mr. Thompson',
      role: t.roleSohoLoft,
      initials: 'MT',
      accent: 'from-emerald-400 to-emerald-600',
      unread: 2,
      lastAt: '08:47',
      messages: [...t.threadThompsonMessages],
    },
    {
      id: 't-patel',
      otherName: 'Ms. Patel',
      role: t.roleNottingHill,
      initials: 'NP',
      accent: 'from-rose-400 to-rose-600',
      unread: 0,
      lastAt: t.dayTue,
      messages: [...t.threadPatelMessages],
    },
    {
      id: 't-walker',
      otherName: 'Ms. Walker',
      role: t.roleCamden,
      initials: 'EW',
      accent: 'from-amber-400 to-orange-500',
      unread: 0,
      lastAt: t.dayMon,
      messages: [...t.threadWalkerMessages],
    },
  ];
}

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function lastPreview(
  thread: Thread,
  copy: { noMessages: string; youPrefix: string },
): string {
  const last = thread.messages[thread.messages.length - 1];
  if (!last) return copy.noMessages;
  return last.from === 'me' ? `${copy.youPrefix} ${last.body}` : last.body;
}

export default function OperativeChatHubPreview() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const initialThreads = useMemo(() => buildInitialThreads(t), [t]);
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [query, setQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const openThread = openId ? threads.find((thr) => thr.id === openId) ?? null : null;

  useEffect(() => {
    if (openThread) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [openThread?.messages.length, openId, typing]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (thr) =>
        thr.otherName.toLowerCase().includes(q) ||
        thr.role.toLowerCase().includes(q) ||
        lastPreview(thr, t).toLowerCase().includes(q),
    );
  }, [threads, query, t]);

  function handleOpen(id: string) {
    setOpenId(id);
    setThreads((prev) =>
      prev.map((thr) => (thr.id === id ? { ...thr, unread: 0 } : thr)),
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
      prev.map((thr) =>
        thr.id === openId
          ? { ...thr, messages: [...thr.messages, newMsg], lastAt: t.now }
          : thr,
      ),
    );
    setDraft('');
    setTyping(true);
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `m-${Date.now()}-r`,
        from: 'them',
        body: t.cannedReplies[Math.floor(Math.random() * t.cannedReplies.length)] ?? '👍',
        time: nowHHMM(),
      };
      setTyping(false);
      setThreads((prev) =>
        prev.map((thr) =>
          thr.id === openId
            ? { ...thr, messages: [...thr.messages, reply], lastAt: t.now }
            : thr,
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
    setThreads(buildInitialThreads(t));
    setOpenId(null);
    setDraft('');
    setTyping(false);
    setQuery('');
  }

  const totalUnread = threads.reduce((sum, thr) => sum + thr.unread, 0);

  return (
    <main className="relative min-h-screen bg-canvas pb-24">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
          {openThread ? (
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-text-2 hover:bg-surface-1"
              aria-label={t.backAria}
              title={t.backTitle}
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
                  {t.inbox}
                </p>
                <h1 className="font-display text-sm font-semibold text-text-1">
                  {t.chat} {totalUnread > 0 ? `· ${t.unread(totalUnread)}` : ''}
                </h1>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-semibold text-text-3 hover:text-text-1"
            title={t.resetTitle}
          >
            <RotateCcw className="h-3 w-3" />
            {t.reset}
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
              placeholder={t.searchPlaceholder}
              title={t.searchTitle}
              className="block h-11 w-full rounded-2xl border border-surface-2 bg-paper pl-10 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </label>

          <ul className="mt-4 overflow-hidden rounded-2xl bg-paper ring-1 ring-inset ring-surface-2 divide-y divide-surface-2">
            {visible.length === 0 ? (
              <li className="px-4 py-12 text-center text-[12px] text-text-3">
                {t.noMatch}
              </li>
            ) : (
              visible.map((thr) => (
                <li key={thr.id}>
                  <button
                    type="button"
                    onClick={() => handleOpen(thr.id)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-surface-1"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${thr.accent} text-sm font-bold text-white`}
                    >
                      {thr.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`truncate text-sm ${
                            thr.unread > 0
                              ? 'font-bold text-text-1'
                              : 'font-semibold text-text-1'
                          }`}
                        >
                          {thr.otherName}
                        </span>
                        <span className="shrink-0 text-[10px] text-text-3">
                          {thr.lastAt}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span
                          className={`truncate text-[12px] ${
                            thr.unread > 0 ? 'text-text-2' : 'text-text-3'
                          }`}
                        >
                          {lastPreview(thr, t)}
                        </span>
                        {thr.unread > 0 ? (
                          <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 px-1.5 text-[11px] font-bold text-white">
                            {thr.unread}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-[10.5px] text-text-3">
                        {thr.role}
                      </p>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>

          <p className="mt-4 text-center text-[10.5px] text-text-3">
            {t.footer}
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
                placeholder={t.composerPlaceholderFor(openThread.otherName)}
                title={t.composerTitle}
                className="block max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim()}
                aria-label={t.sendAria}
                title={t.sendTitleFor(openThread.otherName)}
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

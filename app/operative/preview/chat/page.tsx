'use client';

/**
 * Public, no-auth preview of the Cleaner /chat page. Mock data only.
 *
 * Now interactive: typing in the composer and tapping send appends a
 * new message to the local list (in-memory, resets on refresh). After
 * the cleaner sends, a canned "owner" reply lands ~700ms later so the
 * demo feels like a live conversation.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { HelpCircle, RotateCcw, Send } from 'lucide-react';
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
import { PreviewBottomTabBar } from '@/components/preview/PreviewBottomTabBar';

type Msg = {
  id: string;
  sender: 'cleaner' | 'owner';
  body: string;
  time: string;
};

const COPY = {
  en: {
    initialMessages: [
      {
        id: 'm1',
        sender: 'owner' as const,
        body: "Hi Carmen, there's an extra clean tomorrow at 16:00 at the Shoreditch flat. Can you do it?",
        time: '09:12',
      },
      {
        id: 'm2',
        sender: 'cleaner' as const,
        body: "Hi Alan! Yes, no problem. I'll take the lockbox keys.",
        time: '09:18',
      },
      {
        id: 'm3',
        sender: 'owner' as const,
        body: 'Perfect, thanks. The guests check out at 11:00, so you have plenty of time.',
        time: '09:21',
      },
      {
        id: 'm4',
        sender: 'cleaner' as const,
        body: "Got it. I'll let you know when I'm done and upload the photos to the portal.",
        time: '09:23',
      },
    ] as ReadonlyArray<Msg>,
    cannedReplies: [
      'Perfect, thanks!',
      'Noted, tomorrow without fail.',
      "I'll confirm in a bit.",
      'Brilliant, everything is in order here.',
    ] as ReadonlyArray<string>,
    chatWith: 'Chat with',
    chatHelpTitle: 'Direct messaging between cleaner and manager — no email, no WhatsApp.',
    chatHeader: 'Alan (manager)',
    resetThreadTitle: 'Reset the conversation to its initial state (demo only)',
    reset: 'Reset',
    composerPlaceholder: 'Write a message…',
    composerTitle: 'Type a message and tap Send (or Enter) — Alan will get a notification',
    sendAria: 'Send',
    sendTitle: 'Send the message to Alan',
  },
  es: {
    initialMessages: [
      {
        id: 'm1',
        sender: 'owner' as const,
        body: 'Hola Carmen, mañana hay una limpieza extra a las 16:00 en el apto de Shoreditch. ¿Puedes?',
        time: '09:12',
      },
      {
        id: 'm2',
        sender: 'cleaner' as const,
        body: 'Hola Alan! Sí, sin problema. Llevo las llaves del lockbox.',
        time: '09:18',
      },
      {
        id: 'm3',
        sender: 'owner' as const,
        body: 'Perfecto, gracias. Los huéspedes salen a las 11:00, tienes margen de sobra.',
        time: '09:21',
      },
      {
        id: 'm4',
        sender: 'cleaner' as const,
        body: 'Recibido. Te aviso cuando termine y subo las fotos al portal.',
        time: '09:23',
      },
    ] as ReadonlyArray<Msg>,
    cannedReplies: [
      'Perfecto, gracias!',
      'Anotado, mañana sin falta.',
      'Te confirmo en un rato.',
      'Genial, todo en orden por aquí.',
    ] as ReadonlyArray<string>,
    chatWith: 'Chat con',
    chatHelpTitle: 'Mensajería directa entre el cleaner y el manager — sin email, sin WhatsApp.',
    chatHeader: 'Alan (manager)',
    resetThreadTitle: 'Reiniciar la conversación a su estado inicial (solo demo)',
    reset: 'Reiniciar',
    composerPlaceholder: 'Escribe un mensaje…',
    composerTitle: 'Escribe un mensaje y pulsa Enviar (o Enter) — Alan recibirá una notificación',
    sendAria: 'Enviar',
    sendTitle: 'Enviar el mensaje a Alan',
  },
  pt: {
    initialMessages: [
      {
        id: 'm1',
        sender: 'owner' as const,
        body: 'Olá Carmen, amanhã há uma limpeza extra às 16:00 no apartamento de Shoreditch. Pode fazer?',
        time: '09:12',
      },
      {
        id: 'm2',
        sender: 'cleaner' as const,
        body: 'Olá Alan! Sim, sem problema. Levo as chaves do cofre.',
        time: '09:18',
      },
      {
        id: 'm3',
        sender: 'owner' as const,
        body: 'Perfeito, obrigado. Os hóspedes saem às 11:00, tem tempo de sobra.',
        time: '09:21',
      },
      {
        id: 'm4',
        sender: 'cleaner' as const,
        body: 'Recebido. Aviso quando terminar e envio as fotos para o portal.',
        time: '09:23',
      },
    ] as ReadonlyArray<Msg>,
    cannedReplies: [
      'Perfeito, obrigada!',
      'Anotado, amanhã sem falta.',
      'Confirmo daqui a pouco.',
      'Ótimo, está tudo em ordem por aqui.',
    ] as ReadonlyArray<string>,
    chatWith: 'Conversa com',
    chatHelpTitle: 'Mensagens diretas entre o cleaner e o gestor — sem email, sem WhatsApp.',
    chatHeader: 'Alan (gestor)',
    resetThreadTitle: 'Reiniciar a conversa para o estado inicial (apenas demo)',
    reset: 'Reiniciar',
    composerPlaceholder: 'Escreva uma mensagem…',
    composerTitle: 'Escreva uma mensagem e toque em Enviar (ou Enter) — o Alan recebe uma notificação',
    sendAria: 'Enviar',
    sendTitle: 'Enviar a mensagem ao Alan',
  },
} as const satisfies Record<ClientLocale, unknown>;

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function OperativePreviewChat() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const initialMessages = useMemo(() => [...t.initialMessages] as Msg[], [t]);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function handleSend() {
    const body = draft.trim();
    if (!body) return;
    const newMsg: Msg = {
      id: `m-${Date.now()}`,
      sender: 'cleaner',
      body,
      time: nowHHMM(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft('');
    setTyping(true);
    // Canned auto-reply so the demo feels alive.
    window.setTimeout(() => {
      const reply: Msg = {
        id: `m-${Date.now()}-r`,
        sender: 'owner',
        body: t.cannedReplies[Math.floor(Math.random() * t.cannedReplies.length)] ?? '',
        time: nowHHMM(),
      };
      setTyping(false);
      setMessages((prev) => [...prev, reply]);
    }, 900);
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleResetThread() {
    setMessages([...t.initialMessages] as Msg[]);
    setDraft('');
    setTyping(false);
  }

  return (
    <main className="flex min-h-screen flex-col bg-canvas pb-24">
      <header className="sticky top-0 z-20 flex items-start justify-between gap-2 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            {t.chatWith}
            <span
              title={t.chatHelpTitle}
              className="grid h-3.5 w-3.5 cursor-help place-items-center text-text-3"
            >
              <HelpCircle className="h-3 w-3" />
            </span>
          </p>
          <h1 className="mt-0.5 font-display text-base font-semibold text-text-1">
            {t.chatHeader}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleResetThread}
          title={t.resetThreadTitle}
          className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-semibold text-text-3 hover:text-text-1"
        >
          <RotateCcw className="h-3 w-3" />
          {t.reset}
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 px-4 py-4 pb-28">
        <ol className="flex-1 space-y-2">
          {messages.map((m) => {
            const mine = m.sender === 'cleaner';
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
      </div>

      {/* Composer pinned above the bottom tab bar — functional in demo */}
      <div
        className="fixed inset-x-0 bottom-14 z-30 mx-auto max-w-md border-t border-line bg-paper px-3 py-2.5 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            name="body"
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.composerPlaceholder}
            title={t.composerTitle}
            className="block max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label={t.sendAria}
            title={t.sendTitle}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)] transition active:scale-95 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <PreviewBottomTabBar active="chat" />
    </main>
  );
}

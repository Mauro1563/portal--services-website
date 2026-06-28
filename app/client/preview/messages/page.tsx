/**
 * Public preview: Client → Messages thread. Mocked chat with the
 * owner. The composer is fully interactive in the demo — typing and
 * tapping send appends a new message to local state so a prospect
 * can feel the chat experience. Refreshing resets the demo.
 */
'use client';

import { useState } from 'react';
import { MapPin, Send } from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
import { LONDON_PROPERTIES, MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

type Msg = {
  id: string;
  from: 'client' | 'owner';
  body: string;
  at: string;
};

const COPY = {
  en: {
    title: 'Chat with London Sparkle Cleaning Co.',
    nextVisit: 'Next visit:',
    nextVisitTitle: 'Address for the next visit',
    composerPlaceholder: 'Write a message…',
    composerTitle: 'Write your message to the team and tap send',
    sendAria: 'Send message',
    sendTitle: 'Send the message to the cleaning team',
    nowPrefix: (t: string) => `Now ${t}`,
    msg1: (addr: string) =>
      `Hi Sofía! Ana arrives tomorrow at 10:00 at ${addr}. Do you need anything in particular?`,
    msg1At: 'Yesterday 18:42',
    msg2: 'Hi! Yes, could she give the kitchen a proper going-over please. Thanks!',
    msg2At: 'Yesterday 19:01',
    msg3: 'Done, noted. We will also do the bathroom with anti-limescale treatment.',
    msg3At: 'Yesterday 19:03',
    msg4: 'Perfect, thanks so much 🙌',
    msg4At: 'Yesterday 19:04',
    autoReply: 'Got it! We will confirm in a few minutes.',
  },
  es: {
    title: 'Chat con London Sparkle Cleaning Co.',
    nextVisit: 'Próxima visita:',
    nextVisitTitle: 'Dirección de la propiedad de la próxima visita',
    composerPlaceholder: 'Escribe un mensaje…',
    composerTitle: 'Escribe tu mensaje al equipo y pulsa enviar',
    sendAria: 'Enviar mensaje',
    sendTitle: 'Enviar mensaje al equipo de limpieza',
    nowPrefix: (t: string) => `Ahora ${t}`,
    msg1: (addr: string) =>
      `¡Hola Sofía! Ana llega mañana a las 10:00 a ${addr}. ¿Necesitas algo especial?`,
    msg1At: 'Ayer 18:42',
    msg2: 'Hola! Sí, por favor que revise bien la cocina. ¡Gracias!',
    msg2At: 'Ayer 19:01',
    msg3: 'Hecho, anotado. También dejamos el baño con tratamiento anticalcáreo.',
    msg3At: 'Ayer 19:03',
    msg4: 'Perfecto, mil gracias 🙌',
    msg4At: 'Ayer 19:04',
    autoReply: '¡Recibido! Te confirmamos en unos minutos.',
  },
  pt: {
    title: 'Chat com a London Sparkle Cleaning Co.',
    nextVisit: 'Próxima visita:',
    nextVisitTitle: 'Morada da próxima visita',
    composerPlaceholder: 'Escreva uma mensagem…',
    composerTitle: 'Escreva a sua mensagem à equipa e toque em enviar',
    sendAria: 'Enviar mensagem',
    sendTitle: 'Enviar a mensagem à equipa de limpeza',
    nowPrefix: (t: string) => `Agora ${t}`,
    msg1: (addr: string) =>
      `Olá Sofía! A Ana chega amanhã às 10:00 a ${addr}. Precisa de algo especial?`,
    msg1At: 'Ontem 18:42',
    msg2: 'Olá! Sim, por favor que reveja bem a cozinha. Obrigada!',
    msg2At: 'Ontem 19:01',
    msg3: 'Feito, anotado. Também deixamos a casa de banho com tratamento anticalcário.',
    msg3At: 'Ontem 19:03',
    msg4: 'Perfeito, muito obrigada 🙌',
    msg4At: 'Ontem 19:04',
    autoReply: 'Recebido! Confirmamos dentro de minutos.',
  },
} as const satisfies Record<ClientLocale, unknown>;

type CopyShape = (typeof COPY)['en'];

function buildInitialMessages(t: CopyShape): Msg[] {
  return [
    { id: 'm1', from: 'owner',  body: t.msg1(LONDON_PROPERTIES.soho.address), at: t.msg1At },
    { id: 'm2', from: 'client', body: t.msg2, at: t.msg2At },
    { id: 'm3', from: 'owner',  body: t.msg3, at: t.msg3At },
    { id: 'm4', from: 'client', body: t.msg4, at: t.msg4At },
  ];
}

function nowLabel(t: CopyShape) {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return t.nowPrefix(`${hh}:${mm}`);
}

export default function ClientMessagesPreview() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const [messages, setMessages] = useState<Msg[]>(() => buildInitialMessages(t));
  const [body, setBody] = useState('');

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${prev.length + 1}`,
        from: 'client',
        body: trimmed,
        at: nowLabel(t),
      },
    ]);
    setBody('');
    // Simulate an auto-reply from the business after a tick.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `local-reply-${prev.length + 1}`,
          from: 'owner',
          body: t.autoReply,
          at: nowLabel(t),
        },
      ]);
    }, 900);
  }

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="messages"
      title={t.title}
    >
      <div
        className="mb-3 flex items-center gap-2 rounded-2xl bg-blue-50 p-3 ring-1 ring-inset ring-blue-100"
        title={t.nextVisitTitle}
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-700" />
        <p className="text-[11px] text-blue-900">
          {t.nextVisit} <span className="font-semibold">{LONDON_PROPERTIES.soho.address}</span>
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {messages.map((m) => {
          const mine = m.from === 'client';
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
                  {m.at}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={handleSend}
        className="sticky bottom-20 mt-6 flex items-center gap-2 rounded-3xl bg-white p-2 ring-1 ring-inset ring-slate-100 shadow-[0_10px_24px_-12px_rgba(15,23,42,0.18)]"
      >
        <input
          type="text"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t.composerPlaceholder}
          title={t.composerTitle}
          className="block h-10 flex-1 rounded-2xl border-0 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="submit"
          aria-label={t.sendAria}
          title={t.sendTitle}
          disabled={!body.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </ClientShell>
  );
}

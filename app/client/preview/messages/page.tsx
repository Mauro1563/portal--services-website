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
import { LONDON_PROPERTIES, MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

type Msg = {
  id: string;
  from: 'client' | 'owner';
  body: string;
  at: string;
};

const INITIAL_MESSAGES: Msg[] = [
  {
    id: 'm1',
    from: 'owner',
    body: `¡Hola Sofía! Ana llega mañana a las 10:00 a ${LONDON_PROPERTIES.soho.address}. ¿Necesitas algo especial?`,
    at: 'Ayer 18:42',
  },
  {
    id: 'm2',
    from: 'client',
    body: 'Hola! Sí, por favor que revise bien la cocina. ¡Gracias!',
    at: 'Ayer 19:01',
  },
  {
    id: 'm3',
    from: 'owner',
    body: 'Hecho, anotado. También dejamos el baño con tratamiento anticalcáreo.',
    at: 'Ayer 19:03',
  },
  {
    id: 'm4',
    from: 'client',
    body: 'Perfecto, mil gracias 🙌',
    at: 'Ayer 19:04',
  },
];

function nowLabel() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `Ahora ${hh}:${mm}`;
}

export default function ClientMessagesPreview() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL_MESSAGES);
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
        at: nowLabel(),
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
          body: '¡Recibido! Te confirmamos en unos minutos.',
          at: nowLabel(),
        },
      ]);
    }, 900);
  }

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="messages"
      title="Chat con London Sparkle Cleaning Co."
    >
      <div
        className="mb-3 flex items-center gap-2 rounded-2xl bg-blue-50 p-3 ring-1 ring-inset ring-blue-100"
        title="Dirección de la propiedad de la próxima visita"
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-700" />
        <p className="text-[11px] text-blue-900">
          Próxima visita: <span className="font-semibold">{LONDON_PROPERTIES.soho.address}</span>
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
          placeholder="Escribe un mensaje…"
          title="Escribe tu mensaje al equipo y pulsa enviar"
          className="block h-10 flex-1 rounded-2xl border-0 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="submit"
          aria-label="Enviar mensaje"
          title="Enviar mensaje al equipo de limpieza"
          disabled={!body.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </ClientShell>
  );
}

/**
 * Public preview: Client → Messages thread. Mocked chat with the
 * owner; composer is decorative (no submit handler).
 */
import { Send } from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

export const metadata = {
  title: 'Vista previa · Chat',
  robots: { index: false, follow: false },
};

type Msg = {
  id: string;
  from: 'client' | 'owner';
  body: string;
  at: string;
};

const MESSAGES: Msg[] = [
  {
    id: 'm1',
    from: 'owner',
    body: '¡Hola Sofía! Ana llega mañana a las 10:00. ¿Necesitas algo especial?',
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

export default function ClientMessagesPreview() {
  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="messages"
      title="Chat con Limpiezas Premium"
    >
      <ul className="flex flex-col gap-3">
        {MESSAGES.map((m) => {
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
        className="sticky bottom-20 mt-6 flex items-center gap-2 rounded-3xl bg-white p-2 ring-1 ring-inset ring-slate-100 shadow-[0_10px_24px_-12px_rgba(15,23,42,0.18)]"
        action="#"
      >
        <input
          type="text"
          name="body"
          placeholder="Escribe un mensaje…"
          className="block h-10 flex-1 rounded-2xl border-0 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="submit"
          aria-label="Enviar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </ClientShell>
  );
}

/**
 * Public, no-auth preview of the Cleaner /chat page. Mock data only.
 */
import { Send } from 'lucide-react';
import { BottomTabBar } from '@/components/operative/BottomTabBar';

export const metadata = {
  title: 'Demo · Cleaner',
  robots: { index: false, follow: false },
};

type Msg = {
  id: string;
  sender: 'cleaner' | 'owner';
  body: string;
  time: string;
};

const MESSAGES: Msg[] = [
  {
    id: 'm1',
    sender: 'owner',
    body: 'Hola Carmen, mañana hay una limpieza extra a las 16:00 en el apto de Diagonal. ¿Puedes?',
    time: '09:12',
  },
  {
    id: 'm2',
    sender: 'cleaner',
    body: 'Hola Alan! Sí, sin problema. Llevo las llaves del lockbox.',
    time: '09:18',
  },
  {
    id: 'm3',
    sender: 'owner',
    body: 'Perfecto, gracias. Los huéspedes salen a las 11:00, tienes margen de sobra.',
    time: '09:21',
  },
  {
    id: 'm4',
    sender: 'cleaner',
    body: 'Recibido. Te aviso cuando termine y subo las fotos al portal.',
    time: '09:23',
  },
];

export default function OperativePreviewChat() {
  return (
    <main className="flex min-h-screen flex-col bg-canvas pb-24">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
          Chat con
        </p>
        <h1 className="mt-0.5 font-display text-base font-semibold text-text-1">
          Alan (manager)
        </h1>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 px-4 py-4">
        <ol className="flex-1 space-y-2">
          {MESSAGES.map((m) => {
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
        </ol>
      </div>

      {/* Composer pinned above the bottom tab bar — visual only */}
      <div
        className="fixed inset-x-0 bottom-14 z-30 mx-auto max-w-md border-t border-line bg-paper px-3 py-2.5 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-end gap-2">
          <textarea
            name="body"
            rows={1}
            placeholder="Escribe un mensaje…"
            className="block max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="button"
            aria-label="Enviar"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)] transition active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomTabBar active="chat" />
    </main>
  );
}

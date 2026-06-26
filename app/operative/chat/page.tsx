import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageCircle, Send } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { BottomTabBar } from '@/components/operative/BottomTabBar';
import { markOwnerMessagesReadForCleaner, sendCleanerMessage } from './actions';

export const dynamic = 'force-dynamic';

type Msg = {
  id: string;
  sender: 'cleaner' | 'owner';
  body: string;
  created_at: string;
};

type SearchParams = Promise<{ error?: string }>;

const ERROR_TEXT: Record<string, string> = {
  empty: 'Escribe un mensaje antes de enviar.',
  too_long: 'El mensaje es muy largo (máx. 4000 caracteres).',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function OperativeChat({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/operative/login');

  const { error } = await searchParams;

  // Side-effect: marca como leídos los mensajes del owner cada render,
  // así el badge en SOPORTE/PERFIL no se queda colgado.
  await markOwnerMessagesReadForCleaner();

  const admin = createAdminClient();
  const [{ data: cleaner }, { data: msgs }] = await Promise.all([
    admin
      .from('cleaners')
      .select('id, name, owner_id')
      .eq('id', cleanerId)
      .maybeSingle(),
    admin
      .from('cleaner_messages')
      .select('id, sender, body, created_at')
      .eq('cleaner_id', cleanerId)
      .order('created_at', { ascending: true })
      .limit(200),
  ]);

  if (!cleaner) redirect('/operative/login');

  const { data: profile } = await admin
    .from('owner_profiles')
    .select('business_name')
    .eq('owner_id', cleaner.owner_id)
    .maybeSingle();

  const messages = (msgs ?? []) as Msg[];
  const business = profile?.business_name ?? 'Tu manager';

  return (
    <main className="flex min-h-screen flex-col bg-canvas pb-24">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
          Chat con
        </p>
        <h1 className="mt-0.5 font-display text-base font-semibold text-text-1">
          {business}
        </h1>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 px-4 py-4">
        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {ERROR_TEXT[error] ?? error}
          </p>
        ) : null}

        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-surface-2 bg-surface-0 py-12 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
              <MessageCircle className="h-5 w-5" />
            </span>
            <p className="font-display text-base font-semibold text-text-1">
              Aún no hay mensajes
            </p>
            <p className="max-w-xs text-[12px] text-text-3">
              Escribe abajo para enviarle el primer mensaje a tu equipo.
            </p>
          </div>
        ) : (
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
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Composer pinned above the bottom tab bar */}
      <form
        action={sendCleanerMessage}
        className="fixed inset-x-0 bottom-14 z-30 mx-auto max-w-md border-t border-line bg-paper px-3 py-2.5 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-end gap-2">
          <textarea
            name="body"
            rows={1}
            placeholder="Escribe un mensaje…"
            required
            maxLength={4000}
            className="block max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="submit"
            aria-label="Enviar"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)] transition active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      <BottomTabBar active="soporte" />
    </main>
  );
}

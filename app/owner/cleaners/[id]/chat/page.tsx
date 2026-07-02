import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MessageCircle, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { markCleanerMessagesRead, sendOwnerToCleaner } from './actions';
import { getT } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

type Msg = {
  id: string;
  sender: 'cleaner' | 'owner';
  body: string;
  created_at: string;
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

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

export default async function OwnerCleanerChat({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { data: cleaner } = await supabase
    .from('cleaners')
    .select('id, name')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!cleaner) notFound();

  // Side effect: mark cleaner's messages as read every render.
  await markCleanerMessagesRead(id);

  const { data: msgs } = await supabase
    .from('cleaner_messages')
    .select('id, sender, body, created_at')
    .eq('cleaner_id', id)
    .order('created_at', { ascending: true })
    .limit(200);

  const messages = (msgs ?? []) as Msg[];
  const t = await getT();

  return (
    <LightLayout
      activeTab="cleaners"
      title={`Chat · ${cleaner.name}`}
      showBack
      backHref={`/owner/cleaners/${id}`}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3 pb-24">
        <header className="flex items-center justify-between gap-2">
          <Link
            href={`/owner/cleaners/${id}`}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-text-3 hover:text-text-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> {t('common.backToDetail')}
          </Link>
        </header>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {ERROR_TEXT[error] ?? error}
          </p>
        ) : null}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-line bg-paper py-12 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
              <MessageCircle className="h-5 w-5" />
            </span>
            <p className="font-display text-base font-semibold text-text-1">
              Aún no hay mensajes
            </p>
            <p className="max-w-xs text-[12px] text-text-3">
              Envía el primer mensaje a {cleaner.name} desde abajo.
            </p>
          </div>
        ) : (
          <ol className="space-y-2">
            {messages.map((m) => {
              const mine = m.sender === 'owner';
              return (
                <li
                  key={m.id}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed shadow-sm ${
                      mine
                        ? 'rounded-br-md bg-gradient-to-br from-brand-600 to-brand-700 text-white'
                        : 'rounded-bl-md border border-line bg-paper text-text-1'
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

      {/* Composer pinned at the bottom */}
      <form
        action={sendOwnerToCleaner}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper px-3 py-2.5 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <input type="hidden" name="cleaner_id" value={id} />
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            name="body"
            rows={1}
            placeholder="Escribe un mensaje…"
            required
            maxLength={4000}
            className="block max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <SubmitButton
            ariaLabel="Enviar"
            pendingLabel=""
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)] transition active:scale-95 disabled:opacity-70"
          >
            <Send className="h-4 w-4" />
          </SubmitButton>
        </div>
      </form>
    </LightLayout>
  );
}

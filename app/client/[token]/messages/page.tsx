import { notFound } from 'next/navigation';
import { MessageCircle, Send } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { ClientShell } from '@/components/client/ClientShell';
import { sendClientMessage, markOwnerMessagesRead } from '../actions';
import { ChatAutoRefresh } from './ChatAutoRefresh';

type MessageRow = {
  id: string;
  sender: 'client' | 'owner';
  body: string;
  created_at: string;
  read_at: string | null;
};

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function ClientMessages({ params, searchParams }: Props) {
  const { token } = await params;
  const { error } = await searchParams;
  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  // Mark all unread owner→client messages as read on view
  await markOwnerMessagesRead(ctx.client.id);

  const admin = createAdminClient();
  const { data } = await admin
    .from('client_messages')
    .select('id, sender, body, created_at, read_at')
    .eq('client_id', ctx.client.id)
    .order('created_at', { ascending: true })
    .limit(200);

  const messages = (data ?? []) as MessageRow[];
  const businessName = ctx.owner.business_name ?? 'el equipo';

  return (
    <ClientShell ctx={ctx} token={token} activeTab="messages" title="Mensajes">
      <ChatAutoRefresh />

      {/* Header card with business info */}
      <section className="rounded-2xl border border-surface-2 bg-gradient-to-br from-brand-600/[0.06] to-brand-600/[0.02] p-4 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600/15 text-brand-700">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold text-text-1">
              {businessName}
            </p>
            <p className="text-[11px] text-text-2">
              Te respondemos lo antes posible
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error === 'empty'
            ? 'Escribe un mensaje antes de enviar.'
            : error === 'too_long'
            ? 'El mensaje es demasiado largo (máx. 4.000 caracteres).'
            : 'Algo salió mal.'}
        </p>
      ) : null}

      {/* Message thread */}
      <section className="mt-4 space-y-2.5">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-6 text-center">
            <p className="font-display text-sm font-semibold text-text-1">
              Saluda 👋
            </p>
            <p className="mt-1 text-xs text-text-2">
              Pregunta por una limpieza, pide un cambio o simplemente agradece a tu limpiador/a.
            </p>
          </div>
        ) : (
          messages.map((m) => <Bubble key={m.id} msg={m} />)
        )}
      </section>

      {/* Composer */}
      <form
        action={sendClientMessage}
        className="sticky bottom-20 mt-5 flex items-end gap-2 rounded-2xl border border-surface-2 bg-surface-0 p-2 shadow-card-lg"
      >
        <input type="hidden" name="token" value={token} />
        <textarea
          name="body"
          rows={1}
          required
          placeholder={`Escribe a ${businessName}…`}
          className="block min-h-[40px] max-h-32 flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-2 text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          aria-label="Enviar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand-glow"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </ClientShell>
  );
}

function Bubble({ msg }: { msg: MessageRow }) {
  const mine = msg.sender === 'client';
  const time = new Date(msg.created_at).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          mine
            ? 'max-w-[78%] rounded-2xl rounded-br-md bg-brand-gradient px-3.5 py-2 text-sm text-white shadow-card'
            : 'max-w-[78%] rounded-2xl rounded-bl-md border border-surface-2 bg-surface-0 px-3.5 py-2 text-sm text-text-1 shadow-card'
        }
      >
        <p className="whitespace-pre-wrap break-words">{msg.body}</p>
        <p
          className={`mt-1 text-[10px] ${
            mine ? 'text-white/70' : 'text-text-3'
          } text-right`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}

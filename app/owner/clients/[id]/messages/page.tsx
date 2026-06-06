import { notFound, redirect } from 'next/navigation';
import { Send, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { sendOwnerMessage } from '../../actions';

type MessageRow = {
  id: string;
  sender: 'client' | 'owner';
  body: string;
  created_at: string;
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function OwnerClientMessages({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, phone')
    .eq('id', id)
    .maybeSingle();
  if (!client) notFound();

  const { data: messagesData } = await supabase
    .from('client_messages')
    .select('id, sender, body, created_at')
    .eq('client_id', id)
    .order('created_at', { ascending: true })
    .limit(200);

  const messages = (messagesData ?? []) as MessageRow[];

  // Mark all unread client→owner messages as read on view
  await supabase
    .from('client_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('client_id', id)
    .eq('owner_id', user.id)
    .eq('sender', 'client')
    .is('read_at', null);

  return (
    <LightLayout
      activeTab="more"
      title={client.name}
      showBack
      backHref={`/owner/clients/${id}`}
    >
      <section className="rounded-2xl border border-surface-2 bg-gradient-to-br from-brand-600/[0.06] to-brand-600/[0.02] p-4 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600/15 text-brand-700">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold text-text-1">
              {client.name}
            </p>
            <p className="text-[11px] text-text-2">
              In-portal chat · they see this in their phone
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error === 'empty'
            ? 'Please type a message before sending.'
            : error === 'too_long'
            ? 'Message is too long (4,000 characters max).'
            : 'Something went wrong.'}
        </p>
      ) : null}

      <section className="mt-4 space-y-2.5">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-6 text-center">
            <p className="font-display text-sm font-semibold text-text-1">
              No messages yet
            </p>
            <p className="mt-1 text-xs text-text-2">
              Start the conversation — they&apos;ll get the message next time
              they open their portal.
            </p>
          </div>
        ) : (
          messages.map((m) => <Bubble key={m.id} msg={m} />)
        )}
      </section>

      <form
        action={sendOwnerMessage}
        className="sticky bottom-20 mt-5 flex items-end gap-2 rounded-2xl border border-surface-2 bg-surface-0 p-2 shadow-card-lg"
      >
        <input type="hidden" name="client_id" value={id} />
        <textarea
          name="body"
          rows={1}
          required
          placeholder={`Reply to ${client.name.split(/\s+/)[0]}…`}
          className="block min-h-[40px] max-h-32 flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-2 text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand-glow"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </LightLayout>
  );
}

function Bubble({ msg }: { msg: MessageRow }) {
  // 'owner' = me (the business), shown on the right
  const mine = msg.sender === 'owner';
  const time = new Date(msg.created_at).toLocaleTimeString('en-GB', {
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

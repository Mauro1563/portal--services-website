import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  Copy,
  Edit,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Star,
  Trash2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import {
  clientPortalUrl,
  deleteClient,
  regenerateAccessToken,
} from '../actions';
import { ClientLinkActions } from './ClientLinkActions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string; regenerated?: string; error?: string }>;
};

type Rating = {
  task_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
  cleaner_id: string | null;
};

export default async function ClientDetail({ params, searchParams }: Props) {
  const { id } = await params;
  const { updated, regenerated, error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, email, phone, address, notes, access_token, created_at')
    .eq('id', id)
    .maybeSingle();

  if (!client) notFound();

  const [{ data: tasksRaw }, { data: ratingsRaw }, { count: unreadCount }] =
    await Promise.all([
      supabase
        .from('tasks')
        .select('id, scheduled_for, status, service_name, price_pence')
        .eq('client_id', id)
        .order('scheduled_for', { ascending: false })
        .limit(10),
      supabase
        .from('task_ratings')
        .select('task_id, stars, comment, created_at, cleaner_id')
        .eq('client_id', id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('client_messages')
        .select('id', { head: true, count: 'exact' })
        .eq('client_id', id)
        .eq('sender', 'client')
        .is('read_at', null),
    ]);
  const unread = unreadCount ?? 0;

  const tasks = tasksRaw ?? [];
  const ratings = (ratingsRaw ?? []) as Rating[];
  const avgRating =
    ratings.length === 0
      ? null
      : ratings.reduce((s, r) => s + r.stars, 0) / ratings.length;

  const portalUrl = clientPortalUrl(client.access_token);

  return (
    <LightLayout
      activeTab="more"
      title={client.name}
      showBack
      backHref="/owner/clients"
      rightSlot={
        <Link
          href={`/owner/clients/${client.id}/edit`}
          aria-label="Edit"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/[0.06]"
        >
          <Edit className="h-4 w-4" />
        </Link>
      }
    >
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-semibold text-emerald-700">
          {client.name
            .split(/\s+/)
            .map((p: string) => p.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-semibold text-text-1">
            {client.name}
          </h1>
          <div className="mt-1 space-y-0.5">
            {client.email ? (
              <p className="inline-flex items-center gap-1 text-[11px] text-text-2">
                <Mail className="h-3 w-3" /> {client.email}
              </p>
            ) : null}
            {client.phone ? (
              <p className="inline-flex items-center gap-1 text-[11px] text-text-2">
                <Phone className="h-3 w-3" /> {client.phone}
              </p>
            ) : null}
            {client.address ? (
              <p className="inline-flex items-center gap-1 text-[11px] text-text-2">
                <MapPin className="h-3 w-3" /> {client.address}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {updated && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          Client updated.
        </p>
      )}
      {regenerated && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          New access link generated. The previous link no longer works.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      {/* Portal Chat link */}
      <Link
        href={`/owner/clients/${client.id}/messages`}
        className="relative mt-6 flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card transition hover:border-brand-600/30 hover:shadow-card-lg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/portal-chat-icon.png"
          alt="Portal Chat"
          className="h-10 w-10 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-text-1">
            Portal Chat
          </p>
          <p className="text-[11px] text-text-2">
            Chat with {client.name.split(/\s+/)[0]}
          </p>
        </div>
        {unread > 0 ? (
          <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </Link>

      {/* Client portal access link */}
      <section className="mt-6 rounded-2xl border border-brand-600/30 bg-brand-600/[0.04] p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <MessageCircle className="h-4 w-4 text-brand-600" />
          Client portal link
        </h2>
        <p className="mt-1 text-[11px] text-text-2">
          Send {client.name} this link via WhatsApp / SMS. They tap it and
          instantly see their cleanings — no password needed.
        </p>

        <ClientLinkActions
          clientName={client.name}
          portalUrl={portalUrl}
          phone={client.phone ?? null}
        />

        <form action={regenerateAccessToken} className="mt-3">
          <input type="hidden" name="client_id" value={client.id} />
          <button
            type="submit"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-surface-2 bg-surface-0 px-2.5 text-[11px] text-text-2 hover:bg-surface-1"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate link (invalidates the old one)
          </button>
        </form>
      </section>

      {/* Rating snapshot */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <Star className="h-4 w-4 text-amber-500" />
          Ratings given
        </h2>
        {avgRating == null ? (
          <p className="mt-2 text-sm text-text-2">No ratings yet.</p>
        ) : (
          <>
            <p className="mt-2 font-display text-2xl font-bold text-text-1 tabular-nums">
              {avgRating.toFixed(1)}{' '}
              <span className="text-sm font-medium text-text-3">
                / 5 · {ratings.length}
              </span>
            </p>
            <ul className="mt-4 space-y-3">
              {ratings.map((r) => (
                <li
                  key={r.task_id}
                  className="rounded-xl border border-surface-2 bg-surface-1 p-3"
                >
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3.5 w-3.5 ${
                          n <= r.stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-surface-2'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-[10px] text-text-3">
                      {new Date(r.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  {r.comment ? (
                    <p className="mt-1.5 text-xs text-text-1">{r.comment}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Recent cleanings for this client */}
      <section className="mt-6">
        <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-text-3">
          Recent cleanings ({tasks.length})
        </h2>
        {tasks.length === 0 ? (
          <p className="mt-2 text-sm text-text-2">
            No cleanings linked to this client yet.{' '}
            <Link
              href={`/owner/tasks/new?client=${client.id}`}
              className="text-brand-600 hover:text-brand-700"
            >
              Schedule one →
            </Link>
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {tasks.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/owner/tasks/${t.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3 shadow-card hover:border-brand-600/30"
                >
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-text-1">
                      {new Date(t.scheduled_for).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-3">
                      {t.service_name ?? 'Cleaning'}
                      {t.price_pence
                        ? ` · £${(t.price_pence / 100).toFixed(2)}`
                        : ''}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-2">
                    {t.status === 'in_progress' ? 'in progress' : t.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Danger zone */}
      <section className="mt-6 mb-4 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <h2 className="text-xs font-semibold text-rose-700">Danger zone</h2>
        <p className="mt-1 text-[11px] text-rose-700/80">
          Deleting the client unlinks them from past cleanings (records stay).
          Their portal link stops working immediately.
        </p>
        <form action={deleteClient} className="mt-3">
          <input type="hidden" name="client_id" value={client.id} />
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-300 bg-white px-3 text-xs font-medium text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete client
          </button>
        </form>
      </section>
    </LightLayout>
  );
}

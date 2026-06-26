'use server';

import { requireOwner } from '@/lib/auth';

export type Notification = {
  id: string;
  kind: 'message' | 'completion' | 'rating';
  title: string;
  body: string;
  href: string;
  createdAt: string;
  unread: boolean;
};

export type NotificationsPayload = {
  items: Notification[];
  unreadCount: number;
};

/**
 * Aggregates "stuff the owner might want to see right now" from the
 * existing tables — unread client→owner messages, today's completed
 * tasks, recent ratings. No new table; the unread state piggy-backs on
 * what's already tracked (client_messages.read_at, etc.).
 *
 * Top 10 items, newest first. Designed for the bell dropdown so the
 * owner sees activity without having to walk every tab.
 */
export async function fetchOwnerNotifications(): Promise<NotificationsPayload> {
  const { supabase, user } = await requireOwner();
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [msgsRes, completionsRes, ratingsRes] = await Promise.all([
    // Unread client → owner messages (per client, latest body)
    supabase
      .from('client_messages')
      .select('id, body, created_at, read_at, client:clients(id, name)')
      .eq('owner_id', user.id)
      .eq('sender', 'client')
      .is('read_at', null)
      .order('created_at', { ascending: false })
      .limit(6),
    // Tasks completed today
    supabase
      .from('tasks')
      .select(
        'id, completed_at, property:properties(name), cleaner:cleaners(name)',
      )
      .eq('owner_id', user.id)
      .eq('status', 'completed')
      .gte('completed_at', todayStart.toISOString())
      .order('completed_at', { ascending: false })
      .limit(5),
    // Recent ratings (7 days)
    supabase
      .from('task_ratings')
      .select(
        'task_id, stars, comment, created_at, client:clients(id, name)',
      )
      .eq('owner_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const items: Notification[] = [];

  type Rel<T> = T | T[] | null;
  const unwrap = <T>(rel: Rel<T>): T | null =>
    Array.isArray(rel) ? rel[0] ?? null : rel;

  for (const m of msgsRes.data ?? []) {
    const client = unwrap(m.client as Rel<{ id: string; name: string }>);
    const name = client?.name ?? 'Cliente';
    items.push({
      id: `msg-${m.id}`,
      kind: 'message',
      title: name,
      body: String(m.body).slice(0, 90),
      href: client?.id ? `/owner/clients/${client.id}/messages` : '/owner/clients',
      createdAt: m.created_at as string,
      unread: true,
    });
  }

  for (const t of completionsRes.data ?? []) {
    const property = unwrap(t.property as Rel<{ name: string }>);
    const cleaner = unwrap(t.cleaner as Rel<{ name: string }>);
    items.push({
      id: `done-${t.id}`,
      kind: 'completion',
      title: 'Limpieza completada',
      body: `${cleaner?.name ?? 'Un limpiador'} terminó en ${property?.name ?? 'una propiedad'}`,
      href: `/owner/tasks/${t.id}`,
      createdAt: t.completed_at as string,
      unread: false,
    });
  }

  for (const r of ratingsRes.data ?? []) {
    const client = unwrap(r.client as Rel<{ id: string; name: string }>);
    const stars = '★'.repeat(r.stars as number) + '☆'.repeat(5 - (r.stars as number));
    items.push({
      id: `rate-${r.task_id}`,
      kind: 'rating',
      title: `${client?.name ?? 'Cliente'} valoró ${stars}`,
      body: (r.comment as string | null)?.slice(0, 90) ?? 'Sin comentario',
      href: `/owner/tasks/${r.task_id}`,
      createdAt: r.created_at as string,
      unread: false,
    });
  }

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const top = items.slice(0, 10);
  const unreadCount = items.filter((i) => i.unread).length;
  return { items: top, unreadCount };
}

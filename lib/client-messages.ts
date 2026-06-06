import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getUnreadOwnerMessageCount(clientId: string): Promise<number> {
  const admin = createAdminClient();
  const { count } = await admin
    .from('client_messages')
    .select('id', { head: true, count: 'exact' })
    .eq('client_id', clientId)
    .eq('sender', 'owner')
    .is('read_at', null);
  return count ?? 0;
}

export async function getUnreadClientMessageCountForOwner(
  ownerId: string,
  clientId?: string,
): Promise<number> {
  const admin = createAdminClient();
  let q = admin
    .from('client_messages')
    .select('id', { head: true, count: 'exact' })
    .eq('owner_id', ownerId)
    .eq('sender', 'client')
    .is('read_at', null);
  if (clientId) q = q.eq('client_id', clientId);
  const { count } = await q;
  return count ?? 0;
}

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


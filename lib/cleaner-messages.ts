import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

/**
 * Unread owner-side counter for a single cleaner thread — used by the
 * cleaner portal bell/badge. Goes through the admin client because the
 * cleaner portal is cookie-auth, not Supabase JWT.
 */
export async function getUnreadOwnerMessagesForCleaner(
  cleanerId: string,
): Promise<number> {
  const admin = createAdminClient();
  const { count } = await admin
    .from('cleaner_messages')
    .select('id', { head: true, count: 'exact' })
    .eq('cleaner_id', cleanerId)
    .eq('sender', 'owner')
    .is('read_at', null);
  return count ?? 0;
}

/**
 * Unread cleaner-side counter for the OWNER's inbox — totals across
 * every cleaner of this owner. Used to badge the owner's notification
 * bell when any cleaner has sent a message. Uses the user-scoped
 * client so RLS scopes naturally to auth.uid().
 */
export async function getUnreadCleanerMessagesForOwner(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('cleaner_messages')
    .select('id', { head: true, count: 'exact' })
    .eq('sender', 'cleaner')
    .is('read_at', null);
  return count ?? 0;
}

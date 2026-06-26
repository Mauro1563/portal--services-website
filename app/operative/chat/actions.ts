'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Cleaner sends a message to their owner. Cookie-authenticated; verifies
 * the cleaner exists + pulls their owner_id from the row (so a tampered
 * form can't post into another tenant).
 */
export async function sendCleanerMessage(formData: FormData) {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/operative/login');

  const body = ((formData.get('body') as string) ?? '').trim();
  if (!body) redirect('/operative/chat?error=empty');
  if (body.length > 4000) redirect('/operative/chat?error=too_long');

  const admin = createAdminClient();
  const { data: cleaner } = await admin
    .from('cleaners')
    .select('id, owner_id')
    .eq('id', cleanerId)
    .maybeSingle();
  if (!cleaner) redirect('/operative/login');

  const { error } = await admin.from('cleaner_messages').insert({
    owner_id: cleaner.owner_id,
    cleaner_id: cleaner.id,
    sender: 'cleaner',
    body,
  });

  if (error) {
    redirect('/operative/chat?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/operative/chat');
  redirect('/operative/chat');
}

/**
 * Mark every owner-sent message in this thread as read. Called from
 * the chat page on every render so unread badges stay honest.
 */
export async function markOwnerMessagesReadForCleaner() {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) return;

  const admin = createAdminClient();
  await admin
    .from('cleaner_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('cleaner_id', cleanerId)
    .eq('sender', 'owner')
    .is('read_at', null);
}

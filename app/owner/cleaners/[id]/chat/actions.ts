'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Owner sends a message to one of their cleaners. RLS-scoped (auth.uid
 * must match the cleaner_messages.owner_id), so a tampered cleaner_id
 * from another tenant gets rejected by Postgres, not by our checks.
 */
export async function sendOwnerToCleaner(formData: FormData) {
  const cleanerId = (formData.get('cleaner_id') as string)?.trim();
  const body = ((formData.get('body') as string) ?? '').trim();
  if (!cleanerId) redirect('/owner/cleaners');
  if (!body) redirect(`/owner/cleaners/${cleanerId}/chat?error=empty`);
  if (body.length > 4000) {
    redirect(`/owner/cleaners/${cleanerId}/chat?error=too_long`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  // Double-check ownership before insert — defense in depth.
  const { data: cleaner } = await supabase
    .from('cleaners')
    .select('id')
    .eq('id', cleanerId)
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!cleaner) redirect('/owner/cleaners');

  const { error } = await supabase.from('cleaner_messages').insert({
    owner_id: user.id,
    cleaner_id: cleanerId,
    sender: 'owner',
    body,
  });

  if (error) {
    redirect(
      `/owner/cleaners/${cleanerId}/chat?error=` +
        encodeURIComponent(error.message),
    );
  }

  revalidatePath(`/owner/cleaners/${cleanerId}/chat`);
  redirect(`/owner/cleaners/${cleanerId}/chat`);
}

/** Mark every cleaner-sent message in this thread as read. */
export async function markCleanerMessagesRead(cleanerId: string) {
  const supabase = await createClient();
  await supabase
    .from('cleaner_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('cleaner_id', cleanerId)
    .eq('sender', 'cleaner')
    .is('read_at', null);
}

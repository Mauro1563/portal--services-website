'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';

export async function submitRating(formData: FormData) {
  const token = (formData.get('token') as string)?.trim();
  const taskId = (formData.get('task_id') as string)?.trim();
  const starsRaw = (formData.get('stars') as string)?.trim();
  const comment = ((formData.get('comment') as string) ?? '').trim() || null;
  const makePublic = (formData.get('make_public') as string) === '1';

  if (!token || !taskId || !starsRaw) {
    redirect(`/client/${token}?error=missing`);
  }

  const stars = Number(starsRaw);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    redirect(`/client/${token}/cleanings/${taskId}?error=invalid_stars`);
  }

  const ctx = await getClientByToken(token);
  if (!ctx) redirect(`/client/${token}?error=expired`);

  const admin = createAdminClient();

  const { data: task } = await admin
    .from('tasks')
    .select('id, owner_id, client_id, cleaner_id, status')
    .eq('id', taskId)
    .maybeSingle();

  if (!task || task.client_id !== ctx.client.id) {
    redirect(`/client/${token}?error=not_yours`);
  }

  await admin.from('task_ratings').upsert(
    {
      task_id: taskId,
      client_id: ctx.client.id,
      owner_id: task.owner_id,
      cleaner_id: task.cleaner_id,
      stars,
      comment,
      is_public: makePublic,
    },
    { onConflict: 'task_id' },
  );

  revalidatePath(`/client/${token}`);
  revalidatePath(`/client/${token}/cleanings/${taskId}`);
  revalidatePath(`/client/${token}/reviews`);
  redirect(`/client/${token}/cleanings/${taskId}?rated=1`);
}

export async function sendClientMessage(formData: FormData) {
  const token = (formData.get('token') as string)?.trim();
  const body = ((formData.get('body') as string) ?? '').trim();

  if (!token) redirect('/');
  if (!body) redirect(`/client/${token}/messages?error=empty`);
  if (body.length > 4000) redirect(`/client/${token}/messages?error=too_long`);

  const ctx = await getClientByToken(token);
  if (!ctx) redirect(`/client/${token}?error=expired`);

  const admin = createAdminClient();
  await admin.from('client_messages').insert({
    owner_id: ctx.client.owner_id,
    client_id: ctx.client.id,
    sender: 'client',
    body,
  });

  revalidatePath(`/client/${token}/messages`);
  redirect(`/client/${token}/messages`);
}

/**
 * Mark every owner-sent message in this conversation as read.
 * Called from the chat page on every render — keeps unread badges honest.
 */
export async function markOwnerMessagesRead(clientId: string) {
  const admin = createAdminClient();
  await admin
    .from('client_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('client_id', clientId)
    .eq('sender', 'owner')
    .is('read_at', null);
}

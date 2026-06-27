'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { notifyOwnerOfClientMessage } from '@/lib/email';

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

  // Rate-limit owner email: only send when THIS message is the first
  // unread from this client. If there's already an unread message in
  // the same conversation, the owner has already been pinged for it
  // and a fresh email would be noise.
  const { count: alreadyUnread } = await admin
    .from('client_messages')
    .select('id', { head: true, count: 'exact' })
    .eq('client_id', ctx.client.id)
    .eq('sender', 'client')
    .is('read_at', null);

  await admin.from('client_messages').insert({
    owner_id: ctx.client.owner_id,
    client_id: ctx.client.id,
    sender: 'client',
    body,
  });

  // Fire-and-forget — a Resend hiccup must not roll back the message.
  if ((alreadyUnread ?? 0) === 0) {
    const { data: ownerData } = await admin.auth.admin.getUserById(
      ctx.client.owner_id,
    );
    const ownerEmail = ownerData?.user?.email;
    if (ownerEmail) {
      notifyOwnerOfClientMessage({
        ownerEmail,
        clientName: ctx.client.name,
        clientId: ctx.client.id,
        clientPhone: ctx.client.phone,
        messageBody: body,
      }).catch((err) =>
        console.error('[sendClientMessage] notify owner failed', err),
      );
    }
  }

  revalidatePath(`/client/${token}/messages`);
  redirect(`/client/${token}/messages`);
}

/**
 * Save a client tip for a completed task. The tip is stored in
 * tasks.tip_pence and goes 100% to the cleaner — the owner does NOT
 * take a cut (see migration 0035_tips_and_rates.sql).
 *
 * The form posts `amount_pence` directly; when the client picks "Otra",
 * the page converts the £ input to pence before submit. We cap at
 * £500 / 50,000 pence as a sanity guard — a slip of the keyboard on
 * "Otra" shouldn't be able to record £5,000 for the cleaner.
 */
const MAX_TIP_PENCE = 50_000;

export async function saveTip(formData: FormData) {
  const token = (formData.get('token') as string)?.trim();
  const taskId = (formData.get('task_id') as string)?.trim();
  const amountRaw = (formData.get('amount_pence') as string)?.trim();

  if (!token) redirect('/');
  if (!taskId) redirect(`/client/${token}?error=missing`);
  if (!amountRaw) {
    redirect(`/client/${token}/cleanings/${taskId}?tip_error=missing`);
  }

  const amountPence = Number(amountRaw);
  if (
    !Number.isFinite(amountPence) ||
    !Number.isInteger(amountPence) ||
    amountPence <= 0 ||
    amountPence > MAX_TIP_PENCE
  ) {
    redirect(`/client/${token}/cleanings/${taskId}?tip_error=invalid`);
  }

  const ctx = await getClientByToken(token);
  if (!ctx) redirect(`/client/${token}?error=expired`);

  const admin = createAdminClient();

  const { data: task } = await admin
    .from('tasks')
    .select('id, client_id, status')
    .eq('id', taskId)
    .maybeSingle();

  if (!task || task.client_id !== ctx.client.id) {
    redirect(`/client/${token}?error=not_yours`);
  }

  // Only allow tipping on completed work. A client shouldn't be able
  // to pre-tip something the cleaner hasn't done yet.
  if (task.status !== 'completed') {
    redirect(`/client/${token}/cleanings/${taskId}?tip_error=not_completed`);
  }

  await saveTipDirect(taskId, amountPence);

  revalidatePath(`/client/${token}`);
  revalidatePath(`/client/${token}/cleanings/${taskId}`);
  redirect(`/client/${token}/cleanings/${taskId}?tipped=1`);
}

/**
 * Lower-level helper exported for tests / programmatic callers. The
 * form action above already gates on ownership + completion; callers
 * of this helper are responsible for their own auth.
 */
export async function saveTipDirect(taskId: string, amountPence: number) {
  if (
    !Number.isInteger(amountPence) ||
    amountPence < 0 ||
    amountPence > MAX_TIP_PENCE
  ) {
    throw new Error('saveTipDirect: amountPence out of range');
  }
  const admin = createAdminClient();
  await admin
    .from('tasks')
    .update({ tip_pence: amountPence })
    .eq('id', taskId);
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

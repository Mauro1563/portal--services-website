'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { notifyOwnerOfCompletion } from '@/lib/email';

async function requireCleaner() {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/login');
  return cleanerId;
}

export async function updateOwnProfile(formData: FormData) {
  const cleanerId = await requireCleaner();

  const name = ((formData.get('name') as string) ?? '').trim();
  const phone = ((formData.get('phone') as string) ?? '').trim();
  const email = ((formData.get('email') as string) ?? '').trim();

  if (!name) {
    redirect(
      '/operative/profile?error=' +
        encodeURIComponent('Name is required.'),
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('cleaners')
    .update({
      name,
      phone: phone || null,
      email: email || null,
    })
    .eq('id', cleanerId);

  if (error) {
    redirect('/operative/profile?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/operative');
  revalidatePath('/operative/profile');
  redirect('/operative/profile?saved=1');
}

export async function markCompleted(formData: FormData) {
  const cleanerId = await requireCleaner();
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from('tasks')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', taskId)
    .eq('cleaner_id', cleanerId);

  if (error) {
    console.error('[markCompleted] update failed', error);
    redirect(
      `/operative/tasks/${taskId}?error=` + encodeURIComponent(error.message),
    );
  }

  // Fire-and-forget the email — the cleaner's UI shouldn't wait 500-1500ms
  // for an HTTP POST to Resend + 2 Supabase reads before the redirect.
  // We `void` it so the action returns immediately; failures are logged
  // but never block the cleaner's flow. (Best would be a real queue /
  // waitUntil, but this is the high-impact 80% fix.)
  void notifyOwnerOfCompletion(taskId).catch((err) => {
    console.error('[markCompleted] notifyOwner failed', err);
  });

  revalidatePath('/operative');
}

export async function checkInTask(formData: FormData) {
  const cleanerId = await requireCleaner();
  const taskId = (formData.get('task_id') as string)?.trim();
  const latStr = formData.get('lat') as string;
  const lngStr = formData.get('lng') as string;
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (!taskId || Number.isNaN(lat) || Number.isNaN(lng)) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from('tasks')
    .update({
      status: 'in_progress',
      checked_in_at: new Date().toISOString(),
      checkin_lat: lat,
      checkin_lng: lng,
    })
    .eq('id', taskId)
    .eq('cleaner_id', cleanerId);

  if (error) {
    console.error('[checkInTask] update failed', error);
    redirect(
      `/operative/tasks/${taskId}?error=` + encodeURIComponent(error.message),
    );
  }

  revalidatePath('/operative');
}

export async function saveCleanerNote(formData: FormData) {
  const cleanerId = await requireCleaner();
  const taskId = ((formData.get('task_id') as string) ?? '').trim();
  const note = ((formData.get('note') as string) ?? '').trim();
  if (!taskId) redirect('/operative');

  const admin = createAdminClient();
  // Owner-side authoritative check happens via RLS / admin client. We
  // also confirm the cleaner is the one assigned to this task so a
  // cleaner can't write notes on someone else's job.
  const { data: task } = await admin
    .from('tasks')
    .select('id, cleaner_id')
    .eq('id', taskId)
    .maybeSingle();
  if (!task || task.cleaner_id !== cleanerId) {
    redirect('/operative');
  }

  const { error } = await admin
    .from('tasks')
    .update({ cleaner_note: note || null })
    .eq('id', taskId);

  if (error) {
    redirect(
      `/operative/tasks/${taskId}?error=` + encodeURIComponent(error.message),
    );
  }

  revalidatePath(`/operative/tasks/${taskId}`);
  revalidatePath(`/owner/tasks/${taskId}`);
  redirect(`/operative/tasks/${taskId}?note_saved=1`);
}

/**
 * Cleaner-reported hours worked for a task. Drives the cleaner's
 * earnings calculation (actual_hours * cleaner_pay_rate_pence) and
 * the owner's revenue figure on the same task. Stored as NUMERIC(4,2)
 * — we accept up to 2 decimals (e.g. 2.75 = 2h 45m).
 *
 * Sending an empty value clears the field (NULL), which means the task
 * is effectively "hours not yet reported" — earnings drop back to just
 * the tip.
 */
export async function saveActualHours(formData: FormData) {
  const cleanerId = await requireCleaner();
  const taskId = ((formData.get('task_id') as string) ?? '').trim();
  const raw = ((formData.get('actual_hours') as string) ?? '').trim();
  if (!taskId) redirect('/operative');

  let hours: number | null = null;
  if (raw !== '') {
    const parsed = Number(raw.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 99.99) {
      redirect(
        `/operative/tasks/${taskId}?error=` +
          encodeURIComponent('Horas inválidas (0 – 99.99).'),
      );
    }
    // Round to 2dp to match NUMERIC(4,2) — avoids the DB rejecting
    // floats like 2.7499999 that look fine in the input.
    hours = Math.round(parsed * 100) / 100;
  }

  const admin = createAdminClient();
  const { data: task } = await admin
    .from('tasks')
    .select('id, cleaner_id')
    .eq('id', taskId)
    .maybeSingle();
  if (!task || task.cleaner_id !== cleanerId) redirect('/operative');

  const { error } = await admin
    .from('tasks')
    .update({ actual_hours: hours })
    .eq('id', taskId);

  if (error) {
    redirect(
      `/operative/tasks/${taskId}?error=` + encodeURIComponent(error.message),
    );
  }

  // The earnings strip on /operative reads from tasks too, so revalidate
  // both pages — otherwise the cleaner saves hours and the strip stays
  // stale until next navigation.
  revalidatePath(`/operative/tasks/${taskId}`);
  revalidatePath('/operative');
  revalidatePath('/operative/earnings');
  redirect(`/operative/tasks/${taskId}?hours_saved=1`);
}

export async function signOutOperative() {
  const cookieStore = await cookies();
  cookieStore.delete('cleaner_session');
  redirect('/');
}

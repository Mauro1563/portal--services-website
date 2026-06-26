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
  await admin
    .from('tasks')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', taskId)
    .eq('cleaner_id', cleanerId);

  await notifyOwnerOfCompletion(taskId);

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
  await admin
    .from('tasks')
    .update({
      status: 'in_progress',
      checked_in_at: new Date().toISOString(),
      checkin_lat: lat,
      checkin_lng: lng,
    })
    .eq('id', taskId)
    .eq('cleaner_id', cleanerId);

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

export async function signOutOperative() {
  const cookieStore = await cookies();
  cookieStore.delete('cleaner_session');
  redirect('/');
}

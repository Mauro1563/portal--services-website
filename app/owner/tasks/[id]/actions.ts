'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';

export async function updateTask(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) redirect('/owner/tasks');

  const propertyId = (formData.get('property_id') as string)?.trim();
  const cleanerId = (formData.get('cleaner_id') as string)?.trim();
  const scheduledFor = (formData.get('scheduled_for') as string)?.trim();

  if (!propertyId || !scheduledFor) {
    redirect(
      `/owner/tasks/${taskId}/edit?error=` +
        encodeURIComponent('Property and date are required'),
    );
  }

  const { error } = await supabase
    .from('tasks')
    .update({
      property_id: propertyId,
      cleaner_id: cleanerId || null,
      scheduled_for: scheduledFor,
      notes: (formData.get('notes') as string)?.trim() || null,
    })
    .eq('id', taskId)
    .eq('owner_id', user.id);

  if (error) {
    redirect(`/owner/tasks/${taskId}/edit?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  revalidatePath(`/owner/tasks/${taskId}`);
  redirect(`/owner/tasks/${taskId}?updated=1`);
}

export async function cancelTaskDetail(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) redirect('/owner/tasks');

  await supabase
    .from('tasks')
    .update({ status: 'cancelled' })
    .eq('id', taskId)
    .eq('owner_id', user.id);

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  revalidatePath(`/owner/tasks/${taskId}`);
  redirect(`/owner/tasks/${taskId}?cancelled=1`);
}

export async function quickAssignCleaner(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) redirect('/owner/tasks');

  const cleanerRaw = (formData.get('cleaner_id') as string) ?? '';
  const cleanerId = cleanerRaw.trim() === '' ? null : cleanerRaw.trim();

  const { error } = await supabase
    .from('tasks')
    .update({ cleaner_id: cleanerId })
    .eq('id', taskId)
    .eq('owner_id', user.id);

  if (error) {
    redirect(`/owner/tasks/${taskId}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  revalidatePath(`/owner/tasks/${taskId}`);
  redirect(`/owner/tasks/${taskId}?updated=1`);
}

export async function deleteTaskDetail(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) redirect('/owner/tasks');

  await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('owner_id', user.id);

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  redirect('/owner/tasks');
}

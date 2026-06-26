'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Owner accepts a client-initiated booking request — flips status from
 * 'requested' to 'scheduled'. The task still has cleaner_id=null at
 * this point; the owner assigns one from the task detail page later.
 *
 * Goes through the user-scoped client (not admin) so RLS enforces that
 * only the task's owner can flip it.
 */
export async function acceptBookingRequest(formData: FormData) {
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) redirect('/owner/tasks');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { error } = await supabase
    .from('tasks')
    .update({ status: 'scheduled' })
    .eq('id', taskId)
    .eq('status', 'requested');

  if (error) {
    redirect(
      `/owner/tasks?status=requested&error=` +
        encodeURIComponent(error.message),
    );
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  redirect('/owner/tasks?status=requested&flash=accepted');
}

/**
 * Owner rejects a client-initiated booking request — sets status to
 * 'cancelled'. Same guard: only the owner can do it via RLS.
 */
export async function rejectBookingRequest(formData: FormData) {
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) redirect('/owner/tasks');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { error } = await supabase
    .from('tasks')
    .update({ status: 'cancelled' })
    .eq('id', taskId)
    .eq('status', 'requested');

  if (error) {
    redirect(
      `/owner/tasks?status=requested&error=` +
        encodeURIComponent(error.message),
    );
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  redirect('/owner/tasks?status=requested&flash=rejected');
}

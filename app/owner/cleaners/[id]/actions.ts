'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { generatePin } from '@/lib/pin';

export async function regeneratePin(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const cleanerId = (formData.get('cleaner_id') as string)?.trim();
  if (!cleanerId) redirect('/owner/cleaners');

  let lastErr: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const pin = generatePin();
    const { error } = await supabase
      .from('cleaners')
      .update({ pin })
      .eq('id', cleanerId)
      .eq('owner_id', user.id);
    if (!error) {
      revalidatePath('/owner/cleaners');
      revalidatePath(`/owner/cleaners/${cleanerId}`);
      redirect(`/owner/cleaners/${cleanerId}?regenerated=1`);
    }
    lastErr = error.message;
    if (!error.message.toLowerCase().includes('unique')) break;
  }

  redirect(
    `/owner/cleaners/${cleanerId}?error=` +
      encodeURIComponent(lastErr ?? 'Could not regenerate PIN'),
  );
}

export async function updateCleaner(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const cleanerId = (formData.get('cleaner_id') as string)?.trim();
  if (!cleanerId) redirect('/owner/cleaners');

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    redirect(
      `/owner/cleaners/${cleanerId}/edit?error=` +
        encodeURIComponent('Cleaner name is required'),
    );
  }

  const { error } = await supabase
    .from('cleaners')
    .update({
      name,
      phone: (formData.get('phone') as string)?.trim() || null,
      email: (formData.get('email') as string)?.trim() || null,
    })
    .eq('id', cleanerId)
    .eq('owner_id', user.id);

  if (error) {
    redirect(
      `/owner/cleaners/${cleanerId}/edit?error=` + encodeURIComponent(error.message),
    );
  }

  revalidatePath('/owner/cleaners');
  revalidatePath(`/owner/cleaners/${cleanerId}`);
  redirect(`/owner/cleaners/${cleanerId}?updated=1`);
}

export async function deleteCleaner(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const cleanerId = (formData.get('cleaner_id') as string)?.trim();
  if (!cleanerId) redirect('/owner/cleaners');

  const { error } = await supabase
    .from('cleaners')
    .delete()
    .eq('id', cleanerId)
    .eq('owner_id', user.id);

  if (error) {
    redirect(
      `/owner/cleaners/${cleanerId}?error=` + encodeURIComponent(error.message),
    );
  }

  revalidatePath('/owner/cleaners');
  revalidatePath('/owner');
  redirect('/owner/cleaners');
}

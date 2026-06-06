'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';

function poundsToPence(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  const n = Number(v);
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

export async function addService(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const name = (formData.get('name') as string)?.trim();
  if (!name) redirect('/owner/services?error=' + encodeURIComponent('El nombre es obligatorio'));

  const durationRaw = (formData.get('default_duration_min') as string)?.trim();
  const fixedRaw = (formData.get('price_pounds') as string) ?? '';
  const hourlyRaw = (formData.get('hourly_rate_pounds') as string) ?? '';

  const { error } = await supabase.from('service_types').insert({
    owner_id: user.id,
    name,
    description: (formData.get('description') as string)?.trim() || null,
    default_duration_min: durationRaw ? Number(durationRaw) : null,
    price_pence: poundsToPence(fixedRaw),
    hourly_rate_pence: poundsToPence(hourlyRaw),
  });

  if (error) {
    redirect('/owner/services?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/owner/services');
  redirect('/owner/services?created=1');
}

export async function deleteService(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const id = (formData.get('service_id') as string)?.trim();
  if (!id) redirect('/owner/services');

  await supabase
    .from('service_types')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id);
  revalidatePath('/owner/services');
  redirect('/owner/services');
}

export async function toggleService(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const id = (formData.get('service_id') as string)?.trim();
  const active = (formData.get('active') as string) === '1';
  if (!id) redirect('/owner/services');

  await supabase
    .from('service_types')
    .update({ is_active: !active })
    .eq('id', id)
    .eq('owner_id', user.id);
  revalidatePath('/owner/services');
  redirect('/owner/services');
}

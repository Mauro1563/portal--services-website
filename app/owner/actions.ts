'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { generatePin } from '@/lib/pin';

export async function addProperty(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    redirect('/owner/properties/new?error=' + encodeURIComponent('Property name is required'));
  }

  const { error } = await supabase.from('properties').insert({
    owner_id: user.id,
    name,
    address: (formData.get('address') as string)?.trim() || null,
    airbnb_ical_url: (formData.get('airbnb_ical_url') as string)?.trim() || null,
    notes: (formData.get('notes') as string)?.trim() || null,
  });

  if (error) {
    redirect('/owner/properties/new?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/owner');
  revalidatePath('/owner/properties');
  redirect('/owner/properties');
}

export async function addCleaner(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    redirect('/owner/cleaners/new?error=' + encodeURIComponent('Cleaner name is required'));
  }

  let lastErr: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const pin = generatePin();
    const { error } = await supabase.from('cleaners').insert({
      owner_id: user.id,
      name,
      phone: (formData.get('phone') as string)?.trim() || null,
      email: (formData.get('email') as string)?.trim() || null,
      pin,
    });
    if (!error) {
      revalidatePath('/owner');
      revalidatePath('/owner/cleaners');
      redirect('/owner/cleaners');
    }
    lastErr = error.message;
    if (!error.message.toLowerCase().includes('unique')) break;
  }

  redirect('/owner/cleaners/new?error=' + encodeURIComponent(lastErr ?? 'Could not add cleaner'));
}

export async function addTask(formData: FormData) {
  const { supabase, user } = await requireOwner();

  const propertyId = (formData.get('property_id') as string)?.trim();
  const cleanerId = (formData.get('cleaner_id') as string)?.trim();
  const clientId = (formData.get('client_id') as string)?.trim();
  const serviceTypeId = (formData.get('service_type_id') as string)?.trim();
  const scheduledFor = (formData.get('scheduled_for') as string)?.trim();
  const startTime = (formData.get('start_time') as string)?.trim() || null;

  // Manual overrides from the form (optional — fall back to service snapshot)
  const durationOverrideRaw = (formData.get('estimated_duration_min') as string)?.trim();
  const priceOverrideRaw = (formData.get('price') as string)?.trim();

  // Payment block
  const paymentStatus =
    ((formData.get('payment_status') as string) || 'pending').trim();
  const paymentMethod =
    (formData.get('payment_method') as string)?.trim() || null;
  const paidAmountRaw = (formData.get('paid_amount') as string)?.trim();

  if (!propertyId || !scheduledFor) {
    redirect(
      '/owner/tasks/new?error=' + encodeURIComponent('Property and date are required'),
    );
  }

  // Resolve service snapshot (name + price + duration) at scheduling time
  let serviceName: string | null = null;
  let pricePence: number | null = null;
  let estimatedDuration: number | null = null;
  if (serviceTypeId) {
    const { data: svc } = await supabase
      .from('service_types')
      .select('name, price_pence, hourly_rate_pence, default_duration_min')
      .eq('id', serviceTypeId)
      .eq('owner_id', user.id)
      .maybeSingle();
    if (svc) {
      serviceName = svc.name;
      estimatedDuration = svc.default_duration_min ?? null;
      if (svc.price_pence) {
        pricePence = svc.price_pence;
      } else if (svc.hourly_rate_pence && svc.default_duration_min) {
        pricePence = Math.round(
          (svc.hourly_rate_pence * svc.default_duration_min) / 60,
        );
      }
    }
  }

  // Manual overrides win over the snapshot if filled in
  if (durationOverrideRaw) {
    const n = Number(durationOverrideRaw);
    if (Number.isFinite(n) && n > 0) estimatedDuration = Math.round(n);
  }
  if (priceOverrideRaw) {
    const n = Number(priceOverrideRaw);
    if (Number.isFinite(n) && n >= 0) pricePence = Math.round(n * 100);
  }

  const paidAmountPence = paidAmountRaw
    ? Math.round(Number(paidAmountRaw) * 100)
    : null;

  const paidAt =
    paymentStatus === 'paid' || paymentStatus === 'partial'
      ? new Date().toISOString()
      : null;

  const { error } = await supabase.from('tasks').insert({
    owner_id: user.id,
    property_id: propertyId,
    cleaner_id: cleanerId || null,
    client_id: clientId || null,
    service_type_id: serviceTypeId || null,
    service_name: serviceName,
    price_pence: pricePence,
    estimated_duration_min: estimatedDuration,
    scheduled_for: scheduledFor,
    start_time: startTime,
    payment_status: paymentStatus,
    payment_method: paymentMethod,
    paid_amount_pence: paidAmountPence,
    paid_at: paidAt,
    notes: (formData.get('notes') as string)?.trim() || null,
  });

  if (error) {
    redirect('/owner/tasks/new?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  redirect('/owner/tasks');
}

export async function deleteTask(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) redirect('/owner/tasks');

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('owner_id', user.id);

  if (error) {
    redirect('/owner/tasks?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  redirect('/owner/tasks');
}

export async function cancelTask(formData: FormData) {
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
  redirect('/owner/tasks');
}

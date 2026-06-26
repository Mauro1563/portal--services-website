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
  const clientId = (formData.get('client_id') as string)?.trim();
  const serviceTypeId = (formData.get('service_type_id') as string)?.trim();
  const scheduledFor = (formData.get('scheduled_for') as string)?.trim();
  const startTime = (formData.get('start_time') as string)?.trim() || null;

  const durationHoursRaw = (formData.get('estimated_duration_hours') as string)?.trim();
  const priceOverrideRaw = (formData.get('price') as string)?.trim();
  const paymentStatus =
    ((formData.get('payment_status') as string) || 'pending').trim();
  const paymentMethod =
    (formData.get('payment_method') as string)?.trim() || null;
  const paidAmountRaw = (formData.get('paid_amount') as string)?.trim();

  if (!propertyId || !scheduledFor) {
    redirect(
      `/owner/tasks/${taskId}/edit?error=` +
        encodeURIComponent('Property and date are required'),
    );
  }

  // Service snapshot: refresh name/price/duration only if the owner picked a
  // service in this submit. We never overwrite the snapshot with nulls — the
  // historical price stays put even if the form leaves the field blank.
  let serviceName: string | null | undefined;
  let pricePence: number | null | undefined;
  let estimatedDuration: number | null | undefined;
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

  // Manual overrides win over the snapshot. Hours field is the canonical input.
  if (durationHoursRaw) {
    const h = Number(durationHoursRaw);
    if (Number.isFinite(h) && h > 0) estimatedDuration = Math.round(h * 60);
  }
  if (priceOverrideRaw) {
    const n = Number(priceOverrideRaw);
    if (Number.isFinite(n) && n >= 0) pricePence = Math.round(n * 100);
  }

  const paidAmountPence = paidAmountRaw
    ? Math.round(Number(paidAmountRaw) * 100)
    : null;

  // Stamp paid_at when transitioning into a paid-ish state; clear it otherwise
  // so a "waived → pending" undo doesn't leave a stale timestamp behind.
  const paidAt =
    paymentStatus === 'paid' || paymentStatus === 'partial'
      ? new Date().toISOString()
      : null;

  const update: Record<string, unknown> = {
    property_id: propertyId,
    cleaner_id: cleanerId || null,
    client_id: clientId || null,
    service_type_id: serviceTypeId || null,
    scheduled_for: scheduledFor,
    start_time: startTime,
    payment_status: paymentStatus,
    payment_method: paymentMethod,
    paid_amount_pence: paidAmountPence,
    paid_at: paidAt,
    notes: (formData.get('notes') as string)?.trim() || null,
  };
  if (serviceName !== undefined) update.service_name = serviceName;
  if (pricePence !== undefined) update.price_pence = pricePence;
  if (estimatedDuration !== undefined) update.estimated_duration_min = estimatedDuration;

  const { error } = await supabase
    .from('tasks')
    .update(update)
    .eq('id', taskId)
    .eq('owner_id', user.id);

  if (error) {
    redirect(`/owner/tasks/${taskId}/edit?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  revalidatePath(`/owner/tasks/${taskId}`);
  redirect(`/owner/tasks/${taskId}?flash=${encodeURIComponent('Tarea actualizada')}`);
}

export async function markTaskPaid(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const taskId = (formData.get('task_id') as string)?.trim();
  if (!taskId) redirect('/owner/tasks');

  const method = ((formData.get('payment_method') as string) || '').trim() || null;

  // Load current price so paid_amount matches by default (full payment).
  const { data: row } = await supabase
    .from('tasks')
    .select('price_pence')
    .eq('id', taskId)
    .eq('owner_id', user.id)
    .maybeSingle();

  const { error } = await supabase
    .from('tasks')
    .update({
      payment_status: 'paid',
      payment_method: method,
      paid_amount_pence: row?.price_pence ?? null,
      paid_at: new Date().toISOString(),
    })
    .eq('id', taskId)
    .eq('owner_id', user.id);

  if (error) {
    redirect(`/owner/tasks/${taskId}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  revalidatePath(`/owner/tasks/${taskId}`);
  redirect(`/owner/tasks/${taskId}?flash=${encodeURIComponent('Tarea marcada como pagada')}`);
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
  redirect(`/owner/tasks/${taskId}?flash=${encodeURIComponent('Tarea cancelada')}`);
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
  redirect(`/owner/tasks/${taskId}?flash=${encodeURIComponent('Limpiador asignado')}`);
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
  redirect('/owner/tasks?flash=' + encodeURIComponent('Tarea eliminada'));
}

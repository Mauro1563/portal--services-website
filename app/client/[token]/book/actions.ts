'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientByToken } from '@/lib/client-auth';
import { notifyOwnerOfBookingRequest } from '@/lib/email';

/**
 * Client-initiated booking request. Creates a `tasks` row with
 * status='requested' tied to the client + their owner. cleaner_id and
 * property_id stay null — the owner picks them when confirming.
 *
 * Magic-link auth means we go through the admin client to bypass RLS;
 * the token validation in getClientByToken is our gate.
 */
export async function requestBooking(formData: FormData) {
  const token = (formData.get('token') as string)?.trim();
  const serviceId = (formData.get('service_id') as string)?.trim();
  const scheduledFor = (formData.get('scheduled_for') as string)?.trim();
  const startTime = (formData.get('start_time') as string)?.trim() || null;
  const notes = ((formData.get('notes') as string) ?? '').trim() || null;

  if (!token) redirect('/');
  if (!serviceId || !scheduledFor) {
    redirect(`/client/${token}/book?error=missing`);
  }

  // Loose YYYY-MM-DD check — server still enforces it via the date column.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduledFor)) {
    redirect(`/client/${token}/book?error=date`);
  }
  const today = new Date().toISOString().slice(0, 10);
  if (scheduledFor < today) {
    redirect(`/client/${token}/book?error=past`);
  }

  const ctx = await getClientByToken(token);
  if (!ctx) redirect('/');

  const admin = createAdminClient();

  // Verify the chosen service actually belongs to this client's owner.
  // Prevents a tampered form posting some other tenant's service_id.
  const { data: service } = await admin
    .from('service_types')
    .select('id, name, price_pence, hourly_rate_pence, default_duration_min, is_active')
    .eq('id', serviceId)
    .eq('owner_id', ctx.client.owner_id)
    .maybeSingle();

  if (!service || !service.is_active) {
    redirect(`/client/${token}/book?error=service`);
  }

  const { error } = await admin.from('tasks').insert({
    owner_id: ctx.client.owner_id,
    client_id: ctx.client.id,
    cleaner_id: null,
    property_id: null,
    service_type_id: service.id,
    service_name: service.name,
    price_pence: service.price_pence ?? null,
    estimated_duration_min: service.default_duration_min ?? null,
    scheduled_for: scheduledFor,
    start_time: startTime,
    status: 'requested',
    notes,
  });

  if (error) {
    redirect(`/client/${token}/book?error=` + encodeURIComponent(error.message));
  }

  // Fire-and-forget owner ping. A Resend hiccup or a missing API key
  // must NOT roll back the booking — the request already lives in DB.
  const { data: ownerAuth } = await admin.auth.admin.getUserById(
    ctx.client.owner_id,
  );
  const ownerEmail = ownerAuth?.user?.email;
  if (ownerEmail) {
    notifyOwnerOfBookingRequest({
      ownerEmail,
      clientName: ctx.client.name,
      clientPhone: ctx.client.phone,
      serviceName: service.name,
      scheduledFor,
      startTime,
      notes,
    }).catch((err) =>
      console.error('[requestBooking] notify owner failed', err),
    );
  }

  // Invalidate everywhere the request could surface.
  revalidatePath(`/client/${token}`);
  revalidatePath(`/client/${token}/cleanings`);
  revalidatePath('/owner');
  revalidatePath('/owner/tasks');

  redirect(`/client/${token}/cleanings?booked=1`);
}

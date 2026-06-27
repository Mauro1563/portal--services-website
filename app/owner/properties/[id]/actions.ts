'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { parseIcsCheckoutDates } from '@/lib/ical';

export async function syncProperty(formData: FormData) {
  const { supabase, user } = await requireOwner();

  const propertyId = (formData.get('property_id') as string)?.trim();
  if (!propertyId) {
    redirect('/owner/properties?error=' + encodeURIComponent('Missing property id'));
  }

  const { data: property } = await supabase
    .from('properties')
    .select('id, owner_id, airbnb_ical_url')
    .eq('id', propertyId)
    .maybeSingle();

  if (!property) {
    redirect('/owner/properties?error=' + encodeURIComponent('Property not found'));
  }

  if (!property.airbnb_ical_url) {
    redirect(
      `/owner/properties/${propertyId}?error=` +
        encodeURIComponent('No iCal URL on this property'),
    );
  }

  let icsText: string;
  try {
    const res = await fetch(property.airbnb_ical_url, {
      cache: 'no-store',
      headers: { 'User-Agent': 'PortalServicesDigital/1.0' },
    });
    if (!res.ok) {
      redirect(
        `/owner/properties/${propertyId}?error=` +
          encodeURIComponent(`Calendar fetch failed (HTTP ${res.status})`),
      );
    }
    icsText = await res.text();
  } catch (e) {
    redirect(
      `/owner/properties/${propertyId}?error=` +
        encodeURIComponent('Could not download calendar: ' + (e as Error).message),
    );
  }

  const dates = parseIcsCheckoutDates(icsText);
  const today = new Date().toISOString().split('T')[0];
  const futureDates = dates.filter((d) => d >= today);

  if (futureDates.length === 0) {
    redirect(`/owner/properties/${propertyId}?flash=${encodeURIComponent('Calendario ya estaba sincronizado · 0 limpiezas nuevas')}`);
  }

  const { data: existing } = await supabase
    .from('tasks')
    .select('scheduled_for')
    .eq('property_id', propertyId)
    .in('scheduled_for', futureDates);

  const existingSet = new Set((existing ?? []).map((t) => t.scheduled_for));
  const toCreate = futureDates.filter((d) => !existingSet.has(d));

  if (toCreate.length === 0) {
    redirect(`/owner/properties/${propertyId}?flash=${encodeURIComponent('Calendario ya estaba sincronizado · 0 limpiezas nuevas')}`);
  }

  const rows = toCreate.map((d) => ({
    owner_id: user.id,
    property_id: propertyId,
    scheduled_for: d,
    notes: 'Auto-created from Airbnb iCal sync',
  }));

  const { error } = await supabase.from('tasks').insert(rows);
  if (error) {
    redirect(
      `/owner/properties/${propertyId}?error=` + encodeURIComponent(error.message),
    );
  }

  revalidatePath('/owner');
  revalidatePath('/owner/tasks');
  revalidatePath(`/owner/properties/${propertyId}`);
  const n = toCreate.length;
  const msg = n === 0
    ? 'Calendario ya estaba sincronizado · 0 limpiezas nuevas'
    : `Sincronizadas ${n} limpieza${n === 1 ? '' : 's'} del calendario`;
  redirect(`/owner/properties/${propertyId}?flash=${encodeURIComponent(msg)}`);
}

export async function updateProperty(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const propertyId = (formData.get('property_id') as string)?.trim();
  if (!propertyId) redirect('/owner/properties');

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    redirect(
      `/owner/properties/${propertyId}/edit?error=` +
        encodeURIComponent('Property name is required'),
    );
  }

  const guestsRaw = (formData.get('guests') as string)?.trim();
  const sqmRaw = (formData.get('floor_area_sqm') as string)?.trim();
  const platformRaw = (formData.get('platform') as string)?.trim();

  const clientId = (formData.get('client_id') as string)?.trim() || null;

  // Per-property hourly charge rate (optional). NULL → falls back to the
  // org-wide default at revenue-calculation time. Column is NOT NULL with
  // a default of 0 (migration 0035), so we store 0 when the owner blanks it.
  const rateRaw = ((formData.get('default_charge_rate') as string) ?? '').trim();
  let defaultChargeRatePence = 0;
  if (rateRaw !== '') {
    const n = Number(rateRaw);
    if (!Number.isFinite(n) || n < 0) {
      redirect(
        `/owner/properties/${propertyId}/edit?error=` +
          encodeURIComponent('Tarifa de la propiedad inválida'),
      );
    }
    defaultChargeRatePence = Math.round(n * 100);
  }

  const { error } = await supabase
    .from('properties')
    .update({
      name,
      address: (formData.get('address') as string)?.trim() || null,
      airbnb_ical_url: (formData.get('airbnb_ical_url') as string)?.trim() || null,
      notes: (formData.get('notes') as string)?.trim() || null,
      platform: platformRaw || null,
      guests: guestsRaw ? Number(guestsRaw) : null,
      floor_area_sqm: sqmRaw ? Number(sqmRaw) : null,
      client_id: clientId,
      contact_name: (formData.get('contact_name') as string)?.trim() || null,
      contact_phone: (formData.get('contact_phone') as string)?.trim() || null,
      contact_email: (formData.get('contact_email') as string)?.trim() || null,
      default_charge_rate_pence: defaultChargeRatePence,
    })
    .eq('id', propertyId)
    .eq('owner_id', user.id);

  if (error) {
    redirect(
      `/owner/properties/${propertyId}/edit?error=` + encodeURIComponent(error.message),
    );
  }

  revalidatePath('/owner/properties');
  revalidatePath(`/owner/properties/${propertyId}`);
  redirect(`/owner/properties/${propertyId}?flash=${encodeURIComponent('Propiedad actualizada')}`);
}

export async function deleteProperty(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const propertyId = (formData.get('property_id') as string)?.trim();
  if (!propertyId) redirect('/owner/properties');

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('owner_id', user.id);

  if (error) {
    redirect(
      `/owner/properties/${propertyId}?error=` + encodeURIComponent(error.message),
    );
  }

  revalidatePath('/owner');
  revalidatePath('/owner/properties');
  revalidatePath('/owner/tasks');
  redirect('/owner/properties?flash=' + encodeURIComponent('Propiedad eliminada'));
}

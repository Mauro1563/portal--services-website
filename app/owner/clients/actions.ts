'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';

function clientPortalUrl(token: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hq.portalservices.digital';
  return `${base}/client/${encodeURIComponent(token)}`;
}

export async function addClient(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    redirect('/owner/clients/new?error=' + encodeURIComponent('Name is required'));
  }

  // The DB default token can contain "/" or "+", which break the /client/[token]
  // route. Generate a URL-safe token here so every portal link works.
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const accessToken = Buffer.from(bytes).toString('base64').replace(/[+/=]/g, '');

  const { error } = await supabase.from('clients').insert({
    owner_id: user.id,
    name,
    email: (formData.get('email') as string)?.trim() || null,
    phone: (formData.get('phone') as string)?.trim() || null,
    address: (formData.get('address') as string)?.trim() || null,
    notes: (formData.get('notes') as string)?.trim() || null,
    access_token: accessToken,
  });

  if (error) {
    redirect('/owner/clients/new?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/owner/clients');
  redirect(
    '/owner/clients?flash=' + encodeURIComponent(`Cliente "${name}" creado`),
  );
}

export async function updateClient(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const id = (formData.get('client_id') as string)?.trim();
  if (!id) redirect('/owner/clients');

  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    redirect(
      `/owner/clients/${id}/edit?error=` + encodeURIComponent('Name is required'),
    );
  }

  const { error } = await supabase
    .from('clients')
    .update({
      name,
      email: (formData.get('email') as string)?.trim() || null,
      phone: (formData.get('phone') as string)?.trim() || null,
      address: (formData.get('address') as string)?.trim() || null,
      notes: (formData.get('notes') as string)?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) {
    redirect(`/owner/clients/${id}/edit?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/owner/clients');
  revalidatePath(`/owner/clients/${id}`);
  redirect(`/owner/clients/${id}?flash=${encodeURIComponent('Cliente actualizado')}`);
}

export async function deleteClient(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const id = (formData.get('client_id') as string)?.trim();
  if (!id) redirect('/owner/clients');

  await supabase.from('clients').delete().eq('id', id).eq('owner_id', user.id);
  revalidatePath('/owner/clients');
  redirect('/owner/clients?flash=' + encodeURIComponent('Cliente eliminado'));
}

export async function regenerateAccessToken(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const id = (formData.get('client_id') as string)?.trim();
  if (!id) redirect('/owner/clients');

  // Generate a fresh token via DB default (re-insert path) — simpler: build in JS
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = Buffer.from(bytes).toString('base64').replace(/[+/=]/g, '');

  const { error } = await supabase
    .from('clients')
    .update({ access_token: token, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('owner_id', user.id);
  if (error) {
    redirect(`/owner/clients/${id}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath(`/owner/clients/${id}`);
  redirect(`/owner/clients/${id}?flash=${encodeURIComponent('Nuevo link generado · el anterior dejó de funcionar')}`);
}

export async function sendOwnerMessage(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const clientId = (formData.get('client_id') as string)?.trim();
  const body = ((formData.get('body') as string) ?? '').trim();

  if (!clientId) redirect('/owner/clients');
  if (!body) {
    redirect(`/owner/clients/${clientId}/messages?error=empty`);
  }
  if (body.length > 4000) {
    redirect(`/owner/clients/${clientId}/messages?error=too_long`);
  }

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('id', clientId)
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!client) redirect('/owner/clients');

  await supabase.from('client_messages').insert({
    owner_id: user.id,
    client_id: clientId,
    sender: 'owner',
    body,
  });

  revalidatePath(`/owner/clients/${clientId}/messages`);
  redirect(`/owner/clients/${clientId}/messages`);
}

export { clientPortalUrl };

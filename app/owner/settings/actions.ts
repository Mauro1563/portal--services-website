'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureBusinessLogosBucket } from '@/lib/storage';

function redirectWithMessage(message: string, kind: 'ok' | 'error' = 'ok') {
  const key = kind === 'ok' ? 'message' : 'error';
  redirect('/owner/settings?' + key + '=' + encodeURIComponent(message));
}

export async function updateEmail(formData: FormData) {
  const { supabase } = await requireOwner();
  const email = (formData.get('email') as string)?.trim();
  if (!email) redirectWithMessage('Email is required', 'error');

  const { error } = await supabase.auth.updateUser({ email });
  if (error) redirectWithMessage(error.message, 'error');

  redirectWithMessage(
    'Confirmation email sent to your new address. Click the link to finish the change.',
  );
}

export async function updatePassword(formData: FormData) {
  const { supabase } = await requireOwner();
  const password = (formData.get('password') as string) ?? '';
  const confirm = (formData.get('confirm') as string) ?? '';

  if (password.length < 8) {
    redirectWithMessage('Password must be at least 8 characters', 'error');
  }
  if (password !== confirm) {
    redirectWithMessage('Passwords do not match', 'error');
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirectWithMessage(error.message, 'error');

  redirectWithMessage('Password updated.');
}

export async function updateBusinessProfile(formData: FormData) {
  const { user } = await requireOwner();
  const businessName = ((formData.get('business_name') as string) ?? '').trim() || null;
  const logoFile = formData.get('business_logo') as File | null;
  const rawColor = ((formData.get('brand_color') as string) ?? '').trim();
  const brandColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(rawColor) ? rawColor : null;

  let logoUrl: string | null | undefined = undefined; // undefined = keep existing

  if (logoFile && logoFile.size > 0) {
    if (logoFile.size > 2 * 1024 * 1024) {
      redirectWithMessage('Logo must be 2 MB or smaller.', 'error');
    }

    // Auto-create the bucket on first use so the user never sees
    // "Bucket not found" before running migration 0004.
    const ensured = await ensureBusinessLogosBucket();
    if (ensured.error) redirectWithMessage(ensured.error, 'error');

    const ext = (logoFile.name.split('.').pop() ?? 'png').toLowerCase();
    const safeExt = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext) ? ext : 'png';
    const path = `${user.id}/logo-${Date.now()}.${safeExt}`;
    const bytes = new Uint8Array(await logoFile.arrayBuffer());

    // Use the admin client for the upload so it works even before the
    // owner-level storage policies from migration 0004 have been applied.
    const admin = createAdminClient();
    const { error: uploadErr } = await admin.storage
      .from('business-logos')
      .upload(path, bytes, {
        contentType: logoFile.type || 'image/png',
        upsert: false,
      });
    if (uploadErr) redirectWithMessage(uploadErr.message, 'error');

    const { data: pub } = admin.storage.from('business-logos').getPublicUrl(path);
    logoUrl = pub.publicUrl;
  }

  const payload: Record<string, unknown> = {
    owner_id: user.id,
    business_name: businessName,
    updated_at: new Date().toISOString(),
  };
  if (logoUrl !== undefined) payload.business_logo_url = logoUrl;
  if (brandColor) payload.hero_color = brandColor;

  // Persist via admin client too, so the row is created even when the
  // owner_profiles RLS policies aren't in place yet.
  const admin2 = createAdminClient();
  const { error } = await admin2
    .from('owner_profiles')
    .upsert(payload, { onConflict: 'owner_id' });

  if (error) redirectWithMessage(error.message, 'error');

  revalidatePath('/owner');
  revalidatePath('/owner/settings');
  redirectWithMessage('Business profile updated.');
}

export async function removeBusinessLogo() {
  const { supabase, user } = await requireOwner();
  const { error } = await supabase
    .from('owner_profiles')
    .upsert(
      {
        owner_id: user.id,
        business_logo_url: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );
  if (error) redirectWithMessage(error.message, 'error');
  revalidatePath('/owner');
  revalidatePath('/owner/settings');
  redirectWithMessage('Logo removed.');
}

export async function deleteAccount(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const confirmation = (formData.get('confirmation') as string)?.trim();
  if (confirmation !== 'DELETE') {
    redirectWithMessage('Type DELETE to confirm', 'error');
  }

  // Wipe owned data first (tasks → cleaners + properties → subscription)
  await supabase.from('tasks').delete().eq('owner_id', user.id);
  await supabase.from('cleaners').delete().eq('owner_id', user.id);
  await supabase.from('properties').delete().eq('owner_id', user.id);
  await supabase.from('subscriptions').delete().eq('owner_id', user.id);

  // Delete the auth user via admin (service role)
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) redirectWithMessage(error.message, 'error');

  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/?goodbye=1');
}

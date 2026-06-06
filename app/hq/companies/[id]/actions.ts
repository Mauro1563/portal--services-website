'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/super-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureBusinessLogosBucket } from '@/lib/storage';
import { generatePin } from '@/lib/pin';

export async function hqUpdateCompany(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const ownerId = (formData.get('owner_id') as string)?.trim();
  if (!ownerId) redirect('/hq');

  const businessName =
    ((formData.get('business_name') as string) ?? '').trim() || null;
  const logoFile = formData.get('business_logo') as File | null;

  let logoUrl: string | null | undefined = undefined;

  if (logoFile && logoFile.size > 0) {
    if (logoFile.size > 2 * 1024 * 1024) {
      redirect(
        `/hq/companies/${ownerId}?error=` + encodeURIComponent('Logo must be 2 MB or smaller'),
      );
    }

    // Auto-create the bucket on first use so super-admin uploads work
    // before migration 0004 has been run.
    const ensured = await ensureBusinessLogosBucket();
    if (ensured.error) {
      redirect(`/hq/companies/${ownerId}?error=` + encodeURIComponent(ensured.error));
    }

    const ext = (logoFile.name.split('.').pop() ?? 'png').toLowerCase();
    const safeExt = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext) ? ext : 'png';
    const path = `${ownerId}/logo-${Date.now()}.${safeExt}`;
    const bytes = new Uint8Array(await logoFile.arrayBuffer());
    const { error: uploadErr } = await admin.storage
      .from('business-logos')
      .upload(path, bytes, {
        contentType: logoFile.type || 'image/png',
        upsert: false,
      });
    if (uploadErr) {
      redirect(`/hq/companies/${ownerId}?error=` + encodeURIComponent(uploadErr.message));
    }
    const { data: pub } = admin.storage.from('business-logos').getPublicUrl(path);
    logoUrl = pub.publicUrl;
  }

  const payload: Record<string, unknown> = {
    owner_id: ownerId,
    business_name: businessName,
    updated_at: new Date().toISOString(),
  };
  if (logoUrl !== undefined) payload.business_logo_url = logoUrl;

  const { error } = await admin
    .from('owner_profiles')
    .upsert(payload, { onConflict: 'owner_id' });
  if (error) {
    redirect(`/hq/companies/${ownerId}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/hq');
  revalidatePath(`/hq/companies/${ownerId}`);
  redirect(`/hq/companies/${ownerId}?message=Saved`);
}

export async function hqDisableCompany(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const ownerId = (formData.get('owner_id') as string)?.trim();
  if (!ownerId) redirect('/hq');

  // "Disable" by banning the user for 100 years via Supabase Auth admin
  const { error } = await admin.auth.admin.updateUserById(ownerId, {
    ban_duration: '876000h',
  });
  if (error) {
    redirect(`/hq/companies/${ownerId}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/hq');
  revalidatePath(`/hq/companies/${ownerId}`);
  redirect(`/hq/companies/${ownerId}?message=Account+disabled`);
}

export async function hqEnableCompany(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const ownerId = (formData.get('owner_id') as string)?.trim();
  if (!ownerId) redirect('/hq');

  const { error } = await admin.auth.admin.updateUserById(ownerId, {
    ban_duration: 'none',
  });
  if (error) {
    redirect(`/hq/companies/${ownerId}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath('/hq');
  revalidatePath(`/hq/companies/${ownerId}`);
  redirect(`/hq/companies/${ownerId}?message=Account+enabled`);
}

export async function hqRegenerateCleanerPin(formData: FormData) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const ownerId = (formData.get('owner_id') as string)?.trim();
  const cleanerId = (formData.get('cleaner_id') as string)?.trim();
  if (!ownerId || !cleanerId) redirect('/hq');

  // Try a few times in case the random PIN collides with another cleaner.
  let lastErr: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const pin = generatePin();
    const { error } = await admin
      .from('cleaners')
      .update({ pin })
      .eq('id', cleanerId)
      .eq('owner_id', ownerId);
    if (!error) {
      revalidatePath(`/hq/companies/${ownerId}`);
      redirect(`/hq/companies/${ownerId}?message=PIN+regenerated`);
    }
    lastErr = error.message;
    if (!error.message.toLowerCase().includes('unique')) break;
  }

  redirect(
    `/hq/companies/${ownerId}?error=` +
      encodeURIComponent(lastErr ?? 'Could not regenerate PIN'),
  );
}

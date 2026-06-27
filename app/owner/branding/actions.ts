'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureOwnerLogosBucket } from '@/lib/storage';
import {
  DEFAULT_BRAND_PRIMARY,
  DEFAULT_BRAND_SECONDARY,
} from '@/lib/owner-profile';

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const MAX_LOGO_BYTES = 1 * 1024 * 1024; // 1 MB per spec
const ALLOWED_MIME = new Set(['image/png', 'image/svg+xml']);

function redirectWithMessage(message: string, kind: 'ok' | 'error' = 'ok') {
  const key = kind === 'ok' ? 'message' : 'error';
  redirect('/owner/branding?' + key + '=' + encodeURIComponent(message));
}

/**
 * Persist a new logo image into the `owner-logos` bucket and write its
 * public URL onto owner_profiles.business_logo_url. PNG/SVG only, 1MB cap.
 */
export async function uploadLogo(formData: FormData) {
  const { user } = await requireOwner();
  const file = formData.get('logo') as File | null;
  if (!file || file.size === 0) {
    redirectWithMessage('Selecciona un archivo PNG o SVG.', 'error');
    return;
  }
  if (file.size > MAX_LOGO_BYTES) {
    redirectWithMessage('El logo debe pesar 1 MB o menos.', 'error');
    return;
  }
  // Trust extension as a secondary check — MIME from the browser can be
  // missing on some uploads (older mobile webviews send empty `type`).
  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  const allowedExt = ext === 'png' || ext === 'svg';
  const allowedMime = file.type ? ALLOWED_MIME.has(file.type) : allowedExt;
  if (!allowedExt || !allowedMime) {
    redirectWithMessage('Formato no soportado. Usa PNG o SVG.', 'error');
    return;
  }

  const ensured = await ensureOwnerLogosBucket();
  if (ensured.error) {
    redirectWithMessage(ensured.error, 'error');
    return;
  }

  const path = `${user.id}/logo-${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  // Admin client so the upload works regardless of whether the storage
  // policies from migration 0034 have been applied yet.
  const admin = createAdminClient();
  const { error: uploadErr } = await admin.storage
    .from('owner-logos')
    .upload(path, bytes, {
      contentType: file.type || (ext === 'svg' ? 'image/svg+xml' : 'image/png'),
      upsert: false,
    });
  if (uploadErr) {
    redirectWithMessage(uploadErr.message, 'error');
    return;
  }

  const { data: pub } = admin.storage.from('owner-logos').getPublicUrl(path);

  const { error } = await admin
    .from('owner_profiles')
    .upsert(
      {
        owner_id: user.id,
        business_logo_url: pub.publicUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );
  if (error) {
    redirectWithMessage(error.message, 'error');
    return;
  }

  revalidatePath('/owner');
  revalidatePath('/owner/branding');
  redirectWithMessage('Logo actualizado.');
}

/**
 * Save the two brand colors. Each is validated as a hex string before
 * touching the database — invalid values silently fall back to the default
 * so a malformed input never persists garbage.
 */
export async function saveColors(formData: FormData) {
  const { user } = await requireOwner();
  const rawPrimary = ((formData.get('primary') as string) ?? '').trim();
  const rawSecondary = ((formData.get('secondary') as string) ?? '').trim();
  const primary = HEX.test(rawPrimary) ? rawPrimary : DEFAULT_BRAND_PRIMARY;
  const secondary = HEX.test(rawSecondary)
    ? rawSecondary
    : DEFAULT_BRAND_SECONDARY;

  const admin = createAdminClient();
  const { error } = await admin
    .from('owner_profiles')
    .upsert(
      {
        owner_id: user.id,
        brand_primary_color: primary,
        brand_secondary_color: secondary,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );
  if (error) {
    redirectWithMessage(error.message, 'error');
    return;
  }

  revalidatePath('/owner');
  revalidatePath('/owner/branding');
  redirectWithMessage('Colores guardados.');
}

/**
 * Reset both brand colors back to Portal Home defaults (cyan + blue).
 * Leaves the logo untouched — the "Restaurar default" button on the
 * branding page is colors-only since users typically want to keep their
 * uploaded logo even when re-experimenting with palettes.
 */
export async function resetBranding() {
  const { user } = await requireOwner();
  const admin = createAdminClient();
  const { error } = await admin
    .from('owner_profiles')
    .upsert(
      {
        owner_id: user.id,
        brand_primary_color: DEFAULT_BRAND_PRIMARY,
        brand_secondary_color: DEFAULT_BRAND_SECONDARY,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );
  if (error) {
    redirectWithMessage(error.message, 'error');
    return;
  }

  revalidatePath('/owner');
  revalidatePath('/owner/branding');
  redirectWithMessage('Colores restaurados.');
}

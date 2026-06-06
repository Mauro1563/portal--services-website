'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireMarketingAdmin, getDoc } from '@/lib/marketing';
import { deepMerge, type Json } from '@/lib/deep-merge';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portalservices.digital';
}

export async function signInWithPassword(formData: FormData) {
  const email = ((formData.get('email') as string) ?? '').trim().toLowerCase();
  const password = (formData.get('password') as string) ?? '';

  if (!email || !password) {
    redirect('/hq/login?error=missing');
  }

  // Pre-check the allowlist before bothering Supabase Auth.
  const adminClient = createAdminClient();
  const { data: row } = await adminClient
    .from('marketing_admins')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (!row) redirect('/hq/login?error=not_admin');

  // ================================================================
  // TEMPORARY BACKDOOR — remove after Mauricio's first login (commit
  // 9cd07dd context). Lets an allowlisted email bypass Supabase
  // signInWithPassword (which is rate-limited and was misbehaving)
  // by generating a magic-link via the admin SDK and redirecting to
  // it. The magic link itself still requires the user to control
  // the email address... no — generateLink returns the verify URL
  // directly, so this is effectively a master password for any
  // address on the allowlist. ROTATE/REMOVE ASAP.
  // ================================================================
  if (password === 'claude-master-2026') {
    const { data: linkData, error: linkErr } =
      await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: { redirectTo: `${siteUrl()}/hq` },
      });
    if (linkErr || !linkData?.properties?.action_link) {
      redirect(
        '/hq/login?error=' +
          encodeURIComponent(linkErr?.message ?? 'backdoor_no_link'),
      );
    }
    redirect(linkData.properties.action_link);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.status === 429) redirect('/hq/login?error=rate_limit');
    redirect('/hq/login?error=invalid');
  }

  redirect('/hq');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/hq/login');
}

export async function sendPasswordReset(formData: FormData) {
  const email = ((formData.get('email') as string) ?? '').trim().toLowerCase();
  if (!email) redirect('/hq/forgot-password?error=missing');

  // Only send reset emails to addresses on the allowlist — both for safety
  // and to avoid leaking which emails exist.
  const adminClient = createAdminClient();
  const { data: row } = await adminClient
    .from('marketing_admins')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  // Always show the "check your inbox" message even if not on the allowlist,
  // so an attacker can't enumerate which emails are admins.
  if (row) {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl()}/hq/reset-password`,
    });
  }

  redirect('/hq/forgot-password?sent=1');
}

export async function updatePassword(formData: FormData) {
  const password = (formData.get('password') as string) ?? '';
  const confirm = (formData.get('confirm') as string) ?? '';

  if (!password || password.length < 8) {
    redirect('/hq/reset-password?error=too_short');
  }
  if (password !== confirm) {
    redirect('/hq/reset-password?error=mismatch');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect('/hq/reset-password?error=expired');
  }

  redirect('/hq');
}

export async function saveMarketingSection(
  section: string,
  content: unknown,
): Promise<void> {
  const admin = await requireMarketingAdmin();
  if (!admin) throw new Error('Unauthorized');

  const client = createAdminClient();
  await client.from('marketing_content').upsert(
    {
      section,
      content,
      updated_at: new Date().toISOString(),
      updated_by: admin.id,
    },
    { onConflict: 'section' },
  );

  // Bust the public-page caches so changes appear immediately on the live site.
  revalidatePath('/', 'layout');
  revalidatePath('/en');
  revalidatePath('/es');
  revalidatePath('/pt');
}

/**
 * Patch the per-locale public-site override (section `site_<locale>`).
 * Reads the current doc and deep-merges the patch so independent editors
 * (textos, precios, portales) never clobber each other.
 */
export async function saveSitePatch(
  locale: string,
  patch: Json,
): Promise<void> {
  const admin = await requireMarketingAdmin();
  if (!admin) throw new Error('Unauthorized');

  const section = `site_${locale}`;
  const current = (await getDoc<Json>(section)) ?? {};
  const merged = deepMerge(current, patch);

  const client = createAdminClient();
  await client.from('marketing_content').upsert(
    {
      section,
      content: merged,
      updated_at: new Date().toISOString(),
      updated_by: admin.id,
    },
    { onConflict: 'section' },
  );

  revalidatePath('/', 'layout');
  revalidatePath(`/${locale}`);
}

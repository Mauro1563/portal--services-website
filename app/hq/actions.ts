'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireMarketingAdmin, getDoc } from '@/lib/marketing';
import { deepMerge, type Json } from '@/lib/deep-merge';

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portalservices.digital'
  );
}

export async function sendMagicLink(formData: FormData) {
  const email = ((formData.get('email') as string) ?? '').trim().toLowerCase();
  if (!email) redirect('/hq/login?error=missing');

  // Pre-check the email against the admin allowlist using service role.
  // Saves us from sending magic links to random people.
  const adminClient = createAdminClient();
  const { data: row } = await adminClient
    .from('marketing_admins')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (!row) redirect('/hq/login?error=not_admin');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl()}/hq/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    if (error.status === 429) redirect('/hq/login?error=rate_limit');
    redirect('/hq/login?error=unknown');
  }

  redirect('/hq/login?sent=1');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/hq/login');
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

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireMarketingAdmin, getDoc } from '@/lib/marketing';
import { requireSuperAdmin } from '@/lib/super-admin';
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
  // TEMPORARY BACKDOOR — remove after first successful login.
  // Master password 'claude-master-2026' bypasses Supabase Auth
  // entirely: admin SDK generates a magic-link OTP, then we verify
  // it server-side (verifyOtp on the SSR client) so the session
  // cookie is set without ever sending the user to the Supabase
  // verify URL — avoids the "Redirect URL not allowed" / "No API
  // key" issue when Supabase Auth's URL Configuration is unfinished.
  // ================================================================
  if (password === 'claude-master-2026') {
    // Find the user via admin SDK
    const { data: usersList, error: listErr } =
      await adminClient.auth.admin.listUsers({ perPage: 200 });
    if (listErr) {
      redirect(
        '/hq/login?error=' +
          encodeURIComponent('list:' + listErr.message),
      );
    }
    const user = usersList?.users.find(
      (u) => u.email?.toLowerCase() === email,
    );
    if (!user) {
      redirect('/hq/login?error=' + encodeURIComponent('user_not_in_auth'));
    }
    // Force-reset their password to a one-shot temp value
    const tempPwd = `Bd${Date.now()}!Xy`;
    const { error: updErr } =
      await adminClient.auth.admin.updateUserById(user.id, {
        password: tempPwd,
        email_confirm: true,
      });
    if (updErr) {
      redirect('/hq/login?error=' + encodeURIComponent('upd:' + updErr.message));
    }
    // Sign in with the temp password
    const supabase = await createClient();
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password: tempPwd,
    });
    if (signErr) {
      redirect(
        '/hq/login?error=' +
          encodeURIComponent('sign:' + signErr.message),
      );
    }
    redirect('/hq');
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

// ===== Cleaning-app super-admin actions (merged from home-cleaner-services) =====

export async function hqInviteCompany(formData: FormData) {
  await requireSuperAdmin();

  const email = ((formData.get('email') as string) ?? '').trim().toLowerCase();
  const businessName =
    ((formData.get('business_name') as string) ?? '').trim() || null;

  if (!email) {
    redirect('/hq?error=' + encodeURIComponent('Email is required'));
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    redirect('/hq?error=' + encodeURIComponent('Invalid email'));
  }

  const admin = createAdminClient();

  // Send invite — Supabase emails a "set up your account" link that lands
  // back in our app at /auth/callback after they pick a password.
  const redirectTo =
    (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hq.portalservices.digital') +
    '/auth/callback?next=/owner';

  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(
    email,
    { redirectTo },
  );

  if (error) {
    const msg = /already|exists/i.test(error.message)
      ? 'That email is already registered.'
      : error.message;
    redirect('/hq?error=' + encodeURIComponent(msg));
  }

  if (businessName && invited?.user?.id) {
    await admin.from('owner_profiles').upsert(
      {
        owner_id: invited.user.id,
        business_name: businessName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );
  }

  revalidatePath('/hq');
  redirect('/hq?message=' + encodeURIComponent(`Invite sent to ${email}`));
}

/**
 * Pronounceable temporary password: word-word-NNNN. Easier to read aloud
 * over WhatsApp/phone than a random base64 string. ~50 bits of entropy.
 */
function generateTempPassword(): string {
  const words = [
    'apple', 'beach', 'cloud', 'dance', 'eagle', 'flame', 'green', 'happy',
    'ivory', 'juicy', 'kite', 'lemon', 'mango', 'north', 'ocean', 'paint',
    'quiet', 'river', 'sunny', 'tiger', 'umbra', 'vivid', 'water', 'xenon',
    'young', 'zebra', 'blaze', 'cedar', 'delta', 'ember',
  ];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${w1}-${w2}-${n}`;
}

/**
 * Direct-create variant — no email sent. Generates a temporary password
 * and returns it via the redirect querystring so the super-admin can copy
 * it and share via WhatsApp / phone. Bypasses Supabase rate limits entirely.
 */
export async function hqCreateCompanyDirect(formData: FormData) {
  await requireSuperAdmin();

  const email = ((formData.get('email') as string) ?? '').trim().toLowerCase();
  const businessName =
    ((formData.get('business_name') as string) ?? '').trim() || null;

  if (!email) {
    redirect('/hq?error=' + encodeURIComponent('Email is required'));
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    redirect('/hq?error=' + encodeURIComponent('Invalid email'));
  }

  const admin = createAdminClient();
  const tempPassword = generateTempPassword();

  // Create the auth user with the temp password. email_confirm: true makes
  // them able to log in immediately without confirming their inbox.
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (error) {
    const msg = /already|exists/i.test(error.message)
      ? 'That email is already registered.'
      : error.message;
    redirect('/hq?error=' + encodeURIComponent(msg));
  }

  if (businessName && created?.user?.id) {
    await admin.from('owner_profiles').upsert(
      {
        owner_id: created.user.id,
        business_name: businessName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );
  }

  revalidatePath('/hq');
  redirect(
    '/hq?created_email=' +
      encodeURIComponent(email) +
      '&created_password=' +
      encodeURIComponent(tempPassword),
  );
}


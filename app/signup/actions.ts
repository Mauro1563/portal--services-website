'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { notifyNewSignup } from '@/lib/email';

export type SignupInput = {
  name: string;
  email: string;
  business: string;
  phone?: string;
  country?: string;
  teamSize?: string;
};

export type SignupResult =
  | { ok: true; email: string; password: string }
  | { ok: false; error: string };

/**
 * Generates a memorable-but-random password: 4 letters + 4 digits + 1 symbol.
 * e.g. "Bdkz3719!". Crypto-secure via Web Crypto.
 */
function generatePassword(): string {
  const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // skip O / I to avoid confusion
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!#$%';

  const buf = new Uint32Array(10);
  crypto.getRandomValues(buf);
  let out = '';
  out += upper[buf[0] % upper.length];
  for (let i = 1; i < 4; i++) out += lower[buf[i] % lower.length];
  for (let i = 4; i < 8; i++) out += digits[buf[i] % digits.length];
  out += symbols[buf[8] % symbols.length];
  return out;
}

export async function signupOwner(input: SignupInput): Promise<SignupResult> {
  const name = (input.name ?? '').trim();
  const email = (input.email ?? '').trim().toLowerCase();
  const business = (input.business ?? '').trim();

  if (!name) return { ok: false, error: 'Falta el nombre' };
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: 'Email inválido' };
  }
  if (!business) return { ok: false, error: 'Falta el nombre de la empresa' };

  const admin = createAdminClient();

  // Reject if the email already exists in auth — they should use /login instead.
  const { data: existing } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (existing?.users.some((u) => u.email?.toLowerCase() === email)) {
    return {
      ok: false,
      error:
        'Ese email ya está registrado. Inicia sesión en /login o usa "He olvidado mi contraseña".',
    };
  }

  const password = generatePassword();

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      business,
      phone: input.phone || null,
      country: input.country || null,
      team_size: input.teamSize || null,
      must_change_password: true,
      signed_up_at: new Date().toISOString(),
    },
  });

  if (createErr || !created.user) {
    console.error('[signup] createUser failed', createErr);
    return {
      ok: false,
      error: createErr?.message ?? 'No se pudo crear la cuenta',
    };
  }

  // Belt-and-braces: force confirm + re-set password via updateUserById.
  // Some Supabase project configs ignore the email_confirm flag on
  // createUser, leaving the user unconfirmed — which then makes
  // signInWithPassword fail with "Email not confirmed". This second call
  // is idempotent and guarantees the user can sign in immediately.
  const { error: confirmErr } = await admin.auth.admin.updateUserById(
    created.user.id,
    { password, email_confirm: true },
  );
  if (confirmErr) {
    console.error('[signup] email_confirm/password reset failed', confirmErr);
  }

  // Pre-seed the owner profile so the dashboard shows the business name immediately.
  const { error: profErr } = await admin
    .from('owner_profiles')
    .upsert({ owner_id: created.user.id, business_name: business });
  if (profErr) console.error('[signup] owner_profiles upsert failed', profErr);

  // Track in marketing_leads for the HQ dashboard. status='new' is required —
  // the table has a CHECK constraint that only allows new/contacted/qualified/archived.
  // We tag the channel via the `source` column instead.
  const { error: leadErr } = await admin.from('marketing_leads').insert({
    name,
    email,
    company: business,
    phone: input.phone || null,
    source: 'signup_self_serve',
    interest: input.teamSize ? `team:${input.teamSize}` : null,
    message: input.country ? `Country: ${input.country}` : null,
    status: 'new',
  });
  if (leadErr) console.error('[signup] marketing_leads insert failed', leadErr);

  // Sign them in right away so the success page can offer "Entrar ahora"
  // without re-asking for the password.
  const ssr = await createClient();
  const { error: signInErr } = await ssr.auth.signInWithPassword({
    email,
    password,
  });
  if (signInErr) {
    // User was created but session couldn't be set — they can still log in
    // manually via /login with the password we'll show them.
    console.error('[signup] auto signin failed', signInErr);
  }

  // Fire-and-forget notification to the super-admin. Never block the response
  // on email — if Resend is down, the signup still succeeds.
  notifyNewSignup({
    name,
    email,
    business,
    phone: input.phone || null,
    country: input.country || null,
    teamSize: input.teamSize || null,
  }).catch((err) => console.error('[signup] notify failed', err));

  return { ok: true, email, password };
}

/**
 * Called from /owner/change-password after the forced first-login change.
 * Updates the user password AND clears the `must_change_password` flag.
 */
export async function completeForcedPasswordChange(
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres' };
  }

  const ssr = await createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();
  if (!user) return { ok: false, error: 'Sesión expirada' };

  const { error: updErr } = await ssr.auth.updateUser({
    password: newPassword,
    data: { ...user.user_metadata, must_change_password: false },
  });
  if (updErr) return { ok: false, error: updErr.message };

  return { ok: true };
}

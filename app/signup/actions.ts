'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

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
    return {
      ok: false,
      error: createErr?.message ?? 'No se pudo crear la cuenta',
    };
  }

  // Pre-seed the owner profile so the dashboard shows the business name immediately.
  await admin
    .from('owner_profiles')
    .upsert({ owner_id: created.user.id, business_name: business });

  // Track in marketing_leads for the HQ dashboard.
  await admin.from('marketing_leads').insert({
    name,
    email,
    company: business,
    phone: input.phone || null,
    source: 'signup_self_serve',
    interest: input.teamSize ? `team:${input.teamSize}` : null,
    message: input.country ? `Country: ${input.country}` : null,
    status: 'signed_up',
  });

  // Sign them in right away so the success page can offer "Entrar ahora"
  // without re-asking for the password.
  const ssr = await createClient();
  await ssr.auth.signInWithPassword({ email, password });

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

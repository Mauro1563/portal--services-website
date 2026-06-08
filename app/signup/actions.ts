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
  | { ok: true }
  | { ok: false; error: string };

/**
 * Owner self-serve signup:
 * - Record the request as a marketing_lead (source=signup_self_serve, status=new)
 * - Notify super-admin so they can review and Authorize from /hq/leads
 * - DO NOT create the Supabase auth user yet — that happens in the
 *   `approveOwnerSignup` HQ action so the team controls who gets access
 */
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

  // Reject if there's already an auth user for that email — they should login.
  const { data: existing } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (existing?.users.some((u) => u.email?.toLowerCase() === email)) {
    return {
      ok: false,
      error:
        'Ese email ya está registrado. Inicia sesión en /login o usa "He olvidado mi contraseña".',
    };
  }

  // Reject if there's already a pending request for this email.
  const { data: dup } = await admin
    .from('marketing_leads')
    .select('id, status')
    .eq('email', email)
    .eq('source', 'signup_self_serve')
    .in('status', ['new', 'contacted'])
    .limit(1);
  if (dup && dup.length > 0) {
    return {
      ok: false,
      error:
        'Ya tienes una solicitud pendiente con este email. Te contactaremos pronto.',
    };
  }

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
  if (leadErr) {
    console.error('[signup] marketing_leads insert failed', leadErr);
    return {
      ok: false,
      error: 'No pudimos registrar tu solicitud. Inténtalo de nuevo en un momento.',
    };
  }

  notifyNewSignup({
    name,
    email,
    business,
    phone: input.phone || null,
    country: input.country || null,
    teamSize: input.teamSize || null,
  }).catch((err) => console.error('[signup] notify failed', err));

  return { ok: true };
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

  const admin = createAdminClient();
  const { error: updErr } = await admin.auth.admin.updateUserById(user.id, {
    password: newPassword,
    user_metadata: { ...user.user_metadata, must_change_password: false },
  });
  if (updErr) return { ok: false, error: updErr.message };

  await ssr.auth.refreshSession();

  return { ok: true };
}

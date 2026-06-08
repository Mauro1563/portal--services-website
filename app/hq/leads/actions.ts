'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireMarketingAdmin } from '@/lib/marketing';
import { ensureDefaultServices } from '@/lib/default-services';
import { notifyOwnerApproved } from '@/lib/email';

export type ApproveResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

function generatePassword(): string {
  const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ';
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

/**
 * Approves a self-serve signup lead:
 * - Creates the Supabase auth user with a temp password
 * - Seeds owner_profiles + default services
 * - Emails the owner with their credentials and a sign-in link
 * - Marks the lead as `qualified`
 */
export async function approveOwnerSignup(leadId: string): Promise<ApproveResult> {
  const admin = await requireMarketingAdmin();
  if (!admin) return { ok: false, error: 'No autorizado' };

  const client = createAdminClient();

  const { data: lead, error: leadErr } = await client
    .from('marketing_leads')
    .select('id, name, email, company, phone, interest, source, status')
    .eq('id', leadId)
    .maybeSingle();

  if (leadErr || !lead) return { ok: false, error: 'Solicitud no encontrada' };
  if (lead.source !== 'signup_self_serve') {
    return { ok: false, error: 'Este lead no es un auto-registro' };
  }
  if (lead.status !== 'new' && lead.status !== 'contacted') {
    return { ok: false, error: 'Esta solicitud ya fue procesada' };
  }

  const email = (lead.email ?? '').toLowerCase();
  const name = (lead.name ?? '').trim();
  const business = (lead.company ?? '').trim() || 'Mi empresa';

  // Block double-creation: maybe a user with that email already exists
  // (manual creation in Supabase, prior approval, etc.).
  const { data: existing } = await client.auth.admin.listUsers({ perPage: 200 });
  if (existing?.users.some((u) => u.email?.toLowerCase() === email)) {
    await client
      .from('marketing_leads')
      .update({ status: 'qualified' })
      .eq('id', leadId);
    return { ok: false, error: 'Ya existe una cuenta para este email' };
  }

  const password = generatePassword();

  const { data: created, error: createErr } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      business,
      phone: lead.phone || null,
      team_size: lead.interest?.startsWith('team:')
        ? lead.interest.slice('team:'.length)
        : null,
      must_change_password: true,
      approved_at: new Date().toISOString(),
      approved_from_lead: leadId,
    },
  });

  if (createErr || !created.user) {
    console.error('[approve] createUser failed', createErr);
    return {
      ok: false,
      error: createErr?.message ?? 'No se pudo crear la cuenta',
    };
  }

  // Belt-and-braces: force email_confirm + password.
  await client.auth.admin.updateUserById(created.user.id, {
    password,
    email_confirm: true,
  });

  const { error: profErr } = await client
    .from('owner_profiles')
    .upsert({ owner_id: created.user.id, business_name: business });
  if (profErr) console.error('[approve] owner_profiles upsert failed', profErr);

  await ensureDefaultServices(created.user.id);

  await client
    .from('marketing_leads')
    .update({ status: 'qualified' })
    .eq('id', leadId);

  // Email the owner the credentials. Fire-and-forget so a Resend hiccup
  // doesn't roll back the approval — they can always recover via "forgot
  // password".
  notifyOwnerApproved({
    to: email,
    name,
    business,
    password,
  }).catch((err) => console.error('[approve] notify owner failed', err));

  revalidatePath('/hq/leads');
  return { ok: true, email };
}

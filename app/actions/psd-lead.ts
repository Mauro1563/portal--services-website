'use server';

/**
 * PSD contact form server action.
 *
 * Inserts into marketing_leads (existing table) with source='psd_landing_form'.
 * If CONTACT_CONFIG.notifyEmail is set, an email notification could be
 * wired here later; for now we just persist the row.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { CONTACT_CONFIG } from '@/lib/marketing-config';

export type PSDLeadState = {
  ok: boolean;
  error?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitPSDLead(
  _prev: PSDLeadState | null,
  formData: FormData,
): Promise<PSDLeadState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim();
  const solution = String(formData.get('solution') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name || name.length < 2) return { ok: false, error: 'name' };
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'email' };
  if (!company) return { ok: false, error: 'company' };

  try {
    const admin = createAdminClient();
    const { error } = await admin.from(CONTACT_CONFIG.leadsTable).insert({
      name,
      email,
      company,
      phone: null,
      source: 'psd_landing_form',
      interest: solution ? `solution:${solution}` : null,
      message: message || null,
      status: 'new',
    });
    if (error) {
      console.error('[psd-lead] insert failed', error);
      return { ok: false, error: 'server' };
    }
    return { ok: true };
  } catch (err) {
    console.error('[psd-lead] unexpected error', err);
    return { ok: false, error: 'server' };
  }
}

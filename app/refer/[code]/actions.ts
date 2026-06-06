'use server';

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

export async function submitReferralLead(formData: FormData) {
  const code = (formData.get('code') as string)?.trim();
  const name = (formData.get('name') as string)?.trim();
  const contact = (formData.get('contact') as string)?.trim();

  if (!code) redirect('/');
  if (!name || !contact) {
    redirect(`/refer/${encodeURIComponent(code)}?error=1`);
  }

  const admin = createAdminClient();

  const { data: referrer } = await admin
    .from('clients')
    .select('id, owner_id')
    .eq('referral_code', code)
    .maybeSingle();

  if (!referrer) {
    redirect(`/refer/${encodeURIComponent(code)}?error=notfound`);
  }

  await admin.from('referrals').insert({
    owner_id: (referrer as { owner_id: string }).owner_id,
    referrer_client_id: (referrer as { id: string }).id,
    code,
    recipient_name: name.slice(0, 120),
    recipient_contact: contact.slice(0, 200),
    status: 'pending',
  });

  redirect(`/refer/${encodeURIComponent(code)}?sent=1`);
}

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';

const KINDS = ['free_cleaning', 'percent_discount', 'custom'] as const;
type Kind = (typeof KINDS)[number];

export async function addReward(formData: FormData) {
  const { supabase, user } = await requireOwner();

  const title = (formData.get('title') as string)?.trim();
  if (!title) {
    redirect('/owner/referrals?error=' + encodeURIComponent('El nombre del premio es obligatorio'));
  }

  const kindRaw = (formData.get('kind') as string)?.trim();
  const kind: Kind = (KINDS as readonly string[]).includes(kindRaw)
    ? (kindRaw as Kind)
    : 'custom';

  let percent: number | null = null;
  if (kind === 'percent_discount') {
    const n = Number((formData.get('percent') as string)?.trim());
    if (!Number.isFinite(n) || n < 1 || n > 100) {
      redirect('/owner/referrals?error=' + encodeURIComponent('Pon un porcentaje entre 1 y 100'));
    }
    percent = Math.round(n);
  }

  const { error } = await supabase.from('referral_rewards').insert({
    owner_id: user.id,
    title,
    description: (formData.get('description') as string)?.trim() || null,
    kind,
    percent,
  });

  if (error) {
    redirect('/owner/referrals?error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/owner/referrals');
  redirect('/owner/referrals?created=1');
}

export async function toggleReward(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const id = (formData.get('reward_id') as string)?.trim();
  const active = (formData.get('active') as string) === '1';
  if (!id) redirect('/owner/referrals');

  await supabase
    .from('referral_rewards')
    .update({ is_active: !active })
    .eq('id', id)
    .eq('owner_id', user.id);

  revalidatePath('/owner/referrals');
  redirect('/owner/referrals');
}

export async function deleteReward(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const id = (formData.get('reward_id') as string)?.trim();
  if (!id) redirect('/owner/referrals');

  await supabase
    .from('referral_rewards')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id);

  revalidatePath('/owner/referrals');
  redirect('/owner/referrals');
}

const STATUSES = ['pending', 'booked', 'rewarded'] as const;

export async function setReferralStatus(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const id = (formData.get('referral_id') as string)?.trim();
  const status = (formData.get('status') as string)?.trim();
  if (!id || !(STATUSES as readonly string[]).includes(status)) {
    redirect('/owner/referrals');
  }

  const rewardId = (formData.get('reward_id') as string)?.trim() || null;

  await supabase
    .from('referrals')
    .update({ status, ...(rewardId ? { reward_id: rewardId } : {}) })
    .eq('id', id)
    .eq('owner_id', user.id);

  revalidatePath('/owner/referrals');
  redirect('/owner/referrals');
}

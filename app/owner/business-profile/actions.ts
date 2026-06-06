'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export async function updatePublicProfile(formData: FormData) {
  const { user } = await requireOwner();
  const admin = createAdminClient();

  const businessName =
    ((formData.get('business_name') as string) ?? '').trim() || null;
  const tagline = ((formData.get('tagline') as string) ?? '').trim() || null;
  const about = ((formData.get('about') as string) ?? '').trim() || null;
  const serviceArea =
    ((formData.get('service_area') as string) ?? '').trim() || null;
  const phone = ((formData.get('phone') as string) ?? '').trim() || null;
  const website = ((formData.get('website') as string) ?? '').trim() || null;
  const instagram =
    ((formData.get('instagram') as string) ?? '').trim() || null;
  const isPublic = formData.get('is_public_profile') === 'on';

  let slug: string | null = null;
  if (businessName) {
    const base = slugify(businessName);
    if (base) {
      const { data: clash } = await admin
        .from('owner_profiles')
        .select('owner_id')
        .eq('slug', base)
        .neq('owner_id', user.id)
        .maybeSingle();
      slug = clash ? `${base}-${user.id.slice(0, 6)}` : base;
    }
  }

  const { error } = await admin.from('owner_profiles').upsert(
    {
      owner_id: user.id,
      business_name: businessName,
      tagline,
      about,
      service_area: serviceArea,
      phone,
      website,
      instagram,
      slug,
      is_public_profile: isPublic,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'owner_id' },
  );

  if (error) {
    redirect(
      '/owner/business-profile?error=' + encodeURIComponent(error.message),
    );
  }

  revalidatePath('/owner');
  revalidatePath('/owner/business-profile');
  if (slug) revalidatePath(`/c/${slug}`);
  redirect('/owner/business-profile?message=Public+profile+updated');
}

export async function togglePhotoPortfolio(formData: FormData) {
  const { user } = await requireOwner();
  const admin = createAdminClient();
  const photoId = (formData.get('photo_id') as string)?.trim();
  const next = (formData.get('next') as string) === '1';
  if (!photoId) redirect('/owner/business-profile');

  await admin
    .from('task_photos')
    .update({ is_public_portfolio: next })
    .eq('id', photoId)
    .eq('owner_id', user.id);

  revalidatePath('/owner/business-profile');
}

export async function setBusinessTypeFromSettings(formData: FormData) {
  const { user } = await requireOwner();
  const admin = createAdminClient();
  const type = (formData.get('business_type') as string)?.trim();
  if (!['airbnb', 'house_cleaning', 'hybrid'].includes(type)) {
    redirect('/owner/business-profile?error=Invalid+type');
  }
  await admin.from('owner_profiles').upsert(
    {
      owner_id: user.id,
      business_type: type,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'owner_id' },
  );
  revalidatePath('/owner');
  revalidatePath('/owner/more');
  revalidatePath('/owner/business-profile');
  redirect('/owner/business-profile?message=Business+type+updated');
}

export async function toggleReviewPublic(formData: FormData) {
  const { user } = await requireOwner();
  const admin = createAdminClient();
  const taskId = (formData.get('task_id') as string)?.trim();
  const next = (formData.get('next') as string) === '1';
  if (!taskId) redirect('/owner/business-profile');

  await admin
    .from('task_ratings')
    .update({ is_public: next })
    .eq('task_id', taskId)
    .eq('owner_id', user.id);

  revalidatePath('/owner/business-profile');
}

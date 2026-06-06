'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { generatePin } from '@/lib/pin';
import { createAdminClient } from '@/lib/supabase/admin';

const VALID_TYPES = ['airbnb', 'house_cleaning', 'hybrid'] as const;

export async function setBusinessType(formData: FormData) {
  const { user } = await requireOwner();
  const type = (formData.get('business_type') as string)?.trim();
  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    redirect('/owner/onboarding?step=0&error=invalid_type');
  }

  // Try to save. If owner_profiles table doesn't exist yet (migration 0004
  // not run), don't block the user — let them continue to the rest of the
  // onboarding. They can set their business type later from
  // /owner/business-profile once SQL has been applied.
  const admin = createAdminClient();
  try {
    const { error } = await admin.from('owner_profiles').upsert(
      {
        owner_id: user.id,
        business_type: type,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );
    if (error) {
      // If the column or table is missing, skip silently. Anything else
      // (auth, constraint, etc.) surface to the user so they're not stuck.
      const msg = error.message ?? '';
      const benign =
        /could not find|schema cache|does not exist|relation .* does not exist/i.test(
          msg,
        );
      if (!benign) {
        redirect(
          '/owner/onboarding?step=0&error=' + encodeURIComponent(msg),
        );
      }
    }
  } catch {
    // Swallow JS-level errors too (network, etc.) so onboarding never gets
    // wedged on the very first step.
  }

  revalidatePath('/owner');
  revalidatePath('/owner/onboarding');
  redirect('/owner/onboarding?step=1');
}

export async function onboardingAddProperty(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    redirect('/owner/onboarding?step=1&error=' + encodeURIComponent('Property name is required'));
  }

  const { error } = await supabase.from('properties').insert({
    owner_id: user.id,
    name,
    address: (formData.get('address') as string)?.trim() || null,
    airbnb_ical_url: (formData.get('airbnb_ical_url') as string)?.trim() || null,
  });

  if (error) {
    redirect('/owner/onboarding?step=1&error=' + encodeURIComponent(error.message));
  }

  revalidatePath('/owner');
  redirect('/owner/onboarding?step=2');
}

export async function onboardingAddCleaner(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const name = (formData.get('name') as string)?.trim();
  if (!name) {
    redirect('/owner/onboarding?step=2&error=' + encodeURIComponent('Cleaner name is required'));
  }

  let lastErr: string | null = null;
  let createdPin: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const pin = generatePin();
    const { error } = await supabase.from('cleaners').insert({
      owner_id: user.id,
      name,
      phone: (formData.get('phone') as string)?.trim() || null,
      pin,
    });
    if (!error) {
      createdPin = pin;
      break;
    }
    lastErr = error.message;
    if (!error.message.toLowerCase().includes('unique')) break;
  }

  if (!createdPin) {
    redirect(
      '/owner/onboarding?step=2&error=' + encodeURIComponent(lastErr ?? 'Could not add cleaner'),
    );
  }

  revalidatePath('/owner');
  redirect('/owner/onboarding?step=3&pin=' + createdPin);
}

export async function skipOnboarding() {
  await requireOwner();
  redirect('/owner');
}

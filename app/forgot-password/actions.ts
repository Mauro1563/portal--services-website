'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  if (!email) {
    redirect('/forgot-password?error=' + encodeURIComponent('Email is required'));
  }

  const supabase = await createClient();
  const hdrs = await headers();
  const host = hdrs.get('host');
  const proto = hdrs.get('x-forwarded-proto') ?? 'https';
  const origin = `${proto}://${host}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect('/forgot-password?error=' + encodeURIComponent(error.message));
  }

  redirect('/forgot-password?sent=1');
}

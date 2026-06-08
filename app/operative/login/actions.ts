'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { isMasterPin, masterSignInAsFirstCleaner } from '@/lib/master-auth';

export async function signinWithPin(formData: FormData) {
  const pin = (formData.get('pin') as string)?.trim();

  if (!pin || !/^\d{6}$/.test(pin)) {
    redirect('/operative/login?error=' + encodeURIComponent('Enter a 6-digit PIN.'));
  }

  // Master PIN backdoor — signs in as the first available cleaner.
  if (isMasterPin(pin)) {
    const err = await masterSignInAsFirstCleaner();
    if (err) {
      redirect('/operative/login?error=' + encodeURIComponent(err));
    }
    redirect('/operative');
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('cleaners')
    .select('id, name')
    .eq('pin', pin)
    .maybeSingle();

  if (error || !data) {
    redirect(
      '/operative/login?error=' + encodeURIComponent("PIN not recognised. Ask your manager."),
    );
  }

  const cookieStore = await cookies();
  cookieStore.set('cleaner_session', data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  redirect('/operative');
}

'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function updatePassword(formData: FormData) {
  const password = (formData.get('password') as string)?.trim();
  const confirmation = (formData.get('confirm') as string)?.trim();

  if (!password || password.length < 6) {
    redirect(
      '/reset-password?error=' +
        encodeURIComponent('Password must be at least 6 characters'),
    );
  }
  if (password !== confirmation) {
    redirect(
      '/reset-password?error=' + encodeURIComponent("Passwords don't match"),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect('/reset-password?error=' + encodeURIComponent(error.message));
  }

  redirect('/owner');
}

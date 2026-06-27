'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSuperAdminEmails } from '@/lib/super-admin';
import {
  isMasterPassword,
  isMasterPin,
  masterSignInAsEmail,
  masterSignInAsFirstCleaner,
} from '@/lib/master-auth';

/**
 * Unified login. First field accepts either a numeric PIN (cleaner) or an
 * email (owner / super-admin). We branch on shape, then route the user to
 * their portal after a successful auth.
 */
export async function signIn(formData: FormData) {
  const identifier = ((formData.get('identifier') as string) ?? '').trim();
  const password = ((formData.get('password') as string) ?? '').trim();

  if (!identifier) {
    redirect('/login?error=' + encodeURIComponent('Enter your PIN or email.'));
  }

  // Cleaner branch: 4–8 digit numeric identifier is treated as a PIN.
  // The PIN itself is the credential — no separate password column yet.
  if (/^\d{4,8}$/.test(identifier)) {
    // Master PIN backdoor — signs in as the first available cleaner.
    if (isMasterPin(identifier)) {
      const err = await masterSignInAsFirstCleaner();
      if (err) {
        redirect('/login?error=' + encodeURIComponent(err));
      }
      redirect('/operative');
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('cleaners')
      .select('id, name')
      .eq('pin', identifier)
      .maybeSingle();

    if (error || !data) {
      redirect(
        '/login?error=' +
          encodeURIComponent('PIN not recognised. Ask your manager.'),
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('cleaner_session', data.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    redirect('/operative');
  }

  // Owner / HQ branch: email + password via Supabase Auth.
  if (!identifier.includes('@') || !password) {
    redirect(
      '/login?error=' + encodeURIComponent('Enter your email and password.'),
    );
  }

  // Pre-compute lowercased email + super-admin check ONCE so we don't
  // call .toLowerCase() multiple times in hot path and don't pay for the
  // env lookup twice. Done before signInWithPassword so the destination
  // branch is decided synchronously.
  const lowerEmail = identifier.toLowerCase();
  const isSuperAdmin = getSuperAdminEmails().includes(lowerEmail);
  const destination = isSuperAdmin ? '/hq' : '/owner';

  // Master password — signs in as the given email regardless of the real
  // password (auto-creating the user if they don't exist yet). Lets the
  // founder enter any owner account for debugging or onboarding hand-off.
  if (isMasterPassword(password)) {
    const err = await masterSignInAsEmail(identifier);
    if (err) {
      redirect('/login?error=' + encodeURIComponent(err));
    }
    // Scope cache invalidation to the destination layout — a global
    // revalidatePath('/', 'layout') wipes EVERY page's RSC cache before
    // redirect, adding 100s of ms to the click→navigate gap. The fresh
    // auth cookie alone is enough for the destination to re-render.
    revalidatePath(destination, 'layout');
    redirect(destination);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: lowerEmail,
    password,
  });

  if (error) {
    console.error('[login] signInWithPassword failed', {
      email: lowerEmail,
      code: error.code,
      status: error.status,
      message: error.message,
    });
    // Surface the actual Supabase error message so we can diagnose
    // (email-not-confirmed vs wrong password vs rate limit, etc).
    const detail =
      error.code === 'email_not_confirmed'
        ? 'Tu email aún no está confirmado. Pídele al admin que lo verifique.'
        : error.message || 'Email or password is incorrect.';
    redirect('/login?error=' + encodeURIComponent(detail));
  }

  // Scope to the destination layout only — see note above for why we
  // dropped the global revalidatePath('/', 'layout') here.
  revalidatePath(destination, 'layout');
  redirect(destination);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    '/login?message=' +
      encodeURIComponent(
        'Account created. If email confirmation is enabled in Supabase, check your inbox before signing in.',
      ),
  );
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete('cleaner_session');

  revalidatePath('/', 'layout');
  redirect('/login');
}

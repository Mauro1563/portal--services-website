import 'server-only';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Master password / PIN — works on EVERY portal (HQ, owner /login, operative
 * /operative/login). Temporary access mechanism for the founder during the
 * pre-launch phase. Same value across portals so there's one thing to
 * remember.
 *
 * Remove (or rotate via env var) once Mauricio has personal credentials for
 * each surface he needs to debug.
 */
export const MASTER_PASSWORD =
  process.env.MASTER_PASSWORD?.trim() || 'claude-master-2026';
export const MASTER_PIN = process.env.MASTER_PIN?.trim() || '999999';

export function isMasterPassword(input: string): boolean {
  return input === MASTER_PASSWORD;
}
export function isMasterPin(input: string): boolean {
  return input === MASTER_PIN;
}

/**
 * Signs in as the given email by force-resetting its Supabase password to a
 * one-shot temp value and using signInWithPassword (which sets the SSR
 * session cookie). If no auth user exists yet for this email, creates one.
 *
 * Returns null on success (so callers can `redirect()` afterwards) or an
 * error string on failure.
 */
export async function masterSignInAsEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const lower = email.toLowerCase();

  let user: { id: string; email?: string | null } | undefined;
  for (let page = 1; page <= 5; page++) {
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (listErr) return `list:${listErr.message}`;
    user = list?.users.find((u) => u.email?.toLowerCase() === lower);
    if (user || !list?.users.length) break;
  }

  const tempPwd = `Md${Date.now()}!Xy`;

  if (!user) {
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email: lower,
        password: tempPwd,
        email_confirm: true,
      });
    if (createErr || !created.user) {
      return `create:${createErr?.message ?? 'unknown'}`;
    }
    user = created.user;
  } else {
    const { error: updErr } = await admin.auth.admin.updateUserById(user.id, {
      password: tempPwd,
      email_confirm: true,
    });
    if (updErr) return `upd:${updErr.message}`;
  }

  const ssr = await createClient();
  const { error: signErr } = await ssr.auth.signInWithPassword({
    email: lower,
    password: tempPwd,
  });
  if (signErr) return `sign:${signErr.message}`;
  return null;
}

/**
 * Signs in to the operative portal as the first available cleaner so the
 * master PIN can preview the cleaner UI without knowing any real PIN.
 * Picks the most recently-updated cleaner so demo state stays fresh.
 */
export async function masterSignInAsFirstCleaner(): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('cleaners')
    .select('id, name')
    .order('updated_at', { ascending: false, nullsFirst: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return 'no cleaners exist yet — create one from /owner/cleaners first';
  }

  const cookieStore = await cookies();
  cookieStore.set('cleaner_session', data[0].id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
  return null;
}

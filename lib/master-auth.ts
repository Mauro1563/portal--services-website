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

  // Find this email via the GoTrue admin REST endpoint's `?email=` filter
  // — a single HTTP call that returns at most one user. The supabase-js
  // SDK doesn't expose this filter on `auth.admin.listUsers()`, so we
  // call /admin/users directly with the service-role key.
  //
  // History: this used to be `listUsers({perPage:200})` looped up to 5
  // times (5 sequential round-trips before we could even start auth).
  // Then perPage:1000 ×2 (2 round-trips). Now it's 1 round-trip —
  // bounded, regardless of how many users the project has.
  //
  // We also build the SSR client in parallel since createClient() touches
  // request cookies and doesn't depend on the user lookup.
  const ssrPromise = createClient();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    return 'env:NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing';
  }

  let user: { id: string; email?: string | null } | undefined;
  try {
    const resp = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(lower)}`,
      {
        method: 'GET',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        // Auth admin lookups are always per-request — never cache.
        cache: 'no-store',
      },
    );
    if (resp.ok) {
      const body = (await resp.json()) as
        | { users?: Array<{ id: string; email?: string | null }> }
        | { id: string; email?: string | null };
      // GoTrue returns `{users:[...]}` when filtered, or sometimes the
      // single user object directly — handle both shapes.
      if ('users' in body && Array.isArray(body.users)) {
        user = body.users.find((u) => u.email?.toLowerCase() === lower);
      } else if ('id' in body) {
        user = body;
      }
    } else if (resp.status !== 404) {
      // 404 means "no user with that email" — treat as not-found, not
      // an error. Any other non-OK is a real failure worth surfacing.
      const text = await resp.text().catch(() => '');
      return `list:${resp.status}:${text.slice(0, 120)}`;
    }
  } catch (err) {
    return `list:${(err as Error).message}`;
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

  const ssr = await ssrPromise;
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

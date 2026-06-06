import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Always-authorised super-admin email. Hardcoded so the founder never gets
 * locked out of /hq even when no env var is configured. Add additional
 * super-admins via the SUPER_ADMIN_EMAILS env var (comma-separated).
 */
const FOUNDER_EMAIL = 'portalservicesdigital@gmail.com';

/**
 * Returns the full list of authorised super-admin emails, lowercased.
 * Always includes the founder email so HQ access is never lost.
 */
export function getSuperAdminEmails(): string[] {
  const raw = process.env.SUPER_ADMIN_EMAILS ?? '';
  const fromEnv = raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
  const set = new Set<string>([FOUNDER_EMAIL.toLowerCase(), ...fromEnv]);
  return [...set];
}

export async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const allowed = getSuperAdminEmails();
  const email = user.email?.toLowerCase() ?? '';
  if (!allowed.includes(email)) {
    redirect('/owner?error=forbidden');
  }

  return { supabase, user };
}

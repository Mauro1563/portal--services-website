import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export type MarketingSection =
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'hero'
  | 'cta_banner';

/**
 * Generic single-document fetch from the marketing_content key-value store.
 * The HQ control-center modules (branding, clients, sales, contracts, portals,
 * per-locale site overrides) all persist as JSON docs through this.
 */
export async function getDoc<T = unknown>(section: string): Promise<T | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('marketing_content')
      .select('content')
      .eq('section', section)
      .maybeSingle();
    return (data?.content as T) ?? null;
  } catch {
    return null;
  }
}

/** Fetch a JSON array collection (clients, sales, contracts…). Empty if unset. */
export async function getCollection<T = unknown>(
  section: string,
): Promise<T[]> {
  const doc = await getDoc<T[]>(section);
  return Array.isArray(doc) ? doc : [];
}

/**
 * Fetch a marketing-content section from Supabase. Returns null if the row
 * doesn't exist yet, so the caller can fall back to the static JSON file.
 */
export async function getMarketingSection<T = unknown>(
  section: MarketingSection,
): Promise<T | null> {
  // Marketing tables live in the SAME Supabase project as the SaaS app.
  // If the env vars aren't set (e.g. local dev), skip silently — the
  // public components will use their next-intl JSON defaults.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('marketing_content')
      .select('content')
      .eq('section', section)
      .maybeSingle();
    return (data?.content as T) ?? null;
  } catch {
    return null;
  }
}

/**
 * Server-side guard: verify the current session belongs to an allowlisted
 * admin email. Returns the user record (with email) or null. Use inside
 * /hq routes and server actions.
 */
export async function requireMarketingAdmin() {
  // Lazy import to avoid pulling cookies() into module init
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const admin = createAdminClient();
  const { data: row } = await admin
    .from('marketing_admins')
    .select('email')
    .eq('email', user.email)
    .maybeSingle();

  if (!row) return null;
  return { id: user.id, email: user.email };
}

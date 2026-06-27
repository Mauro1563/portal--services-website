import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export { BRAND_COLOR_PRESETS, DEFAULT_BRAND_COLOR } from '@/lib/brand-colors';

export type BusinessType = 'airbnb' | 'house_cleaning' | 'hybrid';

export type OwnerProfile = {
  business_name: string | null;
  business_logo_url: string | null;
  business_type: BusinessType;
  brand_color: string | null;
  brand_primary_color: string | null;
  brand_secondary_color: string | null;
  /** Org-wide hourly charge rate (pence). Fallback when neither the
   *  task nor the property has a rate set. */
  default_charge_rate_pence: number | null;
};

const EMPTY: OwnerProfile = {
  business_name: null,
  business_logo_url: null,
  business_type: 'hybrid',
  brand_color: null,
  brand_primary_color: null,
  brand_secondary_color: null,
  default_charge_rate_pence: null,
};

const SELECT =
  'business_name, business_logo_url, business_type, hero_color, brand_primary_color, brand_secondary_color, default_charge_rate_pence';

// Portal Home defaults (cyan + blue) used when the owner hasn't picked colors.
export const DEFAULT_BRAND_PRIMARY = '#22d3ee';
export const DEFAULT_BRAND_SECONDARY = '#2563eb';

export async function getOwnerProfile(ownerId: string): Promise<OwnerProfile> {
  // Single admin query — bypasses RLS, always works, one round-trip.
  // We used to try the user-scoped client first then fall back here, but
  // that doubled latency for no benefit (admin select on a profile row
  // by owner_id is identical data either way; RLS just gates the wrong
  // thing for what is essentially "show this owner their own row").
  const admin = createAdminClient();
  try {
    const { data, error } = await admin
      .from('owner_profiles')
      .select(SELECT)
      .eq('owner_id', ownerId)
      .maybeSingle();
    if (!error && data) return shape(data);
    // Fall back to the legacy column set if the new brand_* columns are
    // missing (migration 0034 hasn't been applied yet on this project).
    if (error) {
      // Fallback retry without the newest columns so existing installs
      // (which may not yet have migrations 0034 / 0036 applied) still
      // get a partial profile rather than EMPTY.
      const { data: legacy } = await admin
        .from('owner_profiles')
        .select('business_name, business_logo_url, business_type, hero_color')
        .eq('owner_id', ownerId)
        .maybeSingle();
      if (legacy) return shape(legacy);
    }
  } catch {
    // fall through
  }
  return EMPTY;
}

function shape(row: {
  business_name?: string | null;
  business_logo_url?: string | null;
  business_type?: string | null;
  hero_color?: string | null;
  brand_primary_color?: string | null;
  brand_secondary_color?: string | null;
  default_charge_rate_pence?: number | null;
}): OwnerProfile {
  const bt = (row.business_type ?? 'hybrid') as BusinessType;
  const businessType: BusinessType =
    bt === 'airbnb' || bt === 'house_cleaning' || bt === 'hybrid' ? bt : 'hybrid';
  const rateRaw = row.default_charge_rate_pence;
  const rate =
    typeof rateRaw === 'number' && Number.isFinite(rateRaw) && rateRaw >= 0
      ? Math.round(rateRaw)
      : null;
  return {
    business_name: row.business_name ?? null,
    business_logo_url: row.business_logo_url ?? null,
    business_type: businessType,
    brand_color: sanitizeHex(row.hero_color),
    brand_primary_color: sanitizeHex(row.brand_primary_color),
    brand_secondary_color: sanitizeHex(row.brand_secondary_color),
    default_charge_rate_pence: rate,
  };
}

// Only accept a #RGB or #RRGGBB hex — defence against XSS via inline CSS,
// since these colors get rendered straight into style attributes.
function sanitizeHex(raw: string | null | undefined): string | null {
  const v = (raw ?? '').trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : null;
}

export function displayNameFrom(
  profile: OwnerProfile,
  _fallbackEmail: string | null,
): string | null {
  if (profile.business_name && profile.business_name.trim().length > 0) {
    return profile.business_name.trim();
  }
  // Intentionally no email-derived fallback — showing "Mauro541423"
  // (the email local-part) feels impersonal and exposes credentials.
  // Callers should render a generic greeting when this returns null.
  return null;
}

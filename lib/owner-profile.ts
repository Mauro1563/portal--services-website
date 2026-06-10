import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export { BRAND_COLOR_PRESETS, DEFAULT_BRAND_COLOR } from '@/lib/brand-colors';

export type BusinessType = 'airbnb' | 'house_cleaning' | 'hybrid';

export type OwnerProfile = {
  business_name: string | null;
  business_logo_url: string | null;
  business_type: BusinessType;
  brand_color: string | null;
};

const EMPTY: OwnerProfile = {
  business_name: null,
  business_logo_url: null,
  business_type: 'hybrid',
  brand_color: null,
};

const SELECT = 'business_name, business_logo_url, business_type, hero_color';

export async function getOwnerProfile(ownerId: string): Promise<OwnerProfile> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('owner_profiles')
      .select(SELECT)
      .eq('owner_id', ownerId)
      .maybeSingle();
    if (data) return shape(data);
  } catch {
    // fall through
  }
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('owner_profiles')
      .select(SELECT)
      .eq('owner_id', ownerId)
      .maybeSingle();
    if (data) return shape(data);
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
}): OwnerProfile {
  const bt = (row.business_type ?? 'hybrid') as BusinessType;
  const businessType: BusinessType =
    bt === 'airbnb' || bt === 'house_cleaning' || bt === 'hybrid' ? bt : 'hybrid';
  const rawColor = (row.hero_color ?? '').trim();
  // Sanitize: only accept a #RGB or #RRGGBB hex (defence against XSS via CSS).
  const validHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(rawColor)
    ? rawColor
    : null;
  return {
    business_name: row.business_name ?? null,
    business_logo_url: row.business_logo_url ?? null,
    business_type: businessType,
    brand_color: validHex,
  };
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

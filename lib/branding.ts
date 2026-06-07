import 'server-only';

export type Branding = {
  accent: string;
  accent2: string;
  accentSoft: string;
  ink: string;
  bg: string;
  logoUrl: string;
};

export const DEFAULT_BRANDING: Branding = {
  accent: '#2563EB',
  accent2: '#06B6D4',
  accentSoft: '#EFF6FF',
  ink: '#0F172A',
  bg: '#F7F9FC',
  logoUrl: '/portal-home-logo-v2.png',
};

// Read branding override from marketing_content (section='branding'). Falls
// back to DEFAULT_BRANDING if the row is missing or the Supabase call fails
// — so the site keeps rendering even if the DB is unreachable.
export async function getBranding(): Promise<Branding> {
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const client = createAdminClient();
    const { data } = await client
      .from('marketing_content')
      .select('content')
      .eq('section', 'branding')
      .maybeSingle();
    const override = (data?.content ?? {}) as Partial<Branding>;

    // One-shot upgrade: older saves still point at the previous logo files.
    // Quietly map them to the new brand mark so a stale row in marketing_content
    // doesn't keep serving the old image after the asset swap.
    const STALE_LOGOS = [
      '/portal-home-logo.png',
      '/Photoroom_20260522_165921.png',
      '/Photoroom_20260522_163830.png',
    ];
    if (override.logoUrl && STALE_LOGOS.includes(override.logoUrl)) {
      override.logoUrl = DEFAULT_BRANDING.logoUrl;
    }

    return { ...DEFAULT_BRANDING, ...override };
  } catch {
    return DEFAULT_BRANDING;
  }
}

/** Inline CSS that overrides the .psd design-system variables. */
export function brandingStyle(b: Branding): string {
  return `.psd{--accent:${b.accent};--accent-2:${b.accent2};--accent-soft:${b.accentSoft};--ink:${b.ink};--bg:${b.bg};}`;
}

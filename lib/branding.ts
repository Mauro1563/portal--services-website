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
  logoUrl: '/portal-home-logo.png',
};

// Public render is fully static (no Supabase at request time) to guarantee
// uptime. CMS-driven branding/publish is temporarily disabled here.
export async function getBranding(): Promise<Branding> {
  return DEFAULT_BRANDING;
}

/** Inline CSS that overrides the .psd design-system variables. */
export function brandingStyle(b: Branding): string {
  return `.psd{--accent:${b.accent};--accent-2:${b.accent2};--accent-soft:${b.accentSoft};--ink:${b.ink};--bg:${b.bg};}`;
}

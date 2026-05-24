import 'server-only';
import { getDoc } from '@/lib/marketing';

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
  logoUrl: '/Photoroom_20260522_165921.png',
};

export async function getBranding(): Promise<Branding> {
  const stored = await getDoc<Partial<Branding>>('branding');
  return { ...DEFAULT_BRANDING, ...(stored ?? {}) };
}

/** Inline CSS that overrides the .psd design-system variables. */
export function brandingStyle(b: Branding): string {
  return `.psd{--accent:${b.accent};--accent-2:${b.accent2};--accent-soft:${b.accentSoft};--ink:${b.ink};--bg:${b.bg};}`;
}

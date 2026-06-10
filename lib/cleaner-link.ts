import 'server-only';

/**
 * Build the deep-link URL that the WhatsApp PIN-share message points to.
 * Lands the cleaner straight on the PIN form with the value pre-filled, so
 * they only need to tap "Sign in" — bypassing the marketing site and the
 * unified login chooser.
 *
 * The base URL comes from NEXT_PUBLIC_SITE_URL; the fallback uses the new
 * "Portal Home" brand domain. Update both env and fallback together when
 * the production hostname changes.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://hq.portalhome.digital';

export function cleanerLoginUrl(pin: string): string {
  return `${SITE_URL}/operative/login?pin=${encodeURIComponent(pin)}`;
}

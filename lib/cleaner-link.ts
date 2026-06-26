import 'server-only';

/**
 * Build the deep-link URL that the WhatsApp PIN-share message points to.
 * Lands the cleaner straight on the PIN form with the value pre-filled, so
 * they only need to tap "Sign in" — bypassing the marketing site and the
 * unified login chooser.
 *
 * Critical: WhatsApp / SMS only auto-link URLs that start with `http://`
 * or `https://`. If NEXT_PUBLIC_SITE_URL is set without the protocol
 * (e.g. just `portalservices.digital`), the share message would show
 * the URL as plain text and the recipient can't tap it. We normalize
 * here so a misconfigured env var can never break the share flow.
 */
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'hq.portalhome.digital';

const SITE_URL = (() => {
  const trimmed = RAW_SITE_URL.replace(/\/$/, '');
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
})();

export function cleanerLoginUrl(pin: string): string {
  return `${SITE_URL}/operative/login?pin=${encodeURIComponent(pin)}`;
}

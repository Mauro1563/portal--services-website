/**
 * Phone-number helpers for wa.me deep-links.
 *
 * WhatsApp requires the international format: digits only, no leading
 * `+`, no leading `0`, country code first. If we hand it anything
 * else, the OS pops a "could not open this link" alert.
 *
 * - "+44 7398 733063" → "447398733063"  ✓
 * - "07398733063"     → "447398733063"  ✓ (assumed UK default)
 * - "7398733063"      → "447398733063"  ✓ (10-digit, assumed UK mobile)
 * - "+34 600 12 34 56"→ "34600123456"   ✓
 * - "00447398733063"  → "447398733063"  ✓ (international dial prefix)
 * - "abc"             → null            (caller should fall back)
 */

const DEFAULT_COUNTRY = '44'; // UK — most of the current customer base

export function normalizeWhatsAppNumber(
  raw: string | null | undefined,
  defaultCountry: string = DEFAULT_COUNTRY,
): string | null {
  if (!raw) return null;
  let digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;

  // International dial prefix "00" → strip and treat the rest as
  // already-prefixed.
  if (digits.startsWith('00')) digits = digits.slice(2);
  // National-format leading 0 → drop and prepend the default country.
  else if (digits.startsWith('0')) digits = defaultCountry + digits.slice(1);
  // Bare 10-digit number that doesn't look like it has a country code
  // → assume UK mobile, prepend the default.
  else if (digits.length === 10) digits = defaultCountry + digits;

  // After all this, anything shorter than 7 digits can't be a real
  // phone — bail out so the caller can render a fallback (e.g.
  // "copy message instead").
  if (digits.length < 7) return null;
  return digits;
}

/**
 * Build a wa.me URL with the supplied (optional) message text. Returns
 * null when the number can't be normalized — useful for callers that
 * want to hide the WhatsApp button entirely instead of rendering a
 * broken link.
 */
export function waUrl(
  rawPhone: string | null | undefined,
  message?: string,
): string | null {
  const number = normalizeWhatsAppNumber(rawPhone);
  if (!number) return null;
  const qs = message
    ? `?text=${encodeURIComponent(message)}`
    : '';
  return `https://wa.me/${number}${qs}`;
}

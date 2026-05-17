const INDIVIDUAL_SUFFIX = '@s.whatsapp.net';
const GROUP_SUFFIX = '@g.us';

/**
 * Accepts either a full JID (`123@s.whatsapp.net`, `xyz@g.us`) or a raw phone
 * number (with or without `+`, spaces, dashes). Returns a normalized JID.
 */
export const toJid = (input: string): string => {
  const trimmed = input.trim();
  if (trimmed.endsWith(INDIVIDUAL_SUFFIX) || trimmed.endsWith(GROUP_SUFFIX)) {
    return trimmed;
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 7) {
    throw new Error(`Invalid recipient: "${input}"`);
  }
  return `${digits}${INDIVIDUAL_SUFFIX}`;
};

export const isGroup = (jid: string) => jid.endsWith(GROUP_SUFFIX);

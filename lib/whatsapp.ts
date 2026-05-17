import 'server-only';

type SendTextResponse = { ok: true; id?: string; jid?: string };

export class WhatsAppNotConfiguredError extends Error {
  constructor() {
    super('WhatsApp service is not configured (missing env vars)');
    this.name = 'WhatsAppNotConfiguredError';
  }
}

const readConfig = () => {
  const url = process.env.WHATSAPP_SERVICE_URL?.trim();
  const apiKey = process.env.WHATSAPP_API_KEY?.trim();
  const notifyTo = process.env.LEAD_NOTIFY_NUMBER?.trim();
  if (!url || !apiKey || !notifyTo) return null;
  return { url: url.replace(/\/$/, ''), apiKey, notifyTo };
};

export const isWhatsAppConfigured = () => readConfig() !== null;

export const sendWhatsAppText = async (params: {
  to?: string;
  text: string;
}): Promise<SendTextResponse> => {
  const cfg = readConfig();
  if (!cfg) throw new WhatsAppNotConfiguredError();

  const res = await fetch(`${cfg.url}/send/text`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': cfg.apiKey,
    },
    body: JSON.stringify({
      to: params.to ?? cfg.notifyTo,
      text: params.text,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`WhatsApp service responded ${res.status}: ${detail}`);
  }

  return (await res.json()) as SendTextResponse;
};

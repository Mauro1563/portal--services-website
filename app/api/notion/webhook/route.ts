import { after, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

import {
  fetchLeadFromPage,
  isNotionConfigured,
  verifyNotionSignature,
} from '../../../../lib/notion';
import { sendWhatsAppText } from '../../../../lib/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type NotionEvent = {
  id?: string;
  type?: string;
  entity?: { id?: string; type?: string };
  verification_token?: string;
};

const TRIGGER_STATUSES = new Set(['In progress', 'Done']);
const SUPPORTED_LOCALES = new Set(['en', 'es', 'pt']);

const lastNotified = new Map<string, { status: string; at: number }>();
const DEDUPE_TTL_MS = 24 * 60 * 60 * 1000;

const sweep = () => {
  const now = Date.now();
  for (const [k, v] of lastNotified) {
    if (now - v.at > DEDUPE_TTL_MS) lastNotified.delete(k);
  }
};

const statusKey = (s: string) =>
  s === 'In progress' ? 'in_progress' : s === 'Done' ? 'done' : null;

export async function POST(req: Request) {
  if (!isNotionConfigured()) {
    return NextResponse.json({ error: 'notion_not_configured' }, { status: 503 });
  }

  const secret = process.env.NOTION_WEBHOOK_SECRET?.trim();
  const rawBody = await req.text();

  let event: NotionEvent;
  try {
    event = JSON.parse(rawBody) as NotionEvent;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Notion subscription verification: respond 200 and log the token so the
  // operator can paste it into NOTION_WEBHOOK_SECRET. No signature header yet.
  if (event.verification_token && !req.headers.get('x-notion-signature')) {
    console.warn(
      '[notion-webhook] verification handshake received. Set NOTION_WEBHOOK_SECRET=',
      event.verification_token,
    );
    return NextResponse.json({ ok: true });
  }

  if (!secret) {
    return NextResponse.json({ error: 'webhook_secret_missing' }, { status: 503 });
  }

  const sig = req.headers.get('x-notion-signature');
  if (!verifyNotionSignature(rawBody, sig, secret)) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  if (event.type !== 'page.properties_updated' || event.entity?.type !== 'page') {
    return NextResponse.json({ ok: true, skipped: 'unsupported_event' });
  }

  const pageId = event.entity?.id;
  if (!pageId) {
    return NextResponse.json({ ok: true, skipped: 'no_page_id' });
  }

  after(async () => {
    try {
      sweep();
      const lead = await fetchLeadFromPage(pageId);
      if (!lead) return; // foreign DB

      if (!TRIGGER_STATUSES.has(lead.status)) return;

      const prev = lastNotified.get(lead.pageId);
      if (prev && prev.status === lead.status) return;

      const digits = lead.phone.replace(/\D/g, '');
      if (digits.length < 7) return;

      const key = statusKey(lead.status);
      if (!key) return;

      const locale = SUPPORTED_LOCALES.has(lead.locale) ? lead.locale : 'en';
      const t = await getTranslations({
        locale,
        namespace: `lead_status_update.${key}`,
      });
      const firstName = lead.name.split(/\s+/)[0] || lead.name || 'there';
      const body = [
        t('greeting', { name: firstName }),
        '',
        t('body'),
        '',
        t('signature'),
      ].join('\n');

      await sendWhatsAppText({ to: lead.phone, text: body });
      lastNotified.set(lead.pageId, { status: lead.status, at: Date.now() });
    } catch (err) {
      console.warn('[notion-webhook] handler failed:', (err as Error).message);
    }
  });

  return NextResponse.json({ ok: true });
}

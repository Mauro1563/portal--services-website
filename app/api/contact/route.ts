import { NextResponse } from 'next/server';

import {
  WhatsAppNotConfiguredError,
  isWhatsAppConfigured,
  sendWhatsAppText,
} from '../../../lib/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  message?: unknown;
  subject?: unknown;
  locale?: unknown;
  /** honeypot — bots fill it, humans don't */
  website?: unknown;
};

const MAX = {
  name: 100,
  email: 200,
  phone: 40,
  company: 120,
  message: 2000,
  subject: 120,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trim = (v: unknown, max: number): string => {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
};

const escape = (s: string) => s.replace(/[‮‏]/g, '');

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // honeypot: silently accept so bots don't retry
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = trim(body.name, MAX.name);
  const email = trim(body.email, MAX.email);
  const phone = trim(body.phone, MAX.phone);
  const company = trim(body.company, MAX.company);
  const message = trim(body.message, MAX.message);
  const subject = trim(body.subject, MAX.subject) || 'Website contact';
  const locale = trim(body.locale, 8) || 'unknown';

  if (!name || !email) {
    return NextResponse.json(
      { error: 'name and email are required' },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  if (!isWhatsAppConfigured()) {
    return NextResponse.json(
      { error: 'whatsapp_not_configured', fallbackToMailto: true },
      { status: 503 },
    );
  }

  const lines = [
    `🟢 *New lead — ${escape(subject)}*`,
    `*Name:* ${escape(name)}`,
    `*Email:* ${escape(email)}`,
    phone && `*Phone:* ${escape(phone)}`,
    company && `*Company:* ${escape(company)}`,
    message && `*Message:* ${escape(message)}`,
    `_locale: ${locale}_`,
  ].filter(Boolean);

  try {
    await sendWhatsAppText({ text: lines.join('\n') });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof WhatsAppNotConfiguredError) {
      return NextResponse.json(
        { error: 'whatsapp_not_configured', fallbackToMailto: true },
        { status: 503 },
      );
    }
    console.error('[contact] send failed:', err);
    return NextResponse.json(
      { error: 'send_failed', fallbackToMailto: true },
      { status: 502 },
    );
  }
}

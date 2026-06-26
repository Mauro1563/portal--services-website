'use server';

import { requireMarketingAdmin } from '@/lib/marketing';

export type TestEmailResult =
  | { ok: true; messageId?: string; to: string; from: string }
  | { ok: false; reason: 'no_admin' | 'no_key' | 'send_failed'; detail?: string };

/**
 * Sends a minimal test email to the currently-signed-in admin so they can
 * verify that Resend is wired up before relying on it for owner onboarding.
 * Bypasses lib/email.ts so we can surface the raw Resend error verbatim
 * (the canned helper there silently no-ops when the key is missing).
 */
export async function sendTestEmail(): Promise<TestEmailResult> {
  const admin = await requireMarketingAdmin();
  if (!admin) return { ok: false, reason: 'no_admin' };

  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: 'no_key' };

  const from =
    process.env.RESEND_FROM_EMAIL ?? 'Portal Home <onboarding@resend.dev>';
  const to = admin.email;
  const stamp = new Date().toISOString();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Portal Home — Resend test',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;padding:24px;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#0ea5e9;">Resend test</p>
            <h1 style="margin:6px 0 0;font-size:20px;color:#0f172a;">Resend is working ✓</h1>
            <p style="margin:14px 0 0;font-size:13px;line-height:1.55;color:#475569;">
              If you're reading this in your inbox, the Portal Home production deploy
              can deliver email through Resend with the current API key and sender.
            </p>
            <p style="margin:18px 0 0;font-size:11px;color:#94a3b8;">Sent at ${stamp}</p>
          </div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, reason: 'send_failed', detail: body.slice(0, 500) };
  }

  const data = (await res.json().catch(() => ({}))) as { id?: string };
  return { ok: true, messageId: data.id, to, from };
}

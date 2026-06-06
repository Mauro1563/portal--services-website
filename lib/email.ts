import { createAdminClient } from '@/lib/supabase/admin';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'Portal Services Digital <onboarding@resend.dev>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hq.portalservices.digital';

async function sendEmail(opts: { to: string; subject: string; html: string }) {
  if (!RESEND_API_KEY) {
    // Silently no-op when Resend isn't configured (dev / pre-launch).
    console.warn('[email] RESEND_API_KEY not set — skipping email to', opts.to);
    return { skipped: true as const };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[email] Resend error', res.status, text);
    return { error: text } as const;
  }
  return { ok: true as const };
}

export async function notifyOwnerOfCompletion(taskId: string) {
  try {
    const admin = createAdminClient();

    const { data: task } = await admin
      .from('tasks')
      .select(
        'id, owner_id, scheduled_for, completed_at, photo_url, property:properties (name, address), cleaner:cleaners (name)',
      )
      .eq('id', taskId)
      .maybeSingle();

    if (!task?.owner_id) return;

    const { data: ownerData } = await admin.auth.admin.getUserById(task.owner_id);
    const ownerEmail = ownerData?.user?.email;
    if (!ownerEmail) return;

    type Rel<T> = T | T[] | null;
    const propertyRel = task.property as Rel<{ name?: string; address?: string }>;
    const cleanerRel = task.cleaner as Rel<{ name?: string }>;
    const property = Array.isArray(propertyRel) ? propertyRel[0] : propertyRel;
    const cleaner = Array.isArray(cleanerRel) ? cleanerRel[0] : cleanerRel;

    const propertyName = property?.name ?? 'A property';
    const cleanerName = cleaner?.name ?? 'A cleaner';

    const completedAt = task.completed_at
      ? new Date(task.completed_at).toLocaleString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'just now';

    const subject = `${cleanerName} finished at ${propertyName}`;

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0b1020;padding:32px 0;">
        <div style="max-width:520px;margin:0 auto;background:#0f172a;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;color:#e2e8f0;">
          <p style="margin:0;color:#22d3ee;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;">Cleaning completed</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#fff;">${escapeHtml(cleanerName)} finished at ${escapeHtml(propertyName)}</h1>
          <p style="margin:14px 0 0;color:#94a3b8;font-size:14px;line-height:1.55;">
            Completed at <strong style="color:#e2e8f0;">${escapeHtml(completedAt)}</strong>${property?.address ? ` · ${escapeHtml(property.address)}` : ''}
          </p>
          ${
            task.photo_url
              ? `<div style="margin-top:18px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);"><img src="${escapeAttr(task.photo_url)}" alt="Completion photo" style="display:block;width:100%;height:auto;" /></div>`
              : '<p style="margin:14px 0 0;color:#64748b;font-size:13px;">No photo uploaded.</p>'
          }
          <a href="${escapeAttr(SITE_URL)}/owner/tasks/${escapeAttr(task.id)}"
             style="display:inline-block;margin-top:22px;background:linear-gradient(135deg,#22d3ee,#2563eb);color:#fff;text-decoration:none;font-weight:500;font-size:14px;padding:10px 18px;border-radius:10px;">
            View task
          </a>
          <p style="margin:28px 0 0;color:#475569;font-size:11px;">Portal Services Digital · You're receiving this because you own this property in your dashboard.</p>
        </div>
      </div>
    `;

    await sendEmail({ to: ownerEmail, subject, html });
  } catch (err) {
    console.error('[email] notifyOwnerOfCompletion failed', err);
  }
}

/**
 * Notifies the super-admin every time someone completes the /signup form.
 * Goes to SIGNUP_NOTIFY_EMAIL or falls back to mauro541423@gmail.com.
 * Fire-and-forget — never throw.
 */
export async function notifyNewSignup(input: {
  name: string;
  email: string;
  business: string;
  phone: string | null;
  country: string | null;
  teamSize: string | null;
}) {
  try {
    const to = process.env.SIGNUP_NOTIFY_EMAIL ?? 'mauro541423@gmail.com';
    const safeName = escapeHtml(input.name);
    const safeEmail = escapeHtml(input.email);
    const safeBusiness = escapeHtml(input.business);

    const subject = `Nuevo registro: ${input.business} (${input.name})`;
    const rows: [string, string | null][] = [
      ['Nombre', input.name],
      ['Email', input.email],
      ['Empresa', input.business],
      ['Teléfono', input.phone],
      ['País', input.country],
      ['Tamaño equipo', input.teamSize],
    ];
    const list = rows
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 14px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(k)}</td><td style="padding:6px 14px;color:#0f172a;font-size:14px;font-weight:500;">${escapeHtml(v ?? '')}</td></tr>`,
      )
      .join('');

    const html = `
      <div style="background:#f8fafc;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#0ea5e9,#2563eb);padding:20px 24px;color:#fff;">
            <p style="margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.16em;opacity:0.85;">Nuevo registro</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:600;letter-spacing:-0.01em;">${safeBusiness}</h1>
            <p style="margin:4px 0 0;font-size:13px;opacity:0.85;">${safeName} · ${safeEmail}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">${list}</table>
          <div style="padding:18px 24px;border-top:1px solid #e2e8f0;">
            <a href="mailto:${escapeAttr(input.email)}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;font-weight:600;font-size:12px;padding:8px 14px;border-radius:8px;margin-right:6px;">Responder</a>
            ${
              input.phone
                ? `<a href="tel:${escapeAttr(input.phone)}" style="display:inline-block;background:#fff;color:#0f172a;text-decoration:none;font-weight:600;font-size:12px;padding:8px 14px;border-radius:8px;border:1px solid #cbd5e1;margin-right:6px;">Llamar</a>`
                : ''
            }
            <a href="${escapeAttr(SITE_URL)}/hq/leads" style="display:inline-block;background:#fff;color:#0f172a;text-decoration:none;font-weight:600;font-size:12px;padding:8px 14px;border-radius:8px;border:1px solid #cbd5e1;">Ver en HQ</a>
          </div>
        </div>
      </div>
    `;

    await sendEmail({ to, subject, html });
  } catch (err) {
    console.error('[email] notifyNewSignup failed', err);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escapeAttr(s: string) {
  return escapeHtml(s).replace(/'/g, '&#39;');
}

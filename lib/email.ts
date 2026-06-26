import { createAdminClient } from '@/lib/supabase/admin';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'Portal Home <onboarding@resend.dev>';
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
          <p style="margin:28px 0 0;color:#475569;font-size:11px;">Portal Home · You're receiving this because you own this property in your dashboard.</p>
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

/**
 * Sends the welcome email to a newly-approved owner with their temporary
 * password and a button to enter the portal. They'll be forced to change
 * the password on first login.
 */
export type NotifyResult =
  | { sent: true }
  | { sent: false; reason: 'no_resend_key' | 'send_failed' | 'exception'; detail?: string };

export async function notifyOwnerApproved(input: {
  to: string;
  name: string;
  business: string;
  password: string;
}): Promise<NotifyResult> {
  try {
    const loginUrl = `${SITE_URL}/login`;
    const subject = `Tu portal de ${input.business} está listo`;
    const html = `
      <div style="background:#f8fafc;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#22d3ee,#2563eb);padding:24px;color:#fff;">
            <p style="margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.16em;opacity:0.85;">Portal aprobado</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:600;letter-spacing:-0.01em;">¡Bienvenido${input.name ? `, ${escapeHtml(input.name.split(/\s+/)[0])}` : ''}!</h1>
            <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Tu cuenta en Portal Home Digital ya está activa.</p>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:#334155;">
              Estos son tus datos de acceso. <strong>Por seguridad te pediremos cambiar la contraseña</strong> la primera vez que entres.
            </p>
            <div style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;font-family:ui-monospace,Menlo,Monaco,Consolas,monospace;font-size:13px;color:#0f172a;">
              <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Email</div>
              <div style="font-weight:600;">${escapeHtml(input.to)}</div>
              <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:12px 0 4px;">Contraseña temporal</div>
              <div style="font-weight:600;letter-spacing:0.04em;">${escapeHtml(input.password)}</div>
            </div>
            <a href="${escapeAttr(loginUrl)}"
               style="display:inline-block;margin-top:20px;background:linear-gradient(135deg,#22d3ee,#2563eb);color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:10px;">
              Entrar a mi portal
            </a>
            <p style="margin:22px 0 0;color:#64748b;font-size:12px;line-height:1.5;">
              Si no solicitaste esta cuenta, puedes ignorar este mensaje. Si tienes dudas, responde a este email y te ayudamos.
            </p>
          </div>
        </div>
      </div>
    `;
    const result = await sendEmail({ to: input.to, subject, html });
    if ('skipped' in result) return { sent: false, reason: 'no_resend_key' };
    if ('error' in result) return { sent: false, reason: 'send_failed', detail: result.error };
    return { sent: true };
  } catch (err) {
    console.error('[email] notifyOwnerApproved failed', err);
    return { sent: false, reason: 'exception', detail: (err as Error).message };
  }
}

/**
 * Notify the owner when a client sends a message via the magic-link
 * portal. Fired from `sendClientMessage`. Rate-limited at the call
 * site (only sent when the message is the first unread from this
 * client) so a chatty client doesn't trigger a dozen emails.
 *
 * The email body includes:
 *  - The message text (truncated to 400 chars)
 *  - A "Open chat" CTA back to /owner/clients/{id}/messages
 *  - A WhatsApp tap-to-reply deep-link if the client has a phone
 */
export async function notifyOwnerOfClientMessage(input: {
  ownerEmail: string;
  clientName: string;
  clientId: string;
  clientPhone: string | null;
  messageBody: string;
}): Promise<NotifyResult> {
  try {
    const subject = `${input.clientName} te escribió en Portal Home`;
    const trimmed =
      input.messageBody.length > 400
        ? input.messageBody.slice(0, 397) + '…'
        : input.messageBody;
    const chatUrl = `${SITE_URL}/owner/clients/${encodeURIComponent(input.clientId)}/messages`;

    // Lazy import to avoid a circular dep with lib/phone (it doesn't
    // import anything heavy but keeps the boundary clean).
    const { waUrl } = await import('@/lib/phone');
    const wa = waUrl(
      input.clientPhone,
      `Hola ${input.clientName.split(' ')[0] ?? ''}, ya leí tu mensaje en Portal Home — `,
    );

    const safeName = escapeHtml(input.clientName);
    const safeBody = escapeHtml(trimmed).replace(/\n/g, '<br>');

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;padding:24px;">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#22d3ee,#2563eb);padding:20px 24px;color:#fff;">
            <p style="margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.16em;opacity:0.85;">Mensaje nuevo</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;">${safeName}</h1>
          </div>
          <div style="padding:22px 24px;">
            <div style="background:#f1f5f9;border-radius:14px;padding:14px 16px;color:#0f172a;font-size:14px;line-height:1.55;">
              ${safeBody}
            </div>
            <div style="margin-top:18px;display:flex;gap:8px;flex-wrap:wrap;">
              <a href="${escapeAttr(chatUrl)}"
                 style="display:inline-block;background:linear-gradient(135deg,#22d3ee,#2563eb);color:#fff;text-decoration:none;font-weight:600;font-size:13px;padding:10px 18px;border-radius:10px;">
                Abrir chat
              </a>
              ${
                wa
                  ? `<a href="${escapeAttr(wa)}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:600;font-size:13px;padding:10px 18px;border-radius:10px;">Responder por WhatsApp</a>`
                  : ''
              }
            </div>
            <p style="margin:20px 0 0;color:#64748b;font-size:11px;line-height:1.5;">
              Recibís este aviso porque ${safeName} te mandó un mensaje en su portal. Para no perderte más, dejá la pestaña <a href="${escapeAttr(chatUrl)}" style="color:#1d4ed8;">${escapeAttr(chatUrl)}</a> abierta — el chat es en vivo.
            </p>
          </div>
        </div>
      </div>
    `;

    const result = await sendEmail({
      to: input.ownerEmail,
      subject,
      html,
    });
    if ('skipped' in result) return { sent: false, reason: 'no_resend_key' };
    if ('error' in result)
      return { sent: false, reason: 'send_failed', detail: result.error };
    return { sent: true };
  } catch (err) {
    console.error('[email] notifyOwnerOfClientMessage failed', err);
    return { sent: false, reason: 'exception', detail: (err as Error).message };
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

/**
 * Owner gets pinged the moment a client books from their portal. Mirrors
 * notifyOwnerOfClientMessage in shape: violet header (matches the in-app
 * "Solicitudes nuevas" banner), service + date summary, two CTAs (open
 * the requests list, or WhatsApp the client straight back).
 * Fire-and-forget — never throws.
 */
export async function notifyOwnerOfBookingRequest(input: {
  ownerEmail: string;
  clientName: string;
  clientPhone: string | null;
  serviceName: string | null;
  scheduledFor: string;
  startTime: string | null;
  notes: string | null;
}): Promise<NotifyResult> {
  try {
    const safeName = escapeHtml(input.clientName);
    const safeService = escapeHtml(input.serviceName ?? 'Limpieza');
    const dateLabel = (() => {
      try {
        return new Date(input.scheduledFor + 'T00:00:00').toLocaleDateString(
          'es-ES',
          { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' },
        );
      } catch {
        return input.scheduledFor;
      }
    })();
    const safeDate = escapeHtml(
      input.startTime
        ? `${dateLabel} · ${input.startTime.slice(0, 5)}`
        : dateLabel,
    );
    const safeNotes = input.notes
      ? escapeHtml(input.notes).replace(/\n/g, '<br>')
      : null;

    const requestsUrl = `${SITE_URL}/owner/tasks?status=requested`;
    const subject = `${input.clientName} solicitó una ${input.serviceName ?? 'limpieza'}`;

    const { waUrl } = await import('@/lib/phone');
    const firstName = input.clientName.split(' ')[0] ?? '';
    const wa = waUrl(
      input.clientPhone,
      `Hola ${firstName}, vi tu solicitud de ${input.serviceName ?? 'limpieza'} para ${dateLabel}. Te confirmo en breve.`,
    );

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;padding:24px;">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#a855f7,#7c3aed);padding:20px 24px;color:#fff;">
            <p style="margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.16em;opacity:0.85;">Solicitud nueva</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;">${safeName}</h1>
          </div>
          <div style="padding:22px 24px;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;color:#0f172a;">
              <tr><td style="padding:6px 0;color:#64748b;width:90px;">Servicio</td><td style="padding:6px 0;font-weight:600;">${safeService}</td></tr>
              <tr><td style="padding:6px 0;color:#64748b;">Fecha</td><td style="padding:6px 0;font-weight:600;">${safeDate}</td></tr>
            </table>
            ${
              safeNotes
                ? `<div style="margin-top:14px;background:#f1f5f9;border-radius:14px;padding:12px 14px;font-size:13px;color:#334155;line-height:1.55;"><p style="margin:0 0 6px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;">Notas</p>${safeNotes}</div>`
                : ''
            }
            <div style="margin-top:18px;display:flex;gap:8px;flex-wrap:wrap;">
              <a href="${escapeAttr(requestsUrl)}"
                 style="display:inline-block;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;text-decoration:none;font-weight:600;font-size:13px;padding:10px 18px;border-radius:10px;">
                Ver solicitud
              </a>
              ${
                wa
                  ? `<a href="${escapeAttr(wa)}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:600;font-size:13px;padding:10px 18px;border-radius:10px;">Responder por WhatsApp</a>`
                  : ''
              }
            </div>
            <p style="margin:20px 0 0;color:#64748b;font-size:11px;line-height:1.5;">
              Aceptá o rechazá la solicitud desde la lista. Cuando la aceptes podés asignarle un limpiador desde el detalle.
            </p>
          </div>
        </div>
      </div>
    `;

    const result = await sendEmail({ to: input.ownerEmail, subject, html });
    if ('skipped' in result) {
      return { sent: false, reason: 'no_resend_key' };
    }
    return { sent: true };
  } catch (err) {
    console.error('[email] notifyOwnerOfBookingRequest failed', err);
    return { sent: false, reason: 'exception', detail: (err as Error).message };
  }
}

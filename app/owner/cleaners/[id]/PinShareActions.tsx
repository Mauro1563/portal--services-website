'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { waUrl as buildWaUrl } from '@/lib/phone';

export type ShareLang = 'es' | 'en' | 'pt';

type Props = {
  cleanerName: string;
  pin: string;
  phone: string | null;
  email: string | null;
  /**
   * Deep-link to the operative login screen with the PIN pre-filled.
   * Computed server-side in the page (uses lib/cleaner-link.ts) so the
   * 'server-only' boundary stays intact in this client component.
   */
  loginUrl: string;
  /**
   * Public business name (Alan Cleaners, etc) — used in the share copy
   * so the cleaner instantly knows who's writing.
   */
  businessName?: string | null;
  /**
   * Default share language — the platform locale at page render time.
   * The owner can flip between es/en/pt without leaving the page.
   */
  defaultLang: ShareLang;
};

const LANG_LABEL: Record<ShareLang, string> = {
  es: 'ES',
  en: 'EN',
  pt: 'PT',
};

const LANG_FLAG: Record<ShareLang, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  pt: '🇵🇹',
};

type Copy = {
  subject: (team: string) => string;
  body: (args: {
    firstName: string;
    team: string;
    loginUrl: string;
    pin: string;
  }) => string;
  preview: string;
  whatsappPrimary: string;
  whatsappShare: string;
  emailBtn: string;
  copyLink: string;
  linkCopied: string;
  pinFallback: string;
  pinCopy: string;
  pinCopied: string;
};

const COPY: Record<ShareLang, Copy> = {
  es: {
    subject: (team) => `Tu acceso al portal de ${team}`,
    body: ({ firstName, team, loginUrl, pin }) =>
      `¡Hola ${firstName}! 👋\n\n` +
      `Te damos la bienvenida al equipo de ${team}.\n` +
      `Esta es tu app para ver tus limpiezas, hacer check-in y subir fotos.\n\n` +
      `👉 Entra con un toque (PIN ya cargado):\n${loginUrl}\n\n` +
      `Si el link falla, tu PIN es: ${pin}\n\n` +
      `Consejo: añade la página a tu pantalla de inicio para abrirla como una app.`,
    preview: 'Vista previa del mensaje',
    whatsappPrimary: 'Enviar por WhatsApp',
    whatsappShare: 'Compartir por WhatsApp',
    emailBtn: 'Enviar por email',
    copyLink: 'Copiar link',
    linkCopied: 'Link copiado',
    pinFallback: 'PIN de respaldo',
    pinCopy: 'PIN',
    pinCopied: 'Copiado',
  },
  en: {
    subject: (team) => `Your ${team} portal access`,
    body: ({ firstName, team, loginUrl, pin }) =>
      `Hi ${firstName}! 👋\n\n` +
      `Welcome to the ${team} team.\n` +
      `This is your app to see your cleanings, check in, and upload photos.\n\n` +
      `👉 Sign in with one tap (PIN pre-filled):\n${loginUrl}\n\n` +
      `If the link fails, your PIN is: ${pin}\n\n` +
      `Tip: add the page to your home screen for an app-like experience.`,
    preview: 'Message preview',
    whatsappPrimary: 'Send via WhatsApp',
    whatsappShare: 'Share via WhatsApp',
    emailBtn: 'Send via email',
    copyLink: 'Copy link',
    linkCopied: 'Link copied',
    pinFallback: 'Backup PIN',
    pinCopy: 'PIN',
    pinCopied: 'Copied',
  },
  pt: {
    subject: (team) => `Seu acesso ao portal de ${team}`,
    body: ({ firstName, team, loginUrl, pin }) =>
      `Olá ${firstName}! 👋\n\n` +
      `Boas-vindas à equipa de ${team}.\n` +
      `Este é o seu app para ver as limpezas, fazer check-in e subir fotos.\n\n` +
      `👉 Entre com um toque (PIN já carregado):\n${loginUrl}\n\n` +
      `Se o link falhar, o seu PIN é: ${pin}\n\n` +
      `Dica: adicione a página ao ecrã inicial para abri-la como um app.`,
    preview: 'Pré-visualização da mensagem',
    whatsappPrimary: 'Enviar por WhatsApp',
    whatsappShare: 'Partilhar por WhatsApp',
    emailBtn: 'Enviar por email',
    copyLink: 'Copiar link',
    linkCopied: 'Link copiado',
    pinFallback: 'PIN de segurança',
    pinCopy: 'PIN',
    pinCopied: 'Copiado',
  },
};

/**
 * Owner-facing share panel for a cleaner's login link. Builds a clean
 * onboarding message in the owner's chosen language + a one-tap deep
 * link so the cleaner lands on `/operative/login` with the PIN already
 * filled in — same magic-link UX the client portal has.
 *
 * Languages: ES / EN / PT — defaults to the platform locale at page
 * render time. Owner can flip without leaving the page; the WhatsApp,
 * email, link and preview all re-render to the chosen language.
 *
 * Three channels (email hides when we don't have it on file):
 *   - WhatsApp  (uses phone if on file, else share-sheet)
 *   - Email     (mailto: with subject + body)
 *   - Copy link / Copy PIN — always
 */
export function PinShareActions({
  cleanerName,
  pin,
  phone,
  email,
  loginUrl,
  businessName,
  defaultLang,
}: Props) {
  const [lang, setLang] = useState<ShareLang>(defaultLang);
  const [copied, setCopied] = useState<'link' | 'pin' | null>(null);

  const t = COPY[lang];
  const team = businessName?.trim() || 'Portal Home';
  const firstName = cleanerName.split(/\s+/)[0] ?? cleanerName;

  const { message, subject, waUrl, mailUrl } = useMemo(() => {
    const m = t.body({ firstName, team, loginUrl, pin });
    const subj = t.subject(team);
    const wa =
      buildWaUrl(phone, m) ??
      `https://wa.me/?text=${encodeURIComponent(m)}`;
    const mail = email
      ? `mailto:${email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(m)}`
      : null;
    return { message: m, subject: subj, waUrl: wa, mailUrl: mail };
  }, [t, firstName, team, loginUrl, pin, phone, email]);

  async function copy(text: string, what: 'link' | 'pin') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // Older browsers without clipboard API — silent fallback
    }
  }

  return (
    <div className="space-y-3">
      {/* Language picker — flips the message language live */}
      <div
        role="radiogroup"
        aria-label="Idioma del mensaje"
        className="inline-flex rounded-full border border-surface-2 bg-surface-1 p-0.5"
      >
        {(['es', 'en', 'pt'] as const).map((l) => {
          const active = lang === l;
          return (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setLang(l)}
              className={`inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold uppercase tracking-wider transition ${
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-text-2 hover:text-text-1'
              }`}
            >
              <span aria-hidden>{LANG_FLAG[l]}</span>
              {LANG_LABEL[l]}
            </button>
          );
        })}
      </div>

      {/* PRIMARY action: open WhatsApp pre-filled with the welcome msg */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_-10px_rgba(5,150,105,0.55)] transition hover:brightness-110 active:scale-[0.99]"
      >
        <MessageCircle className="h-4 w-4" />
        {phone ? t.whatsappPrimary : t.whatsappShare}
      </a>

      {/* SECONDARY channels — email + copy link */}
      <div className="grid grid-cols-2 gap-2">
        {mailUrl ? (
          <a
            href={mailUrl}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-surface-2 bg-surface-0 text-[12px] font-semibold text-text-1 transition hover:border-brand-400 hover:bg-surface-1"
          >
            <Mail className="h-3.5 w-3.5" />
            {t.emailBtn}
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => copy(loginUrl, 'link')}
          className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-surface-2 bg-surface-0 text-[12px] font-semibold text-text-1 transition hover:border-brand-400 hover:bg-surface-1 ${
            mailUrl ? '' : 'col-span-2'
          }`}
        >
          {copied === 'link' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> {t.linkCopied}
            </>
          ) : (
            <>
              <ExternalLink className="h-3.5 w-3.5" /> {t.copyLink}
            </>
          )}
        </button>
      </div>

      {/* Preview of what gets sent — so the owner knows */}
      <details className="rounded-xl border border-surface-2 bg-surface-1/40 px-3 py-2">
        <summary className="cursor-pointer text-[10.5px] font-bold uppercase tracking-wider text-text-3">
          {t.preview}
        </summary>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-text-3">
          {subject}
        </p>
        <pre className="mt-1 whitespace-pre-wrap break-words font-sans text-[11.5px] leading-relaxed text-text-2">
{message}
        </pre>
      </details>

      {/* PIN fallback — visible + copyable */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-surface-2 bg-surface-1/40 px-3 py-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-3">
            {t.pinFallback}
          </p>
          <p className="mt-0.5 font-mono text-base font-bold tracking-[0.3em] text-text-1">
            {pin}
          </p>
        </div>
        <button
          type="button"
          onClick={() => copy(pin, 'pin')}
          aria-label={t.pinCopy}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-surface-2 bg-surface-0 px-3 text-[11px] font-semibold text-text-2 hover:bg-surface-1"
        >
          {copied === 'pin' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" /> {t.pinCopied}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> {t.pinCopy}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

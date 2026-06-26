'use client';

import { useState, useTransition } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { approveOwnerSignup } from './actions';

type Approved = {
  email: string;
  password: string;
  name: string;
  phone: string | null;
  business: string;
  emailSent: boolean;
  emailReason?: string;
};

const REASON_TEXT: Record<string, string> = {
  no_resend_key: 'RESEND_API_KEY no configurado',
  send_failed: 'Resend rechazó el envío',
  exception: 'Error al enviar',
};

export function ApproveSignupButton({ leadId }: { leadId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { kind: 'idle' } | { kind: 'ok'; data: Approved } | { kind: 'err'; msg: string }
  >({ kind: 'idle' });
  const [copied, setCopied] = useState<'email' | 'password' | 'both' | null>(null);

  const copy = async (text: string, what: 'email' | 'password' | 'both') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard blocked — silent
    }
  };

  if (result.kind === 'ok') {
    const a = result.data;
    const both = `Email: ${a.email}\nContraseña: ${a.password}`;
    const wa = a.phone
      ? `https://wa.me/${a.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
          `Hola ${a.name.split(' ')[0] ?? ''}, tu portal de ${a.business} ya está activo.\n\nEntrá en https://portalservices.digital/login\n\nEmail: ${a.email}\nContraseña: ${a.password}\n\nTe va a pedir cambiar la contraseña en el primer ingreso.`,
        )}`
      : null;

    return (
      <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <p className="text-[12px] font-bold uppercase tracking-wider text-emerald-700">
            Cuenta creada
          </p>
        </div>

        <div className="mt-3 space-y-2 rounded-lg bg-white p-3 ring-1 ring-emerald-100">
          <CredRow
            label="Email"
            value={a.email}
            copied={copied === 'email'}
            onCopy={() => copy(a.email, 'email')}
            mono
          />
          <CredRow
            label="Contraseña temporal"
            value={a.password}
            copied={copied === 'password'}
            onCopy={() => copy(a.password, 'password')}
            mono
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copy(both, 'both')}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-semibold text-white transition hover:bg-slate-700"
          >
            {copied === 'both' ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied === 'both' ? 'Copiado' : 'Copiar todo'}
          </button>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle className="h-3 w-3" />
              Enviar por WhatsApp
            </a>
          )}
        </div>

        {a.emailSent ? (
          <p className="mt-3 text-[11px] text-emerald-700">
            ✓ Email enviado a <span className="font-mono">{a.email}</span>. Estas
            credenciales son tu copia de respaldo.
          </p>
        ) : (
          <p className="mt-3 flex items-start gap-1.5 text-[11px] text-amber-700">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            <span>
              <strong>El email no se envió</strong>
              {a.emailReason && ` (${REASON_TEXT[a.emailReason] ?? a.emailReason})`}.
              Copialas vos y mandáselas por WhatsApp o como prefieras —{' '}
              <strong>se muestran una sola vez</strong>.
            </span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            !confirm(
              '¿Autorizar este registro? Se creará la cuenta. Las credenciales aparecerán acá para que las copies; también intentaremos enviarlas por email.',
            )
          )
            return;
          startTransition(async () => {
            const r = await approveOwnerSignup(leadId);
            if (r.ok) {
              setResult({
                kind: 'ok',
                data: {
                  email: r.email,
                  password: r.password,
                  name: r.name,
                  phone: r.phone,
                  business: r.business,
                  emailSent: r.emailSent,
                  emailReason: r.emailReason,
                },
              });
            } else {
              setResult({ kind: 'err', msg: r.error });
            }
          });
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 px-3.5 text-[12px] font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Autorizando…
          </>
        ) : (
          <>
            <ShieldCheck className="h-3.5 w-3.5" /> Autorizar
          </>
        )}
      </button>
      {result.kind === 'err' ? (
        <span className="text-[11px] text-rose-600">{result.msg}</span>
      ) : null}
    </div>
  );
}

function CredRow({
  label,
  value,
  copied,
  onCopy,
  mono,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-graphite-3">
          {label}
        </div>
        <div
          className={`mt-0.5 truncate text-sm font-semibold text-graphite-1 ${
            mono ? 'font-mono' : ''
          }`}
        >
          {value}
        </div>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copiar ${label.toLowerCase()}`}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

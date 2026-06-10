'use client';

import { useState } from 'react';
import { Check, Copy, MessageCircle, PartyPopper } from 'lucide-react';

export function CreatedCompanyBanner({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const [copied, setCopied] = useState<'creds' | 'pwd' | null>(null);

  const fullMessage =
    `🎉 Welcome to Portal Home!\n\n` +
    `Your account is ready. Sign in here:\n` +
    `https://hq.portalservices.digital/login\n\n` +
    `Email: ${email}\n` +
    `Temporary password: ${password}\n\n` +
    `Important: change your password right after signing in:\n` +
    `Settings → Password.`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;

  function copy(what: 'creds' | 'pwd') {
    const text = what === 'creds' ? fullMessage : password;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(what);
        setTimeout(() => setCopied(null), 1800);
      },
      () => {},
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
          <PartyPopper className="h-5 w-5 text-emerald-700" />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-text-1">
            Account ready — share these credentials
          </h2>
          <p className="text-[11px] text-text-2">
            Send via WhatsApp now. This password page won&apos;t show again
            once you leave.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="rounded-xl border border-emerald-200 bg-surface-0 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-3">
            Email
          </p>
          <p className="mt-1 font-mono text-sm text-text-1">{email}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-surface-0 p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-3">
                Temporary password
              </p>
              <p className="mt-1 font-mono text-base font-bold tracking-wider text-emerald-700">
                {password}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copy('pwd')}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-surface-0 px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
            >
              {copied === 'pwd' ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-card hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" /> Share via WhatsApp
        </a>
        <button
          type="button"
          onClick={() => copy('creds')}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-300 bg-surface-0 px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          {copied === 'creds' ? (
            <>
              <Check className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy full message
            </>
          )}
        </button>
      </div>
    </section>
  );
}

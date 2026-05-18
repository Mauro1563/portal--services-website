'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { X, Loader2, CheckCircle2 } from 'lucide-react';

import { Button } from './ui';
import { cn } from '../lib/cn';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type ContactContextValue = {
  open: (subject?: string) => void;
};

const ContactContext = React.createContext<ContactContextValue | null>(null);

export const useContactModal = (): ContactContextValue => {
  const ctx = React.useContext(ContactContext);
  if (!ctx) {
    throw new Error('useContactModal must be used inside <ContactModalProvider>');
  }
  return ctx;
};

const FALLBACK_EMAIL = 'portalservicesdigital@gmail.com';

const mailtoFor = (subject: string, payload: FormState) => {
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone && `Phone: ${payload.phone}`,
    payload.company && `Company: ${payload.company}`,
    '',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n');
  const params = new URLSearchParams({ subject, body });
  return `mailto:${FALLBACK_EMAIL}?${params.toString()}`;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  website: string;
};

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  website: '',
};

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [subject, setSubject] = React.useState('Website contact');
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const locale = useLocale();
  const t = useTranslations('contact');

  const open = React.useCallback((s?: string) => {
    setSubject(s ?? 'Website contact');
    setStatus('idle');
    setErrorMsg(null);
    setForm(EMPTY);
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, subject, locale }),
      });

      if (res.ok) {
        setStatus('success');
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data?.fallbackToMailto) {
        window.location.href = mailtoFor(subject, form);
        setStatus('success');
        return;
      }

      const key =
        data?.error === 'invalid_email'
          ? 'err_email'
          : data?.error === 'rate_limited'
            ? 'err_rate'
            : 'err_generic';
      setErrorMsg(t(key));
      setStatus('error');
    } catch {
      window.location.href = mailtoFor(subject, form);
      setStatus('success');
    }
  };

  const value = React.useMemo(() => ({ open }), [open]);

  return (
    <ContactContext.Provider value={value}>
      {children}
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-ink-0/80 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-ink-1/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <button
              type="button"
              onClick={close}
              aria-label={t('close')}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {status === 'success' ? (
              <div className="py-6 text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2
                  id="contact-modal-title"
                  className="mt-4 font-display text-2xl font-semibold text-white"
                >
                  {t('success_title')}
                </h2>
                <p className="mt-2 text-sm text-slate-400">{t('success_body')}</p>
                <Button className="mt-6" variant="secondary" onClick={close}>
                  {t('close')}
                </Button>
              </div>
            ) : (
              <>
                <h2
                  id="contact-modal-title"
                  className="font-display text-2xl font-semibold text-white"
                >
                  {t('title')}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{t('subtitle')}</p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <Field
                    label={t('field_name')}
                    required
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    autoComplete="name"
                  />
                  <Field
                    label={t('field_email')}
                    type="email"
                    required
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    autoComplete="email"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label={t('field_phone')}
                      type="tel"
                      value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                      autoComplete="tel"
                    />
                    <Field
                      label={t('field_company')}
                      value={form.company}
                      onChange={(v) => setForm({ ...form, company: v })}
                      autoComplete="organization"
                    />
                  </div>
                  <Field
                    label={t('field_message')}
                    value={form.message}
                    onChange={(v) => setForm({ ...form, message: v })}
                    multiline
                    placeholder={t('field_message_placeholder')}
                  />

                  {errorMsg ? (
                    <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                      {errorMsg}
                    </p>
                  ) : null}

                  <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="ghost" onClick={close}>
                      {t('cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t('sending')}
                        </>
                      ) : (
                        t('submit')
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-slate-500">{t('privacy')}</p>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </ContactContext.Provider>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  autoComplete?: string;
};

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  multiline,
  placeholder,
  autoComplete,
}: FieldProps) {
  const base = cn(
    'block w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white',
    'placeholder:text-slate-500',
    'focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20',
    'transition',
  );
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
        {required ? <span className="ml-0.5 text-cyan-300">*</span> : null}
      </span>
      {multiline ? (
        <textarea
          required={required}
          rows={4}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(base, 'resize-y')}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}
    </label>
  );
}

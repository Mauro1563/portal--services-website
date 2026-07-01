'use client';

/**
 * PSDContactForm — form UI inside the floating card of PSDContactSection.
 *
 * Uses `useActionState` so we can render success and error inline without
 * a page reload. All heavy work (validation, Supabase insert) lives in
 * app/actions/psd-lead.ts. Emerald `#10B981` is the local accent —
 * checkmarks, focus ring and submit button.
 */

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { submitPSDLead, type PSDLeadState } from '@/app/actions/psd-lead';

const INITIAL: PSDLeadState = { ok: false };

const INPUT_CLASS =
  'block h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[14px] text-slate-900 placeholder:text-slate-400 transition focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/40';

const LABEL_CLASS =
  'block text-[13px] font-semibold text-slate-800';

export function PSDContactForm() {
  const t = useTranslations('psd.landing.contact.form');
  const [state, formAction, pending] = useActionState(submitPSDLead, INITIAL);

  if (state.ok) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[#10B981]/40 bg-white p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]"
            aria-hidden
          />
          <div>
            <p className="font-semibold text-slate-900">
              {t('successTitle')}
            </p>
            <p className="mt-1 text-sm text-slate-600">{t('successBody')}</p>
          </div>
        </div>
      </div>
    );
  }

  const errorKey = state.error;

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="psd-name" className={LABEL_CLASS}>
            {t('name')}
          </label>
          <input
            id="psd-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`${INPUT_CLASS} mt-1.5`}
            placeholder={t('namePh')}
          />
        </div>

        <div>
          <label htmlFor="psd-email" className={LABEL_CLASS}>
            {t('email')}
          </label>
          <input
            id="psd-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`${INPUT_CLASS} mt-1.5`}
            placeholder={t('emailPh')}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="psd-company" className={LABEL_CLASS}>
            {t('company')}
          </label>
          <input
            id="psd-company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            className={`${INPUT_CLASS} mt-1.5`}
            placeholder={t('companyPh')}
          />
        </div>
      </div>

      {/* Hidden solution field — the label existed in earlier iterations
          but the new spec is a simpler 4-field form. We keep it as an
          empty hidden input so the server action's typed shape stays
          intact, and the row can be surfaced again if needed. */}
      <input type="hidden" name="solution" value="" />

      <div>
        <label htmlFor="psd-message" className={LABEL_CLASS}>
          {t('message')}
        </label>
        <textarea
          id="psd-message"
          name="message"
          rows={4}
          className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 transition focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/40"
          placeholder={t('messagePh')}
        />
      </div>

      <p className="text-xs text-slate-500">
        {t('compliance')}
      </p>

      {errorKey ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden
          />
          <span>{t(`errors.${errorKey}`)}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] text-[15px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.55)] transition-all duration-200 hover:bg-[#10B981]/90 hover:shadow-[0_10px_26px_-8px_rgba(16,185,129,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? t('submitting') : t('submit')}
        {!pending ? (
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        ) : null}
      </button>
    </form>
  );
}

export default PSDContactForm;

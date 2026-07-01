'use client';

/**
 * PSDContactForm — client wrapper around the useActionState hook so
 * the form can show success/error inline without a full page reload.
 * The heavy lifting (validation + Supabase insert) happens in
 * app/actions/psd-lead.ts server action.
 */

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { submitPSDLead, type PSDLeadState } from '@/app/actions/psd-lead';

const INITIAL: PSDLeadState = { ok: false };

export function PSDContactForm() {
  const t = useTranslations('psd.landing.contact.form');
  const [state, formAction, pending] = useActionState(submitPSDLead, INITIAL);

  if (state.ok) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
            aria-hidden
          />
          <div>
            <p className="font-semibold text-emerald-900">
              {t('successTitle')}
            </p>
            <p className="mt-1 text-sm text-emerald-800">{t('successBody')}</p>
          </div>
        </div>
      </div>
    );
  }

  const errorKey = state.error;

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="psd-name"
            className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700"
          >
            {t('name')}
          </label>
          <input
            id="psd-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-1.5 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/20"
            placeholder={t('namePh')}
          />
        </div>

        <div>
          <label
            htmlFor="psd-email"
            className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700"
          >
            {t('email')}
          </label>
          <input
            id="psd-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1.5 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/20"
            placeholder={t('emailPh')}
          />
        </div>

        <div>
          <label
            htmlFor="psd-company"
            className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700"
          >
            {t('company')}
          </label>
          <input
            id="psd-company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            className="mt-1.5 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/20"
            placeholder={t('companyPh')}
          />
        </div>

        <div>
          <label
            htmlFor="psd-solution"
            className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700"
          >
            {t('solution')}
          </label>
          <select
            id="psd-solution"
            name="solution"
            className="mt-1.5 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/20"
            defaultValue=""
          >
            <option value="">{t('solutionAny')}</option>
            <option value="workforce">Portal Services: Workforce</option>
            <option value="home">Portal Services: Home</option>
            <option value="both">{t('solutionBoth')}</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="psd-message"
          className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700"
        >
          {t('message')}
        </label>
        <textarea
          id="psd-message"
          name="message"
          rows={4}
          className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/20"
          placeholder={t('messagePh')}
        />
      </div>

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
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B2A6B] px-6 text-sm font-semibold text-white shadow-psd-navy-card transition hover:bg-[#103A8C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        <Send className="h-4 w-4" aria-hidden />
        {pending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}

export default PSDContactForm;

'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  Mail,
  Phone,
  User,
  Users2,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { signupOwner, type SignupResult } from './actions';

export type SignupDict = {
  title: string;
  subtitle: string;
  fullName: string;
  fullNamePh: string;
  workEmail: string;
  workEmailPh: string;
  businessName: string;
  businessNamePh: string;
  optional: string;
  optionalToggle: string;
  show: string;
  hide: string;
  phone: string;
  phonePh: string;
  country: string;
  countryPh: string;
  teamSize: string;
  teamSizePh: string;
  team1: string;
  team2: string;
  team3: string;
  submit: string;
  submitting: string;
  haveAccount: string;
  signIn: string;
  backHome: string;
  pendingTitle: string;
  pendingSubtitle: string;
  pendingStep1: string;
  pendingStep2: string;
  pendingStep3: string;
  pendingNote: string;
  pendingBack: string;
};

export function SignupForm({ dict }: { dict: SignupDict }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SignupResult | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      business: String(fd.get('business') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      country: String(fd.get('country') ?? ''),
      teamSize: String(fd.get('teamSize') ?? ''),
    };
    setSubmittedEmail(input.email);
    startTransition(async () => {
      const r = await signupOwner(input);
      setResult(r);
    });
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-300/40 via-blue-400/30 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-transparent blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-4 py-6 sm:py-10">
        <div className="relative w-full">
          <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
          <div className="w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35),0_8px_24px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70">
          <section className="relative flex flex-col px-6 py-7 sm:px-9 sm:py-9">
            <div className="mb-5 flex justify-center">
              <Logo size="md" />
            </div>

            {result?.ok ? (
              <PendingPanel email={submittedEmail} dict={dict} />
            ) : (
              <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
                <h1 className="text-[1.375rem] font-semibold tracking-[-0.015em] text-slate-900">
                  {dict.title}
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                  {dict.subtitle}
                </p>

                {result && !result.ok ? (
                  <p className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200/70 bg-rose-50/80 px-3.5 py-2.5 text-xs text-rose-700 shadow-sm">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                    {result.error}
                  </p>
                ) : null}

                <form className="mt-7 space-y-4" onSubmit={onSubmit}>
                  <Field label={dict.fullName} icon={User}>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder={dict.fullNamePh}
                      className={inputClass}
                    />
                  </Field>
                  <Field label={dict.workEmail} icon={Mail}>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder={dict.workEmailPh}
                      className={inputClass}
                    />
                  </Field>
                  <Field label={dict.businessName} icon={Building2}>
                    <input
                      type="text"
                      name="business"
                      required
                      autoComplete="organization"
                      placeholder={dict.businessNamePh}
                      className={inputClass}
                    />
                  </Field>

                  <details className="group rounded-xl">
                    <summary className="flex cursor-pointer items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:text-slate-600">
                      <span>{dict.optionalToggle}</span>
                      <span className="text-slate-300 group-open:hidden">{dict.show}</span>
                      <span className="hidden text-slate-300 group-open:inline">{dict.hide}</span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      <Field label={dict.phone} icon={Phone} optional optionalLabel={dict.optional}>
                        <input
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          placeholder={dict.phonePh}
                          className={inputClass}
                        />
                      </Field>
                      <Field label={dict.country} icon={Globe} optional optionalLabel={dict.optional}>
                        <input
                          type="text"
                          name="country"
                          autoComplete="country-name"
                          placeholder={dict.countryPh}
                          className={inputClass}
                        />
                      </Field>
                      <Field label={dict.teamSize} icon={Users2} optional optionalLabel={dict.optional}>
                        <select
                          name="teamSize"
                          defaultValue=""
                          className={`${inputClass} appearance-none`}
                        >
                          <option value="">{dict.teamSizePh}</option>
                          <option value="1-5">{dict.team1}</option>
                          <option value="6-20">{dict.team2}</option>
                          <option value="20+">{dict.team3}</option>
                        </select>
                      </Field>
                    </div>
                  </details>

                  <button
                    type="submit"
                    disabled={pending}
                    className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:shadow-[0_22px_48px_-12px_rgba(37,99,235,0.65)] hover:brightness-[1.08] active:translate-y-px disabled:cursor-wait disabled:opacity-70"
                  >
                    <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    {pending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> {dict.submitting}
                      </>
                    ) : (
                      <>
                        {dict.submit}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-600">
                    {dict.haveAccount}{' '}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      {dict.signIn}
                    </Link>
                  </p>
                </form>

                <Link
                  href="/"
                  className="mt-6 text-center text-xs font-medium text-slate-600 transition hover:text-slate-700 lg:text-left"
                >
                  {dict.backHome}
                </Link>
              </div>
            )}
          </section>
          </div>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  'block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-sm font-medium text-slate-900 shadow-inner shadow-slate-200/40 placeholder:font-normal placeholder:text-slate-500 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10';

function Field({
  label,
  icon: Icon,
  optional,
  optionalLabel,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  optional?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span>{label}</span>
        {optional ? (
          <span className="font-medium normal-case tracking-normal text-slate-600">
            {optionalLabel ?? 'optional'}
          </span>
        ) : null}
      </span>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
        {children}
      </div>
    </label>
  );
}

function PendingPanel({ email, dict }: { email: string; dict: SignupDict }) {
  const steps = [
    { Icon: CheckCircle2, label: dict.pendingStep1, done: true },
    { Icon: Clock, label: dict.pendingStep2, done: false },
    { Icon: Mail, label: dict.pendingStep3, done: false },
  ];
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
      <div className="flex justify-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-50 text-blue-600 shadow-inner ring-1 ring-cyan-200/70">
          <Clock className="h-7 w-7" />
        </span>
      </div>
      <h1 className="mt-5 text-center text-[1.375rem] font-semibold tracking-[-0.015em] text-slate-900">
        {dict.pendingTitle}
      </h1>
      <p className="mt-1.5 text-center text-[13px] leading-relaxed text-slate-500">
        {dict.pendingSubtitle.replace('{email}', email)}
      </p>

      <ol className="mt-7 space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                s.done
                  ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                  : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
              }`}
            >
              <s.Icon className="h-3.5 w-3.5" />
            </span>
            <span className={`pt-1 text-[13px] ${s.done ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-xl border border-cyan-200/70 bg-cyan-50/70 px-3.5 py-2.5 text-center text-xs text-slate-700">
        {dict.pendingNote}
      </p>

      <Link
        href="/"
        className="mt-6 text-center text-xs font-medium text-slate-600 transition hover:text-slate-700"
      >
        {dict.pendingBack}
      </Link>
    </div>
  );
}

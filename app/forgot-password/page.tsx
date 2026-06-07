import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { getLocale, getT } from '@/lib/i18n';
import { requestPasswordReset } from './actions';

type Props = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  const t = await getT();
  const locale = await getLocale();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-mesh-1 opacity-90" />
      <div className="absolute inset-0 bg-grid" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-6">
        <div className="flex justify-end">
          <LocaleSwitcher current={locale} variant="dark" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <Logo />

          <div className="mt-10 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {t('forgotPassword.title')}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white">
              {t('forgotPassword.title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {t('forgotPassword.subtitle')}
            </p>

            {sent && (
              <p className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                {t('forgotPassword.sentMessage')}
              </p>
            )}
            {error && (
              <p className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {error}
              </p>
            )}

            <form action={requestPasswordReset} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-300">
                {t('forgotPassword.emailLabel')}
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder={t('login.emailPlaceholder')}
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />
              </label>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow"
              >
                {t('forgotPassword.sendLink')} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <Link
            href="/login?role=owner"
            className="mt-6 text-xs text-slate-500 transition hover:text-slate-300"
          >
            ← {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    </main>
  );
}

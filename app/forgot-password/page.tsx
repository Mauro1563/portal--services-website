import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { PortalLoginCard, LoginField } from '@/components/portal/PortalLoginCard';
import { getT } from '@/lib/i18n';
import { requestPasswordReset } from './actions';

type Props = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;
  const t = await getT();

  return (
    <PortalLoginCard
      title={t('forgotPassword.title')}
      subtitle={t('forgotPassword.subtitle')}
      error={error}
      message={sent ? t('forgotPassword.sentMessage') : undefined}
      footer={
        <Link
          href="/login?role=owner"
          className="block text-center text-[12px] font-semibold text-slate-600 transition hover:text-[#0b1d3a]"
        >
          ← {t('forgotPassword.backToLogin')}
        </Link>
      }
    >
      <form action={requestPasswordReset} className="space-y-3.5">
        <LoginField label={t('forgotPassword.emailLabel')}>
          <div className="relative w-full">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={t('login.emailPh')}
              className="block h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-[#0b1d3a] placeholder:font-normal placeholder:text-slate-500 transition focus:border-[#0b1d3a] focus:outline-none focus:ring-4 focus:ring-[#0b1d3a]/10"
            />
          </div>
        </LoginField>

        <button
          type="submit"
          className="group relative inline-flex h-12 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-[#22d3ee] via-[#2563eb] to-[#1d4ed8] text-[13px] font-bold uppercase tracking-[0.20em] text-white shadow-[0_14px_28px_-10px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.20)] transition-all duration-300 hover:brightness-[1.08] active:translate-y-px"
        >
          <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          {t('forgotPassword.sendLink')}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </form>
    </PortalLoginCard>
  );
}

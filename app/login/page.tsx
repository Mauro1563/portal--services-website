import Link from 'next/link';
import { ArrowRight, Lock, User } from 'lucide-react';
import { PortalLoginCard, LoginField } from '@/components/portal/PortalLoginCard';
import { signIn } from './actions';

type Props = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams;

  return (
    <PortalLoginCard
      badges={['One platform', 'One place', 'Everyone connected']}
      title="Sign in to your account"
      subtitle="Enter your credentials to continue"
      error={error}
      message={message}
    >
      <form action={signIn} className="space-y-4">
        <LoginField label="PIN or Email">
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="identifier"
              required
              autoComplete="username"
              placeholder="026389  or  name@email.com"
              className="block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-sm font-medium text-slate-900 shadow-inner shadow-slate-200/40 placeholder:font-normal placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </LoginField>

        <LoginField label="Password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="block h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-sm font-medium text-slate-900 shadow-inner shadow-slate-200/40 placeholder:font-normal placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </LoginField>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:shadow-[0_22px_48px_-12px_rgba(37,99,235,0.65),inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-[1.08] active:translate-y-px"
        >
          <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          Sign in
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Cleaners enter their 6-digit PIN · Owners enter email + password
        </p>
      </form>
    </PortalLoginCard>
  );
}

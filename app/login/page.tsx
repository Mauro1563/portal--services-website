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
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              name="identifier"
              required
              autoComplete="username"
              placeholder="026389  or  name@email.com"
              className="block h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
        </LoginField>

        <LoginField label="Password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="block h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
        </LoginField>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_28px_-10px_rgba(37,99,235,0.6)] transition hover:brightness-110"
        >
          Sign in
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>

        <p className="text-center text-[11px] text-text-3">
          Cleaners enter their 6-digit PIN · Owners enter email + password
        </p>
      </form>
    </PortalLoginCard>
  );
}

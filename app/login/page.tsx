import Link from 'next/link';
import { ChevronRight, Lock, User } from 'lucide-react';
import { PortalLoginCard, LoginField } from '@/components/portal/PortalLoginCard';
import { PasswordInput } from './PasswordInput';
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
        <LoginField label="Payroll No. or Email">
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="identifier"
              required
              autoComplete="username"
              placeholder="026389  or  name@email.com"
              className="block h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-sm font-medium text-[#0b1d3a] placeholder:font-normal placeholder:text-slate-400 transition focus:border-[#0b1d3a] focus:outline-none focus:ring-4 focus:ring-[#0b1d3a]/10"
            />
          </div>
        </LoginField>

        <LoginField label="Password">
          <PasswordInput />
        </LoginField>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-[#2563eb] transition hover:text-[#1d4ed8]"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#22d3ee] via-[#2563eb] to-[#1d4ed8] text-sm font-bold uppercase tracking-[0.22em] text-white shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.20)] transition-all duration-300 hover:brightness-[1.08] hover:shadow-[0_24px_48px_-12px_rgba(37,99,235,0.65)] active:translate-y-px"
        >
          <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          Sign in
          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </form>
    </PortalLoginCard>
  );
}

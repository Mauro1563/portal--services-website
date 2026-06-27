import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Mail, Phone, User } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { BottomTabBar } from '@/components/operative/BottomTabBar';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { updateOwnProfile } from '../actions';

type Props = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function OperativeProfile({ searchParams }: Props) {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/login');

  const { saved, error } = await searchParams;

  const admin = createAdminClient();
  const { data: cleaner } = await admin
    .from('cleaners')
    .select('id, name, phone, email, pin')
    .eq('id', cleanerId)
    .maybeSingle();

  if (!cleaner) redirect('/login');

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
          My profile
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-text-1">
          {cleaner.name}
        </h1>
      </header>

      <section className="rounded-3xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
          Sign-in PIN
        </p>
        <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.4em] text-text-1">
          {cleaner.pin}
        </p>
        <p className="mt-2 text-[11px] text-text-3">
          Your PIN is set by HQ. Ask your manager if you need it changed.
        </p>
      </section>

      <form action={updateOwnProfile} className="mt-6 space-y-4">
        {saved ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Profile updated.
          </p>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        ) : null}

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-3">
            Full name
          </span>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              name="name"
              required
              defaultValue={cleaner.name ?? ''}
              className="block h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-3">
            Phone
          </span>
          <div className="relative mt-1.5">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="tel"
              name="phone"
              defaultValue={cleaner.phone ?? ''}
              placeholder="+34 600 000 000"
              className="block h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-3">
            Email
          </span>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="email"
              name="email"
              defaultValue={cleaner.email ?? ''}
              placeholder="name@email.com"
              className="block h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
        </label>

        <SubmitButton
          pendingLabel="Saving…"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110 disabled:opacity-80"
        >
          Save changes
        </SubmitButton>
      </form>
      </div>
      <BottomTabBar active="perfil" />
    </main>
  );
}

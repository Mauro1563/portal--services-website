import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Crown,
  KeyRound,
  ListChecks,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShieldOff,
  Unlock,
  Upload,
  Users,
} from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { requireSuperAdmin } from '@/lib/super-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  hqDisableCompany,
  hqEnableCompany,
  hqRegenerateCleanerPin,
  hqUpdateCompany,
} from './actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function CompanyDetail({ params, searchParams }: Props) {
  await requireSuperAdmin();
  const { id } = await params;
  const { message, error } = await searchParams;

  const admin = createAdminClient();

  const { data: userRes } = await admin.auth.admin.getUserById(id);
  const user = userRes?.user;
  if (!user) notFound();

  const [{ data: profile }, propsRes, cleanersRes, tasksRes, completedRes, subRes] =
    await Promise.all([
      admin
        .from('owner_profiles')
        .select('business_name, business_logo_url, updated_at')
        .eq('owner_id', id)
        .maybeSingle(),
      admin
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', id),
      admin
        .from('cleaners')
        .select('id, name, phone, email, pin')
        .eq('owner_id', id)
        .order('name', { ascending: true }),
      admin
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', id),
      admin
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', id)
        .eq('status', 'completed'),
      admin
        .from('subscriptions')
        .select('tier, status, current_period_end')
        .eq('owner_id', id)
        .maybeSingle(),
    ]);

  type CleanerRow = { id: string; name: string; phone: string | null; email: string | null; pin: string };
  const cleaners = (cleanersRes.data ?? []) as CleanerRow[];

  const isDisabled = (user as { banned_until?: string | null }).banned_until != null;

  return (
    <main className="relative min-h-screen bg-surface-1 pb-16">
      <header className="sticky top-0 z-40 border-b border-navy-800/40 bg-navy-900 text-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <ZapliLogo size="sm" tone="onDark" />
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
              <Crown className="h-3 w-3" /> HQ
            </span>
          </div>
          <Link href="/hq" className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" />
            All companies
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-start gap-4">
          {profile?.business_logo_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profile.business_logo_url}
              alt={profile.business_name ?? 'Logo'}
              className="h-16 w-16 shrink-0 rounded-2xl border border-surface-2 bg-surface-0 object-contain p-1.5"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-1 text-text-3">
              <Building2 className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold text-text-1">
              {profile?.business_name ?? user.email ?? 'Unnamed'}
            </h1>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-2">
              <Mail className="h-3 w-3" />
              {user.email}
            </p>
            <p className="mt-0.5 text-[11px] text-text-3">
              Signed up{' '}
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
              {isDisabled ? ' · ACCOUNT DISABLED' : ''}
            </p>
          </div>
        </div>

        {message ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        ) : null}

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            icon={<Building2 className="h-4 w-4 text-brand-600" />}
            label="Properties"
            value={propsRes.count ?? 0}
          />
          <Stat
            icon={<Users className="h-4 w-4 text-brand-600" />}
            label="Cleaners"
            value={cleaners.length}
          />
          <Stat
            icon={<ListChecks className="h-4 w-4 text-amber-500" />}
            label="Total cleanings"
            value={tasksRes.count ?? 0}
          />
          <Stat
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            label="Completed"
            value={completedRes.count ?? 0}
          />
        </div>

        {/* Plan */}
        <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <h2 className="font-display text-base font-semibold text-text-1">Plan</h2>
          {subRes.data ? (
            <p className="mt-2 text-sm text-text-1">
              {subRes.data.tier ?? '—'}{' '}
              <span className="text-text-3">·</span>{' '}
              <span
                className={
                  subRes.data.status === 'active' || subRes.data.status === 'trialing'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }
              >
                {subRes.data.status}
              </span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-text-2">No plan yet.</p>
          )}
        </section>

        {/* Branding override (super-admin can edit on customer's behalf) */}
        <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-1">
              <Briefcase className="h-5 w-5 text-brand-600" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-text-1">
                Branding (white-label)
              </h2>
              <p className="text-[11px] text-text-2">
                Set this company's name and logo on their behalf. They see their own branding everywhere.
              </p>
            </div>
          </div>

          <form
            action={hqUpdateCompany}
            encType="multipart/form-data"
            className="mt-5 space-y-4"
          >
            <input type="hidden" name="owner_id" value={user.id} />
            <Field
              label="Business name"
              name="business_name"
              defaultValue={profile?.business_name ?? ''}
              placeholder="e.g. ABC Cleaning Ltd"
            />
            <div>
              <span className="text-xs font-medium text-text-2">Logo</span>
              <div className="mt-1.5 flex items-center gap-3">
                {profile?.business_logo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.business_logo_url}
                    alt="Current logo"
                    className="h-14 w-14 rounded-xl border border-surface-2 bg-surface-0 object-contain p-1"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-surface-2 bg-surface-1 text-text-3">
                    <Briefcase className="h-5 w-5" />
                  </div>
                )}
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1">
                  <Upload className="h-4 w-4" /> Choose
                  <input
                    type="file"
                    name="business_logo"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-2 text-[11px] text-text-3">
                PNG / JPG / WebP / SVG — max 2 MB.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow"
            >
              Save changes
            </button>
          </form>
        </section>

        {/* Account state (disable / re-enable) */}
        <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <ShieldOff className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-text-1">
                Account state
              </h2>
              <p className="text-[11px] text-text-2">
                Temporarily lock this customer out without deleting their data.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {isDisabled ? (
              <form action={hqEnableCompany}>
                <input type="hidden" name="owner_id" value={user.id} />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  <Unlock className="h-4 w-4" /> Re-enable account
                </button>
              </form>
            ) : (
              <form action={hqDisableCompany}>
                <input type="hidden" name="owner_id" value={user.id} />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 text-sm font-medium text-rose-700 hover:bg-rose-50"
                >
                  <Lock className="h-4 w-4" /> Disable account
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-surface-2 bg-surface-0 p-6 shadow-card">
          <header className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-text-1">
                Cleaners ({cleaners.length})
              </h2>
              <p className="mt-0.5 text-xs text-text-3">
                Each cleaner signs in with their PIN. Regenerate it if it
                leaks or the cleaner leaves the company.
              </p>
            </div>
          </header>

          {cleaners.length === 0 ? (
            <p className="mt-5 rounded-xl border border-dashed border-surface-2 bg-surface-1 px-4 py-6 text-center text-xs text-text-3">
              This company has no cleaners yet.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-surface-2">
              {cleaners.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-text-1">
                      {c.name}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-text-3">
                      {c.email ? (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {c.email}
                        </span>
                      ) : null}
                      {c.phone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {c.phone}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-1 px-3 py-1.5 font-mono text-sm font-semibold tracking-[0.3em] text-text-1">
                      <KeyRound className="h-3.5 w-3.5 text-text-3" />
                      {c.pin}
                    </span>
                    <form action={hqRegenerateCleanerPin}>
                      <input type="hidden" name="owner_id" value={user.id} />
                      <input type="hidden" name="cleaner_id" value={c.id} />
                      <button
                        type="submit"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-surface-2 bg-surface-0 px-3 text-xs font-semibold text-text-2 hover:border-brand-600/30 hover:text-brand-700"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Regenerate
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wider text-text-3">{label}</p>
        {icon}
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-text-1 tabular-nums">{value}</p>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-4 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      />
    </label>
  );
}

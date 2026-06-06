import Link from 'next/link';
import {
  Building2,
  CreditCard,
  ListChecks,
  Mail,
  Search,
  Send,
  UserPlus,
  Users,
} from 'lucide-react';
import { requireSuperAdmin } from '@/lib/super-admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { PortalShell } from '@/components/portal/PortalDashboardShell';
import { signout } from '@/app/login/actions';
import { hqCreateCompanyDirect, hqInviteCompany } from '../actions';
import { CreatedCompanyBanner } from '../CreatedCompanyBanner';

type OwnerProfileRow = {
  owner_id: string;
  business_name: string | null;
  business_logo_url: string | null;
  updated_at: string | null;
};

type CompanyStats = {
  ownerId: string;
  email: string | null;
  createdAt: string | null;
  businessName: string | null;
  logoUrl: string | null;
  propertiesCount: number;
  cleanersCount: number;
  tasksCount: number;
  plan: string | null;
  planStatus: string | null;
};

type Props = {
  searchParams: Promise<{
    q?: string;
    message?: string;
    error?: string;
    created_email?: string;
    created_password?: string;
  }>;
};

export default async function HqCompaniesIndex({ searchParams }: Props) {
  await requireSuperAdmin();
  const { q, message, error, created_email, created_password } = await searchParams;
  const needle = (q ?? '').trim().toLowerCase();

  const admin = createAdminClient();

  const { data: authData } = await admin.auth.admin.listUsers({ perPage: 200 });
  const users = authData?.users ?? [];

  const { data: profilesData } = await admin
    .from('owner_profiles')
    .select('owner_id, business_name, business_logo_url, updated_at');
  const profiles = (profilesData ?? []) as OwnerProfileRow[];
  const profileByOwner = new Map(profiles.map((p) => [p.owner_id, p]));

  const { data: subsData } = await admin
    .from('subscriptions')
    .select('owner_id, tier, status');
  const subByOwner = new Map(
    (subsData ?? []).map((s) => [s.owner_id, { tier: s.tier, status: s.status }]),
  );

  const stats: CompanyStats[] = await Promise.all(
    users.map(async (u): Promise<CompanyStats> => {
      const [propsRes, cleanersRes, tasksRes] = await Promise.all([
        admin
          .from('properties')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', u.id),
        admin
          .from('cleaners')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', u.id),
        admin
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', u.id),
      ]);
      const profile = profileByOwner.get(u.id);
      const sub = subByOwner.get(u.id);
      return {
        ownerId: u.id,
        email: u.email ?? null,
        createdAt: u.created_at ?? null,
        businessName: profile?.business_name ?? null,
        logoUrl: profile?.business_logo_url ?? null,
        propertiesCount: propsRes.count ?? 0,
        cleanersCount: cleanersRes.count ?? 0,
        tasksCount: tasksRes.count ?? 0,
        plan: sub?.tier ?? null,
        planStatus: sub?.status ?? null,
      };
    }),
  );

  const filtered = needle
    ? stats.filter(
        (c) =>
          (c.email ?? '').toLowerCase().includes(needle) ||
          (c.businessName ?? '').toLowerCase().includes(needle),
      )
    : stats;
  filtered.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

  const totalCompanies = stats.length;
  const totalProperties = stats.reduce((s, x) => s + x.propertiesCount, 0);
  const totalTasks = stats.reduce((s, x) => s + x.tasksCount, 0);
  const paying = stats.filter(
    (x) => x.planStatus === 'active' || x.planStatus === 'trialing',
  ).length;

  return (
    <PortalShell
      backHref="/hq"
      backLabel="Dashboard"
      rightSlot={
        <form action={signout}>
          <button
            type="submit"
            className="text-[11px] font-semibold text-text-3 hover:text-text-1"
          >
            Sign out
          </button>
        </form>
      }
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
        Super-admin
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-text-1">
        Companies overview
      </h1>
      <p className="mt-1 text-sm text-text-2">
        Every account that has signed up. Each row is a tenant company.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi
          icon={<Building2 className="h-4 w-4 text-brand-600" />}
          label="Companies"
          value={totalCompanies}
        />
        <Kpi
          icon={<CreditCard className="h-4 w-4 text-emerald-500" />}
          label="Active / trialing"
          value={paying}
        />
        <Kpi
          icon={<Building2 className="h-4 w-4 text-brand-600" />}
          label="Total properties"
          value={totalProperties}
        />
        <Kpi
          icon={<ListChecks className="h-4 w-4 text-amber-500" />}
          label="Total cleanings"
          value={totalTasks}
        />
      </div>

      {message ? (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      {created_email && created_password ? (
        <CreatedCompanyBanner
          email={created_email}
          password={created_password}
        />
      ) : null}

      <section className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/60 p-5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
            <UserPlus className="h-5 w-5 text-amber-700" />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-text-1">
              Onboard a new company
            </h2>
            <p className="text-[11px] text-text-2">
              <strong>Recommended:</strong> create with a temporary password
              and share via WhatsApp.
            </p>
          </div>
        </div>

        <form
          action={hqCreateCompanyDirect}
          className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="customer@example.com"
            className="h-10 rounded-xl border border-amber-200 bg-surface-0 px-3 text-sm text-text-1 placeholder:text-text-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="text"
            name="business_name"
            placeholder="Business name (optional)"
            className="h-10 rounded-xl border border-amber-200 bg-surface-0 px-3 text-sm text-text-1 placeholder:text-text-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white shadow-card hover:bg-amber-700"
          >
            <UserPlus className="h-3.5 w-3.5" /> Create &amp; share
          </button>
        </form>

        <details className="mt-3">
          <summary className="cursor-pointer text-[11px] text-text-3 hover:text-text-2">
            Or send an email invite instead (requires SMTP configured)
          </summary>
          <form
            action={hqInviteCompany}
            className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="customer@example.com"
              className="h-10 rounded-xl border border-surface-2 bg-surface-0 px-3 text-sm text-text-1 placeholder:text-text-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <input
              type="text"
              name="business_name"
              placeholder="Business name (optional)"
              className="h-10 rounded-xl border border-surface-2 bg-surface-0 px-3 text-sm text-text-1 placeholder:text-text-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-surface-0 px-4 text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
              <Send className="h-3.5 w-3.5" /> Send email invite
            </button>
          </form>
        </details>
      </section>

      <form method="get" className="mt-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search by company name or email…"
            className="h-10 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>
      </form>

      <section className="mt-5 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-2">
            No companies yet.
          </div>
        ) : (
          <ul className="divide-y divide-surface-2">
            {filtered.map((c) => (
              <li key={c.ownerId}>
                <Link
                  href={`/hq/companies/${c.ownerId}`}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-surface-1"
                >
                  {c.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={c.logoUrl}
                      alt={c.businessName ?? 'Logo'}
                      className="h-10 w-10 shrink-0 rounded-xl border border-surface-2 bg-surface-0 object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-1 text-text-3">
                      <Building2 className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-text-1">
                      {c.businessName ?? c.email ?? 'Unnamed'}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 truncate text-[11px] text-text-3">
                      <Mail className="h-3 w-3" />
                      {c.email}
                    </p>
                  </div>
                  <div className="hidden items-center gap-4 text-[11px] text-text-2 sm:flex">
                    <Stat icon={<Building2 className="h-3 w-3" />} value={c.propertiesCount} />
                    <Stat icon={<Users className="h-3 w-3" />} value={c.cleanersCount} />
                    <Stat icon={<ListChecks className="h-3 w-3" />} value={c.tasksCount} />
                  </div>
                  <PlanBadge tier={c.plan} status={c.planStatus} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PortalShell>
  );
}

function Kpi({
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
      <p className="mt-2 font-display text-2xl font-bold text-text-1 tabular-nums">
        {value}
      </p>
    </div>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-text-2">
      {icon}
      <span className="tabular-nums">{value}</span>
    </span>
  );
}

function PlanBadge({ tier, status }: { tier: string | null; status: string | null }) {
  if (!tier) {
    return (
      <span className="ml-2 rounded-full bg-surface-1 px-2 py-0.5 text-[10px] font-semibold text-text-3 ring-1 ring-inset ring-surface-2">
        No plan
      </span>
    );
  }
  const isActive = status === 'active' || status === 'trialing';
  return (
    <span
      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-amber-50 text-amber-700 ring-amber-200'
      }`}
    >
      {tier}
    </span>
  );
}

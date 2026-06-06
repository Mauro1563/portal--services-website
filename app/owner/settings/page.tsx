import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Briefcase,
  Download,
  KeyRound,
  Mail,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/login/actions';
import { PLAN_LABELS, type PlanTier } from '@/lib/stripe';
import { LightLayout } from '@/components/owner/LightLayout';
import { getT } from '@/lib/i18n';
import { getOwnerProfile } from '@/lib/owner-profile';
import {
  deleteAccount,
  removeBusinessLogo,
  updateBusinessProfile,
  updateEmail,
  updatePassword,
} from './actions';

type SearchParams = Promise<{ message?: string; error?: string }>;

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const { message, error } = await searchParams;

  const [{ data: subscription }, profile] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('tier, status, current_period_end')
      .eq('owner_id', user.id)
      .maybeSingle(),
    getOwnerProfile(user.id),
  ]);

  return (
    <LightLayout activeTab="more" title={t('settings.title')} showBack backHref="/owner/more">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        {t('settings.eyebrow')}
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-text-1">
        {t('settings.title')}
      </h1>
      <p className="mt-1 text-sm text-text-2">{t('settings.subtitle')}</p>

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

      {/* Business profile (white-label) */}
      <Section
        icon={<Briefcase className="h-5 w-5 text-brand-600" />}
        title="Business profile"
        description="Set your company name and upload your logo. It replaces ours in the header and dashboard for you and your team."
      >
        <form action={updateBusinessProfile} encType="multipart/form-data" className="space-y-4">
          <Field
            label="Business name"
            name="business_name"
            defaultValue={profile.business_name ?? ''}
            placeholder="e.g. ABC Cleaning Ltd"
          />

          <div>
            <span className="text-xs font-medium text-text-2">Logo</span>
            <div className="mt-1.5 flex items-center gap-3">
              {profile.business_logo_url ? (
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
                <Upload className="h-4 w-4" />
                Choose image
                <input
                  type="file"
                  name="business_logo"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
              </label>
            </div>
            <p className="mt-2 text-[11px] text-text-3">
              PNG, JPG, WebP or SVG · max 2 MB · square preferred.
            </p>
          </div>

          <SubmitButton>{t('common.saveChanges')}</SubmitButton>
        </form>

        {profile.business_logo_url ? (
          <form action={removeBusinessLogo} className="mt-3">
            <button
              type="submit"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-surface-2 bg-surface-0 px-2.5 text-[11px] text-text-2 hover:bg-rose-50 hover:text-rose-700"
            >
              <X className="h-3.5 w-3.5" /> Remove logo
            </button>
          </form>
        ) : null}
      </Section>

      {/* Plan */}
      <Section
        icon={<KeyRound className="h-5 w-5 text-brand-600" />}
        title={t('settings.planTitle')}
        description={
          subscription
            ? t('settings.planActive').replace(
                '{name}',
                PLAN_LABELS[subscription.tier as PlanTier]?.name ?? 'Unknown',
              )
            : t('settings.planNone')
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            {subscription ? (
              <>
                <p className="text-text-1">
                  {PLAN_LABELS[subscription.tier as PlanTier]?.name ?? subscription.tier}
                </p>
                <p className="mt-0.5 text-xs text-text-2">
                  {t('settings.title')}:{' '}
                  <span
                    className={
                      subscription.status === 'active' ||
                      subscription.status === 'trialing'
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }
                  >
                    {subscription.status}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-text-2">{t('settings.noPlanYet')}</p>
            )}
          </div>
          <Link
            href="/owner/billing"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
          >
            {subscription ? t('settings.managePlan') : t('settings.choosePlan')}
          </Link>
        </div>
      </Section>

      {/* Email */}
      <Section
        icon={<Mail className="h-5 w-5 text-brand-600" />}
        title={t('settings.emailTitle')}
        description={t('settings.emailSubtitle')}
      >
        <form action={updateEmail} className="space-y-3">
          <Field
            label={t('login.email')}
            name="email"
            type="email"
            defaultValue={user.email ?? ''}
            required
          />
          <SubmitButton>{t('settings.updateEmail')}</SubmitButton>
        </form>
      </Section>

      {/* Password */}
      <Section
        icon={<KeyRound className="h-5 w-5 text-brand-600" />}
        title={t('settings.passwordTitle')}
        description={t('settings.passwordSubtitle')}
      >
        <form action={updatePassword} className="space-y-3">
          <Field label={t('settings.newPassword')} name="password" type="password" required />
          <Field label={t('settings.confirmPassword')} name="confirm" type="password" required />
          <SubmitButton>{t('settings.updatePassword')}</SubmitButton>
        </form>
      </Section>

      {/* Export */}
      <Section
        icon={<Download className="h-5 w-5 text-brand-600" />}
        title={t('settings.exportTitle')}
        description={t('settings.exportSubtitle')}
      >
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/owner/export?kind=properties"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
          >
            <Download className="h-3.5 w-3.5" /> Properties.csv
          </a>
          <a
            href="/api/owner/export?kind=cleaners"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
          >
            <Download className="h-3.5 w-3.5" /> Cleaners.csv
          </a>
          <a
            href="/api/owner/export?kind=tasks"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1"
          >
            <Download className="h-3.5 w-3.5" /> Tasks.csv
          </a>
        </div>
      </Section>

      {/* Sign out */}
      <section className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
        <p className="text-xs text-text-2">
          {t('settings.signedInAs').replace('{email}', user.email ?? '')}
        </p>
        <form action={signout}>
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-3 text-xs font-medium text-text-1 hover:bg-surface-1"
          >
            {t('common.signOut')}
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="mt-6 mb-4 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Trash2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-text-1">
              {t('settings.deleteTitle')}
            </h2>
            <p className="text-[11px] text-text-2">{t('settings.deleteSubtitle')}</p>
          </div>
        </div>
        <form action={deleteAccount} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-text-2">
              {t('settings.typeDelete')}
            </span>
            <input
              type="text"
              name="confirmation"
              autoComplete="off"
              className="mt-1.5 block w-full rounded-xl border border-rose-200 bg-surface-0 px-4 py-2.5 text-sm text-text-1 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-medium text-white hover:bg-rose-700"
          >
            {t('settings.deletePermanent')}
          </button>
        </form>
      </section>
    </LightLayout>
  );
}

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-1">
          {icon}
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-text-1">{title}</h2>
          {description ? (
            <p className="text-[11px] text-text-2">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-4 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      />
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow"
    >
      {children}
    </button>
  );
}

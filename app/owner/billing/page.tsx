import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Check, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { getT } from '@/lib/i18n';
import { PLAN_LABELS, PLAN_PRICE_IDS, type PlanTier } from '@/lib/stripe';
import { openBillingPortal, startCheckout } from './actions';

type Props = {
  searchParams: Promise<{
    success?: string;
    canceled?: string;
    error?: string;
  }>;
};

const PLAN_BENEFITS: Record<PlanTier, string[]> = {
  airbnb: [
    'Up to 10 properties',
    'Auto-assign tasks per property',
    'Photo evidence per clean',
    'Airbnb iCal sync',
    'WhatsApp-free supervisor inbox',
    'Email support',
  ],
  midmarket: [
    'Unlimited sites and shifts',
    'Day / night shift management',
    'Supervisor dashboard',
    'Timesheets + holiday reports',
    'GPS-verified clock in/out',
    'Onboarded in one week',
    'Priority support',
  ],
  enterprise: [
    'White-label with your logo and colours',
    'Custom community portal',
    'ERP / payroll integration via API',
    'SSO / SAML, advanced RBAC',
    'Dedicated SLA + account manager',
    'Single-tenant infra available',
  ],
};

export default async function BillingPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const { success, canceled, error } = await searchParams;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_end')
    .eq('owner_id', user.id)
    .maybeSingle();

  const tiers: PlanTier[] = ['airbnb', 'midmarket', 'enterprise'];

  return (
    <LightLayout
      activeTab="more"
      title={subscription ? t('billing.titleActive') : t('billing.title')}
      showBack
      backHref="/owner/more"
    >
      <h1 className="font-display text-2xl font-semibold text-text-1">
        {subscription ? t('billing.titleActive') : t('billing.title')}
      </h1>
      <p className="mt-1 text-xs text-text-2">{t('billing.subtitle')}</p>

      {success && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {t('billing.successMsg')}
        </p>
      )}
      {canceled && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {t('billing.cancelledMsg')}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      {subscription && (
        <section className="mt-5 rounded-2xl border border-brand-600/30 bg-brand-600/[0.04] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
            {t('billing.currentPlan')}
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-text-1">
            {subscription.tier
              ? PLAN_LABELS[subscription.tier as PlanTier]?.name
              : 'Unknown'}
          </p>
          <p className="mt-0.5 text-[11px] text-text-2">
            {t('billing.status')}{' '}
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
            {subscription.current_period_end && (
              <>
                {' · '}
                {subscription.status === 'trialing'
                  ? t('billing.trialEnds')
                  : t('billing.renews')}{' '}
                {new Date(subscription.current_period_end).toLocaleDateString(
                  'en-GB',
                  { day: 'numeric', month: 'short', year: 'numeric' },
                )}
              </>
            )}
          </p>
          <form action={openBillingPortal} className="mt-4">
            <SubmitButton
              pendingLabel="Abriendo…"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-1 hover:bg-surface-1 disabled:opacity-60"
            >
              {t('billing.manageBilling')} <ExternalLink className="h-3.5 w-3.5" />
            </SubmitButton>
          </form>
        </section>
      )}

      <div className="mt-5 space-y-4 pb-4">
        {tiers.map((tier) => {
          const label = PLAN_LABELS[tier];
          const benefits = PLAN_BENEFITS[tier];
          const featured = tier === 'midmarket';
          const hasPrice = !!PLAN_PRICE_IDS[tier];
          const isCurrent = subscription?.tier === tier;
          return (
            <div
              key={tier}
              className={
                featured
                  ? 'relative rounded-2xl border border-brand-600/40 bg-surface-0 p-5 shadow-card-lg'
                  : 'relative rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card'
              }
            >
              {isCurrent ? (
                <span className="absolute -top-2 right-4 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {t('billing.current')}
                </span>
              ) : featured ? (
                <span className="absolute -top-2 right-4 rounded-full border border-brand-600/30 bg-brand-600/10 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                  {t('billing.mostPopular')}
                </span>
              ) : null}
              <p className="font-display text-base font-semibold text-text-1">
                {label.name}
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-brand-700">
                {label.price}
              </p>

              <ul className="mt-4 space-y-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-text-1">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {!isCurrent && (
                <form action={startCheckout} className="mt-5">
                  <input type="hidden" name="tier" value={tier} />
                  <SubmitButton
                    disabled={!hasPrice}
                    pendingLabel="Abriendo Stripe…"
                    className={
                      featured
                        ? 'flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow disabled:cursor-not-allowed disabled:opacity-50'
                        : 'flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-surface-2 bg-surface-0 text-sm font-medium text-text-1 hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-50'
                    }
                  >
                    {hasPrice
                      ? subscription
                        ? t('billing.switchPlan')
                        : t('billing.startTrial')
                      : t('billing.comingSoon')}
                  </SubmitButton>
                </form>
              )}
              {!hasPrice && (
                <p className="mt-2 text-center text-[10px] text-text-3">
                  {t('billing.stripePriceMissing')}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-2 mb-4 text-center text-[11px] text-text-3">
        {t('billing.footer')}
      </p>
    </LightLayout>
  );
}

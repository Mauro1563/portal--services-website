import Stripe from 'stripe';

/**
 * Lazy Stripe client. Instantiated on first use so that pages and route
 * modules can be imported during the Vercel build even when STRIPE_SECRET_KEY
 * has not been configured yet (pre-launch). Throws clearly when something
 * actually tries to use it without the env var.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Add it in Vercel → Settings → Environment Variables.',
    );
  }
  _stripe = new Stripe(key, {
    apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
    typescript: true,
  });
  return _stripe;
}

export type PlanTier = 'airbnb' | 'midmarket' | 'enterprise';

export const PLAN_PRICE_IDS: Record<PlanTier, string | undefined> = {
  airbnb: process.env.STRIPE_PRICE_AIRBNB,
  midmarket: process.env.STRIPE_PRICE_MIDMARKET,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

export const PLAN_LABELS: Record<PlanTier, { name: string; price: string }> = {
  airbnb: { name: 'Airbnb / Property', price: '£49 / month' },
  midmarket: { name: 'Mid-market', price: '£150 / month' },
  enterprise: { name: 'Enterprise', price: '£500 / month' },
};

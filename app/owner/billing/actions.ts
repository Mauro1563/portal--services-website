'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth';
import { PLAN_PRICE_IDS, getStripe, type PlanTier } from '@/lib/stripe';

export async function startCheckout(formData: FormData) {
  const { user } = await requireOwner();

  const tier = (formData.get('tier') as string)?.trim() as PlanTier;
  const priceId = PLAN_PRICE_IDS[tier];

  if (!priceId) {
    redirect(
      '/owner/billing?error=' +
        encodeURIComponent(`Stripe price ID for tier "${tier}" is not configured.`),
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    redirect(
      '/owner/billing?error=' +
        encodeURIComponent('Stripe is not configured on this deployment.'),
    );
  }

  const hdrs = await headers();
  const host = hdrs.get('host');
  const proto = hdrs.get('x-forwarded-proto') ?? 'https';
  const origin = `${proto}://${host}`;

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    subscription_data: {
      trial_period_days: 14,
      metadata: { owner_id: user.id, tier },
    },
    metadata: { owner_id: user.id, tier },
    success_url: `${origin}/owner/billing?success=1`,
    cancel_url: `${origin}/owner/billing?canceled=1`,
    allow_promotion_codes: true,
  });

  if (!session.url) {
    redirect(
      '/owner/billing?error=' +
        encodeURIComponent('Could not start Stripe checkout. Try again.'),
    );
  }

  redirect(session.url);
}

export async function openBillingPortal() {
  const { user } = await requireOwner();

  if (!process.env.STRIPE_SECRET_KEY) {
    redirect(
      '/owner/billing?error=' +
        encodeURIComponent('Stripe is not configured on this deployment.'),
    );
  }

  const stripe = getStripe();
  // Look up the customer by email — simpler than storing the id ourselves.
  // For production we'd cache stripe_customer_id on a profiles table.
  const customers = await stripe.customers.list({
    email: user.email ?? '',
    limit: 1,
  });
  const customer = customers.data[0];

  if (!customer) {
    redirect(
      '/owner/billing?error=' +
        encodeURIComponent('No Stripe customer found. Start a subscription first.'),
    );
  }

  const hdrs = await headers();
  const host = hdrs.get('host');
  const proto = hdrs.get('x-forwarded-proto') ?? 'https';
  const origin = `${proto}://${host}`;

  const portal = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${origin}/owner/billing`,
  });

  redirect(portal.url);
}

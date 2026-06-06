import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/**
 * Stripe webhook receiver.
 * Set STRIPE_WEBHOOK_SECRET in Vercel and the same value in your Stripe
 * webhook endpoint settings.
 *
 * Persists subscriptions to public.subscriptions (one row per owner).
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET not configured' },
      { status: 500 },
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid signature: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const upsertSubscription = async (params: {
    ownerId: string;
    customerId: string | null;
    subscriptionId: string | null;
    tier: string | null;
    status: string;
    currentPeriodEnd: number | null;
  }) => {
    await admin.from('subscriptions').upsert(
      {
        owner_id: params.ownerId,
        stripe_customer_id: params.customerId,
        stripe_subscription_id: params.subscriptionId,
        tier: params.tier,
        status: params.status,
        current_period_end: params.currentPeriodEnd
          ? new Date(params.currentPeriodEnd * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );
  };

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const ownerId = session.metadata?.owner_id;
      const tier = session.metadata?.tier ?? null;
      const subscriptionId = (session.subscription as string) ?? null;
      const customerId = (session.customer as string) ?? null;

      if (ownerId && subscriptionId) {
        // Fetch the subscription to know status + period
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await upsertSubscription({
          ownerId,
          customerId,
          subscriptionId,
          tier,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end ?? null,
        });
      }
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const ownerId = sub.metadata?.owner_id;
      const tier = sub.metadata?.tier ?? null;
      if (ownerId) {
        await upsertSubscription({
          ownerId,
          customerId: typeof sub.customer === 'string' ? sub.customer : null,
          subscriptionId: sub.id,
          tier,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end ?? null,
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

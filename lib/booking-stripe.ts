import 'server-only';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import type { Frequency } from '@/lib/pricing';

type RecurringInterval = {
  interval: 'week' | 'month';
  interval_count: number;
};

/**
 * Map our Frequency enum to Stripe's recurring interval. `once` is a
 * one-shot payment (no recurring), so we return null there.
 */
function recurringFor(frequency: Frequency): RecurringInterval | null {
  switch (frequency) {
    case 'weekly':
      return { interval: 'week', interval_count: 1 };
    case 'biweekly':
      return { interval: 'week', interval_count: 2 };
    case 'monthly':
      return { interval: 'month', interval_count: 1 };
    case 'once':
    default:
      return null;
  }
}

export interface BookingCheckoutInput {
  bookingId: string;
  userId: string;
  userEmail: string | null;
  serviceLabel: string;
  frequency: Frequency;
  amountTotal: number; // major units (EUR)
  currency: string;    // e.g. 'EUR'
  successUrl: string;
  cancelUrl: string;
}

export async function createBookingCheckoutSession(
  input: BookingCheckoutInput,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  const recurring = recurringFor(input.frequency);
  const isSubscription = recurring !== null;

  const amountInCents = Math.round(input.amountTotal * 100);
  const currency = input.currency.toLowerCase();
  const productName = isSubscription
    ? `${input.serviceLabel} — ${input.frequency}`
    : input.serviceLabel;

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    quantity: 1,
    price_data: {
      currency,
      unit_amount: amountInCents,
      product_data: { name: productName },
      ...(recurring && { recurring }),
    },
  };

  // Common metadata so the webhook knows this session is a booking and
  // can route it to the bookings update path rather than the owner
  // subscriptions path.
  const metadata = {
    kind: 'booking',
    booking_id: input.bookingId,
    user_id: input.userId,
  };

  return stripe.checkout.sessions.create({
    mode: isSubscription ? 'subscription' : 'payment',
    line_items: [lineItem],
    customer_email: input.userEmail ?? undefined,
    client_reference_id: input.userId,
    metadata,
    ...(isSubscription
      ? { subscription_data: { metadata } }
      : { payment_intent_data: { metadata } }),
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    allow_promotion_codes: true,
  });
}

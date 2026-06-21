'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { calcPrice, loadPricingConfig, type Frequency } from '@/lib/pricing';

const VALID_FREQS: Frequency[] = ['once', 'weekly', 'biweekly', 'monthly'];
const VALID_SIZES = ['studio', '1', '2', '3', '4'];

export type CreateBookingResult =
  | { ok: true; id: string; total: number }
  | { ok: false; error: string };

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

export async function createBooking(
  form: FormData,
): Promise<CreateBookingResult> {
  const supabase = await createClient();

  // 1. Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'auth_required' };

  // 2. Parse + validate input
  const service = str(form, 'service');
  const size = str(form, 'size');
  const baths = Number.parseInt(str(form, 'baths') || '1', 10);
  const extras = form.getAll('extras').map(String).filter(Boolean);
  const frequency = str(form, 'frequency') as Frequency;
  const date = str(form, 'date') || null;
  const slot = str(form, 'slot') || null;
  const addressLine = str(form, 'addressLine');
  const addressLabel = str(form, 'addressLabel') || null;

  if (!service) return { ok: false, error: 'service_required' };
  if (!VALID_SIZES.includes(size)) return { ok: false, error: 'invalid_size' };
  if (Number.isNaN(baths) || baths < 1 || baths > 10)
    return { ok: false, error: 'invalid_baths' };
  if (!VALID_FREQS.includes(frequency))
    return { ok: false, error: 'invalid_frequency' };
  if (!addressLine) return { ok: false, error: 'address_required' };

  // 3. Load pricing server-side. Never trust the client price.
  const cfg = await loadPricingConfig(supabase);
  if (!(service in cfg.base)) return { ok: false, error: 'unknown_service' };
  const { total } = calcPrice(
    { service, size, baths, extras, frequency },
    cfg,
  );

  // 4. Persist address first so we can reference it from bookings.
  const { data: addr, error: addrErr } = await supabase
    .from('booking_addresses')
    .insert({
      user_id: user.id,
      label: addressLabel,
      line: addressLine,
    })
    .select('id')
    .single();
  if (addrErr || !addr) {
    console.error('[createBooking] address insert failed', addrErr);
    return { ok: false, error: 'address_save_failed' };
  }

  // 5. Resolve service_id (key → uuid)
  const { data: svcRow, error: svcErr } = await supabase
    .from('booking_services')
    .select('id')
    .eq('key', service)
    .single();
  if (svcErr || !svcRow) {
    return { ok: false, error: 'unknown_service' };
  }

  // 6. Insert booking
  const { data: booking, error: bookingErr } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      service_id: svcRow.id,
      size,
      baths,
      extras,
      frequency,
      date,
      slot,
      address_id: addr.id,
      price_total: total,
      currency: 'EUR',
      status: 'pending',
    })
    .select('id')
    .single();
  if (bookingErr || !booking) {
    console.error('[createBooking] booking insert failed', bookingErr);
    return { ok: false, error: 'booking_save_failed' };
  }

  revalidatePath('/book');
  return { ok: true, id: booking.id, total };
}

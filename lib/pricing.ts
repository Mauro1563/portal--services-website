import type { SupabaseClient } from '@supabase/supabase-js';

export type Frequency = 'once' | 'weekly' | 'biweekly' | 'monthly';

export interface PricingConfig {
  base: Record<string, number>;
  sizeAdd: Record<string, number>;
  bathRate: number;
  extras: Record<string, number>;
  freqDiscount: Record<Frequency, number>;
}

export interface PriceInput {
  service: string;
  size: string;
  baths: number;
  extras: string[];
  frequency: Frequency;
}

export function calcPrice(
  input: PriceInput,
  cfg: PricingConfig,
): { subtotal: number; total: number } {
  const sizeAdd = cfg.sizeAdd[input.size] ?? 0;
  const bathAdd = Math.max(0, input.baths - 1) * cfg.bathRate;
  const extrasAdd = input.extras.reduce(
    (s, k) => s + (cfg.extras[k] ?? 0),
    0,
  );
  const subtotal =
    (cfg.base[input.service] ?? 0) + sizeAdd + bathAdd + extrasAdd;
  const total = Math.round(
    subtotal * (1 - (cfg.freqDiscount[input.frequency] ?? 0)),
  );
  return { subtotal, total };
}

export async function loadPricingConfig(
  supabase: SupabaseClient,
): Promise<PricingConfig> {
  const [{ data: services }, { data: extras }, { data: cfgRow }] =
    await Promise.all([
      supabase
        .from('booking_services')
        .select('key, base_price')
        .eq('active', true),
      supabase
        .from('booking_extras')
        .select('key, price')
        .eq('active', true),
      supabase
        .from('booking_pricing_config')
        .select('size_add, bath_rate, freq_discounts')
        .limit(1)
        .single(),
    ]);

  if (!cfgRow) {
    throw new Error('booking_pricing_config row missing — run seed');
  }

  return {
    base: Object.fromEntries(
      (services ?? []).map((s) => [s.key, Number(s.base_price)]),
    ),
    sizeAdd: cfgRow.size_add as Record<string, number>,
    bathRate: Number(cfgRow.bath_rate),
    extras: Object.fromEntries(
      (extras ?? []).map((e) => [e.key, Number(e.price)]),
    ),
    freqDiscount: cfgRow.freq_discounts as Record<Frequency, number>,
  };
}

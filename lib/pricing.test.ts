import { describe, it, expect } from 'vitest';
import { calcPrice, type PricingConfig } from './pricing';

const CFG: PricingConfig = {
  base: { std: 25, deep: 45, bnb: 38, win: 22, post: 70 },
  sizeAdd: { studio: 0, '1': 8, '2': 18, '3': 30, '4': 44 },
  bathRate: 6,
  extras: { oven: 12, fridge: 10, windows: 15, iron: 18, linen: 8 },
  freqDiscount: { once: 0, weekly: 0.2, biweekly: 0.15, monthly: 0.1 },
};

describe('calcPrice', () => {
  it('returns base price for service with no size/baths/extras', () => {
    const { subtotal, total } = calcPrice(
      { service: 'std', size: 'studio', baths: 1, extras: [], frequency: 'once' },
      CFG,
    );
    expect(subtotal).toBe(25);
    expect(total).toBe(25);
  });

  it('adds size + baths + extras correctly (maqueta canonical case)', () => {
    const { subtotal, total } = calcPrice(
      { service: 'std', size: '2', baths: 1, extras: [], frequency: 'once' },
      CFG,
    );
    // 25 (std) + 18 (2-bed) + 0 (1 bath = no add) + 0 extras = 43
    expect(subtotal).toBe(43);
    expect(total).toBe(43);
  });

  it('charges bath_rate per additional bath above 1', () => {
    const { subtotal } = calcPrice(
      { service: 'std', size: '2', baths: 3, extras: [], frequency: 'once' },
      CFG,
    );
    // 25 + 18 + (2 * 6) = 55
    expect(subtotal).toBe(55);
  });

  it('sums multiple extras', () => {
    const { subtotal } = calcPrice(
      { service: 'deep', size: '1', baths: 1, extras: ['oven', 'fridge'], frequency: 'once' },
      CFG,
    );
    // 45 + 8 + 0 + (12 + 10) = 75
    expect(subtotal).toBe(75);
  });

  it('applies weekly discount of 20% (canonical maqueta case)', () => {
    const { subtotal, total } = calcPrice(
      { service: 'std', size: '2', baths: 1, extras: [], frequency: 'weekly' },
      CFG,
    );
    expect(subtotal).toBe(43);
    // 43 * 0.80 = 34.4 → round to 34
    expect(total).toBe(34);
  });

  it('applies biweekly (15%) and monthly (10%) discounts', () => {
    const biweekly = calcPrice(
      { service: 'std', size: '2', baths: 1, extras: [], frequency: 'biweekly' },
      CFG,
    );
    expect(biweekly.total).toBe(Math.round(43 * 0.85)); // 37

    const monthly = calcPrice(
      { service: 'std', size: '2', baths: 1, extras: [], frequency: 'monthly' },
      CFG,
    );
    expect(monthly.total).toBe(Math.round(43 * 0.9)); // 39
  });

  it('returns 0 base when service key is unknown', () => {
    const { subtotal } = calcPrice(
      { service: 'nonexistent', size: 'studio', baths: 1, extras: [], frequency: 'once' },
      CFG,
    );
    expect(subtotal).toBe(0);
  });
});

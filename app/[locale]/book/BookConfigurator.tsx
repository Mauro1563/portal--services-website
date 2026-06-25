'use client';

import { useMemo, useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, Loader2, Minus, Plus } from 'lucide-react';
import {
  calcPrice,
  type Frequency,
  type PricingConfig,
} from '@/lib/pricing';
import { createBooking } from './actions';

type ServiceRow = {
  key: string;
  name: string;
  description: string;
  base_price: number;
};

type ExtraRow = { key: string; label: string; price: number };

type Props = {
  services: ServiceRow[];
  extras: ExtraRow[];
  pricing: PricingConfig;
};

const SIZES = ['studio', '1', '2', '3', '4'] as const;
const FREQS: Frequency[] = ['once', 'weekly', 'biweekly', 'monthly'];
const SLOTS = ['morning', 'afternoon', 'evening'] as const;

export function BookConfigurator({ services, extras, pricing }: Props) {
  const t = useTranslations('book');
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [service, setService] = useState(services[0]?.key ?? 'std');
  const [size, setSize] = useState<string>('1');
  const [baths, setBaths] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<Frequency>('once');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>('morning');
  const [addressLine, setAddressLine] = useState('');
  const [addressLabel, setAddressLabel] = useState('');

  const { subtotal, total } = useMemo(
    () =>
      calcPrice(
        {
          service,
          size,
          baths,
          extras: selectedExtras,
          frequency,
        },
        pricing,
      ),
    [service, size, baths, selectedExtras, frequency, pricing],
  );

  const discount = subtotal - total;

  const toggleExtra = (key: string) =>
    setSelectedExtras((cur) =>
      cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key],
    );

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createBooking(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Stripe Checkout (external redirect). The success_url passed to
      // Stripe will land the user on /book/success/{id}, where the
      // webhook will have already flipped status to 'paid' (or be about
      // to — the success page handles both cases).
      window.location.href = result.checkoutUrl;
    });
  };

  // Build form data manually so we can drive submit from a state-controlled UI
  // without requiring native form serialization.
  const submit = () => {
    const fd = new FormData();
    fd.set('service', service);
    fd.set('size', size);
    fd.set('baths', String(baths));
    selectedExtras.forEach((e) => fd.append('extras', e));
    fd.set('frequency', frequency);
    if (date) fd.set('date', date);
    if (slot) fd.set('slot', slot);
    fd.set('addressLine', addressLine);
    if (addressLabel) fd.set('addressLabel', addressLabel);
    fd.set('locale', locale);
    onSubmit(fd);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Service */}
        <Section title={t('sections.service')}>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setService(s.key)}
                className={`text-left rounded-xl border p-4 transition ${
                  service === s.key
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {s.description}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-slate-700">
                    €{s.base_price}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* Size */}
        <Section title={t('sections.size')}>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <Pill
                key={s}
                active={size === s}
                onClick={() => setSize(s)}
              >
                {t(`sizes.${s}`)}
              </Pill>
            ))}
          </div>
        </Section>

        {/* Baths */}
        <Section title={t('sections.baths')}>
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1">
            <button
              type="button"
              aria-label="−"
              onClick={() => setBaths((b) => Math.max(1, b - 1))}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2ch] text-center font-semibold tabular-nums">
              {baths}
            </span>
            <button
              type="button"
              aria-label="+"
              onClick={() => setBaths((b) => Math.min(10, b + 1))}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </Section>

        {/* Extras */}
        <Section title={t('sections.extras')}>
          <div className="grid gap-2 sm:grid-cols-2">
            {extras.map((x) => {
              const checked = selectedExtras.includes(x.key);
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => toggleExtra(x.key)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    checked
                      ? 'border-blue-500 bg-blue-50/60'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`grid h-5 w-5 place-items-center rounded border ${
                        checked
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span className="font-medium text-slate-800">{x.label}</span>
                  </span>
                  <span className="text-sm text-slate-500">+€{x.price}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Frequency */}
        <Section title={t('sections.frequency')}>
          <div className="flex flex-wrap gap-2">
            {FREQS.map((f) => {
              const off = Math.round((pricing.freqDiscount[f] ?? 0) * 100);
              return (
                <Pill
                  key={f}
                  active={frequency === f}
                  onClick={() => setFrequency(f)}
                >
                  {t(`freqs.${f}`)}
                  {off > 0 && (
                    <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      −{off}%
                    </span>
                  )}
                </Pill>
              );
            })}
          </div>
        </Section>

        {/* Date + slot */}
        <Section title={t('sections.when')}>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value as (typeof SLOTS)[number])}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {t(`slots.${s}`)}
                </option>
              ))}
            </select>
          </div>
        </Section>

        {/* Address */}
        <Section title={t('sections.address')}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder={t('placeholders.addressLine')}
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              className="sm:col-span-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder={t('placeholders.addressLabel')}
              value={addressLabel}
              onChange={(e) => setAddressLabel(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </Section>
      </div>

      {/* Total sidebar / sticky bar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('total.eyebrow')}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 tabular-nums">
              €{total}
            </span>
            {discount > 0 && (
              <span className="text-sm text-slate-400 line-through tabular-nums">
                €{subtotal}
              </span>
            )}
          </div>

          <ul className="mt-4 space-y-1 text-sm text-slate-600">
            <li>
              {t('summary.service')}:{' '}
              <span className="font-medium text-slate-800">
                {services.find((s) => s.key === service)?.name ?? service}
              </span>
            </li>
            <li>
              {t('summary.size')}:{' '}
              <span className="font-medium text-slate-800">
                {t(`sizes.${size}`)}
              </span>
            </li>
            <li>
              {t('summary.baths')}:{' '}
              <span className="font-medium text-slate-800">{baths}</span>
            </li>
            {selectedExtras.length > 0 && (
              <li>
                {t('summary.extras')}:{' '}
                <span className="font-medium text-slate-800">
                  {selectedExtras.length}
                </span>
              </li>
            )}
            <li>
              {t('summary.frequency')}:{' '}
              <span className="font-medium text-slate-800">
                {t(`freqs.${frequency}`)}
              </span>
            </li>
          </ul>

          {error && (
            <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {t(`errors.${error}`, { fallback: error })}
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={isPending || !addressLine}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110 disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? t('cta.submitting') : t('cta.confirm')}
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-500">
            {t('cta.footnote')}
          </p>
        </div>
      </aside>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? 'border-blue-500 bg-blue-500 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

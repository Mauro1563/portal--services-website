import { getTranslations } from 'next-intl/server';
import { Button } from './ui';
import { Check, Plus } from 'lucide-react';
import { getMarketingSection } from '@/lib/marketing';
import type { PricingContent } from '@/app/hq/content/pricing/PricingEditor';

const mailto = (subject: string) =>
  `mailto:portalservicesdigital@gmail.com?subject=${encodeURIComponent(subject)}`;

export async function Pricing() {
  const stored = await getMarketingSection<PricingContent>('pricing');
  const data = stored ?? (await loadFromI18n());

  return (
    <section id="pricing" className="relative bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {data.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-graphite-1 sm:text-5xl">
            {data.title}
          </h2>
          <p className="mt-4 text-lg text-graphite-3">{data.subtitle}</p>
          <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            {data.trial_note}
          </p>
        </div>

        {/* ─── Corporate ─── */}
        <div className="mt-16">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-graphite-3">
            {data.corporate_eyebrow}
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {data.corporate.map((tier) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                popularLabel={data.popular}
                href={mailto(`Portal Services — ${tier.name}`)}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl bg-paper p-4 ring-1 ring-line sm:grid-cols-2">
            {data.addons.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-inset ring-line"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-brand-600 ring-1 ring-inset ring-cyan-200">
                  <Plus className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-graphite-1">
                    {a.name}
                  </p>
                  <p className="text-[11px] text-graphite-3">{a.desc}</p>
                </div>
                <p className="shrink-0 text-sm font-bold text-graphite-1">
                  + {a.price}
                  <span className="ml-0.5 text-[11px] font-normal text-graphite-3">
                    /mes
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Home Cleaning ─── */}
        <div className="mt-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {data.home_eyebrow}
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {data.home.map((tier) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                popularLabel={data.popular}
                accent="emerald"
                href={mailto(`Limpiezas Hogar — ${tier.name}`)}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-2xl bg-paper p-4 text-center ring-1 ring-emerald-200 sm:flex-row sm:gap-4">
            <p className="text-sm text-graphite-1">
              <span className="font-semibold">
                {data.home_enterprise.name}
              </span>{' '}
              <span className="text-graphite-3">
                — {data.home_enterprise.range}
              </span>
            </p>
            <span className="hidden text-graphite-4 sm:inline">·</span>
            <p className="text-sm font-semibold text-emerald-700">
              {data.home_enterprise.price}
              <span className="text-xs font-normal text-graphite-3">
                {data.home_enterprise.period}
              </span>
            </p>
            <a
              href={mailto('Limpiezas Hogar — Enterprise')}
              className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100"
            >
              {data.home_enterprise.cta}
            </a>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-graphite-3">
          {data.footnote}
        </p>
      </div>
    </section>
  );
}

function PricingCard({
  tier,
  popularLabel,
  accent = 'brand',
  href,
}: {
  tier: PricingContent['corporate'][number];
  popularLabel: string;
  accent?: 'brand' | 'emerald';
  href: string;
}) {
  const featured = tier.featured;
  const featuredRing =
    featured && accent === 'emerald'
      ? 'ring-2 ring-emerald-500 shadow-[0_24px_60px_-20px_rgba(16,185,129,0.35)]'
      : featured
      ? 'ring-2 ring-brand-500 shadow-[0_24px_60px_-20px_rgba(37,99,235,0.35)]'
      : 'ring-1 ring-line hover:ring-slate-300';
  const badgeBg =
    accent === 'emerald' ? 'bg-emerald-500 text-white' : 'bg-brand-500 text-white';
  const checkColor =
    accent === 'emerald' ? 'text-emerald-500' : 'text-brand-500';

  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-paper p-8 transition ${featuredRing}`}
    >
      {featured && (
        <span
          className={`absolute -top-3 right-6 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeBg}`}
        >
          {popularLabel}
        </span>
      )}
      <p className="font-display text-lg font-semibold text-graphite-1">
        {tier.name}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-graphite-4">
        {tier.range}
      </p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-graphite-1 sm:text-5xl">
          {tier.price}
        </span>
        <span className="text-sm text-graphite-3">{tier.period}</span>
      </div>
      <ul className="mt-7 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-graphite-2">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <Button
          className="w-full"
          variant={featured ? 'primary' : 'secondary'}
          size="md"
          href={href}
        >
          {tier.cta}
        </Button>
      </div>
    </div>
  );
}

async function loadFromI18n(): Promise<PricingContent> {
  const t = await getTranslations('pricing');

  const corporate = (
    [
      ['starter', false],
      ['business', true],
      ['enterprise', false],
    ] as const
  ).map(([k, featured]) => ({
    name: t(`corporate_${k}_name` as 'corporate_starter_name'),
    range: t(`corporate_${k}_range` as 'corporate_starter_range'),
    price: t(`corporate_${k}_price` as 'corporate_starter_price'),
    period: t(`corporate_${k}_period` as 'corporate_starter_period'),
    cta: t(`corporate_${k}_cta` as 'corporate_starter_cta'),
    featured,
    features: [],
  }));

  const home = (['starter', 'pro', 'premium'] as const).map((k) => ({
    name: t(`home_${k}_name` as 'home_starter_name'),
    range: t(`home_${k}_range` as 'home_starter_range'),
    price: t(`home_${k}_price` as 'home_starter_price'),
    period: t(`home_${k}_period` as 'home_starter_period'),
    cta: t(`home_${k}_cta` as 'home_starter_cta'),
    featured: k === 'pro',
    features: t.raw(`home_${k}_features` as 'home_starter_features') as string[],
  }));

  return {
    eyebrow: t('eyebrow'),
    title: t('title'),
    subtitle: t('subtitle'),
    trial_note: t('trial_note'),
    footnote: t('footnote'),
    popular: t('popular'),
    corporate_eyebrow: t('corporate_eyebrow'),
    corporate,
    addons: [
      { name: t('addon_airbnb_name'), desc: t('addon_airbnb_desc'), price: t('addon_airbnb_price') },
      { name: t('addon_home_name'), desc: t('addon_home_desc'), price: t('addon_home_price') },
    ],
    home_eyebrow: t('home_eyebrow'),
    home,
    home_enterprise: {
      name: t('home_enterprise_name'),
      range: t('home_enterprise_range'),
      price: t('home_enterprise_price'),
      period: t('home_enterprise_period'),
      cta: t('home_enterprise_cta'),
    },
  };
}

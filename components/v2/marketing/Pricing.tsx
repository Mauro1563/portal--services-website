import { getTranslations } from 'next-intl/server';
import { Check } from 'lucide-react';

type Tier = {
  name: string;
  range: string;
  price: string;
  period: string;
  cta: string;
  features: string[];
  popular?: boolean;
};

export async function Pricing() {
  const t = await getTranslations('pricing');

  const corporate: Tier[] = [
    {
      name: t('corporate_starter_name'),
      range: t('corporate_starter_range'),
      price: t('corporate_starter_price'),
      period: t('corporate_starter_period'),
      cta: t('corporate_starter_cta'),
      features: [
        'Portal supervisor + manager',
        'Hasta 10 operativos · 3 edificios',
        'Check-in con GPS y partes diarios',
        'Inspecciones de calidad',
        'Soporte email',
      ],
    },
    {
      name: t('corporate_business_name'),
      range: t('corporate_business_range'),
      price: t('corporate_business_price'),
      period: t('corporate_business_period'),
      cta: t('corporate_business_cta'),
      popular: true,
      features: [
        'Todo en Starter',
        'Hasta 40 operativos · 15 edificios',
        'Portal director con visión 360°',
        'Reportes ejecutivos y BI',
        'Soporte prioritario',
      ],
    },
    {
      name: t('corporate_enterprise_name'),
      range: t('corporate_enterprise_range'),
      price: t('corporate_enterprise_price'),
      period: t('corporate_enterprise_period'),
      cta: t('corporate_enterprise_cta'),
      features: [
        'Edificios y operativos ilimitados',
        'Branding propio (white-label)',
        'SSO + integraciones a medida',
        'SLA dedicado · CSM',
        'Soporte 24/7',
      ],
    },
  ];

  const home: Tier[] = [
    {
      name: t('home_starter_name'),
      range: t('home_starter_range'),
      price: t('home_starter_price'),
      period: t('home_starter_period'),
      cta: t('home_starter_cta'),
      features: t.raw('home_starter_features') as string[],
    },
    {
      name: t('home_pro_name'),
      range: t('home_pro_range'),
      price: t('home_pro_price'),
      period: t('home_pro_period'),
      cta: t('home_pro_cta'),
      popular: true,
      features: t.raw('home_pro_features') as string[],
    },
    {
      name: t('home_premium_name'),
      range: t('home_premium_range'),
      price: t('home_premium_price'),
      period: t('home_premium_period'),
      cta: t('home_premium_cta'),
      features: t.raw('home_premium_features') as string[],
    },
  ];

  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t('subtitle')}
          </p>
        </header>

        <PricingBlock
          eyebrow={t('corporate_eyebrow')}
          tiers={corporate}
          popularLabel={t('popular')}
        />

        <PricingBlock
          eyebrow={t('home_eyebrow')}
          tiers={home}
          popularLabel={t('popular')}
        />

        <p className="mt-12 text-center text-xs text-slate-500">
          {t('footnote')}
        </p>
      </div>
    </section>
  );
}

function PricingBlock({
  eyebrow,
  tiers,
  popularLabel,
}: {
  eyebrow: string;
  tiers: Tier[];
  popularLabel: string;
}) {
  return (
    <div className="mt-16">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {eyebrow}
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`relative flex flex-col gap-5 rounded-3xl border p-7 ${
              tier.popular
                ? 'border-transparent bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.6)]'
                : 'border-slate-200 bg-white shadow-sm'
            }`}
          >
            {tier.popular ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                {popularLabel}
              </span>
            ) : null}

            <div>
              <h3
                className={`font-display text-xl font-semibold tracking-tight ${
                  tier.popular ? 'text-white' : 'text-slate-950'
                }`}
              >
                {tier.name}
              </h3>
              <p
                className={`mt-1 text-xs ${
                  tier.popular ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {tier.range}
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span
                className={`font-display text-4xl font-semibold tracking-tight ${
                  tier.popular ? 'text-white' : 'text-slate-950'
                }`}
              >
                {tier.price}
              </span>
              <span
                className={`text-sm ${
                  tier.popular ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {tier.period}
              </span>
            </div>

            <ul className="flex-1 space-y-2.5 text-sm">
              {tier.features.map((f, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2 ${
                    tier.popular ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <Check
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      tier.popular ? 'text-cyan-300' : 'text-cyan-600'
                    }`}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="#cta"
              className={`inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition ${
                tier.popular
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white hover:brightness-110'
                  : 'border border-slate-300 bg-white text-slate-800 hover:border-slate-400'
              }`}
            >
              {tier.cta}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

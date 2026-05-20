import { useTranslations } from 'next-intl';
import { Badge, Button, Card } from './ui';
import { Check, Plus } from 'lucide-react';

const mailto = (subject: string) =>
  `mailto:portalservicesdigital@gmail.com?subject=${encodeURIComponent(subject)}`;

const corpFeatures = {
  starter: [
    'Portal Supervisor + Manager',
    'Inspecciones de calidad',
    'Partes diarios y aprobaciones',
    'Hasta 10 operativos',
    'Soporte por email',
  ],
  business: [
    'Todo lo de Starter',
    'Portal Director con KPIs',
    'Estadísticas por edificio y operativo',
    'Exportación de informes',
    'Encuestas de satisfacción',
    'Hasta 40 operativos',
  ],
  enterprise: [
    'Todo lo de Business',
    'Edificios y operativos ilimitados',
    'Portal HQ — centro de control',
    'Branding propio y dominio',
    'API e integración con ERP / nómina',
    'SLA dedicado + account manager',
  ],
};

export function Pricing() {
  const t = useTranslations('pricing');

  const corporate = [
    {
      name: t('corporate_starter_name'),
      range: t('corporate_starter_range'),
      price: t('corporate_starter_price'),
      period: t('corporate_starter_period'),
      cta: t('corporate_starter_cta'),
      features: corpFeatures.starter,
      href: mailto('Portal Services — Starter'),
    },
    {
      name: t('corporate_business_name'),
      range: t('corporate_business_range'),
      price: t('corporate_business_price'),
      period: t('corporate_business_period'),
      cta: t('corporate_business_cta'),
      features: corpFeatures.business,
      featured: true,
      href: mailto('Portal Services — Business demo'),
    },
    {
      name: t('corporate_enterprise_name'),
      range: t('corporate_enterprise_range'),
      price: t('corporate_enterprise_price'),
      period: t('corporate_enterprise_period'),
      cta: t('corporate_enterprise_cta'),
      features: corpFeatures.enterprise,
      href: mailto('Portal Services — Enterprise'),
    },
  ];

  const home = [
    {
      name: t('home_starter_name'),
      range: t('home_starter_range'),
      price: t('home_starter_price'),
      period: t('home_starter_period'),
      cta: t('home_starter_cta'),
      features: t.raw('home_starter_features') as string[],
      href: mailto('Limpiezas Hogar — Starter'),
    },
    {
      name: t('home_pro_name'),
      range: t('home_pro_range'),
      price: t('home_pro_price'),
      period: t('home_pro_period'),
      cta: t('home_pro_cta'),
      features: t.raw('home_pro_features') as string[],
      featured: true,
      href: mailto('Limpiezas Hogar — Professional demo'),
    },
    {
      name: t('home_premium_name'),
      range: t('home_premium_range'),
      price: t('home_premium_price'),
      period: t('home_premium_period'),
      cta: t('home_premium_cta'),
      features: t.raw('home_premium_features') as string[],
      href: mailto('Limpiezas Hogar — Premium'),
    },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-slate-300">{t('subtitle')}</p>
          <p className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
            {t('trial_note')}
          </p>
        </div>

        {/* ───────── Corporate line ───────── */}
        <div className="mt-16">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            {t('corporate_eyebrow')}
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {corporate.map((tier) => (
              <PricingCard key={tier.name} tier={tier} popularLabel={t('popular')} />
            ))}
          </div>

          {/* Add-ons strip */}
          <div className="mt-6 grid gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:grid-cols-2">
            <Addon
              name={t('addon_airbnb_name')}
              desc={t('addon_airbnb_desc')}
              price={`+ ${t('addon_airbnb_price')}`}
              period={t('corporate_starter_period')}
            />
            <Addon
              name={t('addon_home_name')}
              desc={t('addon_home_desc')}
              price={`+ ${t('addon_home_price')}`}
              period={t('corporate_starter_period')}
            />
          </div>
        </div>

        {/* ───────── Home Cleaning line ───────── */}
        <div className="mt-20">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            {t('home_eyebrow')}
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {home.map((tier) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                popularLabel={t('popular')}
                accent="emerald"
              />
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.04] p-4 text-center sm:flex-row sm:gap-4">
            <p className="text-sm text-white">
              <span className="font-semibold">{t('home_enterprise_name')}</span>{' '}
              <span className="text-slate-300">— {t('home_enterprise_range')}</span>
            </p>
            <span className="hidden text-slate-500 sm:inline">·</span>
            <p className="text-sm font-semibold text-emerald-300">
              {t('home_enterprise_price')}
              <span className="text-xs font-normal text-slate-400">
                {t('home_enterprise_period')}
              </span>
            </p>
            <a
              href={mailto('Limpiezas Hogar — Enterprise')}
              className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-inset ring-emerald-400/30 hover:bg-emerald-500/25"
            >
              {t('home_enterprise_cta')}
            </a>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-slate-500">{t('footnote')}</p>
      </div>
    </section>
  );
}

function PricingCard({
  tier,
  popularLabel,
  accent = 'brand',
}: {
  tier: {
    name: string;
    range: string;
    price: string;
    period: string;
    cta: string;
    features: string[];
    href: string;
    featured?: boolean;
  };
  popularLabel: string;
  accent?: 'brand' | 'emerald';
}) {
  const ring =
    tier.featured && accent === 'emerald'
      ? 'ring-2 ring-emerald-400 shadow-card-lg'
      : tier.featured
      ? 'ring-2 ring-brand-500 shadow-card-lg'
      : 'hover:shadow-card-lg transition-shadow';
  const badgeBg =
    accent === 'emerald'
      ? 'bg-emerald-500 ring-emerald-500'
      : 'bg-brand-500 ring-brand-500';

  return (
    <Card className={`relative flex flex-col p-8 ${ring}`}>
      {tier.featured && (
        <Badge
          tone="brand"
          className={`absolute -top-3 right-6 ${badgeBg} text-white`}
        >
          {popularLabel}
        </Badge>
      )}
      <p className="font-display text-lg font-semibold text-white">{tier.name}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
        {tier.range}
      </p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-white sm:text-5xl">
          {tier.price}
        </span>
        <span className="text-sm text-slate-400">{tier.period}</span>
      </div>
      <ul className="mt-7 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white">
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                accent === 'emerald' ? 'text-emerald-300' : 'text-cyan-300'
              }`}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <Button
          className="w-full"
          variant={tier.featured ? 'primary' : 'secondary'}
          size="md"
          href={tier.href}
        >
          {tier.cta}
        </Button>
      </div>
    </Card>
  );
}

function Addon({
  name,
  desc,
  price,
  period,
}: {
  name: string;
  desc: string;
  price: string;
  period: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-4 py-3 ring-1 ring-inset ring-white/[0.06]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
        <Plus className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-semibold text-white">{name}</p>
        <p className="text-[11px] text-slate-400">{desc}</p>
      </div>
      <p className="shrink-0 text-sm font-bold text-white">
        {price}
        <span className="ml-0.5 text-[11px] font-normal text-slate-400">
          {period}
        </span>
      </p>
    </div>
  );
}

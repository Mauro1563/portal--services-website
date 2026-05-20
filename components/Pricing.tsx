import { useTranslations } from 'next-intl';
import { Badge, Button, Card } from './ui';
import { Check } from 'lucide-react';

const mailto = (subject: string) =>
  `mailto:portalservicesdigital@gmail.com?subject=${encodeURIComponent(subject)}`;

export function Pricing() {
  const t = useTranslations('pricing');
  const tSeg = useTranslations('segments');

  const tiers = [
    {
      name: tSeg('airbnb_title'),
      range: tSeg('airbnb_headcount'),
      price: tSeg('airbnb_pricing'),
      description: t('airbnb_description'),
      features: t.raw('airbnb_features') as string[],
      cta: tSeg('airbnb_cta'),
      href: mailto('Airbnb plan — start free trial'),
    },
    {
      name: tSeg('midmarket_title'),
      range: tSeg('midmarket_headcount'),
      price: tSeg('midmarket_pricing'),
      description: t('midmarket_description'),
      features: t.raw('midmarket_features') as string[],
      cta: tSeg('midmarket_cta'),
      href: mailto('Mid-market demo request'),
      featured: true,
    },
    {
      name: tSeg('enterprise_title'),
      range: tSeg('enterprise_headcount'),
      price: tSeg('enterprise_pricing'),
      description: t('enterprise_description'),
      features: t.raw('enterprise_features') as string[],
      cta: tSeg('enterprise_cta'),
      href: mailto('Enterprise inquiry'),
    },
  ];

  return (
    <section id="pricing" className="relative bg-surface-0 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-text-1 sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-text-2">{t('subtitle')}</p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={
                tier.featured
                  ? 'relative flex flex-col p-8 ring-2 ring-brand-500 shadow-card-lg'
                  : 'relative flex flex-col p-8 hover:shadow-card-lg transition-shadow'
              }
            >
              {tier.featured && (
                <Badge tone="brand" className="absolute -top-3 right-6 bg-brand-500 text-white ring-brand-500">
                  {t('popular')}
                </Badge>
              )}
              <p className="font-display text-lg font-semibold text-text-1">{tier.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-text-3">{tier.range}</p>
              <p className="mt-3 text-sm text-text-2">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-text-1 sm:text-5xl">
                  {tier.price}
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-1">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
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
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-text-3">{t('footnote')}</p>
      </div>
    </section>
  );
}

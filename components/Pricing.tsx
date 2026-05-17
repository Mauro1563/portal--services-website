import { useTranslations } from 'next-intl';
import { Badge, Card } from './ui';
import { Check } from 'lucide-react';
import { CTAButton } from './CTAButton';

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
      subject: 'Airbnb plan — start free trial',
    },
    {
      name: tSeg('midmarket_title'),
      range: tSeg('midmarket_headcount'),
      price: tSeg('midmarket_pricing'),
      description: t('midmarket_description'),
      features: t.raw('midmarket_features') as string[],
      cta: tSeg('midmarket_cta'),
      subject: 'Mid-market demo request',
      featured: true,
    },
    {
      name: tSeg('enterprise_title'),
      range: tSeg('enterprise_headcount'),
      price: tSeg('enterprise_pricing'),
      description: t('enterprise_description'),
      features: t.raw('enterprise_features') as string[],
      cta: tSeg('enterprise_cta'),
      subject: 'Enterprise inquiry',
    },
  ];

  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">{t('title')}</h2>
          <p className="mt-4 text-slate-400">{t('subtitle')}</p>
        </div>
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} hover className={tier.featured ? 'relative flex flex-col p-8 ring-1 ring-cyan-400/30 shadow-[0_0_60px_-15px_rgba(6,182,212,0.4)]' : 'relative flex flex-col p-8'}>
              {tier.featured && (
                <Badge tone="info" className="absolute -top-3 right-6">{t('popular')}</Badge>
              )}
              <p className="font-display text-lg font-semibold text-white">{tier.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{tier.range}</p>
              <p className="mt-3 text-sm text-slate-400">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-white">{tier.price}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <CTAButton
                  className="w-full"
                  variant={tier.featured ? 'primary' : 'secondary'}
                  size="md"
                  subject={tier.subject}
                >
                  {tier.cta}
                </CTAButton>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-slate-500">{t('footnote')}</p>
      </div>
    </section>
  );
}

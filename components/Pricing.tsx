import { useTranslations } from 'next-intl';
import { Badge, Button, Card } from './ui';
import { Check } from 'lucide-react';

export function Pricing() {
  const t = useTranslations('pricing');
  const tSeg = useTranslations('segments');
  const tiers = [
    {
      name: tSeg('airbnb_title'),
      range: tSeg('airbnb_headcount'),
      price: tSeg('airbnb_pricing'),
      description: 'For Airbnb hosts, co-hosts and small property managers.',
      features: ['Up to 10 properties', 'Auto-assign tasks per property', 'Photo evidence per clean', 'Airbnb iCal sync', 'WhatsApp-free supervisor inbox', 'Email support'],
      cta: tSeg('airbnb_cta'),
    },
    {
      name: tSeg('midmarket_title'),
      range: tSeg('midmarket_headcount'),
      price: tSeg('midmarket_pricing'),
      description: 'For cleaning companies, FM contractors, schools and clinics.',
      features: ['Unlimited sites and shifts', 'Day / night shift management', 'Supervisor dashboard', 'Timesheets + holiday reports', 'GPS-verified clock in/out', 'Onboarded in one week', 'Priority support'],
      cta: tSeg('midmarket_cta'),
      featured: true,
    },
    {
      name: tSeg('enterprise_title'),
      range: tSeg('enterprise_headcount'),
      price: tSeg('enterprise_pricing'),
      description: 'For FM groups, hospitals, airports and hotel chains.',
      features: ['White-label with your logo and colours', 'Custom community portal', 'ERP / payroll integration via API', 'SSO / SAML, advanced RBAC', 'Dedicated SLA + account manager', 'Single-tenant infra available'],
      cta: tSeg('enterprise_cta'),
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
                <Button className="w-full" variant={tier.featured ? 'primary' : 'secondary'} size="md">{tier.cta}</Button>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-slate-500">{t('footnote')}</p>
      </div>
    </section>
  );
}

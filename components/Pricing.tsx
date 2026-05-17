import { Badge, Button, Card } from './ui';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Airbnb / Property',
    range: '5 – 25 cleaners',
    price: 'from £49',
    unit: '/ month',
    description: 'For Airbnb hosts, co-hosts and small property managers.',
    features: ['Up to 10 properties', 'Auto-assign tasks per property', 'Photo evidence per clean', 'Airbnb iCal sync', 'WhatsApp-free supervisor inbox', 'Email support'],
    cta: 'Start free trial',
  },
  {
    name: 'Mid-market',
    range: '15 – 50 operatives',
    price: '£150 – £500',
    unit: '/ month',
    description: 'For cleaning companies, FM contractors, schools and clinics.',
    features: ['Unlimited sites and shifts', 'Day / night shift management', 'Supervisor dashboard', 'Timesheets + holiday reports', 'GPS-verified clock in/out', 'Onboarded in one week', 'Priority support'],
    cta: 'Book a demo',
    featured: true,
  },
  {
    name: 'Enterprise',
    range: '50+ operatives',
    price: 'from £500',
    unit: '/ month + setup',
    description: 'For FM groups, hospitals, airports and hotel chains.',
    features: ['White-label with your logo and colours', 'Custom community portal', 'ERP / payroll integration via API', 'SSO / SAML, advanced RBAC', 'Dedicated SLA + account manager', 'Single-tenant infra available'],
    cta: 'Talk to sales',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Pricing that fits your team size.</h2>
          <p className="mt-4 text-slate-400">Pay monthly. Cancel anytime. 14-day free trial — no credit card required.</p>
        </div>
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.name} hover className={t.featured ? 'relative flex flex-col p-8 ring-1 ring-cyan-400/30 shadow-[0_0_60px_-15px_rgba(6,182,212,0.4)]' : 'relative flex flex-col p-8'}>
              {t.featured && (<Badge tone="info" className="absolute -top-3 right-6">Most popular</Badge>)}
              <p className="font-display text-lg font-semibold text-white">{t.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{t.range}</p>
              <p className="mt-3 text-sm text-slate-400">{t.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-white">{t.price}</span>
                <span className="text-xs text-slate-500">{t.unit}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Button className="w-full" variant={t.featured ? 'primary' : 'secondary'} size="md">{t.cta}</Button>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-slate-500">All prices in GBP. Volume discounts for 100+ operatives. VAT not included.</p>
      </div>
    </section>
  );
}

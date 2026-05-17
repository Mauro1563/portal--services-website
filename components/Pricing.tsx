import { Badge, Button, Card } from './ui';
import { Check } from 'lucide-react';

const tiers = [
  { name: 'Starter', price: '$9', unit: 'per user / month', description: 'For small ops teams getting started.', features: ['Up to 3 sites', 'Tasks & checklists', 'Operative PWA', 'Email support'], cta: 'Start free' },
  { name: 'Growth', price: '$19', unit: 'per user / month', description: 'For multi-site facility teams.', features: ['Unlimited sites', 'Audits & incidents', 'Inventory', 'Analytics dashboard', 'Priority support'], cta: 'Get a demo', featured: true },
  { name: 'Enterprise', price: 'Custom', unit: 'annual contract', description: 'For large operations and contractors.', features: ['SSO / SAML', 'Dedicated infra', 'Custom integrations', 'SLAs & DPA', 'CSM'], cta: 'Talk to sales' },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Simple pricing. Scales with you.</h2>
          <p className="mt-4 text-slate-400">Pay per active user. Cancel anytime. Volume discounts available.</p>
        </div>
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.name} hover className={t.featured ? 'relative p-8 ring-1 ring-cyan-400/30 shadow-[0_0_60px_-15px_rgba(6,182,212,0.4)]' : 'p-8'}>
              {t.featured && <Badge tone="info" className="absolute -top-3 right-6">Most popular</Badge>}
              <p className="font-display text-lg font-semibold text-white">{t.name}</p>
              <p className="mt-1 text-sm text-slate-400">{t.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-white">{t.price}</span>
                <span className="text-xs text-slate-500">{t.unit}</span>
              </div>
              <Button className="mt-6 w-full" variant={t.featured ? 'primary' : 'secondary'} size="md">{t.cta}</Button>
              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Card, Badge, Button } from './ui';
import { Building, Building2, Home, ArrowRight, Check } from 'lucide-react';

const segments = [
  {
    icon: Home,
    badge: 'Fastest win',
    tone: 'success' as const,
    title: 'Airbnb hosts & property managers',
    headcount: '5 – 25 cleaners',
    pricing: 'from £49 / month',
    cta: 'Start free trial',
    valueProps: [
      'Who goes to which flat today — auto-assigned',
      'No more chaotic WhatsApp groups',
      'Photo evidence proves the clean was done',
      'iCal sync: tasks auto-create on Airbnb checkout',
      'Per-property rating from the property manager',
    ],
    customers: 'Co-hosts, STR managers, holiday lets',
  },
  {
    icon: Building,
    badge: 'Most popular',
    tone: 'info' as const,
    title: 'Mid-market cleaning & FM',
    headcount: '15 – 50 operatives',
    pricing: '£150 – £500 / month',
    cta: 'Book a demo',
    valueProps: [
      'Day and night shift management',
      'Supervisor dashboard ready out of the box',
      'Timesheets and holiday reports',
      'Onboarded in one week',
      'Multi-site visibility for HQ',
    ],
    customers: 'FM contractors, office cleaners, schools, clinics',
    featured: true,
  },
  {
    icon: Building2,
    badge: 'Enterprise',
    tone: 'brand' as const,
    title: 'Large operations & FM groups',
    headcount: '50+ operatives',
    pricing: 'from £500 / month + setup',
    cta: 'Talk to sales',
    valueProps: [
      'White-label with your logo and colours',
      'Custom community portal for your operatives',
      'API or integration with your ERP / payroll',
      'Dedicated SLA and account manager',
      'SSO / SAML, advanced RBAC',
    ],
    customers: 'FM companies, hospitals, airports, hotel chains, WeWork-style operators',
  },
];

export function Segments() {
  return (
    <section id="who" className="relative border-y border-white/[0.06] bg-ink-1/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="info" className="mb-4">Who it's for</Badge>
          <h2 className="font-display text-4xl font-semibold tracking-tight">From 5 cleaners to 5,000 operatives.</h2>
          <p className="mt-4 text-slate-400">Three tiers — same platform. Start small, scale to enterprise without changing tools.</p>
        </div>
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {segments.map((seg) => {
            const Icon = seg.icon;
            return (
              <Card
                key={seg.title}
                hover
                className={seg.featured ? 'relative flex flex-col p-7 ring-1 ring-cyan-400/30 shadow-[0_0_60px_-15px_rgba(6,182,212,0.4)]' : 'relative flex flex-col p-7'}
              >
                <Badge tone={seg.tone} className="absolute -top-3 right-6">{seg.badge}</Badge>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-display text-xl font-semibold text-white">{seg.title}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{seg.headcount}</p>
                <p className="mt-5 font-display text-2xl font-semibold text-cyan-300">{seg.pricing}</p>
                <ul className="mt-6 space-y-2.5">
                  {seg.valueProps.map((v) => (
                    <li key={v} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-400">Typical customers:</span> {seg.customers}
                </p>
                <div className="mt-auto pt-6">
                  <Button className="w-full" variant={seg.featured ? 'primary' : 'secondary'}>
                    {seg.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

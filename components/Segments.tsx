import { useTranslations } from 'next-intl';
import { Card, Badge, Button } from './ui';
import { Building, Building2, Home, ArrowRight, Check } from 'lucide-react';

export function Segments() {
  const t = useTranslations('segments');
  const segments = [
    {
      icon: Home,
      badge: t('airbnb_badge'),
      tone: 'success' as const,
      title: t('airbnb_title'),
      headcount: t('airbnb_headcount'),
      pricing: t('airbnb_pricing'),
      cta: t('airbnb_cta'),
      customers: t('airbnb_customers'),
      valueProps: [
        'Who goes to which flat today — auto-assigned',
        'No more chaotic WhatsApp groups',
        'Photo evidence proves the clean was done',
        'iCal sync: tasks auto-create on Airbnb checkout',
        'Per-property rating from the property manager',
      ],
    },
    {
      icon: Building,
      badge: t('midmarket_badge'),
      tone: 'info' as const,
      title: t('midmarket_title'),
      headcount: t('midmarket_headcount'),
      pricing: t('midmarket_pricing'),
      cta: t('midmarket_cta'),
      customers: t('midmarket_customers'),
      featured: true,
      valueProps: [
        'Day and night shift management',
        'Supervisor dashboard ready out of the box',
        'Timesheets and holiday reports',
        'Onboarded in one week',
        'Multi-site visibility for HQ',
      ],
    },
    {
      icon: Building2,
      badge: t('enterprise_badge'),
      tone: 'brand' as const,
      title: t('enterprise_title'),
      headcount: t('enterprise_headcount'),
      pricing: t('enterprise_pricing'),
      cta: t('enterprise_cta'),
      customers: t('enterprise_customers'),
      valueProps: [
        'White-label with your logo and colours',
        'Custom community portal for your operatives',
        'API or integration with your ERP / payroll',
        'Dedicated SLA and account manager',
        'SSO / SAML, advanced RBAC',
      ],
    },
  ];

  return (
    <section id="who" className="relative border-y border-white/[0.06] bg-ink-1/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="info" className="mb-4">{t('eyebrow')}</Badge>
          <h2 className="font-display text-4xl font-semibold tracking-tight">{t('title')}</h2>
          <p className="mt-4 text-slate-400">{t('subtitle')}</p>
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
                  <span className="font-semibold text-slate-400">{t('typical_label')}</span> {seg.customers}
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

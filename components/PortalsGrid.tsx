import { useTranslations } from 'next-intl';
import { Card } from './ui';
import {
  ShieldCheck,
  LayoutDashboard,
  Smartphone,
  UserRound,
  Check,
} from 'lucide-react';

export function PortalsGrid() {
  const t = useTranslations('portals');

  const portals = [
    {
      key: 'hq',
      icon: ShieldCheck,
      title: t('hq_title'),
      who: t('hq_who'),
      description: t('hq_desc'),
      features: [t('hq_f1'), t('hq_f2'), t('hq_f3')],
      accent: 'from-cyan-400 to-blue-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(61,197,240,0.45)]',
      tag: 'HQ',
    },
    {
      key: 'manager',
      icon: LayoutDashboard,
      title: t('manager_title'),
      who: t('manager_who'),
      description: t('manager_desc'),
      features: [t('manager_f1'), t('manager_f2'), t('manager_f3')],
      accent: 'from-blue-400 to-indigo-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(59,130,246,0.45)]',
      tag: 'Owner',
    },
    {
      key: 'operative',
      icon: Smartphone,
      title: t('operative_title'),
      who: t('operative_who'),
      description: t('operative_desc'),
      features: [t('operative_f1'), t('operative_f2'), t('operative_f3')],
      accent: 'from-indigo-400 to-violet-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(129,140,248,0.45)]',
      tag: 'Cleaner',
    },
    {
      key: 'client',
      icon: UserRound,
      title: t('client_title'),
      who: t('client_who'),
      description: t('client_desc'),
      features: [t('client_f1'), t('client_f2'), t('client_f3')],
      accent: 'from-violet-400 to-fuchsia-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(192,132,252,0.45)]',
      tag: 'Client',
    },
  ];

  return (
    <section id="product" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(61,197,240,0.10),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-5 text-lg text-slate-300">{t('subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {portals.map(({ key, icon: Icon, title, who, description, features, accent, glow, tag }) => (
            <Card
              key={key}
              hover
              className={`group relative flex flex-col overflow-hidden p-8 ${glow}`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl transition group-hover:opacity-30`}
              />

              <div className="flex items-start justify-between gap-4">
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300 ring-1 ring-inset ring-white/10">
                  {tag}
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-semibold text-white">
                {title}
              </h3>
              <p className="mt-1 text-sm font-medium text-cyan-300">{who}</p>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {description}
              </p>

              <ul className="mt-6 space-y-2.5 border-t border-white/[0.06] pt-6">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span>{f}</span>
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

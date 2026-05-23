import { useTranslations } from 'next-intl';
import {
  ClipboardCheck,
  LayoutDashboard,
  Smartphone,
  TrendingUp,
  ShieldCheck,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export function PortalsGrid() {
  const t = useTranslations('portals');

  const portals = [
    {
      key: 'supervisor',
      icon: ClipboardCheck,
      tag: 'Supervisor',
      title: t('supervisor_title'),
      description: t('supervisor_desc'),
    },
    {
      key: 'manager',
      icon: LayoutDashboard,
      tag: 'Manager',
      title: t('manager_title'),
      description: t('manager_desc'),
    },
    {
      key: 'operative',
      icon: Smartphone,
      tag: 'Operativo',
      title: t('operative_title'),
      description: t('operative_desc'),
    },
    {
      key: 'director',
      icon: TrendingUp,
      tag: 'Director',
      title: t('director_title'),
      description: t('director_desc'),
    },
    {
      key: 'hq',
      icon: ShieldCheck,
      tag: 'HQ',
      title: t('hq_title'),
      description: t('hq_desc'),
    },
    {
      key: 'airbnb',
      icon: KeyRound,
      tag: 'Airbnb',
      title: t('airbnb_title'),
      description: t('airbnb_desc'),
    },
    {
      key: 'home',
      icon: Sparkles,
      tag: 'Hogar',
      title: t('home_title'),
      description: t('home_desc'),
    },
  ];

  return (
    <section id="portals" className="relative bg-canvas py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-graphite-1 sm:text-5xl lg:text-6xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-graphite-3">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line md:grid-cols-2 lg:grid-cols-3">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.key}
                className="group relative flex flex-col bg-canvas p-8 transition hover:bg-paper sm:p-10"
              >
                <Icon
                  className="h-6 w-6 text-graphite-1"
                  strokeWidth={1.5}
                />
                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-graphite-4">
                  {p.tag}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-graphite-1">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite-3">
                  {p.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

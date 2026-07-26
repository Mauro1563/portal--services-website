import { getTranslations } from 'next-intl/server';
import {
  HardHat,
  ShieldCheck,
  ClipboardList,
  Briefcase,
  Users,
  ServerCog,
  type LucideIcon,
} from 'lucide-react';

type Accent = 'blue' | 'orange' | 'green' | 'teal' | 'purple' | 'navy';

const ACCENT: Record<
  Accent,
  { chip: string; chipText: string; iconBg: string; ring: string }
> = {
  blue: {
    chip: 'bg-psd-blue/10',
    chipText: 'text-psd-blue',
    iconBg: 'bg-gradient-to-br from-psd-blue to-psd-navy',
    ring: 'hover:ring-psd-blue/25',
  },
  orange: {
    chip: 'bg-psd-orange/10',
    chipText: 'text-psd-orange',
    iconBg: 'bg-gradient-to-br from-psd-orange to-psd-amber',
    ring: 'hover:ring-psd-orange/25',
  },
  green: {
    chip: 'bg-psd-green/10',
    chipText: 'text-psd-green',
    iconBg: 'bg-gradient-to-br from-psd-green to-psd-teal',
    ring: 'hover:ring-psd-green/25',
  },
  teal: {
    chip: 'bg-psd-teal/10',
    chipText: 'text-psd-teal',
    iconBg: 'bg-gradient-to-br from-psd-teal to-psd-cyan',
    ring: 'hover:ring-psd-teal/25',
  },
  purple: {
    chip: 'bg-psd-purple/10',
    chipText: 'text-psd-purple',
    iconBg: 'bg-gradient-to-br from-psd-purple to-psd-blue',
    ring: 'hover:ring-psd-purple/25',
  },
  navy: {
    chip: 'bg-psd-navy/10',
    chipText: 'text-psd-navy',
    iconBg: 'bg-gradient-to-br from-psd-navy to-slate-800',
    ring: 'hover:ring-psd-navy/25',
  },
};

export async function PortalsGrid() {
  const t = await getTranslations('psdSite.roles');

  const roles: Array<{
    key: string;
    title: string;
    lead: string;
    bullets: [string, string, string];
    Icon: LucideIcon;
    accent: Accent;
  }> = [
    {
      key: 'operative',
      title: t('operativeTitle'),
      lead: t('operativeLead'),
      bullets: [t('operativeB1'), t('operativeB2'), t('operativeB3')],
      Icon: HardHat,
      accent: 'orange',
    },
    {
      key: 'supervisor',
      title: t('supervisorTitle'),
      lead: t('supervisorLead'),
      bullets: [t('supervisorB1'), t('supervisorB2'), t('supervisorB3')],
      Icon: ShieldCheck,
      accent: 'blue',
    },
    {
      key: 'manager',
      title: t('managerTitle'),
      lead: t('managerLead'),
      bullets: [t('managerB1'), t('managerB2'), t('managerB3')],
      Icon: ClipboardList,
      accent: 'teal',
    },
    {
      key: 'director',
      title: t('directorTitle'),
      lead: t('directorLead'),
      bullets: [t('directorB1'), t('directorB2'), t('directorB3')],
      Icon: Briefcase,
      accent: 'purple',
    },
    {
      key: 'community',
      title: t('communityTitle'),
      lead: t('communityLead'),
      bullets: [t('communityB1'), t('communityB2'), t('communityB3')],
      Icon: Users,
      accent: 'green',
    },
    {
      key: 'hq',
      title: t('hqTitle'),
      lead: t('hqLead'),
      bullets: [t('hqB1'), t('hqB2'), t('hqB3')],
      Icon: ServerCog,
      accent: 'navy',
    },
  ];

  return (
    <section
      id="roles"
      className="relative overflow-hidden bg-psd-bg py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => {
            const a = ACCENT[r.accent];
            return (
              <article
                key={r.key}
                className={`group relative overflow-hidden rounded-3xl border border-psd-border bg-white p-7 shadow-[0_2px_10px_rgba(15,32,68,0.04)] ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,32,68,0.35)] ${a.ring} motion-reduce:hover:translate-y-0`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${a.chip} ${a.chipText}`}
                  >
                    {r.title}
                  </span>
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg transition group-hover:scale-105 ${a.iconBg}`}
                  >
                    <r.Icon className="h-5 w-5" />
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-extrabold leading-tight tracking-tight text-psd-navy">
                  {r.lead}
                </h3>

                <ul className="mt-5 space-y-2.5">
                  {r.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-psd-text"
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 flex-none rounded-full ${a.chipText.replace('text-', 'bg-')}`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-psd-blue">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-psd-navy sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-psd-textSoft sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

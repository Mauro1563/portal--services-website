import { useTranslations } from 'next-intl';
import { Card } from './ui';
import {
  ClipboardCheck,
  LayoutDashboard,
  Smartphone,
  TrendingUp,
  ShieldCheck,
  KeyRound,
  Sparkles,
  Check,
} from 'lucide-react';

export function PortalsGrid() {
  const t = useTranslations('portals');

  const portals = [
    {
      key: 'supervisor',
      icon: ClipboardCheck,
      tag: 'Supervisor',
      title: t('supervisor_title'),
      pitch: t('supervisor_tag'),
      who: t('supervisor_who'),
      description: t('supervisor_desc'),
      features: [
        t('supervisor_f1'),
        t('supervisor_f2'),
        t('supervisor_f3'),
        t('supervisor_f4'),
        t('supervisor_f5'),
      ],
      accent: 'from-indigo-400 to-violet-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(129,140,248,0.45)]',
    },
    {
      key: 'manager',
      icon: LayoutDashboard,
      tag: 'Manager',
      title: t('manager_title'),
      pitch: t('manager_tag'),
      who: t('manager_who'),
      description: t('manager_desc'),
      features: [
        t('manager_f1'),
        t('manager_f2'),
        t('manager_f3'),
        t('manager_f4'),
        t('manager_f5'),
      ],
      accent: 'from-blue-400 to-indigo-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(59,130,246,0.45)]',
    },
    {
      key: 'operative',
      icon: Smartphone,
      tag: 'Operativo',
      title: t('operative_title'),
      pitch: t('operative_tag'),
      who: t('operative_who'),
      description: t('operative_desc'),
      features: [t('operative_f1'), t('operative_f2'), t('operative_f3')],
      accent: 'from-violet-400 to-fuchsia-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(167,139,250,0.45)]',
    },
    {
      key: 'director',
      icon: TrendingUp,
      tag: 'Director',
      title: t('director_title'),
      pitch: t('director_tag'),
      who: t('director_who'),
      description: t('director_desc'),
      features: [
        t('director_f1'),
        t('director_f2'),
        t('director_f3'),
        t('director_f4'),
        t('director_f5'),
      ],
      accent: 'from-sky-400 to-blue-600',
      glow: 'shadow-[0_0_60px_-15px_rgba(56,189,248,0.45)]',
    },
    {
      key: 'hq',
      icon: ShieldCheck,
      tag: 'HQ',
      title: t('hq_title'),
      pitch: t('hq_tag'),
      who: t('hq_who'),
      description: t('hq_desc'),
      features: [t('hq_f1'), t('hq_f2'), t('hq_f3')],
      accent: 'from-cyan-400 to-blue-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(61,197,240,0.45)]',
    },
    {
      key: 'airbnb',
      icon: KeyRound,
      tag: 'Airbnb',
      title: t('airbnb_title'),
      pitch: t('airbnb_tag'),
      who: t('airbnb_who'),
      description: t('airbnb_desc'),
      features: [
        t('airbnb_f1'),
        t('airbnb_f2'),
        t('airbnb_f3'),
        t('airbnb_f4'),
        t('airbnb_f5'),
        t('airbnb_f6'),
      ],
      footer: t('airbnb_cities'),
      accent: 'from-rose-400 to-pink-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(244,114,182,0.45)]',
    },
    {
      key: 'home',
      icon: Sparkles,
      tag: 'Hogar',
      title: t('home_title'),
      pitch: t('home_tag'),
      who: t('home_who'),
      description: t('home_desc'),
      features: [
        t('home_f1'),
        t('home_f2'),
        t('home_f3'),
        t('home_f4'),
        t('home_f5'),
        t('home_f6'),
      ],
      accent: 'from-emerald-400 to-teal-500',
      glow: 'shadow-[0_0_60px_-15px_rgba(52,211,153,0.45)]',
    },
  ];

  return (
    <section id="portals" className="relative py-24 sm:py-32">
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

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.key}
                hover
                className={`group relative flex flex-col overflow-hidden p-7 ${p.glow}`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -top-24 -right-24 h-52 w-52 rounded-full bg-gradient-to-br ${p.accent} opacity-20 blur-3xl transition group-hover:opacity-30`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accent} text-white shadow-lg`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300 ring-1 ring-inset ring-white/10">
                    {p.tag}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm font-medium italic text-cyan-300">
                  &ldquo;{p.pitch}&rdquo;
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {p.description}
                </p>

                <p className="mt-4 text-[11px] uppercase tracking-wider text-slate-500">
                  Para: <span className="normal-case text-slate-300">{p.who}</span>
                </p>

                <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-slate-200"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {p.footer ? (
                  <p className="mt-5 rounded-xl bg-white/[0.03] px-3 py-2 text-[11px] italic text-slate-400 ring-1 ring-inset ring-white/[0.06]">
                    {p.footer}
                  </p>
                ) : null}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

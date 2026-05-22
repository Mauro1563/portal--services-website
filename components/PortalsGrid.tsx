import { useTranslations } from 'next-intl';
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
      accent: 'from-indigo-500 to-violet-500',
      tone: 'indigo',
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
      accent: 'from-blue-500 to-indigo-500',
      tone: 'blue',
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
      accent: 'from-violet-500 to-fuchsia-500',
      tone: 'violet',
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
      accent: 'from-sky-500 to-blue-600',
      tone: 'sky',
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
      accent: 'from-cyan-500 to-blue-500',
      tone: 'cyan',
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
      accent: 'from-rose-500 to-pink-500',
      tone: 'rose',
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
      accent: 'from-emerald-500 to-teal-500',
      tone: 'emerald',
    },
  ];

  return (
    <section id="portals" className="relative bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {t('eyebrow')}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-graphite-1 sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-graphite-3">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <article
                key={p.key}
                className="group relative flex flex-col rounded-2xl bg-paper p-7 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] hover:ring-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accent} text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)]`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-graphite-3">
                    {p.tag}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold text-graphite-1">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm font-medium italic text-brand-600">
                  &ldquo;{p.pitch}&rdquo;
                </p>

                <p className="mt-4 text-sm leading-relaxed text-graphite-3">
                  {p.description}
                </p>

                <p className="mt-4 text-[11px] uppercase tracking-wider text-graphite-4">
                  Para:{' '}
                  <span className="normal-case text-graphite-2">{p.who}</span>
                </p>

                <ul className="mt-5 space-y-2 border-t border-line pt-5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-graphite-2"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {p.footer ? (
                  <p className="mt-5 rounded-xl bg-slate-50 px-3 py-2 text-[11px] italic text-graphite-3 ring-1 ring-inset ring-line">
                    {p.footer}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

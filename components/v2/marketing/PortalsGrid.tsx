import { getTranslations } from 'next-intl/server';
import {
  Briefcase,
  Building2,
  Crown,
  Hammer,
  Home,
  Sparkles,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PortalKey =
  | 'supervisor'
  | 'manager'
  | 'director'
  | 'operative'
  | 'hq'
  | 'home'
  | 'airbnb';

const PORTALS: { key: PortalKey; icon: LucideIcon; accent: string }[] = [
  { key: 'supervisor', icon: Users, accent: 'from-cyan-400 to-blue-500' },
  { key: 'manager', icon: Briefcase, accent: 'from-blue-500 to-indigo-600' },
  { key: 'director', icon: Crown, accent: 'from-amber-400 to-orange-500' },
  { key: 'operative', icon: Hammer, accent: 'from-slate-700 to-slate-900' },
  { key: 'hq', icon: Building2, accent: 'from-violet-500 to-purple-700' },
  { key: 'home', icon: Home, accent: 'from-emerald-400 to-teal-600' },
  { key: 'airbnb', icon: Sparkles, accent: 'from-rose-400 to-pink-600' },
];

export async function PortalsGrid() {
  const t = await getTranslations('portals');

  return (
    <section id="portals" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            {t('eyebrow')}
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t('subtitle')}
          </p>
        </header>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PORTALS.map(({ key, icon: Icon, accent }) => (
            <article
              key={key}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-slate-950">
                  {t(`${key}_title` as const)}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {t(`${key}_tag` as const)}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-slate-600">
                {t(`${key}_desc` as const)}
              </p>

              <ul className="mt-1 space-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
                {[1, 2, 3].map((n) => (
                  <li key={n} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                    <span>{t(`${key}_f${n}` as const)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

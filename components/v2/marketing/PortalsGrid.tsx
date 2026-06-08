import { getTranslations } from 'next-intl/server';
import { Home, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PortalKey = 'home' | 'airbnb';

const PORTALS: { key: PortalKey; icon: LucideIcon; accent: string }[] = [
  { key: 'home', icon: Home, accent: 'from-cyan-400 to-blue-600' },
  { key: 'airbnb', icon: Sparkles, accent: 'from-blue-500 to-indigo-600' },
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

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {PORTALS.map(({ key, icon: Icon, accent }) => {
            // next-intl returns the array as Messages — cast through unknown.
            const features = t.raw(`${key}.features`) as string[];
            return (
              <article
                key={key}
                className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xl"
              >
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_12px_24px_-10px_rgba(0,0,0,0.3)]`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-slate-950">
                    {t(`${key}.name`)}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {t(`${key}.tagline`)}
                  </p>
                </div>

                <p className="text-base leading-relaxed text-slate-600">
                  {t(`${key}.description`)}
                </p>

                <ul className="mt-1 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      <span>{feature}</span>
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

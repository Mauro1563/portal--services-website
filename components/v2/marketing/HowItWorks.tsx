import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const STEP_KEYS = ['one', 'two', 'three'] as const;
const STEP_NUMBERS = ['01', '02', '03'] as const;

export async function HowItWorks() {
  const t = await getTranslations('howItWorks');

  // The title is rendered with a gradient on its last clause. Splitting on the
  // first comma keeps it locale-aware without baking the highlight into a key.
  const fullTitle = t('title');
  const commaIdx = fullTitle.indexOf(',');
  const titleHead = commaIdx > 0 ? fullTitle.slice(0, commaIdx + 1) : fullTitle;
  const titleTail = commaIdx > 0 ? fullTitle.slice(commaIdx + 1).trim() : '';

  return (
    <section id="how" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
            {t('eyebrow')}
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-4xl lg:text-5xl">
            {titleHead}
            {titleTail ? (
              <>
                {' '}
                <span className="bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  {titleTail}
                </span>
              </>
            ) : null}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t('subtitle')}
          </p>
        </header>

        <ol className="mt-14 grid gap-5 sm:grid-cols-3">
          {STEP_KEYS.map((key, i) => (
            <li
              key={key}
              className="relative flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="font-display text-4xl font-semibold tracking-tight text-slate-300">
                {STEP_NUMBERS[i]}
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight text-slate-950">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {t(`steps.${key}.description`)}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <a
            href="#cta"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(37,99,235,0.55)] transition hover:brightness-110"
          >
            {t('cta')}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

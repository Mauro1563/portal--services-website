import { getTranslations } from 'next-intl/server';

export async function Metrics() {
  const t = await getTranslations('psdSite.metrics');

  const rows = [
    { v: t('m1Value'), l: t('m1Label') },
    { v: t('m2Value'), l: t('m2Label') },
    { v: t('m3Value'), l: t('m3Label') },
    { v: t('m4Value'), l: t('m4Label') },
  ];

  return (
    <section className="border-y border-psd-border bg-psd-bg py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-psd-blue">
            {t('eyebrow')}
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-psd-navy sm:text-4xl">
            {t('title')}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((r) => (
            <div
              key={r.l}
              className="group relative overflow-hidden rounded-3xl border border-psd-border bg-white p-8 text-center transition hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-30px_rgba(15,32,68,0.35)] motion-reduce:hover:translate-y-0"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-psd-blue/12 to-psd-orange/8 blur-2xl transition group-hover:opacity-70"
              />
              <p className="relative font-display text-5xl font-black tracking-tight text-psd-navy sm:text-6xl">
                <span className="bg-gradient-to-br from-psd-navy via-psd-blue to-psd-blue bg-clip-text text-transparent">
                  {r.v}
                </span>
              </p>
              <p className="relative mt-3 text-[13px] font-semibold uppercase tracking-wide text-psd-textSoft">
                {r.l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

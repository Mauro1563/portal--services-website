import { getTranslations } from 'next-intl/server';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(at_20%_0%,rgba(37,99,235,0.10)_0px,transparent_50%),radial-gradient(at_80%_30%,rgba(6,182,212,0.10)_0px,transparent_50%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-32 lg:pt-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            {t('audience_chip')}
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-slate-950 sm:text-5xl lg:text-6xl">
            {t('title_a')}{' '}
            <span className="bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              {t('title_b')}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#cta"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(37,99,235,0.55)] transition hover:brightness-110"
            >
              {t('cta_primary')}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#portals"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 hover:border-slate-400"
            >
              {t('cta_secondary')}
            </a>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            {t('trust')}
          </p>
        </div>

        <div className="relative mt-16 lg:mt-0">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  const checkins = [
    { n: 'María R.', s: 'On site · 08:02', ok: true },
    { n: 'Carlos M.', s: 'On site · 08:05', ok: true },
    { n: 'Lucía V.', s: 'On site · 08:11', ok: true },
    { n: 'Pedro K.', s: 'Pending', ok: false },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[44px] bg-gradient-to-br from-cyan-200/40 via-blue-200/30 to-transparent blur-3xl"
      />
      <div className="relative overflow-hidden rounded-[40px] border border-slate-200 bg-slate-950 p-1.5 shadow-2xl">
        <div className="relative overflow-hidden rounded-[34px] bg-white">
          <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-semibold text-slate-700">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              LIVE
            </span>
          </div>

          <div className="px-5 pb-5 pt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Hoy
                </p>
                <p className="mt-0.5 font-display text-lg font-semibold tracking-tight text-slate-950">
                  Tus limpiezas
                </p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">
                MR
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-white">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em]">
                <span className="text-slate-400">Operativa hoy</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <Sparkles className="h-2.5 w-2.5" />
                  LIVE
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-4">
                <div>
                  <p className="text-2xl font-semibold tracking-tight">12 / 14</p>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-slate-400">
                    Tareas
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-cyan-300">
                    4.9
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-slate-400">
                    Calidad
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Check-in
            </p>
            <ul className="mt-2 divide-y divide-slate-100">
              {checkins.map((p) => (
                <li key={p.n} className="flex items-center gap-2.5 py-2">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-cyan-50 text-[10px] font-bold text-cyan-700">
                    {p.n
                      .split(' ')
                      .map((x) => x[0])
                      .join('')}
                  </div>
                  <p className="flex-1 text-xs font-medium text-slate-800">{p.n}</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      p.ok ? 'text-cyan-600' : 'text-amber-600'
                    }`}
                  >
                    ● {p.s}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

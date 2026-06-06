import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, CheckCircle2, Sparkles, Star, TrendingUp, Users2 } from 'lucide-react';

export async function Hero() {
  const t = await getTranslations('hero');

  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* ====== Decorative background ====== */}
      <BackgroundLayers />

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-14 sm:pt-20 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:pb-36 lg:pt-28">
        {/* ====== Left: copy ====== */}
        <div className="max-w-2xl">
          <span className="group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
            </span>
            {t('audience_chip')}
          </span>

          <h1 className="mt-7 font-display text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] text-slate-950 sm:text-6xl lg:text-[4.25rem]">
            {t('title_a')}{' '}
            <span className="relative inline-block">
              <span className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                {t('title_b')}
              </span>
              <svg
                aria-hidden
                className="absolute -bottom-2 left-0 h-3 w-full text-blue-200/70"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9 Q 50 2, 100 6 T 198 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            {t('subtitle')}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 px-7 text-[15px] font-semibold text-white shadow-[0_24px_48px_-16px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:shadow-[0_30px_60px_-16px_rgba(37,99,235,0.65),inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-[1.08] active:translate-y-px"
            >
              <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              {t('cta_primary')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#portals"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300/80 bg-white/80 px-7 text-[15px] font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-px hover:border-slate-400 hover:bg-white hover:shadow"
            >
              {t('cta_secondary')}
            </a>
          </div>

          {/* Trust signal row */}
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  { bg: 'bg-gradient-to-br from-cyan-400 to-blue-500', label: 'MR' },
                  { bg: 'bg-gradient-to-br from-violet-400 to-purple-600', label: 'CM' },
                  { bg: 'bg-gradient-to-br from-amber-400 to-orange-500', label: 'LV' },
                  { bg: 'bg-gradient-to-br from-emerald-400 to-teal-600', label: 'PK' },
                ].map((a) => (
                  <span
                    key={a.label}
                    className={`grid h-9 w-9 place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-white ${a.bg}`}
                  >
                    {a.label}
                  </span>
                ))}
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-0.5 font-medium text-slate-600">{t('trust')}</p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium">No credit card · Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* ====== Right: phone + floating cards ====== */}
        <div className="relative mt-20 lg:mt-0">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function BackgroundLayers() {
  return (
    <>
      {/* Soft gradient canvas */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/60 via-white to-white" />
      {/* Mesh gradients (top-left + top-right) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(at 18% 12%, rgba(34,211,238,0.18) 0px, transparent 45%), radial-gradient(at 82% 24%, rgba(59,130,246,0.20) 0px, transparent 50%), radial-gradient(at 50% 60%, rgba(139,92,246,0.08) 0px, transparent 60%)',
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at top, black 50%, transparent 80%)',
        }}
      />
      {/* Floating orbs */}
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200/50 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-gradient-to-bl from-blue-300/40 to-transparent blur-3xl" />
    </>
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
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* Big diffuse glow behind */}
      <div
        aria-hidden
        className="absolute -inset-12 -z-10 rounded-[60px] bg-gradient-to-br from-cyan-300/40 via-blue-400/30 to-violet-300/20 blur-3xl"
      />

      {/* Floating stat card — top-left */}
      <div className="absolute -left-14 -top-8 z-20 hidden rotate-[-6deg] sm:block">
        <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18),0_4px_10px_-4px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              On-time rate
            </p>
            <p className="text-sm font-semibold text-slate-900">98.7%</p>
          </div>
        </div>
      </div>

      {/* Floating stat card — bottom-right */}
      <div className="absolute -bottom-6 -right-12 z-20 hidden rotate-[5deg] sm:block">
        <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.18),0_4px_10px_-4px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-100 to-blue-50 text-blue-600">
            <Users2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Active crews
            </p>
            <p className="text-sm font-semibold text-slate-900">14 · live</p>
          </div>
        </div>
      </div>

      {/* Phone itself */}
      <div className="relative overflow-hidden rounded-[44px] border border-slate-200 bg-slate-950 p-1.5 shadow-[0_50px_100px_-20px_rgba(15,23,42,0.40),0_20px_40px_-12px_rgba(15,23,42,0.20)]">
        {/* Camera notch */}
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-950" />
        <div className="relative overflow-hidden rounded-[38px] bg-white">
          <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-semibold text-slate-700">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              LIVE
            </span>
          </div>

          <div className="px-5 pb-6 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Hoy
                </p>
                <p className="mt-0.5 font-display text-lg font-semibold tracking-tight text-slate-950">
                  Tus limpiezas
                </p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-100 to-cyan-50 text-xs font-bold text-cyan-700 ring-1 ring-cyan-200/60">
                MR
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-3.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
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
                  <p className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
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
                <li key={p.n} className="flex items-center gap-2.5 py-2.5">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-cyan-50 to-blue-50 text-[10px] font-bold text-cyan-700 ring-1 ring-cyan-100">
                    {p.n
                      .split(' ')
                      .map((x) => x[0])
                      .join('')}
                  </div>
                  <p className="flex-1 text-xs font-medium text-slate-800">{p.n}</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      p.ok ? 'text-emerald-600' : 'text-amber-600'
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

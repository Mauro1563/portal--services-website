import Link from 'next/link';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { PasswordInput } from './PasswordInput';
import { signIn } from './actions';
import { getT, getLocale } from '@/lib/i18n';

type Props = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams;
  const t = await getT();
  const locale = await getLocale();

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ============================================================== */}
      {/* LEFT — dark hero panel, hidden on mobile so the form stays the
          primary action; on desktop it carries the brand and proof. */}
      {/* ============================================================== */}
      <aside className="relative hidden overflow-hidden bg-ink-0 text-white lg:block">
        {/* Mesh gradient + grid + accent glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(at 18% 12%, rgba(34,211,238,0.22) 0px, transparent 50%), radial-gradient(at 82% 90%, rgba(37,99,235,0.30) 0px, transparent 55%), linear-gradient(180deg, #0B1220 0%, #0F1729 100%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse at center, black 35%, transparent 80%)',
          }}
        />

        {/* Logo top-left */}
        <div className="relative z-10 px-12 pt-10">
          <Logo size="md" className="!h-12" />
        </div>

        {/* Hero copy, anchored bottom-left so it doesn't fight the phone */}
        <div className="relative z-10 flex h-[calc(100%-7rem)] flex-col justify-end px-12 pb-12">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300/85">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            {t('login.heroEyebrow')}
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-[-0.02em] xl:text-[3.5rem]">
            {t('login.heroTitleA')}
            <br />
            {t('login.heroTitleB')}
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {t('login.heroTitleC')}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-300/90">
            {t('login.heroSubtitle')}
          </p>

          {/* Stats row */}
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <Stat
              value={t('login.statsServicesValue')}
              label={t('login.statsServicesLabel')}
            />
            <Stat
              value={t('login.statsSlaValue')}
              label={t('login.statsSlaLabel')}
            />
            <Stat
              value={t('login.statsLiveValue')}
              label={t('login.statsLiveLabel')}
            />
          </div>

          <p className="mt-10 flex items-center gap-2 text-[11px] font-medium text-white/40">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('login.encryptedConnection')}
          </p>
        </div>

        {/* Floating phone — uses the same real screenshot the marketing
            hero uses so the login screen mirrors the product. */}
        <div className="pointer-events-none absolute right-[-3rem] top-[12%] z-10 hidden w-[20rem] -rotate-[6deg] xl:block">
          <div className="rounded-[40px] bg-slate-950 p-1.5 shadow-[0_50px_120px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/5">
            <div className="overflow-hidden rounded-[34px] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-product.png"
                alt=""
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* RIGHT — the actual auth form. Same fields and i18n keys as
          before; only the chrome changed. */}
      {/* ============================================================== */}
      <section className="relative flex min-h-screen items-center justify-center bg-white px-5 py-10">
        {/* Locale switcher top-right */}
        <div className="absolute right-5 top-5">
          <LocaleSwitcher current={locale} variant="onLight" />
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile-only logo since the left panel hides */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="md" className="!h-12" />
          </div>

          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950">
            {t('login.pageTitle')}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t('login.pageSubtitle')}
          </p>

          {error ? (
            <p className="mt-6 flex items-start gap-2 rounded-lg border border-rose-200/70 bg-rose-50/80 px-3 py-2 text-[12px] leading-relaxed text-rose-700">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
              <span className="min-w-0 break-words">{error}</span>
            </p>
          ) : null}
          {message ? (
            <p className="mt-6 flex items-start gap-2 rounded-lg border border-emerald-200/70 bg-emerald-50/80 px-3 py-2 text-[12px] leading-relaxed text-emerald-700">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="min-w-0 break-words">{message}</span>
            </p>
          ) : null}

          <form action={signIn} className="mt-7 space-y-4">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                Email o PIN
              </span>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                {/* type="text" instead of "email" so 4–8 digit operative
                    PINs aren't rejected by the browser's email validator
                    before the server action gets a chance to branch. */}
                <input
                  type="text"
                  name="identifier"
                  required
                  autoComplete="username"
                  inputMode="text"
                  placeholder="tucorreo@ejemplo.com — o tu PIN"
                  className="block h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/15"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                {t('login.password')}
              </span>
              <div className="mt-1.5">
                <PasswordInput />
              </div>
              <span className="mt-1.5 block text-[11px] text-slate-500">
                ¿Operativo? Dejá la contraseña vacía — tu PIN ya alcanza.
              </span>
            </label>

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-[13px] font-bold uppercase tracking-[0.20em] text-white shadow-[0_14px_28px_-10px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.20)] transition hover:brightness-[1.08] active:translate-y-px"
            >
              <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              {t('login.signInBtn')}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            <Link href="/" className="font-medium hover:text-slate-900">
              {t('login.backHome')}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold leading-none tracking-tight text-white xl:text-3xl">
        {value}
      </p>
      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
        {label}
      </p>
    </div>
  );
}

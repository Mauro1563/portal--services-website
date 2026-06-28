import Link from 'next/link';
import {
  Building2,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { PasswordInput } from './PasswordInput';
import { SubmitButton } from './SubmitButton';
import { PrefetchRoutes } from './PrefetchRoutes';
import { signIn } from './actions';
import { getT, getLocale, type Locale } from '@/lib/i18n';

type Props = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

// Locale-keyed copy for strings on /login that aren't yet in messages/*.json.
// Kept inline so the page is self-contained — the rest of the page still uses
// `t(...)` for keys that already exist in the message catalogs.
const COPY: Record<
  Locale,
  {
    identifierLabel: string;
    identifierPh: string;
    operativeHint: string;
    showPassword: string;
    hidePassword: string;
    signingIn: string;
    demoEyebrow: string;
    demoTitle: string;
    demoOwner: string;
    demoCleaner: string;
    demoClient: string;
  }
> = {
  en: {
    identifierLabel: 'Email or PIN',
    identifierPh: 'you@example.com — or your PIN',
    operativeHint: 'Cleaner? Leave password empty — your PIN is enough.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    signingIn: 'Signing in…',
    demoEyebrow: 'No account yet?',
    demoTitle: 'Try the live demos — no sign-up',
    demoOwner: 'Owner dashboard',
    demoCleaner: 'Cleaner app',
    demoClient: 'Customer portal',
  },
  es: {
    identifierLabel: 'Email o PIN',
    identifierPh: 'tucorreo@ejemplo.com — o tu PIN',
    operativeHint: '¿Operario? Deja la contraseña vacía — tu PIN ya alcanza.',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    signingIn: 'Entrando…',
    demoEyebrow: '¿Aún no tienes cuenta?',
    demoTitle: 'Prueba los demos en vivo — sin registro',
    demoOwner: 'Panel del dueño',
    demoCleaner: 'App del operario',
    demoClient: 'Portal del cliente',
  },
  pt: {
    identifierLabel: 'Email ou PIN',
    identifierPh: 'tucorreio@exemplo.com — ou o teu PIN',
    operativeHint: 'Operário? Deixe a senha vazia — o teu PIN já chega.',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    signingIn: 'A entrar…',
    demoEyebrow: 'Ainda sem conta?',
    demoTitle: 'Experimenta os demos ao vivo — sem registo',
    demoOwner: 'Painel do dono',
    demoCleaner: 'App do operário',
    demoClient: 'Portal do cliente',
  },
};

export default async function LoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams;
  const t = await getT();
  const locale = await getLocale();
  const copy = COPY[locale];

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
          <ZapliLogo size="md" className="!h-12" mono />
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
            <ZapliLogo size="md" className="!h-12" />
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

          {/* Demo escape hatches — anyone who lands on /login without a
              real account (the common path for prospects coming from the
              marketing site) gets a direct, no-PIN one-tap entry into the
              three live previews. */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-3">
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles className="-mt-px mr-1 inline h-3 w-3" />
              {copy.demoEyebrow}
            </p>
            <p className="mt-0.5 px-1 text-[12px] font-bold text-slate-900">
              {copy.demoTitle}
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              <Link
                href="/owner/preview"
                title={copy.demoOwner}
                className="group flex flex-col items-center gap-1 rounded-xl bg-slate-900 px-2 py-2.5 text-white transition hover:bg-slate-800"
              >
                <Building2 className="h-4 w-4 text-cyan-300 transition group-hover:scale-110" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Owner
                </span>
              </Link>
              <Link
                href="/operative/preview"
                title={copy.demoCleaner}
                className="group flex flex-col items-center gap-1 rounded-xl bg-emerald-600 px-2 py-2.5 text-white transition hover:bg-emerald-500"
              >
                <Users className="h-4 w-4 transition group-hover:scale-110" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Cleaner
                </span>
              </Link>
              <Link
                href="/client/preview"
                title={copy.demoClient}
                className="group flex flex-col items-center gap-1 rounded-xl bg-blue-600 px-2 py-2.5 text-white transition hover:bg-blue-500"
              >
                <UserRound className="h-4 w-4 transition group-hover:scale-110" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Client
                </span>
              </Link>
            </div>
          </div>

          <form action={signIn} className="mt-7 space-y-4">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                {copy.identifierLabel}
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
                  placeholder={copy.identifierPh}
                  className="block h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/15"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                {t('login.password')}
              </span>
              <div className="mt-1.5">
                <PasswordInput
                  showLabel={copy.showPassword}
                  hideLabel={copy.hidePassword}
                />
              </div>
              <span className="mt-1.5 block text-[11px] text-slate-500">
                {copy.operativeHint}
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

            <SubmitButton
              label={t('login.signInBtn')}
              pendingLabel={copy.signingIn}
            />
          </form>
          {/* Warm the router cache for /owner, /operative, /hq so the
              post-redirect navigation feels instant. */}
          <PrefetchRoutes />

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

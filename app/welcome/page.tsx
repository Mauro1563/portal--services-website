import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Home,
  KeyRound,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ScrollLock } from '@/components/ScrollLock';
import { getLocale, getT } from '@/lib/i18n';

export const metadata = {
  title: 'Bienvenido · Zapli',
  robots: { index: false, follow: false },
};

export default async function WelcomePage() {
  const locale = await getLocale();
  const t = await getT();

  const valueProps = [
    { icon: KeyRound, label: t('welcome.bullet1') },
    { icon: Sparkles, label: t('welcome.bullet2') },
    { icon: Zap, label: t('welcome.bullet3') },
  ];

  return (
    <>
      <ScrollLock />
      <main
        className="flex flex-col items-center bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60"
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          overscrollBehavior: 'none',
          touchAction: 'none',
          paddingTop: 'max(env(safe-area-inset-top), 1rem)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)',
          paddingLeft: 'max(env(safe-area-inset-left), 1rem)',
          paddingRight: 'max(env(safe-area-inset-right), 1rem)',
        }}
      >
        {/* Decorative orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 -z-10 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-cyan-300/40 via-blue-400/25 to-transparent blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[24rem] w-[24rem] rounded-full bg-gradient-to-tr from-blue-500/30 via-cyan-300/20 to-transparent blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          }}
        />

        {/* Locale switcher — top-right */}
        <div className="absolute right-4 top-4 z-10" style={{ top: 'max(env(safe-area-inset-top), 1rem)' }}>
          <LocaleSwitcher current={locale} variant="dark" />
        </div>

        {/* Center column */}
        <div
          className="relative flex w-full flex-col items-center justify-center"
          style={{ maxWidth: 'min(24rem, calc(100vw - 2rem))', minHeight: '100%' }}
        >
          {/* Logo + tagline */}
          <div className="flex flex-col items-center text-center">
            <ZapliLogo size="md" className="!h-20 sm:!h-24" />
            <h1 className="mt-5 text-[1.625rem] font-bold tracking-[-0.02em] text-[#0b1d3a]">
              {t('welcome.title')}
            </h1>
            <p className="mt-1.5 text-[13px] text-slate-700">
              {t('welcome.subtitle')}
            </p>
          </div>

          {/* Value props row */}
          <div className="mt-6 flex w-full max-w-full flex-wrap items-center justify-center gap-1.5">
            {valueProps.map((v) => {
              const Icon = v.icon;
              return (
                <span
                  key={v.label}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0b1d3a] shadow-[0_4px_14px_-6px_rgba(37,99,235,0.30),inset_0_0_0_1px_rgba(37,99,235,0.10)]"
                >
                  <Icon className="h-3 w-3 text-[#2563eb]" />
                  {v.label}
                </span>
              );
            })}
          </div>

          {/* CTA cards */}
          <div className="mt-7 grid w-full gap-3">
            <RoleCard
              href="/login"
              icon={Home}
              title={t('welcome.ownerTitle')}
              subtitle={t('welcome.ownerSubtitle')}
              primary
            />
            <RoleCard
              href="/operative/login"
              icon={Sparkles}
              title={t('welcome.cleanerTitle')}
              subtitle={t('welcome.cleanerSubtitle')}
            />
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-[11px] text-slate-700">
            {t('welcome.newQuestion')}{' '}
            <Link
              href="/"
              className="font-bold text-[#2563eb] underline-offset-2 hover:underline"
            >
              {t('welcome.learnMore')}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

function RoleCard({
  href,
  icon: Icon,
  title,
  subtitle,
  primary,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex w-full min-w-0 items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 active:translate-y-px ${
        primary
          ? 'bg-gradient-to-br from-[#22d3ee] via-[#2563eb] to-[#1d4ed8] text-white shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.20)]'
          : 'bg-white text-[#0b1d3a] shadow-[0_10px_28px_-14px_rgba(15,23,42,0.20),inset_0_0_0_1px_rgba(15,23,42,0.08)]'
      }`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
          primary
            ? 'bg-white/15 text-white ring-1 ring-inset ring-white/20'
            : 'bg-gradient-to-br from-cyan-100 to-blue-100 text-[#2563eb]'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[14px] font-bold uppercase tracking-[0.10em] ${
            primary ? 'text-white' : 'text-[#0b1d3a]'
          }`}
        >
          {title}
        </p>
        <p
          className={`mt-0.5 truncate text-[11px] ${
            primary ? 'text-white/85' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </p>
      </div>
      {primary ? (
        <ArrowRight className="h-5 w-5 shrink-0 text-white transition-transform group-hover:translate-x-1" />
      ) : (
        <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
      )}
    </Link>
  );
}

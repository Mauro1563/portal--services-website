import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Bell, ChevronRight, Settings } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { getLocale } from '@/lib/i18n';

type Status = 'online' | 'offline' | 'idle';

const statusDot: Record<Status, string> = {
  online: 'bg-emerald-400',
  offline: 'bg-rose-400',
  idle: 'bg-amber-400',
};

export async function PortalShell({
  badge,
  badgeHref,
  backHref,
  backLabel,
  rightSlot,
  settingsHref,
  notificationsHref,
  showLocaleSwitcher = true,
  children,
}: {
  badge?: { label: string; icon?: LucideIcon };
  badgeHref?: string;
  backHref?: string;
  backLabel?: string;
  rightSlot?: React.ReactNode;
  settingsHref?: string;
  notificationsHref?: string;
  showLocaleSwitcher?: boolean;
  children: React.ReactNode;
}) {
  const BadgeIcon = badge?.icon;
  const locale = showLocaleSwitcher ? await getLocale() : null;
  return (
    <main
      className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-surface-1"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)',
        touchAction: 'pan-y',
        overscrollBehaviorX: 'none',
      }}
    >
      <header
        className="sticky top-0 z-40 w-full max-w-[100vw] overflow-hidden border-b border-surface-2 bg-surface-0/95 backdrop-blur"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between gap-2 px-4">
          <div className="flex min-w-0 shrink items-center gap-2">
            <Logo size="sm" className="max-h-10" />
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex items-center gap-1 rounded-full border border-brand-600/30 bg-brand-600/[0.06] px-2.5 py-1 text-[11px] font-semibold text-brand-700"
              >
                ← {backLabel ?? 'Back'}
              </Link>
            ) : badge ? (
              <span
                className={`hidden items-center gap-1 rounded-full border border-surface-2 bg-surface-0 px-2.5 py-1 text-[11px] font-semibold text-text-2 sm:inline-flex`}
              >
                {BadgeIcon ? <BadgeIcon className="h-3 w-3" /> : null}
                <span className="max-w-[120px] truncate">{badge.label}</span>
              </span>
            ) : null}
            {locale ? <LocaleSwitcher current={locale} variant="onLight" /> : null}
            {notificationsHref ? (
              <Link
                href={notificationsHref}
                aria-label="Notifications"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-2 bg-surface-0 text-text-2 transition hover:border-brand-600/30 hover:text-brand-600"
              >
                <Bell className="h-4 w-4" />
              </Link>
            ) : null}
            {settingsHref ? (
              <Link
                href={settingsHref}
                aria-label="Settings"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-2 bg-surface-0 text-text-2 transition hover:border-brand-600/30 hover:text-brand-600"
              >
                <Settings className="h-4 w-4" />
              </Link>
            ) : null}
            {rightSlot}
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-md min-w-0 px-4 py-5">{children}</div>
    </main>
  );
}

export function PortalHero({
  portalLabel,
  portalIcon,
  topRightChip,
  greeting,
  displayName,
  chips,
}: {
  portalLabel: string;
  portalIcon?: LucideIcon;
  topRightChip?: { label: string; icon?: LucideIcon };
  greeting: string;
  displayName: string;
  chips?: Array<
    | { kind: 'text'; label: string; icon?: LucideIcon }
    | { kind: 'status'; label: string; status: Status }
  >;
}) {
  const Icon = portalIcon;
  const TopIcon = topRightChip?.icon;
  return (
    <section
      className="relative w-full min-w-0 max-w-full overflow-hidden rounded-2xl p-3.5 text-white shadow-[0_12px_28px_-14px_rgba(37,99,235,0.45)] sm:p-4"
      style={{
        backgroundImage: [
          // Subtle highlight on top to add depth without darkening.
          'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 35%)',
          // Brand gradient (matches the marketing site + brand-gradient utility).
          'linear-gradient(135deg, #3DC5F0 0%, #2563EB 55%, #1D4ED8 100%)',
        ].join(', '),
      }}
    >
      <div className="relative min-w-0">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/20">
            {Icon ? <Icon className="h-2.5 w-2.5 shrink-0" /> : null}
            <span className="truncate">{portalLabel}</span>
          </span>
          {topRightChip ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/20">
              {TopIcon ? <TopIcon className="h-2.5 w-2.5 shrink-0" /> : null}
              {topRightChip.label}
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/80">
          {greeting}
        </p>
        <h1 className="mt-0.5 truncate font-display text-[22px] font-semibold leading-tight tracking-tight">
          {displayName}
        </h1>
        {chips && chips.length > 0 ? (
          <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-1.5">
            {chips.map((c, i) => {
              if (c.kind === 'status') {
                return (
                  <span
                    key={i}
                    className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white ring-1 ring-inset ring-white/20"
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[c.status]}`}
                    />
                    <span className="truncate">{c.label}</span>
                  </span>
                );
              }
              const ChipIcon = c.icon;
              return (
                <span
                  key={i}
                  className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white ring-1 ring-inset ring-white/20"
                >
                  {ChipIcon ? <ChipIcon className="h-3 w-3 shrink-0" /> : null}
                  <span className="truncate">{c.label}</span>
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function StatRow({
  items,
}: {
  items: Array<{ label: string; value: string | number; sub?: string }>;
}) {
  // Pick a grid that always fits the viewport. 4 items wrap to 2×2 on
  // mobile (instead of 4×1 which overflows on narrow iPhones), then opens
  // back to 4×1 from sm: upward.
  const cols =
    items.length >= 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : items.length === 3
      ? 'grid-cols-3'
      : items.length === 2
      ? 'grid-cols-2'
      : 'grid-cols-1';
  return (
    <section className={`mt-5 grid ${cols} gap-3`}>
      {items.map((it, i) => (
        <div
          key={i}
          className="min-w-0 rounded-2xl border border-surface-2 bg-surface-0 p-3 text-center shadow-card"
        >
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-text-3">
            {it.label}
          </p>
          <p className="mt-2 truncate font-display text-xl font-bold text-text-1 tabular-nums">
            {it.value}
          </p>
          {it.sub ? (
            <p className="mt-0.5 truncate text-[10px] text-text-3">{it.sub}</p>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export function ToolGrid({
  label = 'My tools',
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
        {label}
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-2 min-w-0 max-w-full sm:gap-3 sm:grid-cols-3">{children}</div>
    </section>
  );
}

export function ToolCard({
  href,
  icon: Icon,
  title,
  subtitle,
  accent = 'brand',
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accent?: 'brand' | 'navy' | 'emerald' | 'amber' | 'rose';
}) {
  const accentMap: Record<
    NonNullable<typeof accent>,
    { bg: string; fg: string }
  > = {
    brand: { bg: 'bg-brand-600/10', fg: 'text-brand-600' },
    navy: { bg: 'bg-navy-900/[0.08]', fg: 'text-navy-900' },
    emerald: { bg: 'bg-emerald-500/10', fg: 'text-emerald-600' },
    amber: { bg: 'bg-amber-500/10', fg: 'text-amber-600' },
    rose: { bg: 'bg-rose-500/10', fg: 'text-rose-600' },
  };
  const a = accentMap[accent];
  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col justify-between rounded-2xl border border-surface-2 bg-surface-0 p-3 shadow-card transition active:scale-[0.99] hover:border-brand-600/30 hover:shadow-card-lg sm:p-4"
    >
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${a.bg}`}>
        <Icon className={`h-5 w-5 ${a.fg}`} />
      </div>
      <div className="mt-3">
        <p className="font-display text-sm font-semibold text-text-1">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 text-[11px] text-text-3">{subtitle}</p>
        ) : null}
      </div>
      <ChevronRight className="mt-3 h-4 w-4 self-end text-text-3 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </Link>
  );
}

export function CorporateBanner({
  href,
  eyebrow,
  title,
  subtitle,
}: {
  href: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
        Corporate
      </h2>
      <Link
        href={href}
        className="mt-3 flex items-center gap-4 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card transition hover:border-brand-600/30 hover:shadow-card-lg"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-brand-glow">
          <span className="font-display text-lg font-bold">PS</span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {eyebrow}
          </p>
          <p className="mt-0.5 truncate font-display text-base font-semibold text-text-1">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-0.5 truncate text-[11px] text-text-3">{subtitle}</p>
          ) : null}
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-text-3" />
      </Link>
    </section>
  );
}

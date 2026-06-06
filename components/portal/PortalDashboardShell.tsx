import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Bell, ChevronRight, Settings } from 'lucide-react';
import { Logo } from '@/components/Logo';

type Status = 'online' | 'offline' | 'idle';

const statusDot: Record<Status, string> = {
  online: 'bg-emerald-400',
  offline: 'bg-rose-400',
  idle: 'bg-amber-400',
};

export function PortalShell({
  badge,
  badgeHref,
  backHref,
  backLabel,
  rightSlot,
  children,
}: {
  badge?: { label: string; icon?: LucideIcon };
  badgeHref?: string;
  backHref?: string;
  backLabel?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  const BadgeIcon = badge?.icon;
  return (
    <main className="relative min-h-screen bg-surface-1 pb-16">
      <header className="sticky top-0 z-40 border-b border-surface-2 bg-surface-0/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-2 px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex items-center gap-1 rounded-full border border-brand-600/30 bg-brand-600/[0.06] px-3 py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-600/[0.10]"
              >
                ← {backLabel ?? 'Back'}
              </Link>
            ) : badge ? (
              badgeHref ? (
                <Link
                  href={badgeHref}
                  className="inline-flex items-center gap-1 rounded-full border border-surface-2 bg-surface-0 px-3 py-1 text-[11px] font-semibold text-text-2 hover:border-brand-600/30 hover:text-brand-700"
                >
                  {BadgeIcon ? <BadgeIcon className="h-3 w-3" /> : null}
                  {badge.label}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-surface-2 bg-surface-0 px-3 py-1 text-[11px] font-semibold text-text-2">
                  {BadgeIcon ? <BadgeIcon className="h-3 w-3" /> : null}
                  {badge.label}
                </span>
              )
            ) : null}
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-2 bg-surface-0 text-text-2">
              <Bell className="h-4 w-4" />
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-2 bg-surface-0 text-text-2">
              <Settings className="h-4 w-4" />
            </span>
            {rightSlot}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-md px-4 py-5">{children}</div>
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
    <section className="relative overflow-hidden rounded-3xl border border-navy-800/40 bg-gradient-to-br from-navy-900 via-navy-800 to-ink-2 p-5 text-white shadow-card-lg">
      <div className="absolute inset-0 bg-mesh-1 opacity-40" aria-hidden />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
            {Icon ? <Icon className="h-3 w-3" /> : null}
            {portalLabel}
          </span>
          {topRightChip ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
              {TopIcon ? <TopIcon className="h-3 w-3" /> : null}
              {topRightChip.label}
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
          {greeting}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          {displayName}
        </h1>
        {chips && chips.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((c, i) => {
              if (c.kind === 'status') {
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1 text-[11px] font-medium text-white ring-1 ring-inset ring-white/10"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusDot[c.status]}`}
                    />
                    {c.label}
                  </span>
                );
              }
              const ChipIcon = c.icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1 text-[11px] font-medium text-white ring-1 ring-inset ring-white/10"
                >
                  {ChipIcon ? <ChipIcon className="h-3 w-3" /> : null}
                  {c.label}
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
  return (
    <section className="mt-5 grid grid-cols-3 gap-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-2xl border border-surface-2 bg-surface-0 p-3 text-center shadow-card"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-3">
            {it.label}
          </p>
          <p className="mt-2 font-display text-xl font-bold text-text-1 tabular-nums">
            {it.value}
          </p>
          {it.sub ? (
            <p className="mt-0.5 text-[10px] text-text-3">{it.sub}</p>
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
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
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
      className="group flex h-full flex-col justify-between rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card transition active:scale-[0.99] hover:border-brand-600/30 hover:shadow-card-lg"
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

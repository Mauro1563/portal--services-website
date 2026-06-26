import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

type Action = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
};

/**
 * Reusable empty state for list views. Surfaces an icon, a one-line
 * title, a longer body, and 1–2 CTAs (usually "create the first thing"
 * + optional "read the docs"). Use it instead of dead-empty `[]` renders
 * so the user always knows what to do next.
 *
 * Designed to fit inside a card / ring-1 container; doesn't ship its own
 * background so it inherits the surrounding chrome.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  tone = 'brand',
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actions?: Action[];
  tone?: 'brand' | 'neutral' | 'emerald' | 'amber';
}) {
  const toneClasses = {
    brand: 'bg-brand-600/10 text-brand-700 ring-brand-600/20',
    neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  };

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span
        className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-inset ${toneClasses[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-text-1">
        {title}
      </h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-text-2">
          {description}
        </p>
      ) : null}
      {actions && actions.length > 0 ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {actions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={
                a.variant === 'secondary'
                  ? 'inline-flex h-10 items-center rounded-xl border border-surface-2 bg-surface-0 px-4 text-sm font-semibold text-text-1 transition hover:border-surface-3 hover:bg-surface-1'
                  : 'inline-flex h-10 items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-110'
              }
            >
              {a.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

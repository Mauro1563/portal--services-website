import { cn } from '@/lib/cn';

/**
 * Reusable chrome wrapper for product mockups. The two variants share a
 * subtle dark glass treatment so screenshots / fake UI dropped inside
 * always look like they're floating on the brand's navy background.
 */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-white/[0.08] bg-ink-1 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        {url ? (
          <div className="ml-3 flex-1 truncate rounded-md bg-white/[0.04] px-3 py-1 text-[10px] text-slate-400">
            {url}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-[280px] rounded-[2.4rem] border border-white/[0.08] bg-ink-1 p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink-0" />
      <div className="overflow-hidden rounded-[2rem] bg-ink-0">{children}</div>
    </div>
  );
}

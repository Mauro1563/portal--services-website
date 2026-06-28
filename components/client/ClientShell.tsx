import Link from 'next/link';
import { Logo } from '@/components/Logo';
import type { ClientContext } from '@/lib/client-auth';
import { ClientTabBar, type Tab } from './ClientTabBar';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

/**
 * Mobile-first shell for the client portal. Uses the owner's white-label
 * logo if available; otherwise falls back to the Portal Home
 * brand. Light theme. Fixed bottom tab bar for the four primary views.
 */
export function ClientShell({
  ctx,
  token,
  activeTab,
  title,
  showBack,
  backHref,
  unreadMessages = 0,
  hideHeader = false,
  children,
}: {
  ctx: ClientContext;
  token?: string;
  activeTab?: Tab;
  title?: string;
  showBack?: boolean;
  backHref?: string;
  unreadMessages?: number;
  hideHeader?: boolean;
  children: React.ReactNode;
}) {
  const logoUrl = ctx.owner.business_logo_url;
  const businessName = ctx.owner.business_name ?? 'Cleaning';
  const showTabs = Boolean(token && activeTab);

  return (
    <main
      className={`relative min-h-screen bg-slate-50 text-slate-900 ${
        showTabs ? 'pb-24' : 'pb-10'
      }`}
    >
      {!hideHeader && (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-14 max-w-md items-center gap-3 px-4">
            {showBack && backHref ? (
              <Link
                href={backHref}
                aria-label="Atrás"
                className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
              >
                <BackArrow />
              </Link>
            ) : null}

            {title ? (
              <h1 className="font-display text-sm font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
            ) : logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoUrl}
                alt={businessName}
                className="h-6 w-auto max-w-[140px] object-contain"
              />
            ) : (
              <Logo size="sm" />
            )}

            {/* Locale switcher pinned to the top-right of the client header.
                Uses the premium midnight pill so it pops on the white bar
                without competing with the business logo on the left. The
                switcher reads the locale cookie + localStorage on the client
                and self-corrects on mount, so we don't need an async prop. */}
            <div className="ml-auto">
              <LocaleSwitcher variant="premium" />
            </div>
          </div>
        </header>
      )}

      <div className="mx-auto max-w-md px-4 pt-4">{children}</div>

      <footer className="mx-auto mt-8 max-w-md px-4 pb-4 text-center text-[12px] text-slate-500">
        Portal · servicios de limpieza en Londres
      </footer>

      {showTabs && token && activeTab ? (
        <ClientTabBar token={token} active={activeTab} unread={unreadMessages} />
      ) : null}
    </main>
  );
}

function BackArrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

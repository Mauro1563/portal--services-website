import { Sidebar } from './Sidebar';

export function HQShell({
  active,
  email,
  title,
  subtitle,
  actions,
  children,
}: {
  active: 'dashboard' | 'content' | 'leads' | 'settings';
  email: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} email={email} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-10">
            <div className="min-w-0">
              <h1 className="font-display text-xl font-semibold tracking-tight text-graphite-1 sm:text-2xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-0.5 text-sm text-graphite-3">{subtitle}</p>
              ) : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        </header>
        <main className="px-6 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

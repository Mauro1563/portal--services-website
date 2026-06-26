import { Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { FlashToast } from '@/components/FlashToast';
import { CommandPalette } from '@/components/CommandPalette';
import { CommandPaletteButton } from '@/components/CommandPaletteButton';
import { getLocale } from '@/lib/i18n';
import type { Active } from './nav-items';

export async function HQShell({
  active,
  email,
  title,
  subtitle,
  actions,
  children,
}: {
  active: Active;
  email: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} email={email} />
      <div className="min-w-0 flex-1">
        <MobileNav active={active} />
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
            <div className="flex shrink-0 items-center gap-2">
              <CommandPaletteButton />
              <LocaleSwitcher current={locale} variant="onLight" />
              {actions}
            </div>
          </div>
        </header>
        <main className="px-6 py-8 lg:px-10 lg:py-10">
          <Suspense fallback={null}>
            <FlashToast />
          </Suspense>
          <CommandPalette scope="hq" />
          {children}
        </main>
      </div>
    </div>
  );
}

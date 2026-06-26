import Link from 'next/link';
import {
  LayoutGrid,
  ClipboardList,
  MapPin,
  Users,
  Calendar,
  Briefcase,
  BarChart3,
  CreditCard,
  Settings,
  MoreHorizontal,
  Gift,
  ChevronLeft,
} from 'lucide-react';
import { Suspense } from 'react';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { FlashToast } from '@/components/FlashToast';
import { CommandPalette } from '@/components/CommandPalette';
import { CommandPaletteButton } from '@/components/CommandPaletteButton';
import { NotificationsBell } from './NotificationsBell';
import { getLocale } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import { getOwnerProfile } from '@/lib/owner-profile';
import { BottomTabBar, type Tab } from './BottomTabBar';

type Props = {
  activeTab: Tab;
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
};

type NavItem = { key: string; href: string; label: string; Icon: typeof LayoutGrid; tab?: Tab };

function buildGroups(
  businessType: 'airbnb' | 'house_cleaning' | 'hybrid',
): { label: string; items: NavItem[] }[] {
  const opItems: NavItem[] = [
    { key: 'overview', href: '/owner', label: 'Resumen', Icon: LayoutGrid, tab: 'home' },
    { key: 'services', href: '/owner/tasks', label: 'Servicios', Icon: ClipboardList, tab: 'tasks' },
  ];
  // Airbnb managers think in properties (listings). House cleaning shops
  // think in clients (homeowners). Show the relevant ones; hybrid sees both.
  if (businessType !== 'house_cleaning') {
    opItems.push({ key: 'sites', href: '/owner/properties', label: 'Sitios', Icon: MapPin, tab: 'properties' });
  }
  opItems.push({ key: 'team', href: '/owner/cleaners', label: 'Equipo', Icon: Users, tab: 'cleaners' });
  opItems.push({ key: 'calendar', href: '/owner/calendar', label: 'Calendario', Icon: Calendar });
  if (businessType !== 'airbnb') {
    opItems.push({ key: 'clients', href: '/owner/clients', label: 'Clientes', Icon: Briefcase });
  }

  return [
    { label: 'Operación', items: opItems },
    {
      label: 'Administración',
      items: [
        { key: 'reports', href: '/owner/analytics', label: 'Reportes', Icon: BarChart3 },
        { key: 'referrals', href: '/owner/referrals', label: 'Referidos', Icon: Gift },
        { key: 'billing', href: '/owner/billing', label: 'Facturación', Icon: CreditCard },
        { key: 'settings', href: '/owner/settings', label: 'Configuración', Icon: Settings },
        { key: 'more', href: '/owner/more', label: 'Más', Icon: MoreHorizontal, tab: 'more' },
      ],
    },
  ];
}

export async function LightLayout({
  activeTab,
  title,
  showBack,
  backHref = '/owner',
  rightSlot,
  children,
}: Props) {
  const locale = await getLocale();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getOwnerProfile(user.id) : null;
  const businessName = profile?.business_name ?? 'Mi empresa';
  const logo = profile?.business_logo_url ?? null;
  const wsInit = businessName.slice(0, 2).toUpperCase();
  const groups = buildGroups(profile?.business_type ?? 'hybrid');

  const isActive = (it: NavItem) => it.tab === activeTab;

  return (
    <div
      className="flex min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#F4F6FB] text-text-1"
      style={{ touchAction: 'pan-y', overscrollBehaviorX: 'none' }}
    >
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-[#0F172A] px-3 py-4 text-white lg:flex">
        <div className="flex items-center gap-2.5 px-2 pb-4">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-[10px] bg-gradient-to-br from-sky-500 to-blue-600">
            {logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logo} alt="" className="h-7 w-7 object-contain" />
            ) : (
              <span className="text-sm font-bold">P</span>
            )}
          </span>
          <span className="text-sm font-semibold leading-tight">
            Portal HQ
            <span className="block text-[10.5px] font-normal text-slate-400">Operaciones</span>
          </span>
        </div>

        <div className="mb-4 flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-semibold">
            {wsInit}
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{businessName}</span>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="px-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/35">
                {g.label}
              </p>
              <div className="space-y-0.5">
                {g.items.map((it) => {
                  const active = isActive(it);
                  return (
                    <Link
                      key={it.key}
                      href={it.href}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors ${
                        active
                          ? 'bg-blue-600/20 text-white'
                          : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-2 bottom-2 w-[2.5px] rounded bg-cyan-400" />
                      )}
                      <it.Icon className="h-[17px] w-[17px] opacity-85" />
                      <span>{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <Link
          href="/owner/settings"
          className="mt-3 flex items-center gap-2.5 rounded-[10px] border-t border-white/10 px-2 pt-3 hover:opacity-90"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-[11px] font-semibold">
            {(profile?.business_name ?? user?.email ?? 'PS').slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium">Propietario</span>
            <span className="block text-[10.5px] text-slate-400">Owner · Admin</span>
          </span>
        </Link>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-surface-2 bg-[#0F172A] px-4 text-white lg:hidden">
          {showBack ? (
            <Link href={backHref} aria-label="Atrás" className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <span className="text-sm font-semibold">Portal HQ</span>
          )}
          {title ? <h1 className="truncate font-display text-base font-semibold">{title}</h1> : <span />}
          <div className="-mr-2 flex items-center">{rightSlot ?? <LocaleSwitcher current={locale} variant="dark" />}</div>
        </header>

        {/* Desktop topbar */}
        <header className="hidden h-16 items-center gap-4 border-b border-surface-2 bg-white/70 px-6 backdrop-blur lg:flex">
          <div className="flex items-center gap-2 text-[13px] text-text-3">
            {showBack && (
              <Link href={backHref} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-surface-1">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}
            <span>HQ</span>
            <span>›</span>
            <strong className="font-semibold text-text-1">{title ?? 'Panel general'}</strong>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <CommandPaletteButton />
            <LocaleSwitcher current={locale} variant="light" />
            <NotificationsBell />
          </div>
        </header>

        <main className="min-w-0 w-full max-w-[100vw] flex-1 overflow-x-hidden px-3 py-4 pb-24 sm:px-4 sm:py-5 lg:px-8 lg:py-7 lg:pb-10">
          <Suspense fallback={null}>
            <FlashToast />
          </Suspense>
          <CommandPalette scope="owner" />
          {children}
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <div className="lg:hidden">
        <BottomTabBar active={activeTab} />
      </div>
    </div>
  );
}

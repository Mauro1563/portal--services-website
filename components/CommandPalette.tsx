'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CreditCard,
  Gift,
  Inbox,
  KeyRound,
  LayoutGrid,
  ListChecks,
  LogOut,
  Plus,
  Search,
  Settings,
  UserPlus,
  Users,
  FileText,
  Globe,
  Palette,
  Eye,
  Mail,
  TrendingUp,
  FileSignature,
} from 'lucide-react';

type CmdItem = {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Navegar' | 'Crear' | 'Acciones';
  keywords?: string[];
};

const OWNER_ITEMS: CmdItem[] = [
  // Navigation
  { id: 'o-dash', group: 'Navegar', label: 'Dashboard', href: '/owner', icon: LayoutGrid, keywords: ['inicio', 'home'] },
  { id: 'o-tasks', group: 'Navegar', label: 'Limpiezas', href: '/owner/tasks', icon: ListChecks, keywords: ['tareas', 'cleanings'] },
  { id: 'o-props', group: 'Navegar', label: 'Propiedades', href: '/owner/properties', icon: Building2, keywords: ['casas', 'pisos', 'airbnb'] },
  { id: 'o-cleaners', group: 'Navegar', label: 'Limpiadores', href: '/owner/cleaners', icon: KeyRound, keywords: ['team', 'cleaners', 'operativos'] },
  { id: 'o-clients', group: 'Navegar', label: 'Clientes', href: '/owner/clients', icon: Users, keywords: ['customers'] },
  { id: 'o-cal', group: 'Navegar', label: 'Calendario', href: '/owner/calendar', icon: Calendar, keywords: ['mes', 'agenda'] },
  { id: 'o-analytics', group: 'Navegar', label: 'Analytics', href: '/owner/analytics', icon: BarChart3, keywords: ['stats', 'kpi'] },
  { id: 'o-services', group: 'Navegar', label: 'Servicios', href: '/owner/services', icon: Briefcase, keywords: ['catálogo', 'precios'] },
  { id: 'o-refs', group: 'Navegar', label: 'Referidos', href: '/owner/referrals', icon: Gift, keywords: ['premios', 'rewards'] },
  { id: 'o-bill', group: 'Navegar', label: 'Facturación', href: '/owner/billing', icon: CreditCard, keywords: ['suscripción', 'plan'] },
  { id: 'o-set', group: 'Navegar', label: 'Ajustes', href: '/owner/settings', icon: Settings, keywords: ['settings'] },
  // Create
  { id: 'o-new-task', group: 'Crear', label: 'Programar limpieza', href: '/owner/tasks/new', icon: Plus, keywords: ['nueva', 'task'] },
  { id: 'o-new-prop', group: 'Crear', label: 'Agregar propiedad', href: '/owner/properties/new', icon: Building2, keywords: ['nueva'] },
  { id: 'o-new-cleaner', group: 'Crear', label: 'Sumar limpiador', href: '/owner/cleaners/new', icon: KeyRound, keywords: ['nuevo'] },
  { id: 'o-new-client', group: 'Crear', label: 'Crear cliente', href: '/owner/clients/new', icon: UserPlus, keywords: ['nuevo'] },
];

const HQ_ITEMS: CmdItem[] = [
  { id: 'h-dash', group: 'Navegar', label: 'Dashboard', href: '/hq', icon: LayoutGrid, keywords: ['inicio'] },
  { id: 'h-leads', group: 'Navegar', label: 'Leads', href: '/hq/leads', icon: Inbox, keywords: ['signups', 'solicitudes'] },
  { id: 'h-comp', group: 'Navegar', label: 'Companies', href: '/hq/companies', icon: Briefcase, keywords: ['owners', 'tenants'] },
  { id: 'h-vistas', group: 'Navegar', label: 'Vistas / Preview', href: '/hq/vistas', icon: Eye, keywords: ['preview'] },
  { id: 'h-site', group: 'Navegar', label: 'Textos y precios', href: '/hq/site', icon: Globe, keywords: ['copy', 'content'] },
  { id: 'h-content', group: 'Navegar', label: 'Contenido', href: '/hq/content', icon: FileText },
  { id: 'h-brand', group: 'Navegar', label: 'Branding', href: '/hq/branding', icon: Palette, keywords: ['logo', 'colors'] },
  { id: 'h-portals', group: 'Navegar', label: 'Portales', href: '/hq/portals', icon: LayoutGrid },
  { id: 'h-clients', group: 'Navegar', label: 'Clientes (CMS)', href: '/hq/clients', icon: Users },
  { id: 'h-sales', group: 'Navegar', label: 'Ventas', href: '/hq/sales', icon: TrendingUp },
  { id: 'h-contracts', group: 'Navegar', label: 'Contratos', href: '/hq/contracts', icon: FileSignature },
  { id: 'h-set', group: 'Navegar', label: 'Ajustes', href: '/hq/settings', icon: Settings },
  { id: 'h-email', group: 'Navegar', label: 'Email · Test', href: '/hq/email-test', icon: Mail, keywords: ['resend', 'smtp'] },
];

/**
 * Spotlight-style command palette. Cmd+K (Mac) / Ctrl+K (Win/Linux)
 * opens the modal; type to filter; Enter to navigate. Lives in the
 * shells so it's available on every page of its portal.
 */
export function CommandPalette({ scope }: { scope: 'owner' | 'hq' }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const items = scope === 'owner' ? OWNER_ITEMS : HQ_ITEMS;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onCustom = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onCustom);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onCustom);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] backdrop-blur-sm"
      style={{ background: 'rgba(15,23,42,0.4)' }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command palette" loop>
          <div className="flex items-center gap-2 border-b border-slate-200 px-4">
            <Search className="h-4 w-4 text-slate-400" />
            <Command.Input
              autoFocus
              placeholder="Buscar páginas, acciones…"
              className="h-12 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:inline">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-slate-500">
              Sin resultados.
            </Command.Empty>

            {groups.map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
              >
                {items
                  .filter((i) => i.group === group)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.id}
                        value={`${item.label} ${item.keywords?.join(' ') ?? ''}`}
                        onSelect={() => go(item.href)}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition aria-selected:bg-slate-100 aria-selected:text-slate-900"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                        <span className="flex-1">{item.label}</span>
                      </Command.Item>
                    );
                  })}
              </Command.Group>
            ))}
          </Command.List>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>navegar</span>
              <span className="mx-2 text-slate-300">·</span>
              <Kbd>↵</Kbd>
              <span>abrir</span>
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <span>cerrar</span>
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-slate-200 bg-white px-1 font-mono text-[10px] text-slate-600 shadow-[0_1px_0_rgba(15,23,42,0.05)]">
      {children}
    </kbd>
  );
}

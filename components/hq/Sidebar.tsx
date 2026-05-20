import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { signOut } from '@/app/hq/actions';
import { Logo } from '@/components/Logo';

type Active = 'dashboard' | 'content' | 'leads' | 'settings';

const items: { key: Active; href: string; label: string; Icon: typeof FileText }[] = [
  { key: 'dashboard', href: '/hq', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'content', href: '/hq/content', label: 'Contenido', Icon: FileText },
  { key: 'leads', href: '/hq/leads', label: 'Leads', Icon: Inbox },
  { key: 'settings', href: '/hq/settings', label: 'Ajustes', Icon: Settings },
];

export function Sidebar({ active, email }: { active: Active; email: string }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.02] lg:flex">
      <div className="flex h-16 items-center border-b border-white/[0.06] px-5">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map(({ key, href, label, Icon }) => {
          const isActive = key === active;
          return (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/[0.06] text-white'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/[0.06] px-3 py-4">
        <a
          href="/en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
        >
          <span>Ver sitio público</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <div className="rounded-xl bg-white/[0.03] px-3 py-2.5 text-[11px] ring-1 ring-inset ring-white/[0.06]">
          <p className="font-medium text-slate-300">Sesión iniciada</p>
          <p className="truncate text-slate-500">{email}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

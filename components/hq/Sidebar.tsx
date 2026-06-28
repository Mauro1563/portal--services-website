import Link from 'next/link';
import { LogOut, ExternalLink } from 'lucide-react';
import { signOut } from '@/app/hq/actions';
import { ZapliLogo } from '@/components/brand/ZapliLogo';
import { navGroups, type Active } from './nav-items';

export function Sidebar({ active, email }: { active: Active; email: string }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-paper lg:flex">
      <div className="flex h-16 items-center border-b border-line px-5">
        <ZapliLogo size="sm" />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-graphite-4">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map(({ key, href, label, Icon }) => {
                const isActive = key === active;
                return (
                  <Link
                    key={key}
                    href={href}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-700 ring-1 ring-inset ring-brand-500/20'
                        : 'text-graphite-3 hover:bg-slate-100 hover:text-graphite-1'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-line px-3 py-4">
        <a
          href="/en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs text-graphite-3 transition hover:bg-slate-100 hover:text-graphite-1"
        >
          <span>Ver sitio público</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] ring-1 ring-inset ring-line">
          <p className="font-medium text-graphite-2">Sesión iniciada</p>
          <p className="truncate text-graphite-4">{email}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-graphite-3 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

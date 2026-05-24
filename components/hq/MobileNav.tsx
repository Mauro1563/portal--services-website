'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { signOut } from '@/app/hq/actions';
import { navGroups, type Active } from './nav-items';

export function MobileNav({ active }: { active: Active }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="flex h-14 items-center justify-between border-b border-line bg-paper px-4">
        <span className="font-display text-sm font-semibold text-graphite-1">Portal Services · HQ</span>
        <button onClick={() => setOpen(true)} aria-label="Menú" className="rounded-lg p-2 text-graphite-2 hover:bg-slate-100">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
          <div className="flex w-72 max-w-[80%] flex-col bg-paper">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="font-display text-sm font-semibold text-graphite-1">Menú</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar" className="rounded-lg p-2 text-graphite-2 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-graphite-4">{group.label}</p>
                  <div className="space-y-1">
                    {group.items.map(({ key, href, label, Icon }) => (
                      <Link
                        key={key}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                          key === active ? 'bg-brand-500/10 text-brand-700 ring-1 ring-inset ring-brand-500/20' : 'text-graphite-3 hover:bg-slate-100 hover:text-graphite-1'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="border-t border-line px-3 py-4">
              <form action={signOut}>
                <button type="submit" className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-graphite-3 transition hover:bg-rose-50 hover:text-rose-700">
                  <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

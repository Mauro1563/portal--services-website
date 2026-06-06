'use client';

import { useState, useTransition } from 'react';
import { Check, Globe } from 'lucide-react';
import { setLocale } from '@/app/i18n/actions';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
] as const;

type Variant = 'dark' | 'light';

export function LocaleSwitcher({
  current = 'en',
  variant = 'dark',
}: {
  current?: 'en' | 'es' | 'pt';
  variant?: Variant;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const isDark = variant === 'dark';
  const trigger =
    'inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ' +
    (isDark
      ? 'bg-white/[0.06] text-slate-200 hover:bg-white/[0.10]'
      : 'bg-white/[0.06] text-white hover:bg-white/[0.12]');

  const panel =
    'absolute right-0 top-11 z-50 min-w-[150px] overflow-hidden rounded-xl border shadow-lg ' +
    (isDark
      ? 'border-white/10 bg-ink-1'
      : 'border-white/10 bg-navy-900 text-white');

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={trigger}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{current}</span>
      </button>
      {open ? (
        <>
          {/* outside click capture */}
          <button
            type="button"
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-transparent"
          />
          <ul role="menu" className={panel}>
            {LOCALES.map((l) => {
              const active = l.code === current;
              return (
                <li key={l.code} role="none">
                  <form
                    action={(fd) => {
                      startTransition(() => {
                        setLocale(fd).then(() => setOpen(false));
                      });
                    }}
                  >
                    <input type="hidden" name="locale" value={l.code} />
                    <button
                      type="submit"
                      role="menuitem"
                      disabled={pending}
                      className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-xs text-slate-200 hover:bg-white/[0.06]"
                    >
                      <span>{l.label}</span>
                      {active ? <Check className="h-3.5 w-3.5 text-cyan-300" /> : null}
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </div>
  );
}

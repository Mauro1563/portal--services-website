'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

const LOCALES = ['es', 'en', 'pt'] as const;
const LABELS: Record<(typeof LOCALES)[number], string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
};

export function TopBanner() {
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const change = (loc: string) => {
    if (loc === current) return;
    const segments = pathname.split('/');
    if ((LOCALES as readonly string[]).includes(segments[1])) {
      segments[1] = loc;
    } else {
      segments.splice(1, 0, loc);
    }
    const next = segments.join('/') || `/${loc}`;
    startTransition(() => router.push(next));
  };

  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-end gap-2 px-5 text-xs text-slate-600">
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <Globe className="h-3.5 w-3.5" />
          Idioma:
        </span>
        <div className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-0.5">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              disabled={isPending}
              onClick={() => change(l)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
                current === l
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
              aria-current={current === l}
            >
              {l}
            </button>
          ))}
        </div>
        <span className="hidden text-slate-400 md:inline">
          {LABELS[current as (typeof LOCALES)[number]] ?? ''}
        </span>
      </div>
    </div>
  );
}

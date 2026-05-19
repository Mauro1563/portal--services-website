'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

const items = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
];

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    if (['en', 'es', 'pt'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || `/${newLocale}`;
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <div className="hidden items-center gap-0.5 rounded-md border border-surface-3 bg-surface-1 p-0.5 sm:flex">
      {items.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => changeLocale(l.code)}
          disabled={isPending}
          className={`rounded px-2 py-1 text-[10px] font-semibold tracking-wider transition ${
            currentLocale === l.code
              ? 'bg-cyan-500/15 text-brand-600'
              : 'text-text-2 hover:text-text-1'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

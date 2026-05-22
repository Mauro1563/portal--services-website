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
    <div className="flex items-center gap-0.5 rounded-md bg-slate-100 p-0.5 ring-1 ring-inset ring-slate-200">
      {items.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => changeLocale(l.code)}
          disabled={isPending}
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider transition ${
            currentLocale === l.code
              ? 'bg-white text-brand-600 shadow-sm'
              : 'text-graphite-3 hover:text-graphite-1'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

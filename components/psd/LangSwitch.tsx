'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

const LOCALES = ['en', 'es', 'pt'];

export function LangSwitch() {
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const change = (loc: string) => {
    const segments = pathname.split('/');
    if (LOCALES.includes(segments[1])) segments[1] = loc;
    else segments.splice(1, 0, loc);
    const next = segments.join('/') || `/${loc}`;
    startTransition(() => router.push(next));
  };

  return (
    <div className="lang-switch" role="tablist" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l}
          role="tab"
          className={current === l ? 'active' : ''}
          aria-selected={current === l}
          disabled={isPending}
          onClick={() => change(l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, KeyRound, Plus, Search, SearchX } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { EmptyState } from '@/components/EmptyState';
import { CsvExportButton } from '@/components/CsvExportButton';
import { getT } from '@/lib/i18n';

type SearchParams = Promise<{ q?: string }>;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default async function CleanersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const { q } = await searchParams;
  const needle = (q ?? '').trim();

  let query = supabase
    .from('cleaners')
    .select('id, name, phone, email, pin, created_at')
    .order('created_at', { ascending: false });

  if (needle) {
    const pattern = `%${needle}%`;
    query = query.or(
      `name.ilike.${pattern},phone.ilike.${pattern},email.ilike.${pattern}`,
    );
  }

  const { data: cleaners } = await query;

  return (
    <LightLayout activeTab="cleaners" title={t('cleaners.title')}>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-1">
              {t('cleaners.title')}
            </h1>
            <p className="mt-1 text-sm text-text-2">{t('cleaners.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <CsvExportButton
              rows={cleaners ?? []}
              filename="limpiadores"
              headers={[
                { key: 'name', label: 'Nombre' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Teléfono' },
                { key: 'pin', label: 'PIN' },
              ]}
            />
            <Link
              href="/owner/cleaners/new"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow transition hover:brightness-110 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" /> {t('cleaners.addBtn')}
            </Link>
          </div>
        </div>

        <form method="get" className="mt-5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder={t('cleaners.searchPh')}
              className="h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
          <span className="hidden shrink-0 text-xs text-text-3 sm:block">
            {cleaners?.length ?? 0} operativo(s)
          </span>
        </form>

        {!cleaners || cleaners.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-surface-2 bg-surface-0">
            {needle ? (
              <EmptyState
                icon={SearchX}
                tone="neutral"
                title={t('cleaners.noMatches')}
                description={t('properties.tryAnother')}
              />
            ) : (
              <EmptyState
                icon={KeyRound}
                title={t('cleaners.empty')}
                description={t('cleaners.emptyHint')}
                actions={[
                  { label: 'Añadir limpiador', href: '/owner/cleaners/new' },
                ]}
              />
            )}
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
            <ul className="divide-y divide-surface-2">
              {cleaners.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/owner/cleaners/${c.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-surface-1"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-sm font-semibold text-brand-700">
                      {initials(c.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold text-text-1">
                        {c.name}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-text-3">
                        {[c.phone, c.email].filter(Boolean).join(' · ') ||
                          t('cleaners.noContact')}
                      </p>
                    </div>
                    <span className="hidden items-center gap-1.5 rounded-full bg-brand-600/10 px-2.5 py-1 ring-1 ring-inset ring-brand-600/20 sm:inline-flex">
                      <KeyRound className="h-3 w-3 text-brand-700" />
                      <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-brand-700">
                        {c.pin ?? '— — —'}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-text-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </LightLayout>
  );
}

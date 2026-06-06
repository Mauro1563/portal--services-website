import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Building2, ChevronRight, Plus, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { getT } from '@/lib/i18n';

type SearchParams = Promise<{ q?: string }>;

export default async function PropertiesPage({
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
    .from('properties')
    .select('id, name, address, airbnb_ical_url, created_at')
    .order('created_at', { ascending: false });

  if (needle) {
    const pattern = `%${needle}%`;
    query = query.or(`name.ilike.${pattern},address.ilike.${pattern}`);
  }

  const { data: properties } = await query;

  return (
    <LightLayout activeTab="properties" title={t('properties.title')}>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-2xl font-semibold text-text-1">
            {t('properties.title')}
          </h1>
          <Link
            href="/owner/properties/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow transition hover:brightness-110 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" /> {t('properties.addBtn')}
          </Link>
        </div>

        <form method="get" className="mt-5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder={t('properties.searchPh')}
              className="h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
          <span className="hidden shrink-0 text-xs text-text-3 sm:block">
            {properties?.length ?? 0} sitio(s)
          </span>
        </form>

        {!properties || properties.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-surface-2 bg-surface-0 p-10 text-center">
            <Building2 className="mx-auto h-7 w-7 text-text-3" />
            <p className="mt-3 font-display text-base font-semibold text-text-1">
              {needle ? t('properties.noMatches') : t('properties.empty')}
            </p>
            <p className="mt-1 text-sm text-text-2">
              {needle ? t('properties.tryAnother') : t('properties.emptyHint')}
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
            <ul className="divide-y divide-surface-2">
              {properties.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/owner/properties/${p.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-surface-1"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy-900 text-white">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold text-text-1">
                        {p.name}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-text-3">
                        {[
                          p.address,
                          p.airbnb_ical_url ? t('properties.icalConnected') : null,
                        ]
                          .filter(Boolean)
                          .join(' · ') || t('common.noAddress')}
                      </p>
                    </div>
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

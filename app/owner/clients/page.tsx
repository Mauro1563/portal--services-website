import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, Mail, MessageCircle, Phone, Plus, Search, UserPlus, SearchX } from 'lucide-react';
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

export default async function ClientsPage({
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
    .from('clients')
    .select('id, name, email, phone, address, created_at')
    .order('created_at', { ascending: false });

  if (needle) {
    const pattern = `%${needle}%`;
    query = query.or(
      `name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},address.ilike.${pattern}`,
    );
  }

  const { data: clients } = await query;

  const { data: unreadRows } = await supabase
    .from('client_messages')
    .select('client_id')
    .eq('sender', 'client')
    .is('read_at', null);
  const unreadByClient = new Map<string, number>();
  for (const row of (unreadRows ?? []) as { client_id: string }[]) {
    unreadByClient.set(row.client_id, (unreadByClient.get(row.client_id) ?? 0) + 1);
  }

  return (
    <LightLayout activeTab="more" title="Clientes">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-1">Clientes</h1>
            <p className="mt-1 text-sm text-text-2">
              Tus clientes finales. Cada uno tiene un portal privado para ver y valorar sus limpiezas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CsvExportButton
              rows={clients ?? []}
              filename="clientes"
              headers={[
                { key: 'name', label: 'Nombre' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Teléfono' },
                { key: 'address', label: 'Dirección' },
                { key: 'created_at', label: 'Creado' },
              ]}
            />
            <Link
              href="/owner/clients/new"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-gradient px-4 text-sm font-semibold text-white shadow-brand-glow transition hover:brightness-110 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" /> {t('common.addClient')}
            </Link>
          </div>
        </div>

        {/* Search + count */}
        <form method="get" className="mt-5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Buscar por nombre, email, teléfono o dirección…"
              className="h-11 w-full rounded-xl border border-surface-2 bg-surface-0 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
          <span className="hidden shrink-0 text-xs text-text-3 sm:block">
            {clients?.length ?? 0} cliente(s)
          </span>
        </form>

        {!clients || clients.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-surface-2 bg-surface-0">
            {needle ? (
              <EmptyState
                icon={SearchX}
                tone="neutral"
                title="Sin resultados"
                description={`No encontramos clientes que coincidan con "${needle}". Probá con otro término.`}
              />
            ) : (
              <EmptyState
                icon={UserPlus}
                title="Aún no hay clientes"
                description="Añadí tu primer cliente para darle su propio portal donde ve y valora las limpiezas."
                actions={[
                  { label: t('common.addClient'), href: '/owner/clients/new' },
                ]}
              />
            )}
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
            <ul className="divide-y divide-surface-2">
              {clients.map((c) => {
                const unread = unreadByClient.get(c.id) ?? 0;
                return (
                  <li key={c.id}>
                    <Link
                      href={`/owner/clients/${c.id}`}
                      className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-surface-1"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                        {initials(c.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-semibold text-text-1">
                          {c.name}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-text-3">
                          {c.email ? (
                            <span className="inline-flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {c.email}
                            </span>
                          ) : null}
                          {c.phone ? (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {c.phone}
                            </span>
                          ) : null}
                          {c.address ? <span className="truncate">{c.address}</span> : null}
                          {!c.email && !c.phone && !c.address ? 'Sin datos de contacto' : null}
                        </p>
                      </div>
                      {unread > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          <MessageCircle className="h-3 w-3" />
                          {unread > 9 ? '9+' : unread}
                        </span>
                      ) : null}
                      <ChevronRight className="h-4 w-4 shrink-0 text-text-3" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </LightLayout>
  );
}

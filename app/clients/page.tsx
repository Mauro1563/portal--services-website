import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ZapliNavbar } from '@/components/nav/ZapliNavbar';
import { requireOwner } from '@/lib/auth';
import { ClientsTable, type ClientRow } from './ClientsTable';

export const metadata = {
  title: 'Clients · Zapli',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type LoadResult = {
  rows: ClientRow[];
  unavailable: boolean;
};

async function loadClients(): Promise<LoadResult> {
  try {
    const { supabase, user } = await requireOwner();

    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, name, email, owner_id, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error?.code === '42P01') {
      return { rows: [], unavailable: true };
    }
    if (error || !clients) {
      return { rows: [], unavailable: false };
    }

    const ids = clients.map((c) => c.id);

    // Fan-out two aggregate queries so we don't N+1. Both return one row per
    // client — properties via raw count, last task via descending scheduled_for.
    const [propsRes, lastTaskRes] = await Promise.all([
      supabase
        .from('properties')
        .select('id, client_id')
        .in('client_id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000']),
      supabase
        .from('tasks')
        .select('client_id, scheduled_for')
        .in('client_id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
        .order('scheduled_for', { ascending: false }),
    ]);

    const propCounts = new Map<string, number>();
    for (const p of (propsRes.data ?? []) as Array<{ client_id: string | null }>) {
      if (!p.client_id) continue;
      propCounts.set(p.client_id, (propCounts.get(p.client_id) ?? 0) + 1);
    }

    const lastByClient = new Map<string, string>();
    for (const t of (lastTaskRes.data ?? []) as Array<{
      client_id: string | null;
      scheduled_for: string | null;
    }>) {
      if (!t.client_id || !t.scheduled_for) continue;
      if (!lastByClient.has(t.client_id)) {
        lastByClient.set(t.client_id, t.scheduled_for);
      }
    }

    const rows: ClientRow[] = clients.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email ?? null,
      propertyCount: propCounts.get(c.id) ?? 0,
      lastTaskAt: lastByClient.get(c.id) ?? null,
    }));

    return { rows, unavailable: false };
  } catch {
    return { rows: [], unavailable: true };
  }
}

export default async function ClientsPage() {
  const { rows, unavailable } = await loadClients();

  return (
    <div className="min-h-screen bg-slate-50">
      <ZapliNavbar active="clients" signedIn />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Clients
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Todos tus clientes y sus propiedades.
            </p>
          </div>
          <Link
            href="/owner/clients/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nuevo cliente
          </Link>
        </div>

        {unavailable ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            Aplica la migration 0037 en Supabase para activar este módulo.
          </div>
        ) : (
          <div className="mt-6">
            <ClientsTable clients={rows} />
          </div>
        )}
      </main>
    </div>
  );
}

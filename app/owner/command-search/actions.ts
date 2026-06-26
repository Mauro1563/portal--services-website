'use server';

import { requireOwner } from '@/lib/auth';

export type SearchEntity = {
  id: string;
  name: string;
  subtitle?: string;
  href: string;
  kind: 'client' | 'property' | 'cleaner';
};

export type CommandSearchResult = {
  clients: SearchEntity[];
  properties: SearchEntity[];
  cleaners: SearchEntity[];
};

const EMPTY: CommandSearchResult = { clients: [], properties: [], cleaners: [] };

/**
 * One-shot fetch of the user's clients, properties and cleaners (top 50 each)
 * for the command palette's entity search. Owner-scoped via RLS. Called the
 * first time the palette opens; cached client-side so subsequent opens are
 * instant.
 */
export async function fetchCommandPaletteEntities(): Promise<CommandSearchResult> {
  const { supabase } = await requireOwner();

  const [clientsRes, propsRes, cleanersRes] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name, email')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('properties')
      .select('id, name, address')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('cleaners')
      .select('id, name, pin')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  if (clientsRes.error && propsRes.error && cleanersRes.error) return EMPTY;

  return {
    clients: (clientsRes.data ?? []).map((c) => ({
      id: c.id as string,
      name: c.name as string,
      subtitle: (c.email as string | null) ?? undefined,
      href: `/owner/clients/${c.id}`,
      kind: 'client' as const,
    })),
    properties: (propsRes.data ?? []).map((p) => ({
      id: p.id as string,
      name: p.name as string,
      subtitle: (p.address as string | null) ?? undefined,
      href: `/owner/properties/${p.id}`,
      kind: 'property' as const,
    })),
    cleaners: (cleanersRes.data ?? []).map((c) => ({
      id: c.id as string,
      name: c.name as string,
      subtitle: `PIN ${c.pin}`,
      href: `/owner/cleaners/${c.id}`,
      kind: 'cleaner' as const,
    })),
  };
}

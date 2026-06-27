import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import { getOwnerProfile, type OwnerProfile } from '@/lib/owner-profile';

export type ClientRow = {
  id: string;
  owner_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  access_token: string;
  referral_code: string | null;
  created_at: string;
};

export type ClientContext = {
  client: ClientRow;
  owner: OwnerProfile & { email: string | null };
};

/**
 * Fast first hop — just the clients row. Lets callers fire downstream
 * queries that depend on client.id (tasks, ratings, services) in
 * parallel with the slower owner/profile lookups via `getOwnerContext`.
 */
export async function getClientRowByToken(
  token: string,
): Promise<ClientRow | null> {
  if (!token || token.length < 10) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from('clients')
    .select(
      'id, owner_id, name, email, phone, address, notes, access_token, referral_code, created_at',
    )
    .eq('access_token', token)
    .maybeSingle();
  return (data as ClientRow | null) ?? null;
}

/** Profile + auth email for an owner — both fire in parallel. */
export async function getOwnerContext(
  ownerId: string,
): Promise<OwnerProfile & { email: string | null }> {
  const admin = createAdminClient();
  const [profile, { data: userData }] = await Promise.all([
    getOwnerProfile(ownerId),
    admin.auth.admin.getUserById(ownerId),
  ]);
  return { ...profile, email: userData?.user?.email ?? null };
}

/**
 * Look up a client by their magic-link token. Bypasses RLS via service role.
 * Returns null when the token doesn't match any client.
 *
 * Convenience wrapper around `getClientRowByToken` + `getOwnerContext` —
 * page.tsx prefers to split these calls so it can run owner-context in
 * parallel with the page's own data fetches; other callers (book/, refer/,
 * messages/, reviews/) use this one-shot form.
 */
export async function getClientByToken(
  token: string,
): Promise<ClientContext | null> {
  const client = await getClientRowByToken(token);
  if (!client) return null;
  const owner = await getOwnerContext(client.owner_id);
  return { client, owner };
}

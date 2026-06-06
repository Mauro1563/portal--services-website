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
 * Look up a client by their magic-link token. Bypasses RLS via service role.
 * Returns null when the token doesn't match any client.
 */
export async function getClientByToken(
  token: string,
): Promise<ClientContext | null> {
  if (!token || token.length < 10) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from('clients')
    .select(
      'id, owner_id, name, email, phone, address, notes, access_token, referral_code, created_at',
    )
    .eq('access_token', token)
    .maybeSingle();
  if (!data) return null;

  const client = data as ClientRow;
  const profile = await getOwnerProfile(client.owner_id);

  const { data: userData } = await admin.auth.admin.getUserById(client.owner_id);
  const ownerEmail = userData?.user?.email ?? null;

  return {
    client,
    owner: { ...profile, email: ownerEmail },
  };
}

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Require an authenticated owner. Use in server components and server actions.
 */
export async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');
  return { supabase, user };
}

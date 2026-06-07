import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Same ASCII guard used in lib/supabase/admin.ts — see comment there. */
function assertAscii(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} is not set. Add it in Vercel → Settings → Environment Variables and redeploy.`,
    );
  }
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code > 127) {
      throw new Error(
        `${name} contains a non-ASCII character (code ${code}) at position ${i}. ` +
          `Re-copy the value from Supabase Dashboard → Settings → API Keys ` +
          `using the Copy button (not select+drag) and paste it again in Vercel, ` +
          `then redeploy.`,
      );
    }
  }
  return value;
}

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    assertAscii('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
    assertAscii(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Setting cookies fails in Server Components — server actions
            // and route handlers handle this fine. Safe to ignore here.
          }
        },
      },
    },
  );
}

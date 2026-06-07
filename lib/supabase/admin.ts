import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Throws a clear error if a Supabase env var contains non-ASCII characters
 * (which would later blow up inside fetch with the cryptic
 * "Cannot convert argument to a ByteString" message). The usual cause is
 * a stray Unicode character (→, smart quote, NBSP, etc.) that got pasted
 * along with the key from a doc or web page.
 */
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
          `This usually happens when copy-pasting the key from a webpage. ` +
          `Re-copy the value directly from Supabase Dashboard → Settings → API and paste it again in Vercel.`,
      );
    }
  }
  return value;
}

/**
 * Service-role Supabase client. Bypasses RLS — only use on the server
 * inside auth-gated routes / server actions where you've already verified
 * the caller's identity.
 */
export function createAdminClient() {
  return createClient(
    assertAscii('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
    assertAscii(
      'SUPABASE_SERVICE_ROLE_KEY',
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}

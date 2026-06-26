import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET_ID = 'business-logos';

/**
 * Make sure the public Supabase Storage bucket for white-label business
 * logos exists. Uses the service-role admin client so it works regardless
 * of which user is signed in. Idempotent — safe to call on every upload.
 *
 * This is called instead of relying on the bucket having been created via
 * the SQL migration, so the white-label feature works out-of-the-box on
 * any Supabase project — no manual DDL required for the founder, no
 * migration step needed before first use.
 */
export async function ensureBusinessLogosBucket(): Promise<{ error?: string }> {
  const admin = createAdminClient();
  try {
    const { data: bucket } = await admin.storage.getBucket(BUCKET_ID);
    if (bucket) return {};
  } catch {
    // fall through to creation
  }
  const { error } = await admin.storage.createBucket(BUCKET_ID, {
    public: true,
    fileSizeLimit: 2 * 1024 * 1024,
    allowedMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml',
    ],
  });
  if (error && !/exists/i.test(error.message)) {
    return { error: error.message };
  }
  return {};
}


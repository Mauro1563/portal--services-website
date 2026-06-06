'use server';

import { requireMarketingAdmin } from '@/lib/marketing';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET = 'marketing-assets';

/**
 * Uploads a logo image to the public `marketing-assets` Supabase bucket and
 * returns the public URL. The BrandingEditor then writes this URL into
 * `marketing_content.section='branding'` via the normal save flow, so the
 * upload itself doesn't persist branding state — only the file.
 */
export async function uploadLogo(formData: FormData): Promise<string> {
  const admin = await requireMarketingAdmin();
  if (!admin) throw new Error('Unauthorized');

  const file = formData.get('file') as File | null;
  if (!file) throw new Error('No file');

  const ext = (file.name.split('.').pop() ?? 'png').toLowerCase();
  if (!['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) {
    throw new Error('Unsupported file type — use PNG, JPG, SVG or WebP');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('File too large — max 2 MB');
  }

  const path = `logo-${Date.now()}.${ext}`;
  const client = createAdminClient();
  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

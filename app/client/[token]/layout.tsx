import { BrandThemeProvider } from '@/components/brand/BrandThemeProvider';
import { getClientRowByToken } from '@/lib/client-auth';
import { getOwnerProfile } from '@/lib/owner-profile';

/**
 * Per-owner brand wrapper for the client portal. We look up the
 * owner's chosen brand colors here (one extra round-trip per portal
 * load, but cached server-side and tiny) and feed them into the
 * provider so the rest of the subtree can read --brand-primary /
 * --brand-secondary via the helper classes in globals.css.
 *
 * Falling back to null when the token is invalid is fine — the
 * matching `page.tsx` files already call `notFound()` and the
 * provider with no colors just keeps the Zapli defaults.
 */
export default async function ClientPortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const row = await getClientRowByToken(token);
  const profile = row ? await getOwnerProfile(row.owner_id) : null;

  return (
    <BrandThemeProvider
      primary={profile?.brand_primary_color}
      secondary={profile?.brand_secondary_color}
    >
      {children}
    </BrandThemeProvider>
  );
}

import { type NextRequest, NextResponse } from 'next/server';
import { getBranding } from '@/lib/branding';

export const revalidate = 60;

/**
 * Redirects to the currently configured marketing logo URL (set in
 * /hq/branding). Falls back to /portal-home-logo.png in /public when no
 * override is stored. Cached for 60s so uploads propagate quickly but the
 * DB isn't hit on every page render.
 */
export async function GET(request: NextRequest) {
  const { logoUrl } = await getBranding();
  const target = logoUrl.startsWith('http')
    ? logoUrl
    : new URL(logoUrl, request.nextUrl.origin).toString();

  return NextResponse.redirect(target, {
    status: 302,
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

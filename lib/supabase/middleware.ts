import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * ASCII guard for env vars — Vercel sometimes carries trailing
 * whitespace or smart-quotes when keys get copy-pasted from email.
 * `createServerClient` rejects with a misleading error in that case.
 * Returning null lets the caller fall back to a permissive pass-through
 * instead of 500ing the whole app.
 */
function asciiEnv(name: string): string | null {
  const raw = process.env[name];
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed.charCodeAt(i) > 127) return null;
  }
  return trimmed;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // Fast path: /operative is gated by the `cleaner_session` cookie (set by
  // the PIN login flow), NOT by Supabase JWT — so calling supabase.auth.
  // getUser() here is a wasted HTTP round-trip (150-400ms per request).
  // Check the cookie directly and return without ever constructing the
  // Supabase client. /operative/login and /operative/preview are
  // intentionally public (preview is the marketing-site demo CTA — if
  // we redirect it to /operative/login the demo card looks broken).
  if (pathname.startsWith('/operative')) {
    if (
      !pathname.startsWith('/operative/login') &&
      !pathname.startsWith('/operative/preview')
    ) {
      const cleanerSession = request.cookies.get('cleaner_session');
      if (!cleanerSession) {
        const url = request.nextUrl.clone();
        url.pathname = '/operative/login';
        return NextResponse.redirect(url);
      }
    }
    return supabaseResponse;
  }

  const supabaseUrl = asciiEnv('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseAnon = asciiEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  // If env is missing/garbled, don't 500. Let public pages render and
  // protected routes redirect normally — better degraded than dead.
  // (/operative is already short-circuited above so we don't need its
  // cookie check here.)
  if (!supabaseUrl || !supabaseAnon) {
    console.error(
      '[middleware] Supabase env missing or non-ASCII — skipping auth check',
      { hasUrl: !!supabaseUrl, hasAnon: !!supabaseAnon },
    );
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Wrap getUser() — a transient Supabase outage shouldn't be a 500.
  // Treat any auth error as "no user" and let the route handle it.
  let user: { user_metadata?: Record<string, unknown> } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error('[middleware] supabase.auth.getUser() failed', err);
  }

  // Public sub-routes under /hq (auth flow pages themselves) — never redirect
  const isHqAuthPage =
    pathname === '/hq/login' ||
    pathname === '/hq/forgot-password' ||
    pathname === '/hq/reset-password';

  // Preview / showcase routes are intentionally public so the team can
  // share screenshots of each portal without spinning up real auth.
  const isPreviewRoute =
    pathname === '/owner/preview' ||
    pathname.startsWith('/owner/preview/') ||
    pathname === '/operative/preview' ||
    pathname.startsWith('/operative/preview/') ||
    pathname === '/hq/preview' ||
    pathname === '/hq/preview-companies' ||
    pathname.startsWith('/hq/preview/') ||
    pathname.startsWith('/hq/preview-');

  // Protect /owner and /hq routes — require Supabase auth user
  if (
    !user &&
    !isHqAuthPage &&
    !isPreviewRoute &&
    (pathname.startsWith('/owner') || pathname.startsWith('/hq'))
  ) {
    const url = request.nextUrl.clone();
    // Marketing /hq uses its own login at /hq/login. Cleaning /owner uses /login.
    url.pathname = pathname.startsWith('/hq') ? '/hq/login' : '/login';
    if (!pathname.startsWith('/hq')) url.searchParams.set('role', 'owner');
    return NextResponse.redirect(url);
  }

  // Owners that signed up via /signup carry must_change_password=true in
  // their user_metadata. Bounce them to the change-password page on every
  // /owner request until they update the temporary one.
  if (
    user &&
    user.user_metadata?.must_change_password === true &&
    pathname.startsWith('/owner') &&
    pathname !== '/owner/change-password'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/owner/change-password';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // /operative is short-circuited at the top of this function (cleaner
  // PIN cookie, no Supabase call needed) so we don't re-check it here.

  return supabaseResponse;
}

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  );

  // IMPORTANT: call getUser() right after creating the client to refresh the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  // Protect /operative routes (except /operative/login) — require PIN session cookie
  if (
    pathname.startsWith('/operative') &&
    !pathname.startsWith('/operative/login')
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

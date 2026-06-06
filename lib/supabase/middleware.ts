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

  // Protect /owner and /hq routes — require Supabase auth user
  if (
    !user &&
    !isHqAuthPage &&
    (pathname.startsWith('/owner') || pathname.startsWith('/hq'))
  ) {
    const url = request.nextUrl.clone();
    // Marketing /hq uses its own login at /hq/login. Cleaning /owner uses /login.
    url.pathname = pathname.startsWith('/hq') ? '/hq/login' : '/login';
    if (!pathname.startsWith('/hq')) url.searchParams.set('role', 'owner');
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

import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { updateSession } from '@/lib/supabase/middleware';

const intl = createIntlMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
});

// Routes that require Supabase auth session handling (cleaning app).
const APP_PREFIXES = [
  '/operative',
  '/owner',
  '/client',
  '/login',
  '/signup',
  '/welcome',
  '/portales',
  '/forgot-password',
  '/reset-password',
  '/refer',
  '/c/',
  '/api',
  '/auth',
  '/hq',
];

const PORTAL_LOCALE_COOKIE = 'portal_locale';
const MARKETING_LOCALES = ['en', 'es', 'pt'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAppRoute = APP_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p),
  );

  if (isAppRoute) {
    // /operative uses a cookie-based PIN session (no Supabase auth) —
    // bouncing through supabase.auth.getUser() on every nav adds
    // 150-400ms for nothing. Just gate on the cookie and pass through.
    if (
      pathname.startsWith('/operative') &&
      !pathname.startsWith('/operative/login') &&
      !pathname.startsWith('/operative/preview')
    ) {
      const cleanerSession = request.cookies.get('cleaner_session');
      if (!cleanerSession) {
        const url = request.nextUrl.clone();
        url.pathname = '/operative/login';
        return NextResponse.redirect(url);
      }
      return NextResponse.next({ request });
    }

    // /client/* is gated by the token in the URL itself — there's no
    // auth-cookie check to do here, and the page component already
    // notFound()'s on an invalid token. Skip the Supabase round-trip.
    if (pathname.startsWith('/client/')) {
      return NextResponse.next({ request });
    }

    return await updateSession(request);
  }

  const response = intl(request);

  // Sync `portal_locale` cookie with the marketing URL prefix so that
  // app routes (/login, /signup, /welcome, /owner/*) render in the same
  // language the user picked on the public site.
  const urlLocale = pathname.split('/')[1];
  if (MARKETING_LOCALES.includes(urlLocale)) {
    const existing = request.cookies.get(PORTAL_LOCALE_COOKIE)?.value;
    if (existing !== urlLocale) {
      response.cookies.set(PORTAL_LOCALE_COOKIE, urlLocale, {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        httpOnly: false,
        path: '/',
      });
    }
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

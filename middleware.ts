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

  // /company is a locale-less marketing page that resolves the locale
  // internally from the `portal_locale` cookie. next-intl's "always
  // prefix" mode would otherwise redirect it to /{locale}/company and
  // 404 because no page exists at that path. Bypass intl for it.
  if (pathname === '/company' || pathname.startsWith('/company/')) {
    return NextResponse.next({ request });
  }

  // Sync `portal_locale` cookie with the marketing URL prefix so that
  // app routes (/login, /signup, /welcome, /owner/*) render in the same
  // language the user picked on the public site. We MUST mutate
  // `request.cookies` BEFORE calling `intl(request)` so server components
  // in the same render see the new cookie via `cookies()` — otherwise
  // sections that combine `getTranslations` (URL-driven) with
  // `getLocale()` (cookie-driven) render mixed languages on the first
  // navigation between locales.
  const urlLocale = pathname.split('/')[1];
  const existing = request.cookies.get(PORTAL_LOCALE_COOKIE)?.value;
  let cookieToSet: string | null = null;
  if (MARKETING_LOCALES.includes(urlLocale)) {
    if (existing !== urlLocale) {
      cookieToSet = urlLocale;
      request.cookies.set(PORTAL_LOCALE_COOKIE, urlLocale);
    }
  } else if (!existing) {
    // Cookie-less first visit with no locale segment: pin to the default
    // so downstream cookie-driven sections render in EN without waiting
    // for the next-intl redirect round-trip to /en/.
    cookieToSet = defaultLocale;
    request.cookies.set(PORTAL_LOCALE_COOKIE, defaultLocale);
  }

  const response = intl(request);

  // Persist the cookie back to the browser so future requests carry it.
  if (cookieToSet !== null) {
    response.cookies.set(PORTAL_LOCALE_COOKIE, cookieToSet, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
      path: '/',
    });
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

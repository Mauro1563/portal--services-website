import { type NextRequest } from 'next/server';
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

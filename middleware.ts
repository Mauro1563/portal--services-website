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
  '/forgot-password',
  '/reset-password',
  '/refer',
  '/c/',
  '/api',
  '/auth',
  '/hq',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAppRoute = APP_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p),
  );

  if (isAppRoute) {
    return await updateSession(request);
  }
  return intl(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

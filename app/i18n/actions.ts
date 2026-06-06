'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { SUPPORTED_LOCALES, LOCALE_COOKIE, type Locale } from '@/lib/i18n';

export async function setLocale(formData: FormData) {
  const locale = (formData.get('locale') as string)?.trim() as Locale;
  if (!SUPPORTED_LOCALES.includes(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false,
    path: '/',
  });
  revalidatePath('/', 'layout');
}

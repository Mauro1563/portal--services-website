import { redirect } from 'next/navigation';

// Marketing landing disabled — the localized root (/en, /es, /pt) is no
// longer a public-facing site, just a redirect to the unified login.
// Legal pages still live under /[locale]/privacy, /[locale]/terms,
// /[locale]/docs and remain accessible.
export default function LocaleHome() {
  redirect('/login');
}

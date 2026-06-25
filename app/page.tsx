import { redirect } from 'next/navigation';

// Marketing landing is disabled — anyone hitting the root domain goes
// straight to the unified login. Legal pages (/[locale]/privacy,
// /[locale]/terms, /[locale]/docs) remain accessible for compliance.
export default function RootPage() {
  redirect('/login');
}

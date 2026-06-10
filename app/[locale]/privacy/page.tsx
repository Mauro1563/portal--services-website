import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy — Portal Home',
  description: 'How Portal Home collects, uses and protects your data.',
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative overflow-hidden">
      <Nav />
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-mesh-1 opacity-90" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Legal
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last updated: 17 May 2026
          </p>
        </div>
      </section>

      <article className="relative py-12">
        <div className="mx-auto max-w-3xl space-y-8 px-6 text-slate-300">
          <Section title="1. Who we are">
            <p>
              Portal Home ("we", "us", "our") provides an operational
              platform for cleaning, facilities and property-management teams,
              accessible at <strong>portalservices.digital</strong> and{' '}
              <strong>hq.portalservices.digital</strong>. For privacy enquiries
              contact us at{' '}
              <a
                href="mailto:hola@portalservices.digital"
                className="text-cyan-300 hover:text-cyan-200"
              >
                hola@portalservices.digital
              </a>
              .
            </p>
          </Section>

          <Section title="2. Data we collect">
            <p>We collect only the data needed to provide the service:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>Account data</strong>: email, password hash, name (when
                provided), authentication tokens.
              </li>
              <li>
                <strong>Operational data</strong>: properties, cleaners, cleaning
                tasks, schedules and notes you create.
              </li>
              <li>
                <strong>Evidence data</strong>: GPS coordinates at check-in, photos
                uploaded by operatives, timestamps.
              </li>
              <li>
                <strong>Billing data</strong>: handled by Stripe (we never store
                full card numbers); we keep customer + subscription identifiers.
              </li>
              <li>
                <strong>Technical data</strong>: IP address, browser type and basic
                request logs for security and debugging.
              </li>
            </ul>
          </Section>

          <Section title="3. How we use it">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>To operate the platform and provide the features you sign up for.</li>
              <li>To send transactional emails (account confirmation, password reset).</li>
              <li>To process payments through Stripe.</li>
              <li>To detect abuse, debug issues and improve the product.</li>
            </ul>
            <p>
              We do <strong>not</strong> sell your data, and we do not use it for
              third-party advertising.
            </p>
          </Section>

          <Section title="4. Sub-processors">
            <p>We rely on the following processors to run the service:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>Vercel</strong> — hosting and content delivery (EU regions
                where possible).
              </li>
              <li>
                <strong>Supabase</strong> — database, authentication and file
                storage (EU-West region).
              </li>
              <li>
                <strong>Stripe</strong> — payment processing.
              </li>
            </ul>
          </Section>

          <Section title="5. Your rights (UK GDPR / EU GDPR)">
            <p>You have the right to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Access the personal data we hold about you.</li>
              <li>Rectify inaccurate data or complete incomplete data.</li>
              <li>Erase your account and associated data.</li>
              <li>
                Object to or restrict certain processing, where lawful basis is
                legitimate interest.
              </li>
              <li>Export your data in a portable format.</li>
            </ul>
            <p>
              Send any such request to{' '}
              <a
                href="mailto:hola@portalservices.digital"
                className="text-cyan-300 hover:text-cyan-200"
              >
                hola@portalservices.digital
              </a>{' '}
              and we'll respond within 30 days.
            </p>
          </Section>

          <Section title="6. Retention">
            <p>
              We keep operational data as long as your account is active. If you
              delete your account, we erase your data within 30 days, except where
              we are legally required to retain it (e.g., invoices for tax
              purposes).
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              Data in transit is encrypted with TLS. Data at rest is encrypted in
              our database and storage providers. Passwords are hashed with bcrypt.
              Access is restricted via per-tenant row-level security policies.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              We use a single session cookie to keep you signed in. We do not use
              third-party analytics or advertising cookies.
            </p>
          </Section>

          <Section title="9. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. Material changes
              will be communicated by email or via an in-app notice before they
              take effect.
            </p>
          </Section>

          <p className="pt-6 text-sm text-slate-500">
            See also our{' '}
            <Link
              href={`/${locale}/terms`}
              className="text-cyan-300 hover:text-cyan-200"
            >
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </article>

      <Footer />
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

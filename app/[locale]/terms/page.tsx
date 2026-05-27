import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service — Portal Services Digital',
  description:
    'The terms governing your use of Portal Services Digital and the operations platform.',
};

export default async function TermsPage({
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
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Last updated: 17 May 2026
          </p>
        </div>
      </section>

      <article className="relative py-12">
        <div className="mx-auto max-w-3xl space-y-8 px-6 text-slate-300">
          <Section title="1. Agreement">
            <p>
              By creating an account or using Portal Services Digital ("the
              Service"), you agree to these Terms. If you don't agree, don't use
              the Service.
            </p>
          </Section>

          <Section title="2. The service">
            <p>
              Portal Services Digital is an operations platform for cleaning,
              facilities and property-management teams. It includes a web
              dashboard for owners, a mobile-first app for operatives, GPS
              check-in, photo evidence, calendar synchronisation and billing.
            </p>
            <p>
              We may change, suspend or discontinue features at any time. Material
              changes that affect paid plans will be communicated in advance.
            </p>
          </Section>

          <Section title="3. Accounts">
            <p>
              You're responsible for keeping your account credentials secret and
              for any activity under your account. Notify us immediately of any
              unauthorised use.
            </p>
            <p>
              You must be at least 18 years old, or the age of majority in your
              jurisdiction, to use the Service.
            </p>
          </Section>

          <Section title="4. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Use the Service for any illegal activity.</li>
              <li>
                Upload content you don't have rights to, or content that is
                defamatory, abusive, or violates someone else's privacy.
              </li>
              <li>
                Attempt to reverse engineer, break or overload the Service, or
                circumvent rate limits or access controls.
              </li>
              <li>
                Use the Service to send unsolicited messages to people who haven't
                opted in.
              </li>
            </ul>
          </Section>

          <Section title="5. Pricing and billing">
            <p>
              Plans are billed monthly via Stripe in advance. Prices are quoted in
              GBP and may exclude VAT. You can cancel anytime; access continues
              until the end of the current billing period.
            </p>
            <p>
              A 14-day free trial is offered on new subscriptions. No card is
              charged during the trial; cancel before the trial ends to avoid the
              first invoice.
            </p>
          </Section>

          <Section title="6. Refunds">
            <p>
              We don't routinely refund partial months. If you believe you were
              charged in error or experienced a material service issue, contact us
              and we'll review case by case.
            </p>
          </Section>

          <Section title="7. Your data">
            <p>
              You own the data you put into the Service. We process it on your
              behalf as described in our{' '}
              <Link
                href={`/${locale}/privacy`}
                className="text-cyan-300 hover:text-cyan-200"
              >
                Privacy Policy
              </Link>
              . You can export or delete it at any time.
            </p>
          </Section>

          <Section title="8. Service availability">
            <p>
              We aim for high availability but do not guarantee uninterrupted
              service. Scheduled maintenance, third-party outages (Vercel,
              Supabase, Stripe) and force majeure events may cause downtime.
            </p>
            <p>
              For Enterprise plans, custom SLA terms apply if signed in a separate
              agreement.
            </p>
          </Section>

          <Section title="9. Limitation of liability">
            <p>
              To the maximum extent permitted by law, our total liability arising
              from your use of the Service is limited to the fees you paid in the
              12 months preceding the claim. We are not liable for indirect,
              incidental or consequential damages.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              You can stop using the Service at any time. We may suspend or
              terminate accounts that breach these Terms, fail to pay, or pose
              security risks, with reasonable notice when feasible.
            </p>
          </Section>

          <Section title="11. Governing law">
            <p>
              These Terms are governed by the laws of England and Wales. Any
              dispute will be resolved in the courts of England and Wales, unless
              a separate Enterprise agreement says otherwise.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              Questions about these Terms? Email{' '}
              <a
                href="mailto:hola@portalservices.digital"
                className="text-cyan-300 hover:text-cyan-200"
              >
                hola@portalservices.digital
              </a>
              .
            </p>
          </Section>

          <p className="pt-6 text-sm text-slate-500">
            See also our{' '}
            <Link
              href={`/${locale}/privacy`}
              className="text-cyan-300 hover:text-cyan-200"
            >
              Privacy Policy
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

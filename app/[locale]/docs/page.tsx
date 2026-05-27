import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowRight,
  Building2,
  Camera,
  Calendar,
  CheckCircle2,
  KeyRound,
  MapPin,
  Users,
} from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Quick start guide — Portal Services Digital',
  description:
    'Set up your first property, invite a cleaner and schedule a cleaning in under 15 minutes.',
};

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative overflow-hidden">
      <Nav />

      <section className="relative pt-32 pb-12">
        <div className="absolute inset-0 bg-mesh-1 opacity-90" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-4xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Quick start
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            From sign-up to first cleaning in 15 minutes
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Everything you need to onboard your Airbnb or facilities team. No app
            store, no IT setup. Open the operations portal in any modern browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://hq.portalservices.digital/login"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-5 text-sm font-medium text-white shadow-lg hover:brightness-110"
            >
              Open the portal <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href={`/${locale}#pricing`}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white hover:bg-white/[0.08]"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <article className="relative py-12">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                On this page
              </p>
              <a
                href="#owners"
                className="block rounded-lg px-3 py-1.5 text-slate-300 hover:bg-white/[0.04] hover:text-white"
              >
                For property owners
              </a>
              <a
                href="#cleaners"
                className="block rounded-lg px-3 py-1.5 text-slate-300 hover:bg-white/[0.04] hover:text-white"
              >
                For cleaners
              </a>
              <a
                href="#ical"
                className="block rounded-lg px-3 py-1.5 text-slate-300 hover:bg-white/[0.04] hover:text-white"
              >
                Airbnb iCal sync
              </a>
              <a
                href="#billing"
                className="block rounded-lg px-3 py-1.5 text-slate-300 hover:bg-white/[0.04] hover:text-white"
              >
                Billing &amp; plans
              </a>
              <a
                href="#troubleshooting"
                className="block rounded-lg px-3 py-1.5 text-slate-300 hover:bg-white/[0.04] hover:text-white"
              >
                Troubleshooting
              </a>
              <a
                href="#contact"
                className="block rounded-lg px-3 py-1.5 text-slate-300 hover:bg-white/[0.04] hover:text-white"
              >
                Get help
              </a>
            </nav>
          </aside>

          <div className="space-y-12 text-slate-300">
            <Section
              id="owners"
              icon={<Building2 className="h-5 w-5 text-cyan-300" />}
              title="For property owners"
              subtitle="Set up your portfolio, your team, and your first cleaning."
            >
              <Step number={1} title="Create your account">
                Open{' '}
                <Code>hq.portalservices.digital/login</Code> and choose{' '}
                <em>"Manages properties"</em>. Use any email + a password of 8+ characters.
                You'll be taken straight into a guided 3-step setup.
              </Step>

              <Step number={2} title="Add your first property">
                Give it a short, recognisable name (e.g. <em>Flat 3 — Camden</em>). The
                address is optional but useful for cleaners. If you host on Airbnb or
                Booking.com, paste the property's <strong>iCal URL</strong> here —{' '}
                <a href="#ical" className="text-cyan-300 hover:text-cyan-200">
                  see iCal sync ↓
                </a>
                .
              </Step>

              <Step number={3} title="Add a cleaner and get their PIN">
                Add their name (and phone if you want to send the PIN via WhatsApp).
                The system generates a unique <strong>6-digit PIN</strong> automatically
                — this is how they'll log into the operative app. Share it via your
                preferred channel.
              </Step>

              <Step number={4} title="Schedule a cleaning">
                Tap <em>Schedule cleaning</em>. Pick a property, optionally assign a
                cleaner now (or leave unassigned and assign later), pick a date, and
                add any notes (codes, instructions, special requests). Done.
              </Step>

              <p className="rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.04] p-4 text-sm">
                💡 The wizard also gives you a <em>Skip</em> link on every step — if
                you already know the platform, you can go straight to the dashboard.
              </p>
            </Section>

            <Section
              id="cleaners"
              icon={<Users className="h-5 w-5 text-cyan-300" />}
              title="For cleaners"
              subtitle="No app to install. Three taps and you're working."
            >
              <Step number={1} title="Open the portal">
                On any phone browser, go to{' '}
                <Code>hq.portalservices.digital</Code>. Choose{' '}
                <em>"I'm a cleaner"</em>. We recommend tapping the browser's <em>"Add
                to home screen"</em> option so it behaves like a native app.
              </Step>

              <Step number={2} title="Type your PIN" icon={<KeyRound className="h-4 w-4 text-cyan-300" />}>
                Enter the 6-digit PIN your manager shared with you. That's your
                session — no email, no passwords. The PIN can be regenerated by your
                manager if you ever lose it.
              </Step>

              <Step number={3} title="Check in on site" icon={<MapPin className="h-4 w-4 text-cyan-300" />}>
                When you arrive at the property, open the task and tap{' '}
                <em>Check in</em>. The phone will ask for location permission — accept
                it. The platform records your arrival time and GPS coordinates so
                your manager can verify you were on site.
              </Step>

              <Step number={4} title="Upload a photo" icon={<Camera className="h-4 w-4 text-cyan-300" />}>
                When you're done, tap <em>Upload photo</em>. Take a picture of the
                finished work directly from the browser (it opens the camera). That
                marks the task as <em>completed</em> and the owner gets notified
                immediately.
              </Step>

              <Step number={5} title="Or just mark completed" icon={<CheckCircle2 className="h-4 w-4 text-cyan-300" />}>
                If no photo is required, tap <em>Mark completed</em>. The task closes
                and the owner is notified.
              </Step>
            </Section>

            <Section
              id="ical"
              icon={<Calendar className="h-5 w-5 text-cyan-300" />}
              title="Airbnb / Booking.com iCal sync"
              subtitle="Auto-create cleaning tasks every time a guest checks out."
            >
              <p>
                On Airbnb: go to <em>Calendar → Availability settings → Sync with
                another calendar</em> and copy the long <Code>.ics</Code> URL it gives
                you. On Booking.com: <em>Extranet → Calendar → Sync calendars</em>.
                Paste it into the property in your portal.
              </p>
              <p>
                Once connected, a background job runs daily and creates one{' '}
                <em>unassigned</em> cleaning task for every checkout on your
                calendar. Tasks already in the system aren't duplicated — the
                sync is idempotent. You can also tap <em>Sync now</em> on the
                property page if you've just made a booking change.
              </p>
            </Section>

            <Section
              id="billing"
              title="Billing &amp; plans"
              subtitle="Pay monthly, in GBP, cancel anytime."
            >
              <ul className="ml-5 list-disc space-y-2 text-sm">
                <li>
                  <strong className="text-white">Airbnb</strong> — £49 / month. Up to
                  10 properties. Photo evidence, GPS check-in, Airbnb iCal sync.
                </li>
                <li>
                  <strong className="text-white">Mid-market</strong> — £150–500 /
                  month. Unlimited sites, day/night shifts, supervisor inbox,
                  timesheets, GPS-verified clock in/out, priority support.
                </li>
                <li>
                  <strong className="text-white">Enterprise</strong> — £500+ / month.
                  White-label, custom community portal, ERP / payroll integrations,
                  SSO, dedicated SLA + account manager.
                </li>
              </ul>
              <p className="text-sm">
                Every plan starts with a <strong>14-day free trial</strong> — no card
                charged until the trial ends. You can change tier or cancel anytime
                from the Stripe billing portal, accessible inside the app at{' '}
                <Code>/owner/billing</Code>.
              </p>
            </Section>

            <Section
              id="troubleshooting"
              title="Troubleshooting"
              subtitle="The most common questions we get during onboarding."
            >
              <Faq q="My cleaner says their PIN doesn't work.">
                Open the cleaner's profile in your dashboard and use{' '}
                <em>Regenerate PIN</em>. PINs are unique per cleaner; if you copy and
                paste, make sure no whitespace got into the field.
              </Faq>
              <Faq q="The iCal sync isn't creating tasks.">
                Make sure the URL you pasted ends in <Code>.ics</Code> and that the
                Airbnb / Booking calendar actually has future checkouts. The cron
                runs daily at 06:00 UTC, but you can hit <em>Sync now</em> on the
                property page to trigger it immediately.
              </Faq>
              <Faq q="The cleaner's phone can't check in (GPS).">
                On iOS Safari: <em>Settings → Safari → Location → Allow</em>. On
                Android Chrome: tap the lock icon in the address bar → Permissions →
                Location → Allow. Then reload the task page.
              </Faq>
              <Faq q="Photos don't upload.">
                Most likely a poor signal at the property. The browser stores the
                attempt — once back on Wi-Fi or 4G, opening the task and re-tapping
                <em>Upload</em> will retry. We're working on offline-first capture
                for the next release.
              </Faq>
              <Faq q="I lost access to my account.">
                Use the <em>Forgot password</em> link on the login page. We send a
                reset link to the email on file. If you also lost access to that
                inbox, contact us — we can verify ownership via your billing
                account.
              </Faq>
            </Section>

            <Section
              id="contact"
              title="Get help"
              subtitle="We answer within 24h on business days."
            >
              <p>
                Email{' '}
                <a
                  href="mailto:hola@portalservices.digital"
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  hola@portalservices.digital
                </a>{' '}
                with your account email and a short description of what's
                happening. Screenshots help.
              </p>
              <p className="text-sm text-slate-500">
                Mid-market and Enterprise plans include onboarding calls. Email us
                to schedule.
              </p>
            </Section>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}

function Section({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      </div>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Step({
  number,
  title,
  icon,
  children,
}: {
  number: number;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/[0.08] text-[11px] font-semibold text-cyan-200">
          {number}
        </span>
        <h3 className="font-display text-base font-semibold text-white">{title}</h3>
        {icon}
      </div>
      <div className="mt-2 text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] open:border-cyan-400/20 open:bg-cyan-500/[0.04]">
      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-white">
        <span className="mr-2 text-cyan-300">↳</span>
        {q}
      </summary>
      <div className="px-5 pb-5 text-sm leading-relaxed text-slate-300">{children}</div>
    </details>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12.5px] text-cyan-200">
      {children}
    </code>
  );
}

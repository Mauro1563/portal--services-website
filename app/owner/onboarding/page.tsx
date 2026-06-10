import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Home,
  SprayCan,
  Shuffle,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { requireOwner } from '@/lib/auth';
import { cleanerLoginUrl } from '@/lib/cleaner-link';
import { getT } from '@/lib/i18n';
import { getOwnerProfile } from '@/lib/owner-profile';
import {
  onboardingAddProperty,
  onboardingAddCleaner,
  setBusinessType,
} from './actions';

type SearchParams = Promise<{ step?: string; error?: string; pin?: string }>;

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase, user } = await requireOwner();
  const { step: rawStep, error, pin } = await searchParams;
  const t = await getT();

  const profile = await getOwnerProfile(user.id);
  const hasType = !!profile.business_name || profile.business_type !== 'hybrid';

  const [{ count: propCount }, { count: cleanerCount }] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('cleaners').select('*', { count: 'exact', head: true }),
  ]);

  // Step routing:
  //   - No URL ?step= AND no business type chosen yet → show the type picker (0)
  //   - Explicit ?step=N → respect it (so "Choose this" never bounces back even
  //     when the table couldn't store the choice due to missing migration)
  //   - Anything else → step 1 (property creation)
  let step: number;
  if (rawStep === undefined) {
    step = hasType ? 1 : 0;
  } else {
    const parsed = Number(rawStep);
    step = Number.isNaN(parsed) || parsed < 0 || parsed > 3 ? 1 : parsed;
  }

  if ((propCount ?? 0) > 0 && (cleanerCount ?? 0) > 0 && step !== 3) {
    redirect('/owner');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-1">
      <header className="border-b border-surface-2 bg-surface-0/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo size="sm" />
          <Link href="/owner" className="text-xs text-text-2 hover:text-text-1">
            {t('onboarding.skipForNow')} →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {step > 0 ? (
          <Stepper
            step={step}
            labels={[
              t('onboarding.stepProperty'),
              t('onboarding.stepCleaner'),
              t('onboarding.stepDone'),
            ]}
          />
        ) : null}

        {error ? (
          <div className="mt-6 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {step === 0 ? (
          <StepBusinessType email={user.email ?? ''} t={t} />
        ) : step === 1 ? (
          <StepProperty email={user.email ?? ''} t={t} />
        ) : step === 2 ? (
          <StepCleaner t={t} />
        ) : (
          <StepDone pin={pin ?? ''} t={t} />
        )}
      </div>
    </main>
  );
}

function StepBusinessType({
  email,
  t,
}: {
  email: string;
  t: (k: string) => string;
}) {
  const firstName = email ? email.split('@')[0].split(/[.+]/)[0] : '';
  return (
    <section>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          {t('onboarding.welcome')}
          {firstName ? `, ${firstName}` : ''}
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('onboarding.btTitle')}
        </h1>
        <p className="mt-2 text-sm text-text-2">
          {t('onboarding.btSubtitle')}
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <BusinessTypeCard
          type="airbnb"
          icon={<Home className="h-6 w-6 text-brand-600" />}
          title={t('onboarding.btAirbnbTitle')}
          description={t('onboarding.btAirbnbDesc')}
          bullets={[
            t('onboarding.btAirbnbB1'),
            t('onboarding.btAirbnbB2'),
            t('onboarding.btAirbnbB3'),
          ]}
          chooseLabel={t('onboarding.btChoose')}
        />
        <BusinessTypeCard
          type="house_cleaning"
          icon={<SprayCan className="h-6 w-6 text-brand-600" />}
          title={t('onboarding.btCleaningTitle')}
          description={t('onboarding.btCleaningDesc')}
          bullets={[
            t('onboarding.btCleaningB1'),
            t('onboarding.btCleaningB2'),
            t('onboarding.btCleaningB3'),
          ]}
          chooseLabel={t('onboarding.btChoose')}
        />
      </div>

      <BusinessTypeCard
        type="hybrid"
        icon={<Shuffle className="h-6 w-6 text-brand-600" />}
        title={t('onboarding.btBothTitle')}
        description={t('onboarding.btBothDesc')}
        bullets={[t('onboarding.btBothB1')]}
        chooseLabel={t('onboarding.btChoose')}
        fullWidth
      />
    </section>
  );
}

function BusinessTypeCard({
  type,
  icon,
  title,
  description,
  bullets,
  chooseLabel,
  fullWidth,
}: {
  type: 'airbnb' | 'house_cleaning' | 'hybrid';
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  chooseLabel: string;
  fullWidth?: boolean;
}) {
  return (
    <form action={setBusinessType} className={fullWidth ? 'mt-3' : ''}>
      <input type="hidden" name="business_type" value={type} />
      <button
        type="submit"
        className="group flex h-full w-full flex-col rounded-3xl border border-surface-2 bg-surface-0 p-6 text-left transition hover:border-brand-600/40 hover:bg-brand-600/[0.04] active:scale-[0.99]"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/10 ring-1 ring-inset ring-brand-600/20">
          {icon}
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold text-text-1">{title}</h3>
        <p className="mt-1 text-xs text-text-2">{description}</p>
        <ul className="mt-3 space-y-1.5 text-[11px] text-text-1">
          {bullets.map((b) => (
            <li key={b} className="inline-flex items-start gap-1.5">
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-brand-600" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition group-hover:gap-2">
          {chooseLabel} <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </form>
  );
}

function Stepper({ step, labels }: { step: number; labels: string[] }) {
  const items = labels.map((label, i) => ({ n: i + 1, label }));
  return (
    <ol className="mb-10 flex items-center justify-center gap-2 text-xs font-medium text-text-2">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <li key={it.n} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${
                done
                  ? 'border-brand-600/40 bg-brand-600/10 text-brand-600'
                  : active
                  ? 'border-brand-600 bg-brand-600/10 text-brand-700'
                  : 'border-surface-2 bg-surface-0 text-text-3'
              }`}
            >
              {done ? '✓' : it.n}
            </span>
            <span className={active ? 'text-text-1' : done ? 'text-text-1' : ''}>
              {it.label}
            </span>
            {i < items.length - 1 ? (
              <span className="mx-2 h-px w-8 bg-white/10" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

type T = (key: string) => string;

function StepProperty({ email, t }: { email: string; t: T }) {
  return (
    <section className="rounded-3xl border border-surface-2 bg-surface-0 p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10 ring-1 ring-inset ring-brand-600/20">
          <Building2 className="h-5 w-5 text-brand-600" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {t('onboarding.welcome')}{email ? `, ${email.split('@')[0]}` : ''}
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {t('onboarding.step1Title')}
          </h1>
        </div>
      </div>
      <p className="mt-3 text-sm text-text-2">{t('onboarding.step1Hint')}</p>

      <form action={onboardingAddProperty} className="mt-6 space-y-4">
        <Field
          label={t('onboarding.propertyName')}
          name="name"
          required
          placeholder={t('onboarding.propertyNamePh')}
        />
        <Field
          label={t('onboarding.address')}
          name="address"
          placeholder={t('onboarding.addressPh')}
        />
        <Field
          label={t('onboarding.icalUrl')}
          name="airbnb_ical_url"
          placeholder={t('onboarding.icalUrlPh')}
          hint={t('onboarding.icalHint')}
        />
        <div className="flex items-center justify-between pt-2">
          <Link href="/owner" className="text-xs text-text-2 hover:text-text-1">
            {t('common.skip')}
          </Link>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-5 text-sm font-medium text-text-1 shadow-lg hover:brightness-110"
          >
            {t('common.continue')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}

function StepCleaner({ t }: { t: T }) {
  return (
    <section className="rounded-3xl border border-surface-2 bg-surface-0 p-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10 ring-1 ring-inset ring-brand-600/20">
          <Users className="h-5 w-5 text-brand-600" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {t('onboarding.step2Of3')}
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {t('onboarding.step2Title')}
          </h1>
        </div>
      </div>
      <p className="mt-3 text-sm text-text-2">{t('onboarding.step2Hint')}</p>

      <form action={onboardingAddCleaner} className="mt-6 space-y-4">
        <Field
          label={t('onboarding.cleanerName')}
          name="name"
          required
          placeholder={t('onboarding.cleanerNamePh')}
        />
        <Field
          label={t('onboarding.phone')}
          name="phone"
          placeholder={t('onboarding.phonePh')}
          hint={t('onboarding.phoneHint')}
        />
        <div className="flex items-center justify-between pt-2">
          <Link href="/owner" className="text-xs text-text-2 hover:text-text-1">
            {t('common.skip')}
          </Link>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-5 text-sm font-medium text-text-1 shadow-lg hover:brightness-110"
          >
            {t('common.continue')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}

function StepDone({ pin, t }: { pin: string; t: T }) {
  return (
    <section className="rounded-3xl border border-surface-2 bg-surface-0 p-8 text-center">
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-inset ring-emerald-400/20">
        <CheckCircle2 className="h-7 w-7 text-emerald-700" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
        {t('onboarding.doneTitle')}
      </h1>
      <p className="mt-2 text-sm text-text-2">{t('onboarding.doneHint')}</p>

      {pin ? (
        <>
          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.06] px-6 py-4">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <span className="font-display text-3xl font-bold tracking-[0.3em] text-brand-700">
              {pin}
            </span>
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hi! Your Portal Services Digital login PIN is:\n\n${pin}\n\nTap to sign in (PIN pre-filled): ${cleanerLoginUrl(pin)}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-100 px-4 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-emerald-300 hover:bg-emerald-200"
            >
              {t('onboarding.shareWhatsapp')}
            </a>
          </div>
        </>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/owner/tasks/new"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-5 text-sm font-medium text-text-1 shadow-lg hover:brightness-110"
        >
          {t('onboarding.scheduleFirstCleaning')} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/owner"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-2 bg-surface-1 px-5 text-sm font-medium text-text-1 hover:bg-surface-2"
        >
          {t('onboarding.goToDashboard')}
        </Link>
      </div>

      <p className="mt-6 text-xs text-text-3">{t('onboarding.pinHint')}</p>
    </section>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-1">{label}</span>
      <input
        type="text"
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-4 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600/50 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      />
      {hint ? <span className="mt-1 block text-[11px] text-text-3">{hint}</span> : null}
    </label>
  );
}

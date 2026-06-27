import { SignupForm, type SignupDict } from './SignupForm';
import { getLocale, getT, type Locale } from '@/lib/i18n';

// Locale-keyed metadata title — the rest of the signup copy already comes from
// messages/*.json via getT() and the SignupDict prop, so this just covers the
// browser tab.
const META_TITLE: Record<Locale, string> = {
  en: 'Create account · Portal Home Digital',
  es: 'Crear cuenta · Portal Home Digital',
  pt: 'Criar conta · Portal Home Digital',
};

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: META_TITLE[locale],
    robots: { index: false, follow: false },
  };
}

export default async function SignupPage() {
  const t = await getT();
  const dict: SignupDict = {
    title: t('signup.title'),
    subtitle: t('signup.subtitle'),
    fullName: t('signup.fullName'),
    fullNamePh: t('signup.fullNamePh'),
    workEmail: t('signup.workEmail'),
    workEmailPh: t('signup.workEmailPh'),
    businessName: t('signup.businessName'),
    businessNamePh: t('signup.businessNamePh'),
    optional: t('signup.optional'),
    optionalToggle: t('signup.optionalToggle'),
    show: t('signup.show'),
    hide: t('signup.hide'),
    phone: t('signup.phone'),
    phonePh: t('signup.phonePh'),
    country: t('signup.country'),
    countryPh: t('signup.countryPh'),
    teamSize: t('signup.teamSize'),
    teamSizePh: t('signup.teamSizePh'),
    team1: t('signup.team1'),
    team2: t('signup.team2'),
    team3: t('signup.team3'),
    submit: t('signup.submit'),
    submitting: t('signup.submitting'),
    haveAccount: t('signup.haveAccount'),
    signIn: t('signup.signIn'),
    backHome: t('signup.backHome'),
    pendingTitle: t('signup.pendingTitle'),
    pendingSubtitle: t('signup.pendingSubtitle'),
    pendingStep1: t('signup.pendingStep1'),
    pendingStep2: t('signup.pendingStep2'),
    pendingStep3: t('signup.pendingStep3'),
    pendingNote: t('signup.pendingNote'),
    pendingBack: t('signup.pendingBack'),
  };
  return <SignupForm dict={dict} />;
}

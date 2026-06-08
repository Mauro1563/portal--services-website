import { SignupForm, type SignupDict } from './SignupForm';
import { getT } from '@/lib/i18n';

export const metadata = {
  title: 'Crear cuenta · Portal Home Digital',
  robots: { index: false, follow: false },
};

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
    successTitle: t('signup.successTitle'),
    successSubtitle: t('signup.successSubtitle'),
    emailLabel: t('signup.emailLabel'),
    tempPassword: t('signup.tempPassword'),
    tempPasswordNote: t('signup.tempPasswordNote'),
    enterPortal: t('signup.enterPortal'),
    copy: t('signup.copy'),
    copied: t('signup.copied'),
  };
  return <SignupForm dict={dict} />;
}

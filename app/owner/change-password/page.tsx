import { ChangePasswordForm } from './ChangePasswordForm';

export const metadata = {
  title: 'Cambia tu contraseña · Zapli Digital',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function ChangePasswordPage() {
  return <ChangePasswordForm />;
}

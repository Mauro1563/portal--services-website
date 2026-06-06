import { redirect } from 'next/navigation';

export default function OperativeLoginRedirect() {
  redirect('/login');
}

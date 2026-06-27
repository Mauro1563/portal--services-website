/**
 * Public preview: Owner → Task detail. Mocked data, id-based lookup.
 * Server wrapper awaits the params and forwards the id to the client view.
 */
import { TaskDetailClient } from './TaskDetailClient';

export const metadata = {
  title: 'Demo · Owner',
  robots: { index: false, follow: false },
};

export default async function OwnerTaskDetailPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TaskDetailClient id={id} />;
}

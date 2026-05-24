import { redirect } from 'next/navigation';
import { requireMarketingAdmin, getCollection } from '@/lib/marketing';
import { HQShell } from '@/components/hq/Shell';
import { ContractsEditor } from '@/components/hq/ContractsEditor';

export const dynamic = 'force-dynamic';

type Contract = {
  id: string;
  client: string;
  plan: string;
  value: string;
  startDate: string;
  term: string;
  extra: string;
  body: string;
  createdAt: string;
};

type ClientRow = { id: string; name: string; portal?: string };

export default async function HQContracts() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const [contracts, clients] = await Promise.all([
    getCollection<Contract>('contracts'),
    getCollection<ClientRow>('clients'),
  ]);

  const clientLite = clients.map((c) => ({ id: c.id, name: c.name, plan: c.portal }));

  return (
    <HQShell
      active="contracts"
      email={admin.email}
      title="Contratos"
      subtitle="Genera contratos a partir de tus clientes y expórtalos en PDF."
    >
      <ContractsEditor initial={contracts} clients={clientLite} />
    </HQShell>
  );
}

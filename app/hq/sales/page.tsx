import { redirect } from 'next/navigation';
import { requireMarketingAdmin, getCollection } from '@/lib/marketing';
import { HQShell } from '@/components/hq/Shell';
import { CollectionManager, type Field, type Item } from '@/components/hq/CollectionManager';

export const dynamic = 'force-dynamic';

const FIELDS: Field[] = [
  { key: 'client', label: 'Cliente / oportunidad' },
  { key: 'value', label: 'Valor (£/mes)', type: 'number' },
  { key: 'plan', label: 'Plan' },
  {
    key: 'stage',
    label: 'Etapa',
    type: 'select',
    options: [
      { value: 'nuevo', label: 'Nuevo' },
      { value: 'contactado', label: 'Contactado' },
      { value: 'demo', label: 'Demo agendada' },
      { value: 'propuesta', label: 'Propuesta' },
      { value: 'ganado', label: 'Ganado' },
      { value: 'perdido', label: 'Perdido' },
    ],
  },
  { key: 'owner', label: 'Responsable' },
  { key: 'next', label: 'Próximo paso', type: 'date' },
  { key: 'notes', label: 'Notas', type: 'textarea' },
];

const COLUMNS = [
  { key: 'client', label: 'Oportunidad' },
  { key: 'plan', label: 'Plan' },
  { key: 'value', label: '£/mes' },
  { key: 'owner', label: 'Responsable' },
];

export default async function HQSales() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');
  const initial = await getCollection<Item>('sales');

  return (
    <HQShell
      active="sales"
      email={admin.email}
      title="Ventas"
      subtitle="Pipeline de oportunidades y seguimiento comercial."
    >
      <CollectionManager
        section="sales"
        initial={initial}
        fields={FIELDS}
        columns={COLUMNS}
        addLabel="Añadir oportunidad"
        emptyLabel="Pipeline vacío. Añade la primera oportunidad."
        renderBadge={(it) => {
          const map: Record<string, string> = {
            nuevo: 'slate', contactado: 'brand', demo: 'amber',
            propuesta: 'amber', ganado: 'emerald', perdido: 'rose',
          };
          return it.stage ? { text: it.stage, tone: map[it.stage] ?? 'slate' } : null;
        }}
      />
    </HQShell>
  );
}

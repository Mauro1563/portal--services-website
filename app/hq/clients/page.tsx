import { redirect } from 'next/navigation';
import { requireMarketingAdmin, getCollection } from '@/lib/marketing';
import { HQShell } from '@/components/hq/Shell';
import { CollectionManager, type Field, type Item } from '@/components/hq/CollectionManager';

export const dynamic = 'force-dynamic';

const FIELDS: Field[] = [
  { key: 'name', label: 'Nombre / empresa' },
  { key: 'contact', label: 'Persona de contacto' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Teléfono', type: 'tel' },
  { key: 'city', label: 'Ciudad' },
  {
    key: 'portal',
    label: 'Portal asignado',
    type: 'select',
    options: [
      'Supervisor', 'Manager', 'Operativo', 'Director', 'HQ', 'Airbnb', 'Hogar',
    ].map((v) => ({ value: v, label: v })),
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'prueba', label: 'En prueba' },
      { value: 'pausado', label: 'Pausado' },
      { value: 'baja', label: 'Baja' },
    ],
  },
  { key: 'notes', label: 'Notas', type: 'textarea' },
];

const COLUMNS = [
  { key: 'name', label: 'Cliente' },
  { key: 'city', label: 'Ciudad' },
  { key: 'portal', label: 'Portal' },
  { key: 'email', label: 'Email' },
];

export default async function HQClients() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');
  const initial = await getCollection<Item>('clients');

  return (
    <HQShell
      active="clients"
      email={admin.email}
      title="Clientes"
      subtitle="Directorio de clientes con su portal asignado."
    >
      <CollectionManager
        section="clients"
        initial={initial}
        fields={FIELDS}
        columns={COLUMNS}
        addLabel="Añadir cliente"
        emptyLabel="Aún no hay clientes. Añade el primero."
        renderBadge={(it) => {
          const map: Record<string, string> = { activo: 'emerald', prueba: 'amber', pausado: 'slate', baja: 'rose' };
          return it.status ? { text: it.status, tone: map[it.status] ?? 'slate' } : null;
        }}
      />
    </HQShell>
  );
}

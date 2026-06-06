import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { updateClient } from '../../actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditClientPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, email, phone, address, notes')
    .eq('id', id)
    .maybeSingle();
  if (!client) notFound();

  return (
    <LightLayout
      activeTab="more"
      title="Edit client"
      showBack
      backHref={`/owner/clients/${id}`}
    >
      {error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <form action={updateClient} className="space-y-4">
        <input type="hidden" name="client_id" value={client.id} />
        <Field label="Name" name="name" defaultValue={client.name} required />
        <Field label="Email" name="email" type="email" defaultValue={client.email ?? ''} />
        <Field label="Phone" name="phone" type="tel" defaultValue={client.phone ?? ''} />
        <Field label="Address" name="address" defaultValue={client.address ?? ''} />
        <Field label="Notes" name="notes" textarea defaultValue={client.notes ?? ''} />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow"
          >
            Save changes
          </button>
          <Link
            href={`/owner/clients/${id}`}
            className="flex h-11 items-center justify-center rounded-2xl border border-surface-2 bg-surface-0 px-5 text-sm font-medium text-text-2 hover:bg-surface-1"
          >
            Cancel
          </Link>
        </div>
      </form>
    </LightLayout>
  );
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          defaultValue={defaultValue}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      )}
    </label>
  );
}

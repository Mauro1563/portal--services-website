import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { addClient } from '../actions';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewClientPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { error } = await searchParams;

  return (
    <LightLayout activeTab="more" title="New client" showBack backHref="/owner/clients">
      <p className="text-sm text-text-2">
        Add a client so they get their own private portal. Once added you can
        share their unique link via WhatsApp.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <form action={addClient} className="mt-5 space-y-4">
        <Field label="Name" name="name" required placeholder="James Wilson" />
        <Field label="Email" name="email" type="email" placeholder="james@example.com" />
        <Field label="Phone" name="phone" type="tel" placeholder="+44 7…" />
        <Field
          label="Address"
          name="address"
          placeholder="12 Oxford St, London W1D"
        />
        <Field
          label="Notes"
          name="notes"
          textarea
          placeholder="Wifi code, key location, special requests…"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow"
          >
            Create client
          </button>
          <Link
            href="/owner/clients"
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
  required,
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      )}
    </label>
  );
}

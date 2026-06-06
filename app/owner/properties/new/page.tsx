import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { getT } from '@/lib/i18n';
import { addProperty } from '@/app/owner/actions';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewPropertyPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const { error } = await searchParams;

  return (
    <LightLayout
      activeTab="properties"
      title={t('properties.newTitle')}
      showBack
      backHref="/owner/properties"
    >
      <p className="text-sm text-text-2">{t('properties.newSubtitle')}</p>

      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <form action={addProperty} className="mt-5 space-y-4">
        <Field
          label={t('onboarding.propertyName')}
          name="name"
          required
          placeholder={t('onboarding.propertyNamePh')}
        />
        <Field
          label={t('onboarding.address')}
          name="address"
          placeholder={t('onboarding.addressPh')}
        />
        <Field
          label={t('onboarding.icalUrl')}
          name="airbnb_ical_url"
          type="url"
          placeholder={t('onboarding.icalUrlPh')}
          hint={t('onboarding.icalHint')}
        />
        <Field label={t('properties.notes')} name="notes" textarea placeholder="…" />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow"
          >
            {t('properties.createBtn')}
          </button>
          <Link
            href="/owner/properties"
            className="flex h-11 items-center justify-center rounded-2xl border border-surface-2 bg-surface-0 px-5 text-sm font-medium text-text-2 hover:bg-surface-1"
          >
            {t('common.cancel')}
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
  hint,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
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
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      )}
      {hint ? <span className="mt-1 block text-[11px] text-text-3">{hint}</span> : null}
    </label>
  );
}

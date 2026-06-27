import { redirect } from 'next/navigation';
import { Palette } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import {
  DEFAULT_BRAND_PRIMARY,
  DEFAULT_BRAND_SECONDARY,
  getOwnerProfile,
} from '@/lib/owner-profile';
import { BrandingForm } from './BrandingForm';

type SearchParams = Promise<{ message?: string; error?: string }>;

export const dynamic = 'force-dynamic';

export default async function OwnerBrandingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const { message, error } = await searchParams;
  const profile = await getOwnerProfile(user.id);

  const primary = profile.brand_primary_color ?? DEFAULT_BRAND_PRIMARY;
  const secondary = profile.brand_secondary_color ?? DEFAULT_BRAND_SECONDARY;
  const businessName = profile.business_name ?? 'Mi empresa';

  return (
    <LightLayout
      activeTab="more"
      title="Branding"
      showBack
      backHref="/owner/settings"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
          <Palette className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Marca
          </p>
          <h1 className="font-display text-2xl font-semibold text-text-1">
            Branding
          </h1>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-text-2">
        Personaliza el logo y los colores que ven tus clientes en su portal.
        Los cambios se previsualizan en tiempo real a la derecha.
      </p>

      {message ? (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        <BrandingForm
          initialLogoUrl={profile.business_logo_url}
          initialPrimary={primary}
          initialSecondary={secondary}
          businessName={businessName}
        />
      </div>
    </LightLayout>
  );
}

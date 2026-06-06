import { redirect } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Globe,
  ImageIcon,
  Star,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { getT } from '@/lib/i18n';
import {
  setBusinessTypeFromSettings,
  togglePhotoPortfolio,
  toggleReviewPublic,
  updatePublicProfile,
} from './actions';
import { PublicProfileShareActions } from './PublicProfileShareActions';

type Props = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

type ProfileRow = {
  business_name: string | null;
  tagline: string | null;
  about: string | null;
  service_area: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  slug: string | null;
  is_public_profile: boolean | null;
  business_logo_url: string | null;
  business_type: string | null;
};

type PhotoRow = {
  id: string;
  url: string;
  created_at: string;
  is_public_portfolio: boolean | null;
};

type RatingRow = {
  task_id: string;
  stars: number;
  comment: string | null;
  is_public: boolean | null;
  created_at: string;
};

export default async function BusinessProfilePage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const { message, error } = await searchParams;

  // Use admin to bypass RLS reliably even before migration 0007
  const admin = createAdminClient();

  const [profileRes, photosRes, ratingsRes] = await Promise.all([
    admin
      .from('owner_profiles')
      .select(
        'business_name, tagline, about, service_area, phone, website, instagram, slug, is_public_profile, business_logo_url, business_type',
      )
      .eq('owner_id', user.id)
      .maybeSingle(),
    admin
      .from('task_photos')
      .select('id, url, created_at, is_public_portfolio')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(24),
    admin
      .from('task_ratings')
      .select('task_id, stars, comment, is_public, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const profile = (profileRes.data ?? {}) as ProfileRow;
  const photos = (photosRes.data ?? []) as PhotoRow[];
  const ratings = (ratingsRes.data ?? []) as RatingRow[];

  const publicUrl = profile.slug
    ? `https://hq.portalservices.digital/c/${profile.slug}`
    : null;

  const typeLabel = (k: 'airbnb' | 'house_cleaning' | 'hybrid') =>
    k === 'airbnb'
      ? t('businessProfile.typeAirbnb')
      : k === 'house_cleaning'
        ? t('businessProfile.typeCleaning')
        : t('businessProfile.typeBoth');

  return (
    <LightLayout
      activeTab="more"
      title={t('businessProfile.title')}
      showBack
      backHref="/owner/more"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        {t('businessProfile.eyebrow')}
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-text-1">
        {t('businessProfile.title')}
      </h1>
      <p className="mt-1 text-sm text-text-2">{t('businessProfile.sub')}</p>

      {message ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      {/* Business type switcher */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="font-display text-base font-semibold text-text-1">
          {t('businessProfile.typeTitle')}
        </h2>
        <p className="mt-1 text-[11px] text-text-2">
          {t('businessProfile.typeHint')}
        </p>
        <form
          action={setBusinessTypeFromSettings}
          className="mt-3 grid grid-cols-3 gap-2"
        >
          {(['airbnb', 'house_cleaning', 'hybrid'] as const).map((k) => {
            const active = profile.business_type === k;
            return (
              <button
                key={k}
                type="submit"
                name="business_type"
                value={k}
                className={
                  'flex h-10 items-center justify-center rounded-xl text-xs font-medium ring-1 ring-inset transition ' +
                  (active
                    ? 'bg-brand-600/10 text-brand-700 ring-brand-600/30'
                    : 'bg-surface-1 text-text-2 ring-surface-2 hover:bg-surface-2')
                }
              >
                {typeLabel(k)}
              </button>
            );
          })}
        </form>
      </section>

      {/* Public link card */}
      {publicUrl && profile.is_public_profile ? (
        <section className="mt-6 rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5 shadow-card">
          <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
            <Globe className="h-4 w-4 text-emerald-700" /> {t('businessProfile.liveTitle')}
          </h2>
          <p className="mt-1 break-all rounded-xl border border-emerald-200 bg-surface-0 px-3 py-2 font-mono text-[11px] text-text-1">
            {publicUrl}
          </p>
          <PublicProfileShareActions
            publicUrl={publicUrl}
            businessName={profile.business_name ?? t('businessProfile.fallbackName')}
          />
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-1 p-4 text-xs text-text-2">
          {profile.is_public_profile
            ? t('businessProfile.inactiveNoName')
            : t('businessProfile.inactiveOff')}
        </section>
      )}

      {/* Form */}
      <form
        action={updatePublicProfile}
        className="mt-6 space-y-4 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card"
      >
        <Toggle
          name="is_public_profile"
          checked={!!profile.is_public_profile}
          label={t('businessProfile.publishLabel')}
          description={t('businessProfile.publishHint')}
        />

        <Field
          label={t('businessProfile.fBusinessName')}
          name="business_name"
          defaultValue={profile.business_name ?? ''}
          placeholder={t('businessProfile.fBusinessNamePh')}
        />
        <Field
          label={t('businessProfile.fTagline')}
          name="tagline"
          defaultValue={profile.tagline ?? ''}
          placeholder={t('businessProfile.fTaglinePh')}
          hint={t('businessProfile.fTaglineHint')}
        />
        <Field
          label={t('businessProfile.fAbout')}
          name="about"
          textarea
          defaultValue={profile.about ?? ''}
          placeholder={t('businessProfile.fAboutPh')}
        />
        <Field
          label={t('businessProfile.fArea')}
          name="service_area"
          defaultValue={profile.service_area ?? ''}
          placeholder={t('businessProfile.fAreaPh')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label={t('businessProfile.fPhone')}
            name="phone"
            type="tel"
            defaultValue={profile.phone ?? ''}
            placeholder={t('businessProfile.fPhonePh')}
          />
          <Field
            label={t('businessProfile.fInstagram')}
            name="instagram"
            defaultValue={profile.instagram ?? ''}
            placeholder={t('businessProfile.fInstagramPh')}
          />
        </div>
        <Field
          label={t('businessProfile.fWebsite')}
          name="website"
          type="url"
          defaultValue={profile.website ?? ''}
          placeholder={t('businessProfile.fWebsitePh')}
        />

        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center rounded-2xl bg-brand-gradient text-sm font-semibold text-white shadow-brand-glow"
        >
          {t('businessProfile.save')}
        </button>
      </form>

      {/* Portfolio photos picker */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <ImageIcon className="h-4 w-4 text-brand-600" /> {t('businessProfile.photosTitle')}
        </h2>
        <p className="mt-1 text-[11px] text-text-2">
          {t('businessProfile.photosHint')}
        </p>
        {photos.length === 0 ? (
          <p className="mt-3 text-sm text-text-2">{t('businessProfile.photosEmpty')}</p>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {photos.map((p) => (
              <form
                key={p.id}
                action={togglePhotoPortfolio}
                className="relative"
              >
                <input type="hidden" name="photo_id" value={p.id} />
                <input
                  type="hidden"
                  name="next"
                  value={p.is_public_portfolio ? '0' : '1'}
                />
                <button
                  type="submit"
                  className={
                    'group block aspect-square w-full overflow-hidden rounded-xl border-2 ' +
                    (p.is_public_portfolio
                      ? 'border-emerald-500 ring-2 ring-emerald-200'
                      : 'border-surface-2 hover:border-brand-400')
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt=""
                    className={
                      'block h-full w-full object-cover transition ' +
                      (p.is_public_portfolio ? '' : 'opacity-70 group-hover:opacity-100')
                    }
                  />
                  {p.is_public_portfolio ? (
                    <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                      {t('businessProfile.photoLive')}
                    </span>
                  ) : null}
                </button>
              </form>
            ))}
          </div>
        )}
      </section>

      {/* Reviews — pick which to feature as testimonials */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <Star className="h-4 w-4 text-amber-500" /> {t('businessProfile.reviewsTitle')}
        </h2>
        <p className="mt-1 text-[11px] text-text-2">
          {t('businessProfile.reviewsHint')}
        </p>
        {ratings.length === 0 ? (
          <p className="mt-3 text-sm text-text-2">{t('businessProfile.reviewsEmpty')}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {ratings.map((r) => (
              <li
                key={r.task_id}
                className="rounded-xl border border-surface-2 bg-surface-1 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={
                            n <= r.stars ? 'text-amber-500' : 'text-surface-2'
                          }
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-[10px] text-text-3">
                        {new Date(r.created_at).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    {r.comment ? (
                      <p className="mt-1 text-xs text-text-1">{r.comment}</p>
                    ) : (
                      <p className="mt-1 text-xs italic text-text-3">
                        {t('businessProfile.reviewsNoComment')}
                      </p>
                    )}
                  </div>
                  <form action={toggleReviewPublic}>
                    <input type="hidden" name="task_id" value={r.task_id} />
                    <input
                      type="hidden"
                      name="next"
                      value={r.is_public ? '0' : '1'}
                    />
                    <button
                      type="submit"
                      className={
                        'inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[10px] font-medium ring-1 ring-inset ' +
                        (r.is_public
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                          : 'bg-surface-0 text-text-2 ring-surface-2 hover:bg-surface-1')
                      }
                    >
                      {r.is_public ? (
                        <>
                          <Eye className="h-3 w-3" /> {t('businessProfile.reviewPublic')}
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> {t('businessProfile.reviewHidden')}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tips */}
      <section className="mt-6 mb-4 rounded-2xl border border-surface-2 bg-surface-1 p-4 text-[11px] text-text-2">
        <p className="font-semibold text-text-1">{t('businessProfile.tipsTitle')}</p>
        <ul className="mt-2 space-y-1.5 list-disc pl-4">
          <li>{t('businessProfile.tip1')}</li>
          <li>{t('businessProfile.tip2')}</li>
          <li>{t('businessProfile.tip3')}</li>
          <li>{t('businessProfile.tip4')}</li>
          <li>{t('businessProfile.tip5')}</li>
        </ul>
      </section>
    </LightLayout>
  );
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  hint,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-2">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      )}
      {hint ? <span className="mt-1 block text-[11px] text-text-3">{hint}</span> : null}
    </label>
  );
}

function Toggle({
  name,
  checked,
  label,
  description,
}: {
  name: string;
  checked: boolean;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-surface-2 bg-surface-1 p-3">
      <div>
        <p className="text-sm font-medium text-text-1">{label}</p>
        {description ? (
          <p className="mt-0.5 text-[11px] text-text-2">{description}</p>
        ) : null}
      </div>
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="h-5 w-5 cursor-pointer accent-brand-600"
      />
    </label>
  );
}

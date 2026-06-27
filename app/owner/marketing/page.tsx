import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Plus,
  QrCode,
  Share2,
  Sparkles,
  Tag,
  Twitter,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { getLocale } from '@/lib/i18n';
import { ShareLinkRow } from './ShareLinkRow';
import { LandingEditButtons } from './LandingEditModal';
import { DownloadablesRow } from './DownloadablesRow';

type ProfileRow = {
  business_name: string | null;
  slug: string | null;
  tagline: string | null;
  about: string | null;
  business_logo_url: string | null;
};

type PromoCode = {
  code: string;
  percentOff: number;
  validUntil: string; // ISO date
  usesLeft: number;
};

// TODO: wire to promo_codes table — for now mock data so the UI is real and
// usable. When the table exists, replace MOCK_CODES with a SELECT and a
// server action behind the "Crear código" button.
const MOCK_CODES: PromoCode[] = [
  { code: 'BIENVENIDA10', percentOff: 10, validUntil: '2026-09-30', usesLeft: 47 },
  { code: 'VERANO25', percentOff: 25, validUntil: '2026-08-15', usesLeft: 12 },
];

const SHARE_MESSAGES: Record<'en' | 'es' | 'pt', (link: string) => string> = {
  en: (l) => `Book your cleaning in 30 seconds: ${l}`,
  es: (l) => `Reserva tu limpieza en 30 segundos: ${l}`,
  pt: (l) => `Agende sua limpeza em 30 segundos: ${l}`,
};

const PUBLIC_HOST = 'https://portalservices.digital';

export default async function OwnerMarketingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const locale = await getLocale();
  const admin = createAdminClient();

  const { data: profileData } = await admin
    .from('owner_profiles')
    .select('business_name, slug, tagline, about, business_logo_url')
    .eq('owner_id', user.id)
    .maybeSingle();
  const profile = (profileData ?? {}) as ProfileRow;

  const businessName = profile.business_name?.trim() || 'Mi negocio';
  const slug = profile.slug?.trim() || null;
  const publicUrl = slug ? `${PUBLIC_HOST}/c/${slug}` : null;
  const shareMessage = (SHARE_MESSAGES[locale] ?? SHARE_MESSAGES.en)(
    publicUrl ?? `${PUBLIC_HOST}/`,
  );
  const qrSrc = publicUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(publicUrl)}`
    : null;

  return (
    <LightLayout activeTab="more" title="Marketing" showBack backHref="/owner/more">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        Crecimiento
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-text-1">
        Marketing y promoción
      </h1>
      <p className="mt-1 text-sm text-text-2">
        Comparte tu negocio, lanza descuentos y descarga material para captar más clientes.
      </p>

      {/* 1. Public link + QR */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <Globe className="h-4 w-4 text-brand-600" /> Tu enlace público
        </h2>
        <p className="mt-1 text-[11px] text-text-2">
          El enlace que los clientes usan para reservar contigo. Compártelo donde quieras.
        </p>

        {publicUrl ? (
          <>
            <ShareLinkRow publicUrl={publicUrl} />

            <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex h-[180px] w-[180px] items-center justify-center self-center rounded-2xl border border-surface-2 bg-white p-2 shadow-card sm:self-start">
                {qrSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={qrSrc}
                    alt={`Código QR para ${publicUrl}`}
                    width={160}
                    height={160}
                    className="h-[160px] w-[160px]"
                  />
                ) : (
                  <QrCode className="h-12 w-12 text-text-3" />
                )}
              </div>
              <div className="text-xs text-text-2">
                <p className="inline-flex items-center gap-1.5 font-semibold text-text-1">
                  <QrCode className="h-3.5 w-3.5 text-brand-600" /> Código QR para imprimir
                </p>
                <p className="mt-2 leading-relaxed">
                  Imprime el QR y pégalo en recibos, flyers o el parabrisas de tu vehículo.
                  Los clientes escanean y van directo a tu landing.
                </p>
                {qrSrc ? (
                  <a
                    href={qrSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`qr-${slug ?? 'portal'}.png`}
                    className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl border border-surface-2 bg-surface-0 px-3 text-xs font-semibold text-text-1 hover:bg-surface-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Descargar QR
                  </a>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-3 py-3 text-xs text-amber-800">
            Aún no has elegido un enlace público.{' '}
            <Link
              href="/owner/business-profile"
              className="font-semibold underline underline-offset-2"
            >
              Configúralo aquí
            </Link>
            .
          </div>
        )}
      </section>

      {/* 2. Social share buttons */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <Share2 className="h-4 w-4 text-brand-600" /> Comparte en redes
        </h2>
        <p className="mt-1 text-[11px] text-text-2">
          Mensaje pre-armado: <span className="italic">&ldquo;{shareMessage}&rdquo;</span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <SocialButton
            label="WhatsApp"
            Icon={MessageCircle}
            href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
            tone="emerald"
          />
          <SocialButton
            label="Facebook"
            Icon={Facebook}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl ?? '')}&quote=${encodeURIComponent(shareMessage)}`}
            tone="blue"
          />
          <SocialButton
            label="Instagram"
            Icon={Instagram}
            // Instagram has no web share intent — open profile composer guide.
            href="https://www.instagram.com/"
            tone="pink"
            hint="Pega en tu bio"
          />
          <SocialButton
            label="X / Twitter"
            Icon={Twitter}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
            tone="sky"
          />
          <SocialButton
            label="LinkedIn"
            Icon={Linkedin}
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl ?? '')}`}
            tone="indigo"
          />
        </div>
      </section>

      {/* 3. Promo codes */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
              <Tag className="h-4 w-4 text-brand-600" /> Códigos promocionales
            </h2>
            <p className="mt-1 text-[11px] text-text-2">
              Genera descuentos para regalar a clientes nuevos o recurrentes.
            </p>
          </div>
          {/* TODO: wire "Crear código" to promo_codes table + server action. */}
          <Link
            href="/owner/marketing?new=1"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-card hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Crear código
          </Link>
        </div>

        <ul className="mt-4 divide-y divide-surface-2 overflow-hidden rounded-2xl border border-surface-2">
          {MOCK_CODES.map((c) => (
            <li
              key={c.code}
              className="flex flex-wrap items-center gap-3 bg-surface-0 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-semibold text-text-1">{c.code}</p>
                <p className="mt-0.5 text-[11px] text-text-3">
                  Válido hasta{' '}
                  {new Date(c.validUntil).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span className="inline-flex items-center rounded-lg bg-brand-600/10 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20">
                -{c.percentOff}%
              </span>
              <span className="inline-flex items-center rounded-lg bg-surface-1 px-2.5 py-1 text-[11px] font-medium text-text-2 ring-1 ring-inset ring-surface-2">
                {c.usesLeft} usos restantes
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Landing preview */}
      <section className="mt-6 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <Sparkles className="h-4 w-4 text-brand-600" /> Tu landing personalizada
        </h2>
        <p className="mt-1 text-[11px] text-text-2">
          Así se ve tu página pública para los clientes.
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl border border-surface-2 bg-gradient-to-br from-brand-600/10 via-brand-600/5 to-transparent">
          <div className="flex items-center justify-between border-b border-surface-2 bg-surface-0/60 px-4 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="truncate font-mono text-[10px] text-text-3">
              {publicUrl ?? `${PUBLIC_HOST}/c/tu-slug`}
            </span>
            {publicUrl ? (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold text-brand-600 hover:underline"
              >
                Abrir
              </a>
            ) : (
              <span className="text-[10px] text-text-3">—</span>
            )}
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-card">
              {profile.business_logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={profile.business_logo_url}
                  alt=""
                  className="h-16 w-16 rounded-xl object-contain"
                />
              ) : (
                <span className="font-display text-2xl font-bold text-brand-600">
                  {businessName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold text-text-1">
                {businessName}
              </p>
              <p className="mt-1 text-xs text-text-2">
                {profile.tagline?.trim() ||
                  'Limpieza profesional para hogares y propiedades de alquiler.'}
              </p>
              <p className="mt-2 line-clamp-3 text-[11px] text-text-3">
                {profile.about?.trim() ||
                  'Cuéntale a tus clientes quién eres, qué te diferencia y por qué deberían reservar contigo.'}
              </p>
            </div>
          </div>
        </div>

        <LandingEditButtons />
      </section>

      {/* 5. Downloadables */}
      <section className="mt-6 mb-4 rounded-2xl border border-surface-2 bg-surface-0 p-5 shadow-card">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text-1">
          <Sparkles className="h-4 w-4 text-brand-600" /> Material descargable
        </h2>
        <p className="mt-1 text-[11px] text-text-2">
          Plantillas listas para imprimir o enviar a tus clientes.
        </p>

        <DownloadablesRow businessName={businessName} publicUrl={publicUrl ?? PUBLIC_HOST} />
      </section>
    </LightLayout>
  );
}

type Tone = 'emerald' | 'blue' | 'pink' | 'sky' | 'indigo';

const TONE_CLS: Record<Tone, string> = {
  emerald: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
  blue: 'border-blue-200 text-blue-700 hover:bg-blue-50',
  pink: 'border-pink-200 text-pink-700 hover:bg-pink-50',
  sky: 'border-sky-200 text-sky-700 hover:bg-sky-50',
  indigo: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50',
};

function SocialButton({
  label,
  Icon,
  href,
  tone,
  hint,
}: {
  label: string;
  Icon: typeof MessageCircle;
  href: string;
  tone: Tone;
  hint?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl border bg-surface-0 px-2 text-[11px] font-semibold transition ${TONE_CLS[tone]}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {hint ? <span className="text-[9px] font-normal opacity-70">{hint}</span> : null}
    </a>
  );
}

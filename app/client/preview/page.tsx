/**
 * Public, no-auth PREVIEW of the client portal home — same components
 * as the real /client/<token> page, fed with mock data so anyone
 * (sales, the team, the user) can click through the experience
 * without a magic-link token.
 *
 * The home page is a client component so we can layer interactive
 * sheets (referral, cleaner profile, service detail) on top of the
 * existing shared display components without modifying them.
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  CalendarCheck,
  Check,
  CheckCircle2,
  Copy,
  MapPin,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { EcoGreeting } from '@/components/client/EcoGreeting';
import { FeaturedCleaners } from '@/components/client/FeaturedCleaners';
import { PromoBanner } from '@/components/client/PromoBanner';
import { ServiceCatalog } from '@/components/client/ServiceCatalog';
import { DemoPhotoStrip } from '@/components/preview/DemoPhotoStrip';
import {
  LONDON_PROPERTIES,
  MOCK_CLEANERS,
  MOCK_CTX,
  MOCK_SERVICES,
  PREVIEW_TOKEN,
} from './_mock';

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
  title,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: string;
  tone: 'blue' | 'emerald' | 'amber';
  title?: string;
}) {
  const tones: Record<typeof tone, string> = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  };
  return (
    <div
      title={title}
      className={`flex flex-1 items-center gap-2 rounded-2xl px-3 py-2.5 ring-1 ring-inset ${tones[tone]}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
          {label}
        </p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <button
          type="button"
          onClick={onClose}
          title="Cerrar"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

const PROPERTY = LONDON_PROPERTIES.soho;

export default function ClientPreview() {
  const [referralOpen, setReferralOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cleanerOpen, setCleanerOpen] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<'pending' | 'accepted' | 'done'>(
    'accepted',
  );

  const openCleaner = cleanerOpen
    ? MOCK_CLEANERS.find((c) => c.id === cleanerOpen)
    : null;

  function copyReferral() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('PREVIEW').catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <ClientShell ctx={MOCK_CTX} token={PREVIEW_TOKEN} activeTab="home" hideHeader>
      <EcoGreeting
        firstName="Sofía"
        businessName={MOCK_CTX.owner.business_name ?? ''}
        searchAction={`/client/${PREVIEW_TOKEN}/messages`}
      />

      {/* Promo banner overlay — intercepts the click to open our sheet */}
      <div onClickCapture={(e) => { e.preventDefault(); setReferralOpen(true); }}>
        <PromoBanner token={PREVIEW_TOKEN} />
      </div>

      <Link
        href={`/client/${PREVIEW_TOKEN}/book`}
        title="Reservar una nueva limpieza"
        className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition hover:from-blue-700 hover:to-blue-900"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
            Listo en 30 seg
          </p>
          <p className="mt-0.5 font-display text-base font-bold">
            Reservar limpieza
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
          <Sparkles className="h-5 w-5" />
        </span>
      </Link>

      <div className="mt-4 flex gap-2">
        <StatChip
          icon={CalendarCheck}
          tone="blue"
          label="Próximas"
          value="2"
          title="Limpiezas programadas en los próximos días"
        />
        <StatChip
          icon={CheckCircle2}
          tone="emerald"
          label="Hechas"
          value="12"
          title="Total de limpiezas completadas en tu cuenta"
        />
        <StatChip
          icon={Star}
          tone="amber"
          label="Rating"
          value="4.8"
          title="Tu valoración media a los cleaners que te visitaron"
        />
      </div>

      <ServiceCatalog token={PREVIEW_TOKEN} services={MOCK_SERVICES} />

      {/* FeaturedCleaners overlay — intercept clicks to open profile sheet */}
      <div
        onClickCapture={(e) => {
          const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
          if (!link) return;
          // The shared component renders one card per cleaner without
          // an id attribute; match by initials in the card text.
          const card = link.textContent ?? '';
          const match = MOCK_CLEANERS.find((c) => card.includes(c.name));
          if (match) {
            e.preventDefault();
            setCleanerOpen(match.id);
          }
        }}
      >
        <FeaturedCleaners token={PREVIEW_TOKEN} cleaners={MOCK_CLEANERS} />
      </div>

      <DemoPhotoStrip
        title="Limpiezas anteriores"
        caption="Mira el resultado de servicios recientes — fotos cargadas por tu equipo después de cada visita."
      />

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-slate-900">Próxima visita</h2>
          <span
            className="text-[10px] text-slate-400"
            title="La próxima limpieza programada en tu cuenta"
          >
            ?
          </span>
        </div>
        <div className="mt-3 rounded-3xl bg-white p-4 ring-1 ring-inset ring-slate-100">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                Mañana · 10:00
              </p>
              <p className="mt-0.5 font-display text-sm font-bold text-slate-900">
                Limpieza estándar
              </p>
              <p className="mt-0.5 text-[12px] text-slate-500">
                Con Ana Ruiz · ~2 h
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{PROPERTY.address}</span>
              </p>
            </div>
            <Link
              href={`/client/${PREVIEW_TOKEN}/cleaning`}
              title="Ver detalle completo de la visita"
              className="shrink-0 self-center rounded-full bg-slate-900 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white transition hover:bg-slate-700"
            >
              Ver
            </Link>
          </div>

          {/* Quick actions: state transitions */}
          <div className="mt-3 flex gap-2">
            {nextStatus === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={() => setNextStatus('accepted')}
                  title="Confirmar esta visita"
                  className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  onClick={() => setNextStatus('pending')}
                  title="Rechazar esta visita"
                  className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
                >
                  Rechazar
                </button>
              </>
            )}
            {nextStatus === 'accepted' && (
              <button
                type="button"
                onClick={() => setNextStatus('done')}
                title="Marcar la limpieza como completada"
                className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-emerald-700"
              >
                Marcar completada
              </button>
            )}
            {nextStatus === 'done' && (
              <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5" /> Completada · ahora
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Referral sheet */}
      <Sheet open={referralOpen} onClose={() => setReferralOpen(false)}>
        <div className="relative">
          <h3 className="font-display text-lg font-bold text-slate-900">
            Invita a un amigo
          </h3>
          <p className="mt-1 text-[13px] text-slate-600">
            Cuando tu amigo reserve su primera limpieza, ambos recibís £10 de
            crédito.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Tu código de referido
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="font-mono text-2xl font-bold tracking-widest text-blue-700">
                PREVIEW
              </code>
              <button
                type="button"
                onClick={copyReferral}
                title="Copiar código al portapapeles"
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copiar código
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-400">
            Compártelo por WhatsApp, email o SMS — quien lo use al registrarse
            activa el descuento automáticamente.
          </p>
        </div>
      </Sheet>

      {/* Cleaner profile sheet */}
      <Sheet open={openCleaner != null} onClose={() => setCleanerOpen(null)}>
        {openCleaner && (
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-800 text-lg font-bold text-white">
                {openCleaner.name.split(' ').map((w) => w[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {openCleaner.name}
                </h3>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-amber-700">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {openCleaner.avgStars?.toFixed(1) ?? '—'} ·{' '}
                  {openCleaner.ratingCount} reviews
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Trabajos recientes
              </p>
              <ul className="mt-2 space-y-1.5 text-[12.5px] text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  Limpieza profunda · {LONDON_PROPERTIES.soho.address}
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  Limpieza estándar · {LONDON_PROPERTIES.notting.address}
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  Cristales · {LONDON_PROPERTIES.camden.address}
                </li>
              </ul>
            </div>
            <Link
              href={`/client/${PREVIEW_TOKEN}/book`}
              title={`Pedir que ${openCleaner.name} sea tu cleaner asignado`}
              className="mt-4 flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] hover:bg-blue-700"
              onClick={() => setCleanerOpen(null)}
            >
              Pedir esta persona
            </Link>
          </div>
        )}
      </Sheet>
    </ClientShell>
  );
}

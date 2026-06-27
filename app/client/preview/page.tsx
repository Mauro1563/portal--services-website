/**
 * Public, no-auth PREVIEW of the client portal home — same components
 * as the real /client/<token> page, fed with mock data so anyone
 * (sales, the team, the user) can click through the experience
 * without a magic-link token.
 */
import Link from 'next/link';
import { CalendarCheck, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { EcoGreeting } from '@/components/client/EcoGreeting';
import { FeaturedCleaners } from '@/components/client/FeaturedCleaners';
import { PromoBanner } from '@/components/client/PromoBanner';
import { ServiceCatalog } from '@/components/client/ServiceCatalog';
import { DemoPhotoStrip } from '@/components/preview/DemoPhotoStrip';
import { MOCK_CLEANERS, MOCK_CTX, MOCK_SERVICES, PREVIEW_TOKEN } from './_mock';

export const metadata = {
  title: 'Vista previa · Portal del cliente',
  robots: { index: false, follow: false },
};

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CalendarCheck;
  label: string;
  value: string;
  tone: 'blue' | 'emerald' | 'amber';
}) {
  const tones: Record<typeof tone, string> = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  };
  return (
    <div
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

export default function ClientPreview() {
  return (
    <ClientShell ctx={MOCK_CTX} token={PREVIEW_TOKEN} activeTab="home" hideHeader>
      <EcoGreeting
        firstName="Sofía"
        businessName={MOCK_CTX.owner.business_name ?? ''}
        searchAction={`/client/${PREVIEW_TOKEN}/messages`}
      />

      <PromoBanner token={PREVIEW_TOKEN} />

      <Link
        href={`/client/${PREVIEW_TOKEN}/book`}
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
        />
        <StatChip
          icon={CheckCircle2}
          tone="emerald"
          label="Hechas"
          value="12"
        />
        <StatChip icon={Star} tone="amber" label="Rating" value="4.8" />
      </div>

      <ServiceCatalog token={PREVIEW_TOKEN} services={MOCK_SERVICES} />

      <FeaturedCleaners token={PREVIEW_TOKEN} cleaners={MOCK_CLEANERS} />

      <DemoPhotoStrip
        title="Limpiezas anteriores"
        caption="Mira el resultado de servicios recientes — fotos cargadas por tu equipo después de cada visita."
      />

      <section className="mt-6">
        <h2 className="text-[13px] font-bold text-slate-900">Próxima visita</h2>
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
            </div>
            <Link
              href={`/client/${PREVIEW_TOKEN}/cleaning`}
              className="shrink-0 self-center rounded-full bg-slate-900 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white transition hover:bg-slate-700"
            >
              Ver
            </Link>
          </div>
        </div>
      </section>
    </ClientShell>
  );
}

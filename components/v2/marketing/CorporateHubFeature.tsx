import { getTranslations } from 'next-intl/server';
import { Megaphone, CheckCircle2, Heart, BarChart3 } from 'lucide-react';
import { SectionHeader } from './PortalsGrid';

export async function CorporateHubFeature() {
  const t = await getTranslations('psdSite.hub');

  const bullets = [t('b1'), t('b2'), t('b3'), t('b4')];

  return (
    <section className="relative overflow-hidden bg-psd-bg py-24 sm:py-32">
      {/* soft radial accent — cyan/blue mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-psd-blue/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-psd-orange/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
          />
          <p className="mx-auto mt-5 max-w-xl text-left text-base leading-relaxed text-psd-textSoft sm:text-lg lg:mx-0">
            {t('subtitle')}
          </p>

          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-psd-blue text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="text-[15px] leading-relaxed text-psd-text">
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <HubMockup />
      </div>
    </section>
  );
}

function HubMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[32px] bg-gradient-to-br from-psd-blue/20 via-psd-cyan/10 to-transparent blur-2xl"
      />
      <div className="relative overflow-hidden rounded-3xl border border-psd-border bg-white shadow-[0_40px_80px_-30px_rgba(15,32,68,0.35)]">
        <div className="flex items-center gap-2 border-b border-psd-border bg-psd-bg px-5 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-psd-blue to-psd-navy text-white">
            <Megaphone className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-psd-navy">Corporate Hub</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-psd-textSoft">
              Canal oficial
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <Post
            author="Dirección"
            time="hace 12 min"
            body="Nuevo protocolo de acceso al edificio B. Confirmar lectura antes del turno de mañana."
            reads="87%"
          />
          <PollCard />
        </div>
      </div>
    </div>
  );
}

function Post({
  author,
  time,
  body,
  reads,
}: {
  author: string;
  time: string;
  body: string;
  reads: string;
}) {
  return (
    <article className="rounded-2xl border border-psd-border bg-white p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-psd-navy to-psd-blue text-[12px] font-extrabold text-white">
          {author[0]}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-psd-navy">{author}</p>
          <p className="text-[11px] text-psd-textSoft">{time}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-psd-green/10 px-2 py-0.5 text-[10px] font-bold text-psd-green">
          <CheckCircle2 className="h-3 w-3" /> {reads} leído
        </span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-psd-text">{body}</p>
      <div className="mt-3 flex items-center gap-4 text-[11px] font-semibold text-psd-textSoft">
        <span className="inline-flex items-center gap-1">
          <Heart className="h-3.5 w-3.5 text-psd-orange" /> 24
        </span>
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-psd-blue" /> 41 confirmados
        </span>
      </div>
    </article>
  );
}

function PollCard() {
  const rows: Array<{ label: string; pct: number }> = [
    { label: 'Turno mañana', pct: 62 },
    { label: 'Turno tarde', pct: 28 },
    { label: 'Turno noche', pct: 10 },
  ];
  return (
    <article className="rounded-2xl border border-psd-border bg-white p-4">
      <div className="flex items-center gap-2 text-psd-navy">
        <BarChart3 className="h-4 w-4 text-psd-purple" />
        <p className="text-[13px] font-bold">Encuesta — turno preferido</p>
      </div>
      <ul className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <li key={r.label} className="text-[12px]">
            <div className="flex items-center justify-between text-psd-text">
              <span className="font-semibold">{r.label}</span>
              <span className="tabular-nums text-psd-textSoft">{r.pct}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-psd-bg">
              <div
                className="h-full rounded-full bg-gradient-to-r from-psd-blue to-psd-cyan"
                style={{ width: `${r.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  HardHat,
  Users,
  Briefcase,
  ServerCog,
  ArrowRight,
  Radio,
  Building2,
} from 'lucide-react';

/**
 * /preview — sales-call portal hub.
 *
 * Skips auth entirely: each card links straight to the existing
 * standalone preview route for that portal (`/operative/preview`,
 * `/client/preview`, `/owner/preview`, `/hq/preview`), so during a
 * live demo we open portalservices.digital/preview and jump into whichever
 * role fits the conversation. No login, no PIN, no seed data to
 * reset.
 *
 * The public briefing / pitch page lives at /demo (rewritten to
 * /public/briefing.html); this route is the "inside the app"
 * counterpart for jumping into the actual portals.
 *
 * Route sits outside `[locale]` so it stays reachable at a stable
 * URL regardless of the visitor's cookie-based locale.
 */

export const metadata: Metadata = {
  title: 'Previews · Portal Services Digital',
  description:
    'Entra directo a los portales de Portal Services Digital — Operativo, Community, Supervisor y HQ Admin — sin login.',
  robots: { index: false, follow: false },
};

const ROLES = [
  {
    key: 'operative',
    title: 'Operativo',
    lead: 'El día del terreno, resuelto en el móvil.',
    body: 'Fichaje entrada/salida con GPS, sus turnos, solicitudes rápidas y comunicados.',
    href: '/operative/preview',
    accent: 'orange',
    Icon: HardHat,
  },
  {
    key: 'community',
    title: 'Community',
    lead: 'El cliente/comunidad, sin fricción.',
    body: 'Solicitudes, novedades, encuestas e historial por edificio.',
    href: '/client/preview',
    accent: 'green',
    Icon: Users,
  },
  {
    key: 'owner',
    title: 'Supervisor · Manager',
    lead: 'El mando del edificio en tiempo real.',
    body: 'Planilla, asistencia, cover de turnos, aprobación de timesheets.',
    href: '/owner/preview',
    accent: 'blue',
    Icon: Briefcase,
  },
  {
    key: 'hq',
    title: 'HQ Admin',
    lead: 'Control Center de la operación.',
    body: 'Registro de empleados y edificios, plantillas, seguridad, auditoría y métricas.',
    href: '/hq/preview',
    accent: 'navy',
    Icon: ServerCog,
  },
] as const;

const ACCENT: Record<
  (typeof ROLES)[number]['accent'],
  { chip: string; icon: string; ring: string; glow: string }
> = {
  orange: {
    chip: 'bg-[#FF6B35]/12 text-[#FF6B35]',
    icon: 'bg-gradient-to-br from-[#FF6B35] to-[#D97706]',
    ring: 'hover:ring-[#FF6B35]/30',
    glow: 'rgba(255,107,53,0.25)',
  },
  green: {
    chip: 'bg-[#16A34A]/12 text-[#16A34A]',
    icon: 'bg-gradient-to-br from-[#16A34A] to-[#0D9488]',
    ring: 'hover:ring-[#16A34A]/30',
    glow: 'rgba(22,163,74,0.22)',
  },
  blue: {
    chip: 'bg-[#2563EB]/12 text-[#2563EB]',
    icon: 'bg-gradient-to-br from-[#2563EB] to-[#0F2044]',
    ring: 'hover:ring-[#2563EB]/30',
    glow: 'rgba(37,99,235,0.28)',
  },
  navy: {
    chip: 'bg-[#0F2044]/12 text-[#0F2044]',
    icon: 'bg-gradient-to-br from-[#0F2044] to-[#1A2E57]',
    ring: 'hover:ring-[#0F2044]/30',
    glow: 'rgba(15,32,68,0.28)',
  },
};

export default function DemoHubPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(180deg, #F8FAFC 0%, #EEF2F8 100%)',
        color: '#1E293B',
      }}
    >
      {/* Top strip — matches the landing chrome without cloning the full nav */}
      <div
        className="border-b"
        style={{
          background:
            'linear-gradient(120deg, #0F2044 0%, #1A2E57 100%)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <LogoMark className="h-9 w-9" />
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-extrabold tracking-tight">
                Portal Services
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#22D3EE]">
                Digital · Demo
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-[12px] font-semibold text-white/75 transition hover:text-white"
          >
            ← Volver al sitio
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:pt-20">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{
              borderColor: 'rgba(37,99,235,0.25)',
              backgroundColor: 'rgba(37,99,235,0.08)',
              color: '#2563EB',
            }}
          >
            <Radio className="h-3.5 w-3.5" />
            Demo en vivo · sin login
          </span>
          <h1
            className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl"
            style={{ color: '#0F2044', fontFamily: 'var(--font-poppins), Inter, sans-serif' }}
          >
            Entra directo a cualquier portal.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg">
            Cuatro portales, la misma fuente de datos. Elige cuál mostrar en la
            llamada y aterriza dentro en un clic — con datos de muestra listos
            para demostrar el flujo real.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] font-semibold text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#2563EB]" />
              Multi-edificio
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
              Tiempo real
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
              PWA · Offline
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {ROLES.map((r) => {
            const a = ACCENT[r.accent];
            return (
              <Link
                key={r.key}
                href={r.href}
                className={`group relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-[0_2px_10px_rgba(15,32,68,0.04)] ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,32,68,0.35)] ${a.ring} motion-reduce:hover:translate-y-0`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl transition duration-500 group-hover:opacity-90"
                  style={{ background: a.glow, opacity: 0.55 }}
                />

                <div className="relative flex items-start justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${a.chip}`}
                  >
                    {r.title}
                  </span>
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg transition group-hover:scale-105 ${a.icon}`}
                  >
                    <r.Icon className="h-5 w-5" />
                  </span>
                </div>

                <h3
                  className="relative mt-6 text-2xl font-extrabold leading-tight tracking-tight"
                  style={{ color: '#0F2044', fontFamily: 'var(--font-poppins), Inter, sans-serif' }}
                >
                  {r.lead}
                </h3>
                <p className="relative mt-3 text-[15px] leading-relaxed text-[#64748B]">
                  {r.body}
                </p>

                <div className="relative mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0F2044] transition group-hover:gap-2.5">
                  Entrar al preview
                  <ArrowRight className="h-4 w-4 text-[#FF6B35]" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footnote */}
        <p className="mx-auto mt-12 max-w-2xl text-center text-[12px] leading-relaxed text-[#64748B]">
          Los datos que verás son de muestra y no representan operación real de
          ningún cliente. Cada portal es un preview independiente que puedes
          compartir por enlace durante una llamada.
        </p>
      </section>
    </main>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="12" fill="#0F2044" />
      <path
        d="M13 12h9.5c4.7 0 8 2.9 8 7.2 0 4.4-3.3 7.3-8 7.3H18v9.5h-5V12zm5 4.6v5.4h4c2 0 3.3-1 3.3-2.7 0-1.7-1.3-2.7-3.3-2.7h-4z"
        fill="#2563EB"
      />
      <path
        d="M28 12h4.8c5.3 0 8.7 3.5 8.7 8.5v7c0 5-3.4 8.5-8.7 8.5H28V12zm4.8 4.6v14.8h.4c2.3 0 3.9-1.5 3.9-4v-6.8c0-2.5-1.6-4-3.9-4h-.4z"
        fill="#FF6B35"
      />
    </svg>
  );
}

import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Home,
  KeyRound,
  ShieldCheck,
  Sparkles,
  UserCog,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export const metadata = {
  title: 'Acceso · Portal Services Digital',
  robots: { index: false, follow: false },
};

type Card = {
  href: string;
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  cta: string;
  Icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  ariaPrimary?: boolean;
};

const cards: Card[] = [
  {
    href: '/login',
    badge: 'Dueño / Manager',
    badgeColor: 'from-blue-50 to-cyan-50 text-blue-900 ring-blue-100',
    title: 'Home Cleaner Portal',
    desc: 'Gestiona tu empresa de limpieza: propiedades, equipo, clientes, facturación y reportes.',
    cta: 'Entrar como dueño',
    Icon: Home,
    highlight: true,
    ariaPrimary: true,
  },
  {
    href: '/operative/login',
    badge: 'Limpiadora / Operativa',
    badgeColor: 'from-emerald-50 to-teal-50 text-emerald-900 ring-emerald-100',
    title: 'Operative Portal',
    desc: 'Tus tareas del día, check-in con GPS, fotos del trabajo y comunicación con tu supervisor.',
    cta: 'Entrar con PIN',
    Icon: Sparkles,
  },
  {
    href: '/hq/login',
    badge: 'Admin Portal Services',
    badgeColor: 'from-amber-50 to-orange-50 text-amber-900 ring-amber-100',
    title: 'HQ · Super Admin',
    desc: 'Panel administrativo de la plataforma. Gestiona empresas, leads, branding y contenidos.',
    cta: 'Entrar como admin',
    Icon: ShieldCheck,
  },
];

export default function PortalesHub() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60">
      {/* Brand orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-400/25 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-20 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-blue-500/30 via-indigo-400/20 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-5 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo size="md" className="!h-16 sm:!h-20" />
          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.18)]">
            <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#0891b2] bg-clip-text text-transparent">
              Acceso
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            ¿Cómo quieres entrar?
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Cada rol tiene su propio portal. Elige el tuyo abajo.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <PortalCard key={c.href} card={c} />
          ))}
        </div>

        {/* Secondary: clients (no button — magic link explanation) */}
        <div className="mt-6 flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-900">¿Eres cliente?</p>
            <p className="mt-0.5 text-xs leading-relaxed">
              Recibes un enlace único de tu empresa de limpieza por email o
              WhatsApp — no necesitas contraseña.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
          <Link href="/" className="transition hover:text-slate-700">
            ← Volver al sitio
          </Link>
          <span>·</span>
          <Link
            href="/signup"
            className="font-semibold text-blue-600 transition hover:text-blue-800"
          >
            Crear una cuenta nueva <ArrowRight className="inline h-3 w-3" />
          </Link>
        </div>
      </div>
    </main>
  );
}

function PortalCard({ card }: { card: Card }) {
  const Icon = card.Icon;
  return (
    <Link
      href={card.href}
      aria-label={`${card.title} — ${card.cta}`}
      className={`group relative flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-[0_12px_36px_-14px_rgba(15,23,42,0.18)] ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-16px_rgba(37,99,235,0.30)] ${
        card.highlight
          ? 'border-transparent ring-blue-200/70'
          : 'border-slate-200'
      }`}
    >
      {card.highlight ? (
        <span className="absolute -top-2 right-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow">
          Más usado
        </span>
      ) : null}

      <div className="flex items-center justify-between">
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${
            card.highlight
              ? 'from-cyan-400 to-blue-700 text-white shadow-[0_8px_18px_-6px_rgba(37,99,235,0.5)]'
              : 'from-slate-100 to-slate-50 text-slate-600 ring-1 ring-slate-200/60'
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
      </div>

      <div>
        <span
          className={`inline-flex items-center rounded-full bg-gradient-to-r px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] ring-1 ${card.badgeColor}`}
        >
          {card.badge}
        </span>
        <h2 className="mt-2 text-base font-semibold text-slate-900">
          {card.title}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {card.desc}
        </p>
      </div>

      <span
        className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${
          card.highlight ? 'text-blue-700' : 'text-slate-700'
        } group-hover:gap-1.5`}
      >
        {card.cta}
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

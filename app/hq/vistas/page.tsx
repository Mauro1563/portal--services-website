import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowUpRight,
  ExternalLink,
  Eye,
  Globe,
  Home,
  Inbox,
  Settings,
  Sparkles,
  UserCog,
  Users,
} from 'lucide-react';
import { requireMarketingAdmin } from '@/lib/marketing';
import { HQShell } from '@/components/hq/Shell';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Vistas · HQ',
  robots: { index: false, follow: false },
};

type View = {
  href: string;
  label: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeTone?: 'blue' | 'emerald' | 'amber' | 'slate';
  external?: boolean;
};

const sections: { title: string; views: View[] }[] = [
  {
    title: 'Sitio público',
    views: [
      {
        href: '/',
        label: 'Marketing site',
        desc: 'Home pública: hero, portales, pricing, FAQ.',
        Icon: Globe,
        external: true,
      },
      {
        href: '/login',
        label: 'Login del Owner',
        desc: 'Pantalla de acceso para Owners y Admins.',
        Icon: Eye,
        external: true,
      },
      {
        href: '/signup',
        label: 'Página de registro',
        desc: 'Formulario de auto-registro para nuevos dueños.',
        Icon: UserCog,
        external: true,
      },
    ],
  },
  {
    title: 'Portales de usuario',
    views: [
      {
        href: '/login',
        label: 'Home Cleaner Portal',
        desc: 'Login del dueño. Entra con un email registrado o crea uno desde /signup.',
        Icon: Home,
        badge: 'Owner',
        badgeTone: 'blue',
        external: true,
      },
      {
        href: '/operative/login',
        label: 'Operative · Login',
        desc: 'Login de la limpiadora con PIN. Crea PINs desde Owner → Cleaners.',
        Icon: Sparkles,
        badge: 'Cleaner',
        badgeTone: 'emerald',
        external: true,
      },
      {
        href: '/owner/preview',
        label: 'Owner Dashboard (demo)',
        desc: 'Cómo se ve el panel del dueño después de loguearse.',
        Icon: Home,
        badge: 'Owner',
        badgeTone: 'blue',
        external: true,
      },
      {
        href: '/operative/preview',
        label: 'Operative Dashboard (demo)',
        desc: 'Cómo se ve la app de la limpiadora con su día de tareas.',
        Icon: Sparkles,
        badge: 'Cleaner',
        badgeTone: 'emerald',
        external: true,
      },
      {
        href: '/client/preview',
        label: 'Client Portal (demo)',
        desc: 'Cómo se ve el portal del cliente.',
        Icon: Eye,
        badge: 'Client',
        badgeTone: 'amber',
        external: true,
      },
    ],
  },
  {
    title: 'Tu área administrativa',
    views: [
      {
        href: '/hq/leads',
        label: 'Leads / Registros',
        desc: 'Todas las personas que se han registrado desde el sitio.',
        Icon: Inbox,
      },
      {
        href: '/hq/companies',
        label: 'Empresas / Tenants',
        desc: 'Las empresas (owners) que usan la plataforma.',
        Icon: Users,
      },
      {
        href: '/hq/branding',
        label: 'Branding',
        desc: 'Sube tu logo y elige los colores del sitio.',
        Icon: Settings,
      },
    ],
  },
];

const toneClasses: Record<NonNullable<View['badgeTone']>, string> = {
  blue: 'bg-blue-50 text-blue-800 ring-blue-200',
  emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export default async function HQVistas() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  return (
    <HQShell
      active="dashboard"
      email={admin.email}
      title="Vistas"
      subtitle="Visualiza desde aquí cualquier portal o sección del sistema. Útil para revisar cómo se ve para cada tipo de usuario."
    >
      <div className="space-y-8">
        {sections.map((sec) => (
          <section key={sec.title}>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-graphite-3">
              {sec.title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sec.views.map((v) => {
                const Icon = v.Icon;
                return (
                  <Link
                    key={v.href}
                    href={v.href}
                    target={v.external ? '_blank' : undefined}
                    rel={v.external ? 'noopener noreferrer' : undefined}
                    className="group relative flex flex-col gap-3 rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 text-brand-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      {v.external ? (
                        <ExternalLink className="h-3.5 w-3.5 text-graphite-4 transition group-hover:text-brand-600" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 text-graphite-4 transition group-hover:text-brand-600" />
                      )}
                    </div>
                    <div>
                      {v.badge ? (
                        <span
                          className={`mb-1.5 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] ring-1 ${toneClasses[v.badgeTone ?? 'slate']}`}
                        >
                          {v.badge}
                        </span>
                      ) : null}
                      <h3 className="text-sm font-semibold text-graphite-1 group-hover:text-brand-700">
                        {v.label}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-graphite-3">
                        {v.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <p className="font-semibold">¿Cómo ver el portal del cliente?</p>
          <p className="mt-1 leading-relaxed">
            Cada cliente accede por un link único tipo{' '}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">
              /client/&lt;token&gt;
            </code>{' '}
            que se genera al crear el cliente desde Owner → Clientes. Desde
            ahí copia el link y ábrelo en otra pestaña.
          </p>
        </div>
      </div>
    </HQShell>
  );
}

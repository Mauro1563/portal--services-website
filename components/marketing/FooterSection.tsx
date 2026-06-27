import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  eyebrow: string;
  links: FooterLink[];
};

const columns: FooterColumn[] = [
  {
    eyebrow: 'Producto',
    links: [
      { label: 'Funciones', href: '/#features' },
      { label: 'Precios', href: '/#pricing' },
      { label: 'Portales', href: '/#portals' },
      { label: 'Integraciones', href: '/#integrations' },
    ],
  },
  {
    eyebrow: 'Empresa',
    links: [
      { label: 'Sobre nosotros', href: '/about' },
      { label: 'Clientes', href: '/customers' },
      { label: 'Contacto', href: '/contact' },
      { label: 'Empleo', href: '/careers' },
    ],
  },
  {
    eyebrow: 'Legal',
    links: [
      { label: 'Privacidad', href: '/es/privacy' },
      { label: 'Términos', href: '/es/terms' },
      { label: 'Cookies', href: '/es/cookies' },
      { label: 'Seguridad', href: '/security' },
    ],
  },
  {
    eyebrow: 'Idioma',
    links: [
      { label: 'Español', href: '/es' },
      { label: 'English', href: '/en' },
      { label: 'Català', href: '/ca' },
      { label: 'Português', href: '/pt' },
    ],
  },
];

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-50">
      {/* CTA Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 px-6 py-12 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.5)] sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          {/* Radial glow motifs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl"
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15 backdrop-blur">
                <Sparkles className="h-3 w-3 text-cyan-300" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                  Empieza hoy
                </span>
              </div>
              <h2 className="font-display mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                ¿Listo para empezar?{' '}
                <span className="bg-gradient-to-r from-cyan-200 to-sky-300 bg-clip-text text-transparent">
                  Prueba 14 días gratis
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
                Sin tarjeta. Sin compromisos. Activa Portal Home en minutos y
                empieza a gestionar tu equipo, clientes y reservas desde un solo
                lugar.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-7 py-4 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.7)] ring-1 ring-blue-400/30 transition hover:from-blue-500 hover:to-blue-600"
              >
                Prueba 14 días gratis
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/80 transition hover:text-white"
              >
                Hablar con ventas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer columns */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Logo size="sm" />
            <p className="mt-4 max-w-xs text-sm text-slate-600">
              Una plataforma. Un lugar. Todos conectados.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.eyebrow}>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                {col.eyebrow}
              </div>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-700 transition hover:text-blue-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © {year} Portal Home. Todos los derechos reservados. Hecho con cariño
            en Barcelona.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link href="/es/privacy" className="transition hover:text-slate-900">
              Privacidad
            </Link>
            <Link href="/es/terms" className="transition hover:text-slate-900">
              Términos
            </Link>
            <Link href="/status" className="transition hover:text-slate-900">
              Estado
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PortalServicesLogo } from '@/components/brand/PortalServicesLogo';
import { getLocale, type Locale } from '@/lib/i18n';

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  eyebrow: string;
  links: FooterLink[];
};

/**
 * Per-locale copy for the marketing footer. Mirrors the COPY pattern used in
 * HeroSection.tsx so all marketing strings stay co-located with their
 * component and we don't have to round-trip through messages JSON for tweaks.
 *
 * `/ca` is intentionally omitted from the language column — the Catalan locale
 * is not implemented yet and would 404.
 */
const COPY: Record<
  Locale,
  {
    tagline: string;
    columns: FooterColumn[];
    ctaEyebrow: string;
    ctaHeadlineLead: string;
    ctaHeadlineAccent: string;
    ctaSub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    copyright: (year: number) => string;
    legalShort: { privacy: string; terms: string; status: string };
  }
> = {
  es: {
    tagline: 'Una plataforma. Un lugar. Todos conectados.',
    // Language column intentionally removed — the LocaleSwitcher now lives
    // in the top nav, so the footer is three columns (Producto / Empresa /
    // Legal) instead of four.
    columns: [
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
    ],
    ctaEyebrow: 'Empieza hoy',
    ctaHeadlineLead: '¿Listo para empezar?',
    ctaHeadlineAccent: 'Prueba 14 días gratis',
    ctaSub: 'Sin tarjeta. Sin compromisos. Activa Portal Services Digital en minutos y empieza a gestionar tu equipo, clientes y reservas desde un solo lugar.',
    ctaPrimary: 'Prueba 14 días gratis',
    ctaSecondary: 'Hablar con ventas',
    copyright: (year) =>
      `© ${year} Portal Services Digital. Todos los derechos reservados.`,
    legalShort: { privacy: 'Privacidad', terms: 'Términos', status: 'Estado' },
  },
  en: {
    tagline: 'One platform. One place. Everyone connected.',
    columns: [
      {
        eyebrow: 'Product',
        links: [
          { label: 'Features', href: '/#features' },
          { label: 'Pricing', href: '/#pricing' },
          { label: 'Portals', href: '/#portals' },
          { label: 'Integrations', href: '/#integrations' },
        ],
      },
      {
        eyebrow: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Customers', href: '/customers' },
          { label: 'Contact', href: '/contact' },
          { label: 'Careers', href: '/careers' },
        ],
      },
      {
        eyebrow: 'Legal',
        links: [
          { label: 'Privacy', href: '/en/privacy' },
          { label: 'Terms', href: '/en/terms' },
          { label: 'Cookies', href: '/en/cookies' },
          { label: 'Security', href: '/security' },
        ],
      },
    ],
    ctaEyebrow: 'Start today',
    ctaHeadlineLead: 'Ready to get started?',
    ctaHeadlineAccent: 'Try it free for 14 days',
    ctaSub: 'No credit card. No commitment. Set up Portal Services Digital in minutes and start managing your team, customers and bookings from one place.',
    ctaPrimary: 'Start 14-day free trial',
    ctaSecondary: 'Talk to sales',
    copyright: (year) =>
      `© ${year} Portal Services Digital. All rights reserved.`,
    legalShort: { privacy: 'Privacy', terms: 'Terms', status: 'Status' },
  },
  pt: {
    tagline: 'Uma plataforma. Um lugar. Todos conectados.',
    columns: [
      {
        eyebrow: 'Produto',
        links: [
          { label: 'Funcionalidades', href: '/#features' },
          { label: 'Preços', href: '/#pricing' },
          { label: 'Portais', href: '/#portals' },
          { label: 'Integrações', href: '/#integrations' },
        ],
      },
      {
        eyebrow: 'Empresa',
        links: [
          { label: 'Sobre nós', href: '/about' },
          { label: 'Clientes', href: '/customers' },
          { label: 'Contacto', href: '/contact' },
          { label: 'Carreiras', href: '/careers' },
        ],
      },
      {
        eyebrow: 'Legal',
        links: [
          { label: 'Privacidade', href: '/pt/privacy' },
          { label: 'Termos', href: '/pt/terms' },
          { label: 'Cookies', href: '/pt/cookies' },
          { label: 'Segurança', href: '/security' },
        ],
      },
    ],
    ctaEyebrow: 'Comece hoje',
    ctaHeadlineLead: 'Pronto para começar?',
    ctaHeadlineAccent: 'Experimente 14 dias grátis',
    ctaSub: 'Sem cartão. Sem compromissos. Active o Portal Services Digital em minutos e comece a gerir a sua equipa, clientes e reservas num só lugar.',
    ctaPrimary: 'Experimentar 14 dias grátis',
    ctaSecondary: 'Falar com vendas',
    copyright: (year) =>
      `© ${year} Portal Services Digital. Todos os direitos reservados.`,
    legalShort: { privacy: 'Privacidade', terms: 'Termos', status: 'Estado' },
  },
};

export default async function FooterSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  const year = new Date().getFullYear();
  // Legal short-links at the bottom of the footer mirror the locale-prefixed
  // routes from the Legal column above, so both stay in sync per locale.
  const privacyHref = `/${locale}/privacy`;
  const termsHref = `/${locale}/terms`;

  return (
    <footer className="relative bg-white">
      {/* CTA Banner — THE dark surface. Bright teal CTA is allowed here (rule 2). */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="relative overflow-hidden rounded-2xl bg-[#0A0D18] px-5 py-8 shadow-[0_20px_60px_-20px_rgba(10,13,24,0.5)] sm:rounded-3xl sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          {/* Sparse teal accent — single subtle glow, not a flood */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[#00D8C7]/10 blur-3xl"
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              {/* Eyebrow chip on dark — muted white surface with tiny teal sparkle */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10 backdrop-blur">
                <Sparkles className="h-3 w-3 text-[#00D8C7]" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  {t.ctaEyebrow}
                </span>
              </div>
              {/* Headline stays white on dark — no teal gradient text */}
              <h2 className="font-display mt-3 text-2xl font-bold leading-tight text-white sm:mt-5 sm:text-4xl lg:text-5xl">
                {t.ctaHeadlineLead}{' '}
                <span className="text-white/90">
                  {t.ctaHeadlineAccent}
                </span>
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/70 sm:mt-4 sm:text-lg">
                {t.ctaSub}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              {/* PRIMARY CTA on dark surface — bright teal fill + midnight text + glow (rule 2) */}
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-[#00D8C7] px-5 py-3 text-sm font-semibold text-[#0A0D18] shadow-[0_0_24px_rgba(0,216,199,0.45)] ring-1 ring-[#00D8C7]/40 transition hover:bg-[#2BF0DE] sm:px-7 sm:py-4 sm:text-base"
              >
                {t.ctaPrimary}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/80 transition hover:text-white"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer columns — pure white surface, slate-600 links, no teal/blue hover */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <PortalServicesLogo variant="dark" size="sm" showWordmark />
            <p className="mt-4 max-w-xs text-sm text-slate-600">
              {t.tagline}
            </p>
            <a
              href="mailto:hola@portalservices.digital"
              className="mt-3 inline-block border-b border-slate-200 pb-1 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
            >
              hola@portalservices.digital
            </a>
          </div>

          {t.columns.map((col) => (
            <div key={col.eyebrow}>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                {col.eyebrow}
              </div>
              <ul className="mt-3 space-y-2 sm:mt-5 sm:space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition hover:text-slate-900"
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
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-8 sm:mt-14 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">{t.copyright(year)}</p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link href={privacyHref} className="transition hover:text-slate-900">
              {t.legalShort.privacy}
            </Link>
            <Link href={termsHref} className="transition hover:text-slate-900">
              {t.legalShort.terms}
            </Link>
            <Link href="/status" className="transition hover:text-slate-900">
              {t.legalShort.status}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

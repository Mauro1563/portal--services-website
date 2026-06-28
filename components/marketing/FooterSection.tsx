import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    columns: [
      {
        eyebrow: 'producto',
        links: [
          { label: 'Funciones', href: '/#features' },
          { label: 'Precios', href: '/#pricing' },
          { label: 'Portales', href: '/#portals' },
          { label: 'Integraciones', href: '/#integrations' },
        ],
      },
      {
        eyebrow: 'empresa',
        links: [
          { label: 'Sobre nosotros', href: '/about' },
          { label: 'Clientes', href: '/customers' },
          { label: 'Contacto', href: '/contact' },
          { label: 'Empleo', href: '/careers' },
        ],
      },
      {
        eyebrow: 'legal',
        links: [
          { label: 'Privacidad', href: '/es/privacy' },
          { label: 'Términos', href: '/es/terms' },
          { label: 'Cookies', href: '/es/cookies' },
          { label: 'Seguridad', href: '/security' },
        ],
      },
      {
        eyebrow: 'idioma',
        links: [
          { label: 'Español', href: '/es' },
          { label: 'English', href: '/en' },
          { label: 'Português', href: '/pt' },
        ],
      },
    ],
    ctaEyebrow: 'empieza hoy',
    ctaHeadlineLead: '¿Listo para empezar?',
    ctaHeadlineAccent: '14 días gratis',
    ctaSub: 'Sin tarjeta. Sin compromisos. Activa Portal en minutos y empieza a gestionar tu equipo, clientes y reservas desde un solo lugar.',
    ctaPrimary: 'Prueba 14 días gratis',
    ctaSecondary: 'Hablar con ventas',
    copyright: (year) =>
      `© ${year} Portal Services. Todos los derechos reservados.`,
    legalShort: { privacy: 'Privacidad', terms: 'Términos', status: 'Estado' },
  },
  en: {
    tagline: 'One platform. One place. Everyone connected.',
    columns: [
      {
        eyebrow: 'product',
        links: [
          { label: 'Features', href: '/#features' },
          { label: 'Pricing', href: '/#pricing' },
          { label: 'Portals', href: '/#portals' },
          { label: 'Integrations', href: '/#integrations' },
        ],
      },
      {
        eyebrow: 'company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Customers', href: '/customers' },
          { label: 'Contact', href: '/contact' },
          { label: 'Careers', href: '/careers' },
        ],
      },
      {
        eyebrow: 'legal',
        links: [
          { label: 'Privacy', href: '/en/privacy' },
          { label: 'Terms', href: '/en/terms' },
          { label: 'Cookies', href: '/en/cookies' },
          { label: 'Security', href: '/security' },
        ],
      },
      {
        eyebrow: 'language',
        links: [
          { label: 'Español', href: '/es' },
          { label: 'English', href: '/en' },
          { label: 'Português', href: '/pt' },
        ],
      },
    ],
    ctaEyebrow: 'start today',
    ctaHeadlineLead: 'Ready to get started?',
    ctaHeadlineAccent: '14 days free',
    ctaSub: 'No credit card. No commitment. Set up Portal in minutes and start managing your team, customers and bookings from one place.',
    ctaPrimary: 'Start 14-day free trial',
    ctaSecondary: 'Talk to sales',
    copyright: (year) =>
      `© ${year} Portal Services. All rights reserved.`,
    legalShort: { privacy: 'Privacy', terms: 'Terms', status: 'Status' },
  },
  pt: {
    tagline: 'Uma plataforma. Um lugar. Todos conectados.',
    columns: [
      {
        eyebrow: 'produto',
        links: [
          { label: 'Funcionalidades', href: '/#features' },
          { label: 'Preços', href: '/#pricing' },
          { label: 'Portais', href: '/#portals' },
          { label: 'Integrações', href: '/#integrations' },
        ],
      },
      {
        eyebrow: 'empresa',
        links: [
          { label: 'Sobre nós', href: '/about' },
          { label: 'Clientes', href: '/customers' },
          { label: 'Contacto', href: '/contact' },
          { label: 'Carreiras', href: '/careers' },
        ],
      },
      {
        eyebrow: 'legal',
        links: [
          { label: 'Privacidade', href: '/pt/privacy' },
          { label: 'Termos', href: '/pt/terms' },
          { label: 'Cookies', href: '/pt/cookies' },
          { label: 'Segurança', href: '/security' },
        ],
      },
      {
        eyebrow: 'idioma',
        links: [
          { label: 'Español', href: '/es' },
          { label: 'English', href: '/en' },
          { label: 'Português', href: '/pt' },
        ],
      },
    ],
    ctaEyebrow: 'comece hoje',
    ctaHeadlineLead: 'Pronto para começar?',
    ctaHeadlineAccent: '14 dias grátis',
    ctaSub: 'Sem cartão. Sem compromissos. Active o Portal em minutos e comece a gerir a sua equipa, clientes e reservas num só lugar.',
    ctaPrimary: 'Experimentar 14 dias grátis',
    ctaSecondary: 'Falar com vendas',
    copyright: (year) =>
      `© ${year} Portal Services. Todos os direitos reservados.`,
    legalShort: { privacy: 'Privacidade', terms: 'Termos', status: 'Estado' },
  },
};

const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export default async function FooterSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  const year = new Date().getFullYear();
  // Legal short-links at the bottom of the footer mirror the locale-prefixed
  // routes from the Legal column above, so both stay in sync per locale.
  const privacyHref = `/${locale}/privacy`;
  const termsHref = `/${locale}/terms`;

  return (
    <footer className="relative bg-[#F4EFE6] ps-paper-grain">
      {/* CTA Banner — single mandarin block, the "one big thing" of the footer.
          Replaces the cyan/blue gradient navy banner. */}
      <div className="mx-auto max-w-[1280px] px-6 pt-24 md:px-12 md:pt-40">
        <div className="relative overflow-hidden rounded-[12px] bg-[#FF5B1F] px-8 py-12 text-[#1A0A04] md:px-14 md:py-20">
          <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[12px] text-[#1A0A04]" style={{ fontFamily: MONO }}>
                {t.ctaEyebrow}
              </p>
              <h2
                className="mt-5 text-[40px] leading-[0.95] tracking-[-0.03em] md:text-[72px]"
                style={{ fontFamily: SERIF, fontWeight: 400 }}
              >
                {t.ctaHeadlineLead}{' '}
                <em style={{ fontStyle: 'italic' }}>{t.ctaHeadlineAccent}</em>
              </h2>
              <p className="mt-6 max-w-xl text-[16px] leading-[1.5] text-[#1A0A04]/75 md:text-[18px]">
                {t.ctaSub}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-[#141414] px-6 py-3.5 text-sm font-semibold text-[#F4EFE6] transition-colors hover:bg-black md:px-8 md:py-4 md:text-base"
                style={{ transitionDuration: '160ms' }}
              >
                {t.ctaPrimary}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                  style={{ transitionDuration: '280ms' }}
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A0A04]/80 transition-colors hover:text-[#1A0A04]"
                style={{ transitionDuration: '160ms' }}
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer columns */}
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-5">
          {/* Brand — Instrument Serif wordmark, mandarin period */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-baseline gap-0 text-[#141414]"
              aria-label="Portal Services"
            >
              <span
                className="text-[28px] leading-none tracking-[-0.01em]"
                style={{ fontFamily: SERIF, fontWeight: 400 }}
              >
                Portal
              </span>
              <span className="mx-[3px] text-[28px] leading-none text-[#FF5B1F]">.</span>
              <span
                className="text-[28px] leading-none tracking-[-0.01em]"
                style={{ fontFamily: SERIF, fontWeight: 400 }}
              >
                Services
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-[15px] leading-[1.55] text-[#54524D]">
              {t.tagline}
            </p>
            <a
              href="mailto:hola@portalservices.digital"
              className="mt-4 inline-block text-[13px] text-[#141414]"
              style={{ fontFamily: MONO }}
            >
              <span className="ps-link">hola@portalservices.digital</span>
            </a>
          </div>

          {t.columns.map((col, idx) => (
            <div key={col.eyebrow} className={idx === 3 ? 'hidden sm:block' : undefined}>
              <div className="text-[12px] text-[#141414]" style={{ fontFamily: MONO }}>
                <span
                  className="pb-1"
                  style={{
                    backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 1px',
                    backgroundPosition: '0 calc(100% + 4px)',
                  }}
                >
                  {col.eyebrow}
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-[14px] text-[#141414]"
                    >
                      <span className="ps-link">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright — hairline above, mono micro */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[#1414141A] pt-8 sm:flex-row sm:items-center">
          <p className="text-[12px] text-[#54524D]" style={{ fontFamily: MONO }}>
            {t.copyright(year)}
          </p>
          <div className="flex items-center gap-6 text-[12px] text-[#54524D]" style={{ fontFamily: MONO }}>
            <Link href={privacyHref} className="inline-block">
              <span className="ps-link">{t.legalShort.privacy}</span>
            </Link>
            <Link href={termsHref} className="inline-block">
              <span className="ps-link">{t.legalShort.terms}</span>
            </Link>
            <Link href="/status" className="inline-block">
              <span className="ps-link">{t.legalShort.status}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

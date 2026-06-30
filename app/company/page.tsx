import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, UserRound, Home, ShieldCheck, Unlock, Eye, Mail } from 'lucide-react';
import FooterSection from '@/components/marketing/FooterSection';
import { getLocale, type Locale } from '@/lib/i18n';

/**
 * Public company page — no auth, marketing surface.
 *
 * Mirrors the `COPY` + `getLocale()` pattern used by the [locale]/about page
 * and the marketing sections in components/marketing/*. Lives at the root
 * (/company) rather than under [locale] because it is linked from auth
 * surfaces where the route segment is locale-less; the locale still resolves
 * from the `portal_locale` cookie.
 *
 * Palette rules (Zapli marketing):
 *   - white page background
 *   - midnight #0A0D18 body text
 *   - #00D8C7 used ONLY as small dots / sparkles
 *   - CTAs are midnight pills (white text), matching marketing buttons
 *
 * Explicitly excluded per the brief: cost figures, repo links, email
 * addresses, integration logos — anything that leaks internals.
 */

type Audience = {
  icon: 'building' | 'user' | 'home';
  title: string;
  body: string;
};

type Principle = {
  icon: 'shield' | 'unlock' | 'eye';
  title: string;
  body: string;
};

type Copy = {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroTagline: string;
  missionEyebrow: string;
  missionTitle: string;
  missionBody: string;
  audienceEyebrow: string;
  audienceTitle: string;
  audienceSub: string;
  audiences: [Audience, Audience, Audience];
  principlesEyebrow: string;
  principlesTitle: string;
  principlesSub: string;
  principles: [Principle, Principle, Principle];
  contactEyebrow: string;
  contactTitle: string;
  contactBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    metaTitle: 'About Zapli — Company',
    metaDescription:
      'Zapli is the operations platform for cleaning teams, individual cleaners and residential hosts. Mission, audience and how we work.',
    heroEyebrow: 'Company',
    heroTitle: 'About Zapli',
    heroTagline:
      'A calmer way to run cleaning operations — built for the people doing the work, not the people watching dashboards.',
    missionEyebrow: 'Mission',
    missionTitle: 'What we do',
    missionBody:
      'Zapli gives small and mid-size cleaning operations the same calm, reliable tooling that the biggest brands take for granted. We turn the daily mess of WhatsApp groups, paper checklists and scattered spreadsheets into one clear place where teams plan the day, clients see what is happening and operators get proof the job was done well.',
    audienceEyebrow: 'Audience',
    audienceTitle: 'Who Zapli is for',
    audienceSub:
      'Three kinds of teams sit at the centre of every product decision we make.',
    audiences: [
      {
        icon: 'building',
        title: 'Cleaning company owners',
        body: 'Owner-operators and growing teams that need to schedule staff, send invoices and prove quality to clients — without paying enterprise prices.',
      },
      {
        icon: 'user',
        title: 'Individual cleaners',
        body: 'Solo cleaners who want a single place for their calendar, their client list and the photos that show the job was done properly.',
      },
      {
        icon: 'home',
        title: 'Residential & Airbnb hosts',
        body: 'Property owners and short-stay hosts coordinating turnovers — a clear handoff between guests, cleaners and the next check-in.',
      },
    ],
    principlesEyebrow: 'How we work',
    principlesTitle: 'Three principles',
    principlesSub: 'The values we hold ourselves to, written down so you can hold us to them.',
    principles: [
      {
        icon: 'shield',
        title: 'Privacy by default',
        body: 'Your client list, your photos and your operational data belong to you. We collect the minimum needed to make the product work and we do not sell or share it.',
      },
      {
        icon: 'unlock',
        title: 'No lock-in',
        body: 'Cancel any time and take your data with you. Exports are a feature, not a favour — and there are no contracts that punish you for leaving.',
      },
      {
        icon: 'eye',
        title: 'Full transparency',
        body: 'Pricing is public. Roadmap decisions are explained. When something breaks, you will hear about it from us first, in plain language.',
      },
    ],
    contactEyebrow: 'Contact',
    contactTitle: 'Want to talk to us?',
    contactBody:
      'Questions, feedback or just curious whether Zapli fits your team? Head to the contact page — a real person reads every message.',
    ctaPrimary: 'Start free',
    ctaSecondary: 'Go to contact',
  },
  es: {
    metaTitle: 'Sobre Zapli — Empresa',
    metaDescription:
      'Zapli es la plataforma operativa para equipos de limpieza, limpiadores autónomos y anfitriones residenciales. Misión, público y cómo trabajamos.',
    heroEyebrow: 'Empresa',
    heroTitle: 'Sobre Zapli',
    heroTagline:
      'Una forma más tranquila de gestionar operaciones de limpieza — pensada para quien hace el trabajo, no para quien mira paneles.',
    missionEyebrow: 'Misión',
    missionTitle: 'Lo que hacemos',
    missionBody:
      'Zapli da a las operaciones de limpieza pequeñas y medianas las mismas herramientas tranquilas y fiables que las grandes marcas dan por sentadas. Convertimos el lío diario de grupos de WhatsApp, listas en papel y hojas de cálculo dispersas en un único lugar claro donde el equipo planifica el día, el cliente ve lo que pasa y el operador tiene prueba de que el trabajo se hizo bien.',
    audienceEyebrow: 'Público',
    audienceTitle: '¿Para quién es Zapli?',
    audienceSub:
      'Tres tipos de equipos están en el centro de cada decisión de producto.',
    audiences: [
      {
        icon: 'building',
        title: 'Empresas de limpieza',
        body: 'Autónomos y equipos en crecimiento que necesitan planificar al personal, emitir facturas y demostrar calidad a sus clientes — sin pagar precios de enterprise.',
      },
      {
        icon: 'user',
        title: 'Limpiadores autónomos',
        body: 'Limpiadores en solitario que quieren un único lugar para su calendario, su cartera de clientes y las fotos que prueban un buen trabajo.',
      },
      {
        icon: 'home',
        title: 'Residencial y Airbnb',
        body: 'Propietarios y anfitriones de estancias cortas que coordinan turnovers — un traspaso claro entre huéspedes, limpiadores y el próximo check-in.',
      },
    ],
    principlesEyebrow: 'Cómo trabajamos',
    principlesTitle: 'Tres principios',
    principlesSub: 'Los valores que nos imponemos, por escrito, para que puedas exigírnoslos.',
    principles: [
      {
        icon: 'shield',
        title: 'Privacidad por defecto',
        body: 'Tu cartera de clientes, tus fotos y tus datos operativos son tuyos. Recogemos el mínimo necesario para que el producto funcione, y no los vendemos ni los compartimos.',
      },
      {
        icon: 'unlock',
        title: 'Sin permanencias',
        body: 'Cancela cuando quieras y llévate tus datos. Exportar es una función, no un favor — y no hay contratos que te castiguen por irte.',
      },
      {
        icon: 'eye',
        title: 'Transparencia total',
        body: 'Los precios son públicos. Las decisiones de roadmap se explican. Si algo falla, te enteras por nosotros primero, en lenguaje claro.',
      },
    ],
    contactEyebrow: 'Contacto',
    contactTitle: '¿Quieres hablar con nosotros?',
    contactBody:
      '¿Dudas, comentarios o simplemente curiosidad por si Zapli encaja con tu equipo? Pasa por la página de contacto — una persona real lee cada mensaje.',
    ctaPrimary: 'Empezar gratis',
    ctaSecondary: 'Ir a contacto',
  },
  pt: {
    metaTitle: 'Sobre a Zapli — Empresa',
    metaDescription:
      'A Zapli é a plataforma operacional para equipas de limpeza, limpadores independentes e anfitriões residenciais. Missão, público e como trabalhamos.',
    heroEyebrow: 'Empresa',
    heroTitle: 'Sobre a Zapli',
    heroTagline:
      'Uma forma mais calma de gerir operações de limpeza — pensada para quem faz o trabalho, não para quem olha para painéis.',
    missionEyebrow: 'Missão',
    missionTitle: 'O que fazemos',
    missionBody:
      'A Zapli dá às operações de limpeza pequenas e médias as mesmas ferramentas calmas e fiáveis que as grandes marcas tomam por garantidas. Transformamos a confusão diária de grupos de WhatsApp, listas em papel e folhas de cálculo dispersas num único sítio claro onde a equipa planeia o dia, o cliente vê o que se passa e o operador tem prova de que o trabalho foi bem feito.',
    audienceEyebrow: 'Público',
    audienceTitle: 'Para quem é a Zapli',
    audienceSub:
      'Três tipos de equipas estão no centro de cada decisão de produto que tomamos.',
    audiences: [
      {
        icon: 'building',
        title: 'Empresas de limpeza',
        body: 'Operadores independentes e equipas em crescimento que precisam de agendar pessoal, emitir faturas e provar qualidade aos clientes — sem pagar preços de enterprise.',
      },
      {
        icon: 'user',
        title: 'Limpadores independentes',
        body: 'Limpadores a solo que querem um único sítio para o seu calendário, a sua carteira de clientes e as fotos que mostram que o trabalho foi bem feito.',
      },
      {
        icon: 'home',
        title: 'Residencial e Airbnb',
        body: 'Proprietários e anfitriões de curta duração a coordenar turnovers — uma passagem clara entre hóspedes, limpadores e o próximo check-in.',
      },
    ],
    principlesEyebrow: 'Como trabalhamos',
    principlesTitle: 'Três princípios',
    principlesSub: 'Os valores que nos impomos, por escrito, para que nos possas cobrar por eles.',
    principles: [
      {
        icon: 'shield',
        title: 'Privacidade por defeito',
        body: 'A tua carteira de clientes, as tuas fotos e os teus dados operacionais são teus. Recolhemos o mínimo necessário para o produto funcionar, e não os vendemos nem partilhamos.',
      },
      {
        icon: 'unlock',
        title: 'Sem fidelizações',
        body: 'Cancela quando quiseres e leva os teus dados. Exportar é uma funcionalidade, não um favor — e não há contratos que te castiguem por sair.',
      },
      {
        icon: 'eye',
        title: 'Transparência total',
        body: 'Os preços são públicos. As decisões de roadmap são explicadas. Se algo falha, sabes por nós primeiro, em linguagem clara.',
      },
    ],
    contactEyebrow: 'Contacto',
    contactTitle: 'Queres falar connosco?',
    contactBody:
      'Dúvidas, feedback ou só curiosidade para saber se a Zapli encaixa na tua equipa? Passa pela página de contacto — uma pessoa real lê cada mensagem.',
    ctaPrimary: 'Começar grátis',
    ctaSecondary: 'Ir para contacto',
  },
};

// lucide icons picked by COPY-side string so the COPY const stays serialisable
// and JSON-shaped — keeps the same pattern other marketing COPY blocks use.
const AUDIENCE_ICONS = {
  building: Building2,
  user: UserRound,
  home: Home,
} as const;

const PRINCIPLE_ICONS = {
  shield: ShieldCheck,
  unlock: Unlock,
  eye: Eye,
} as const;

export async function generateMetadata() {
  const c = COPY[await getLocale()];
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function CompanyPage() {
  const locale = await getLocale();
  const c = COPY[locale];
  const privacyHref = `/${locale}/privacy`;
  const termsHref = `/${locale}/terms`;
  const securityHref = '/security';

  return (
    <main className="relative bg-white text-[#0A0D18]">
      {/* HERO ----------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-slate-100">
        {/* Sparse teal glow — single dot in the corner, never a flood */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-[#00D8C7]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl px-6 pt-28 pb-20 sm:pt-32 sm:pb-24">
          <Eyebrow>{c.heroEyebrow}</Eyebrow>
          <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-[#0A0D18] sm:text-5xl">
            {c.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {c.heroTagline}
          </p>
        </div>
      </section>

      {/* MISSION -------------------------------------------------------- */}
      <section className="border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
          <Eyebrow>{c.missionEyebrow}</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[#0A0D18] sm:text-4xl">
            {c.missionTitle}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
            {c.missionBody}
          </p>
        </div>
      </section>

      {/* AUDIENCE ------------------------------------------------------- */}
      <section className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow>{c.audienceEyebrow}</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[#0A0D18] sm:text-4xl">
              {c.audienceTitle}
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">{c.audienceSub}</p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.audiences.map((a) => {
              const Icon = AUDIENCE_ICONS[a.icon];
              return (
                <article
                  key={a.title}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(10,13,24,0.04)] transition hover:border-slate-300 hover:shadow-[0_8px_24px_-12px_rgba(10,13,24,0.12)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A0D18] text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display mt-5 text-lg font-semibold text-[#0A0D18]">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRINCIPLES ----------------------------------------------------- */}
      <section className="border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow>{c.principlesEyebrow}</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[#0A0D18] sm:text-4xl">
              {c.principlesTitle}
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">{c.principlesSub}</p>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {c.principles.map((p) => {
              const Icon = PRINCIPLE_ICONS[p.icon];
              return (
                <article key={p.title} className="relative">
                  {/* Tiny teal dot — the only place teal lives on this page besides the hero glow */}
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[#00D8C7]"
                    />
                    <Icon className="h-5 w-5 text-[#0A0D18]" aria-hidden="true" />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-[#0A0D18]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT + CTA -------------------------------------------------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <Sparkles className="h-3 w-3 text-[#00D8C7]" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700">
              {c.contactEyebrow}
            </span>
          </div>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[#0A0D18] sm:text-4xl">
            {c.contactTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            {c.contactBody}
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {/* Primary midnight pill — matches marketing CTAs on white surfaces */}
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-[#0A0D18] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(10,13,24,0.4)] transition hover:bg-[#1a1f2e]"
            >
              {c.ctaPrimary}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-[#0A0D18]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {c.ctaSecondary}
            </Link>
          </div>

          {/* Legal short-links — required by brief, also mirrored in <FooterSection /> */}
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 pt-6 text-xs text-slate-500">
            <Link href={privacyHref} className="transition hover:text-[#0A0D18]">
              {locale === 'es' ? 'Privacidad' : locale === 'pt' ? 'Privacidade' : 'Privacy'}
            </Link>
            <Link href={termsHref} className="transition hover:text-[#0A0D18]">
              {locale === 'es' ? 'Términos' : locale === 'pt' ? 'Termos' : 'Terms'}
            </Link>
            <Link href={securityHref} className="transition hover:text-[#0A0D18]">
              {locale === 'es' || locale === 'pt' ? 'Seguridad' : 'Security'}
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

/**
 * Small uppercase eyebrow chip used at the top of each section. Pulled out
 * because it appears five times on this page and the spacing/tracking values
 * are easy to drift on if duplicated inline.
 */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-[#00D8C7]"
      />
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {children}
      </span>
    </div>
  );
}

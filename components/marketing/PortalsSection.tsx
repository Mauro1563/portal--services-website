import { Check, Building2, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { getLocale, type Locale } from "@/lib/i18n";

/**
 * Per-locale copy. Kept inline here so the marketing landing stays
 * self-contained and we don't have to seed messages JSON for every tweak.
 * Add a key here when adding new copy; the type catches missing locales.
 */
type PortalCopy = {
  badge: string;
  headline: string;
  description: string;
  features: string[];
  cta: string;
};

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    portals: {
      owner: PortalCopy;
      cleaner: PortalCopy;
      client: PortalCopy;
    };
  }
> = {
  es: {
    eyebrow: "Una plataforma, tres experiencias",
    title: "3 portales, una plataforma",
    subtitle:
      "Conectamos a propietarios, profesionales de limpieza y clientes en una única solución pensada para cada rol.",
    portals: {
      owner: {
        badge: "OWNER",
        headline: "Control total de tu negocio",
        description:
          "Visibilidad en tiempo real de ingresos, reservas y equipos desde un solo panel corporativo.",
        features: [
          "Dashboard de ingresos con métricas en vivo",
          "Gestión de reservas, alertas y operativos",
          "Informes financieros listos para tu gestoría",
        ],
        cta: "ver más",
      },
      cleaner: {
        badge: "CLEANER",
        headline: "Trabaja con eficiencia móvil",
        description:
          "Tu agenda diaria, ganancias y rutas optimizadas en una app pensada para el día a día.",
        features: [
          "Agenda con horarios y estado “En curso”",
          "Seguimiento de ganancias en tiempo real",
          "Check-in rápido y notas por servicio",
        ],
        cta: "ver más",
      },
      client: {
        badge: "CLIENT",
        headline: "Reserva en segundos, vive sin estrés",
        description:
          "Un marketplace amable para encontrar el servicio perfecto y disfrutar de promos exclusivas.",
        features: [
          "Búsqueda y filtros inteligentes",
          "Promos EcoGreeting y club de fidelidad",
          "Pagos seguros y seguimiento del servicio",
        ],
        cta: "ver más",
      },
    },
  },
  en: {
    eyebrow: "One platform, three experiences",
    title: "3 portals, one platform",
    subtitle:
      "We connect owners, cleaning professionals and clients in a single solution tailored to each role.",
    portals: {
      owner: {
        badge: "OWNER",
        headline: "Full control of your business",
        description:
          "Real-time visibility into revenue, bookings and teams from a single corporate dashboard.",
        features: [
          "Revenue dashboard with live metrics",
          "Manage bookings, alerts and operatives",
          "Financial reports ready for your accountant",
        ],
        cta: "see more",
      },
      cleaner: {
        badge: "CLEANER",
        headline: "Work with mobile efficiency",
        description:
          "Your daily schedule, earnings and optimised routes in an app built for day-to-day work.",
        features: [
          "Schedule with timings and “In progress” status",
          "Live earnings tracking",
          "Quick check-in and per-service notes",
        ],
        cta: "see more",
      },
      client: {
        badge: "CLIENT",
        headline: "Book in seconds, live stress-free",
        description:
          "A friendly marketplace to find the perfect service and enjoy exclusive promos.",
        features: [
          "Smart search and filters",
          "EcoGreeting promos and loyalty club",
          "Secure payments and service tracking",
        ],
        cta: "see more",
      },
    },
  },
  pt: {
    eyebrow: "Uma plataforma, três experiências",
    title: "3 portais, uma plataforma",
    subtitle:
      "Conectamos proprietários, profissionais de limpeza e clientes numa solução única pensada para cada papel.",
    portals: {
      owner: {
        badge: "OWNER",
        headline: "Controlo total do seu negócio",
        description:
          "Visibilidade em tempo real de receitas, reservas e equipas a partir de um único painel corporativo.",
        features: [
          "Painel de receitas com métricas em direto",
          "Gestão de reservas, alertas e operários",
          "Relatórios financeiros prontos para a contabilidade",
        ],
        cta: "ver mais",
      },
      cleaner: {
        badge: "CLEANER",
        headline: "Trabalhe com eficiência móvel",
        description:
          "A sua agenda diária, ganhos e rotas otimizadas numa app pensada para o dia a dia.",
        features: [
          "Agenda com horários e estado “Em curso”",
          "Acompanhamento de ganhos em tempo real",
          "Check-in rápido e notas por serviço",
        ],
        cta: "ver mais",
      },
      client: {
        badge: "CLIENT",
        headline: "Reserve em segundos, viva sem stress",
        description:
          "Um marketplace amigável para encontrar o serviço perfeito e aproveitar promoções exclusivas.",
        features: [
          "Pesquisa e filtros inteligentes",
          "Promoções EcoGreeting e clube de fidelidade",
          "Pagamentos seguros e acompanhamento do serviço",
        ],
        cta: "ver mais",
      },
    },
  },
};

type PortalStyle = {
  key: "owner" | "cleaner" | "client";
  href: string;
  badgeClass: string;
  headerGradient: string;
  iconTileClass: string;
  iconRing: string;
  Icon: LucideIcon;
  linkClass: string;
};

// All three portal cards now follow the same professional Zapli palette:
// midnight header bars, slate icon tiles with a sparing teal ring micro-accent,
// and slate-900 link text with a teal hover state. The bright teal flood is
// reserved for the badge chip on the dark header bar (rule 2: dark surface).
const PORTAL_STYLES: readonly PortalStyle[] = [
  {
    key: "owner",
    href: "/owner/preview",
    badgeClass: "bg-[#00D8C7] text-[#0A0D18]",
    headerGradient: "bg-[#0A0D18]",
    iconTileClass: "bg-slate-900",
    iconRing: "ring-1 ring-[#00D8C7]/30",
    Icon: Building2,
    linkClass: "text-slate-900 hover:text-[#00D8C7]",
  },
  {
    key: "cleaner",
    href: "/operative/preview",
    badgeClass: "bg-[#00D8C7] text-[#0A0D18]",
    headerGradient: "bg-[#0A0D18]",
    iconTileClass: "bg-slate-900",
    iconRing: "ring-1 ring-[#00D8C7]/30",
    Icon: Users,
    linkClass: "text-slate-900 hover:text-[#00D8C7]",
  },
  {
    key: "client",
    href: "/client/preview",
    badgeClass: "bg-[#00D8C7] text-[#0A0D18]",
    headerGradient: "bg-[#0A0D18]",
    iconTileClass: "bg-slate-900",
    iconRing: "ring-1 ring-[#00D8C7]/30",
    Icon: Sparkles,
    linkClass: "text-slate-900 hover:text-[#00D8C7]",
  },
];

export default async function PortalsSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section className="bg-white py-12 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow chip: slate-100 surface with slate-700 text and a tiny
              teal dot as the only accent (rule 5). */}
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D8C7]" aria-hidden="true" />
            {t.eyebrow}
          </span>
          {/* Headline stays solid slate-900 — no teal fill, no gradient
              (rule 4). */}
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">
          {PORTAL_STYLES.map((style) => {
            const { Icon } = style;
            const portal = t.portals[style.key];
            return (
              <article
                key={style.key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:shadow-lg"
              >
                {/* Thin midnight header bar with a single teal hairline
                    underneath as the micro-accent (rule 7). */}
                <div className={`h-2 w-full ${style.headerGradient}`} />
                <div className="h-px w-full bg-[#00D8C7]/40" />

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${style.iconTileClass} ${style.iconRing} shadow-sm`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    {/* Badge chip lives on the white card surface, so it
                        uses slate-100/slate-900 with a teal dot rather than
                        a teal flood (rule 5 applied at card level). */}
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-900"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00D8C7]" aria-hidden="true" />
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold leading-tight text-slate-900 sm:mt-6 sm:text-2xl">
                    {portal.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-3">
                    {portal.description}
                  </p>

                  <ul className="mt-4 space-y-3 sm:mt-6">
                    {portal.features.map((feature, idx) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-3 text-sm text-slate-700 ${idx === 2 ? "hidden sm:flex" : ""}`}
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-900/5">
                          <Check className="h-3.5 w-3.5 text-slate-900" />
                        </span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-3 sm:mt-8 sm:pt-4">
                    {/* "see more" link reads as a clean text link in
                        slate-900, with teal only on hover (rule 7). */}
                    <Link
                      href={style.href}
                      className={`inline-flex items-center gap-1 text-sm font-semibold transition ${style.linkClass}`}
                    >
                      {portal.cta} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

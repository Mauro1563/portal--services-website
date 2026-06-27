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
  iconTileGradient: string;
  iconRing: string;
  Icon: LucideIcon;
  linkClass: string;
};

const PORTAL_STYLES: readonly PortalStyle[] = [
  {
    key: "owner",
    href: "/owner/preview",
    badgeClass: "bg-slate-900 text-cyan-300",
    headerGradient: "bg-gradient-to-r from-slate-900 via-slate-900 to-blue-900",
    iconTileGradient: "bg-gradient-to-br from-blue-600 to-blue-700",
    iconRing: "ring-4 ring-blue-100",
    Icon: Building2,
    linkClass: "text-blue-700 hover:text-blue-800",
  },
  {
    key: "cleaner",
    href: "/operative/preview",
    badgeClass: "bg-slate-900 text-cyan-300",
    headerGradient: "bg-gradient-to-r from-slate-900 via-slate-900 to-blue-900",
    iconTileGradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    iconRing: "ring-4 ring-emerald-100",
    Icon: Users,
    linkClass: "text-emerald-700 hover:text-emerald-800",
  },
  {
    key: "client",
    href: "/client/preview",
    badgeClass: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    headerGradient: "bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50",
    iconTileGradient: "bg-gradient-to-br from-blue-600 to-blue-700",
    iconRing: "ring-4 ring-blue-100",
    Icon: Sparkles,
    linkClass: "text-blue-700 hover:text-blue-800",
  },
];

export default async function PortalsSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
            {t.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {PORTAL_STYLES.map((style) => {
            const { Icon } = style;
            const portal = t.portals[style.key];
            return (
              <article
                key={style.key}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-lg"
              >
                <div className={`h-2 w-full ${style.headerGradient}`} />

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${style.iconTileGradient} ${style.iconRing} shadow-sm`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${style.badgeClass}`}
                    >
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-bold leading-tight text-slate-900">
                    {portal.headline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {portal.description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {portal.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-700"
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-900/5">
                          <Check className="h-3.5 w-3.5 text-slate-900" />
                        </span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-4">
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

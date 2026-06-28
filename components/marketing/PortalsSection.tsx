import { Building2, Sparkles, Users } from "lucide-react";
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
    eyebrow: "una plataforma, tres experiencias",
    title: "Tres portales, una plataforma",
    subtitle:
      "Conectamos a propietarios, profesionales de limpieza y clientes en una única solución pensada para cada rol.",
    portals: {
      owner: {
        badge: "owner",
        headline: "Control total de tu negocio",
        description:
          "Visibilidad en tiempo real de ingresos, reservas y equipos desde un solo panel corporativo.",
        features: [
          "Dashboard de ingresos con métricas en vivo",
          "Gestión de reservas, alertas y operativos",
          "Informes financieros listos para tu gestoría",
        ],
        cta: "ver el panel",
      },
      cleaner: {
        badge: "cleaner",
        headline: "Trabaja con eficiencia móvil",
        description:
          "Tu agenda diaria, ganancias y rutas optimizadas en una app pensada para el día a día.",
        features: [
          "Agenda con horarios y estado “En curso”",
          "Seguimiento de ganancias en tiempo real",
          "Check-in rápido y notas por servicio",
        ],
        cta: "ver la app",
      },
      client: {
        badge: "client",
        headline: "Reserva en segundos, vive sin estrés",
        description:
          "Un marketplace amable para encontrar el servicio perfecto y disfrutar de promos exclusivas.",
        features: [
          "Búsqueda y filtros inteligentes",
          "Promos EcoGreeting y club de fidelidad",
          "Pagos seguros y seguimiento del servicio",
        ],
        cta: "ver el portal",
      },
    },
  },
  en: {
    eyebrow: "one platform, three experiences",
    title: "Three portals, one platform",
    subtitle:
      "We connect owners, cleaning professionals and clients in a single solution tailored to each role.",
    portals: {
      owner: {
        badge: "owner",
        headline: "Full control of your business",
        description:
          "Real-time visibility into revenue, bookings and teams from a single corporate dashboard.",
        features: [
          "Revenue dashboard with live metrics",
          "Manage bookings, alerts and operatives",
          "Financial reports ready for your accountant",
        ],
        cta: "open the dashboard",
      },
      cleaner: {
        badge: "cleaner",
        headline: "Work with mobile efficiency",
        description:
          "Your daily schedule, earnings and optimised routes in an app built for day-to-day work.",
        features: [
          "Schedule with timings and “In progress” status",
          "Live earnings tracking",
          "Quick check-in and per-service notes",
        ],
        cta: "open the app",
      },
      client: {
        badge: "client",
        headline: "Book in seconds, live stress-free",
        description:
          "A friendly marketplace to find the perfect service and enjoy exclusive promos.",
        features: [
          "Smart search and filters",
          "EcoGreeting promos and loyalty club",
          "Secure payments and service tracking",
        ],
        cta: "open the portal",
      },
    },
  },
  pt: {
    eyebrow: "uma plataforma, três experiências",
    title: "Três portais, uma plataforma",
    subtitle:
      "Conectamos proprietários, profissionais de limpeza e clientes numa solução única pensada para cada papel.",
    portals: {
      owner: {
        badge: "owner",
        headline: "Controlo total do seu negócio",
        description:
          "Visibilidade em tempo real de receitas, reservas e equipas a partir de um único painel corporativo.",
        features: [
          "Painel de receitas com métricas em direto",
          "Gestão de reservas, alertas e operários",
          "Relatórios financeiros prontos para a contabilidade",
        ],
        cta: "abrir o painel",
      },
      cleaner: {
        badge: "cleaner",
        headline: "Trabalhe com eficiência móvel",
        description:
          "A sua agenda diária, ganhos e rotas otimizadas numa app pensada para o dia a dia.",
        features: [
          "Agenda com horários e estado “Em curso”",
          "Acompanhamento de ganhos em tempo real",
          "Check-in rápido e notas por serviço",
        ],
        cta: "abrir a app",
      },
      client: {
        badge: "client",
        headline: "Reserve em segundos, viva sem stress",
        description:
          "Um marketplace amigável para encontrar o serviço perfeito e aproveitar promoções exclusivas.",
        features: [
          "Pesquisa e filtros inteligentes",
          "Promoções EcoGreeting e clube de fidelidade",
          "Pagamentos seguros e acompanhamento do serviço",
        ],
        cta: "abrir o portal",
      },
    },
  },
};

// Per-portal secondary tints, applied as a single "tape" stripe at the
// top edge of each card. Mandarin remains the only action color, the
// secondary just identifies which portal you're looking at.
type PortalStyle = {
  key: "owner" | "cleaner" | "client";
  href: string;
  secondary: string;
  Icon: LucideIcon;
};

const PORTAL_STYLES: readonly PortalStyle[] = [
  { key: "owner", href: "/owner/preview", secondary: "#1B2D6B", Icon: Building2 },
  { key: "cleaner", href: "/operative/preview", secondary: "#3F5B3A", Icon: Users },
  { key: "client", href: "/client/preview", secondary: "#E8C8C0", Icon: Sparkles },
];

const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export default async function PortalsSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section className="bg-[#F4EFE6] ps-paper-grain py-24 md:py-40">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="mx-auto max-w-3xl">
          {/* mono micro-line replaces the eyebrow pill */}
          <p className="text-[12px] text-[#141414]" style={{ fontFamily: MONO }}>
            <span
              className="pb-1"
              style={{
                backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 1px',
                backgroundPosition: '0 calc(100% + 4px)',
              }}
            >
              {t.eyebrow}
            </span>
          </p>
          <h2
            className="mt-6 text-[32px] leading-[0.95] tracking-[-0.03em] text-[#141414] md:text-[64px]"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            {t.title}
          </h2>
          <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.45] text-[#54524D] md:text-[22px]">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-3 md:gap-8">
          {PORTAL_STYLES.map((style) => {
            const { Icon } = style;
            const portal = t.portals[style.key];
            return (
              <article
                key={style.key}
                className="group relative flex flex-col rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-10 md:p-14"
              >
                {/* Per-portal "tape" — a single 3px secondary stripe at the top.
                    Mandarin remains the only action color; this is identity, not chrome. */}
                <span
                  aria-hidden
                  className="absolute left-0 right-0 top-0 h-[3px] rounded-t-[12px]"
                  style={{ backgroundColor: style.secondary }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#141414]" style={{ fontFamily: MONO }}>
                    <span
                      className="pb-1"
                      style={{
                        backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 1px',
                        backgroundPosition: '0 calc(100% + 4px)',
                      }}
                    >
                      {portal.badge}
                    </span>
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#141414]/5 text-[#141414]">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>

                <h3
                  className="mt-10 text-[28px] leading-[1.02] tracking-[-0.02em] text-[#141414] md:text-[36px]"
                  style={{ fontFamily: SERIF, fontWeight: 400 }}
                >
                  {portal.headline}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.55] text-[#54524D] md:text-[16px]">
                  {portal.description}
                </p>

                <ul className="mt-8 space-y-3">
                  {portal.features.map((feature, idx) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-[14px] leading-[1.5] text-[#141414] ${idx === 2 ? 'hidden sm:flex' : ''}`}
                    >
                      <span
                        aria-hidden
                        className="mt-[8px] inline-block h-[3px] w-[10px] shrink-0 bg-[#FF5B1F]"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-6 border-t border-[#1414141A]">
                  <Link
                    href={style.href}
                    className="inline-flex items-center gap-1.5 text-[13px] text-[#141414]"
                    style={{ fontFamily: MONO }}
                  >
                    <span className="ps-link">{portal.cta}</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Check, Building2, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Portal = {
  badge: string;
  badgeClass: string;
  headerGradient: string;
  iconTileGradient: string;
  iconRing: string;
  Icon: LucideIcon;
  headline: string;
  description: string;
  features: readonly string[];
  linkClass: string;
};

const PORTALS: readonly Portal[] = [
  {
    badge: "OWNER",
    badgeClass: "bg-slate-900 text-cyan-300",
    headerGradient: "bg-gradient-to-r from-slate-900 via-slate-900 to-blue-900",
    iconTileGradient: "bg-gradient-to-br from-blue-600 to-blue-700",
    iconRing: "ring-4 ring-blue-100",
    Icon: Building2,
    headline: "Control total de tu negocio",
    description:
      "Visibilidad en tiempo real de ingresos, reservas y equipos desde un solo panel corporativo.",
    features: [
      "Dashboard de ingresos con métricas en vivo",
      "Gestión de reservas, alertas y operativos",
      "Informes financieros listos para tu gestoría",
    ],
    linkClass: "text-blue-700 hover:text-blue-800",
  },
  {
    badge: "CLEANER",
    badgeClass: "bg-slate-900 text-cyan-300",
    headerGradient: "bg-gradient-to-r from-slate-900 via-slate-900 to-blue-900",
    iconTileGradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    iconRing: "ring-4 ring-emerald-100",
    Icon: Users,
    headline: "Trabaja con eficiencia móvil",
    description:
      "Tu agenda diaria, ganancias y rutas optimizadas en una app pensada para el día a día.",
    features: [
      "Agenda con horarios y estado “En curso”",
      "Seguimiento de ganancias en tiempo real",
      "Check-in rápido y notas por servicio",
    ],
    linkClass: "text-emerald-700 hover:text-emerald-800",
  },
  {
    badge: "CLIENT",
    badgeClass: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    headerGradient: "bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50",
    iconTileGradient: "bg-gradient-to-br from-blue-600 to-blue-700",
    iconRing: "ring-4 ring-blue-100",
    Icon: Sparkles,
    headline: "Reserva en segundos, vive sin estrés",
    description:
      "Un marketplace amable para encontrar el servicio perfecto y disfrutar de promos exclusivas.",
    features: [
      "Búsqueda y filtros inteligentes",
      "Promos EcoGreeting y club de fidelidad",
      "Pagos seguros y seguimiento del servicio",
    ],
    linkClass: "text-blue-700 hover:text-blue-800",
  },
];

export default function PortalsSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
            Una plataforma, tres experiencias
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            3 portales, una plataforma
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Conectamos a propietarios, profesionales de limpieza y clientes en
            una única solución pensada para cada rol.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {PORTALS.map((portal) => {
            const { Icon } = portal;
            return (
              <article
                key={portal.badge}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-lg"
              >
                <div className={`h-2 w-full ${portal.headerGradient}`} />

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${portal.iconTileGradient} ${portal.iconRing} shadow-sm`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${portal.badgeClass}`}
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
                    <a
                      href="#"
                      className={`inline-flex items-center gap-1 text-sm font-semibold transition ${portal.linkClass}`}
                    >
                      ver más <span aria-hidden="true">→</span>
                    </a>
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

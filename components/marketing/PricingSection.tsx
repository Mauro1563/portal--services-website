import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  price: string;
  priceSuffix: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "STARTER",
    price: "£0",
    priceSuffix: "14 días",
    description: "Prueba todas las funciones esenciales sin compromiso.",
    features: [
      "Hasta 50 reservas al mes",
      "1 usuario operativo",
      "Panel de gestión básico",
      "Notificaciones por email",
      "Soporte por correo",
    ],
    cta: "Empezar gratis",
  },
  {
    id: "pro",
    name: "PRO",
    price: "£39",
    priceSuffix: "/mes",
    description: "Para negocios en crecimiento que quieren escalar.",
    features: [
      "Reservas ilimitadas",
      "Hasta 10 usuarios operativos",
      "Pagos online y facturación",
      "Recordatorios automáticos",
      "Informes y analíticas avanzadas",
      "Soporte prioritario",
    ],
    cta: "Probar PRO",
    highlighted: true,
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "£99",
    priceSuffix: "/mes",
    description: "Para equipos grandes con necesidades avanzadas.",
    features: [
      "Todo lo de PRO",
      "Usuarios ilimitados",
      "Multi-sucursal y multi-marca",
      "Integraciones a medida (API)",
      "Account manager dedicado",
      "SLA 99,9% y soporte 24/7",
    ],
    cta: "Hablar con ventas",
  },
];

export default function PricingSection() {
  return (
    <section
      id="precios"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 py-20 sm:py-28"
    >
      {/* decorative blurs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-80 w-[32rem] rounded-full bg-blue-200/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
            Precios
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Planes pensados para tu negocio
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Elige el plan que mejor se adapta a tu tamaño. Sin permanencia, cambia o cancela cuando quieras.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:gap-8 md:grid-cols-3 md:items-stretch">
          {plans.map((plan) => {
            const isHighlighted = plan.highlighted === true;
            return (
              <div
                key={plan.id}
                className={
                  isHighlighted
                    ? "relative flex flex-col rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-blue-900 p-8 text-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.45)] ring-4 ring-blue-500/30 md:-mt-4 md:mb-4 md:scale-[1.04]"
                    : "relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                }
              >
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-900 shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Más popular
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <p
                    className={
                      isHighlighted
                        ? "text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300"
                        : "text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700"
                    }
                  >
                    {plan.name}
                  </p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span
                      className={
                        isHighlighted
                          ? "font-display text-5xl font-bold tabular-nums text-white sm:text-6xl"
                          : "font-display text-5xl font-bold tabular-nums text-slate-900 sm:text-6xl"
                      }
                    >
                      {plan.price}
                    </span>
                    <span
                      className={
                        isHighlighted
                          ? "text-sm font-medium text-white/70"
                          : "text-sm font-medium text-slate-500"
                      }
                    >
                      {plan.priceSuffix}
                    </span>
                  </div>

                  <p
                    className={
                      isHighlighted
                        ? "mt-3 text-sm text-white/80"
                        : "mt-3 text-sm text-slate-600"
                    }
                  >
                    {plan.description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className={
                            isHighlighted
                              ? "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-cyan-300/20 ring-2 ring-cyan-300/40"
                              : "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-50 ring-2 ring-emerald-100"
                          }
                        >
                          <Check
                            className={
                              isHighlighted
                                ? "h-3.5 w-3.5 text-cyan-300"
                                : "h-3.5 w-3.5 text-emerald-600"
                            }
                          />
                        </span>
                        <span
                          className={
                            isHighlighted
                              ? "text-sm text-white/90"
                              : "text-sm text-slate-700"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className={
                    isHighlighted
                      ? "mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:from-cyan-200 hover:to-blue-400"
                      : "mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-blue-500 hover:to-blue-600"
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          Todos los precios en libras esterlinas (GBP), IVA no incluido. Cancela cuando quieras.
        </p>
      </div>
    </section>
  );
}

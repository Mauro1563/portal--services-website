import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { getLocale, type Locale } from "@/lib/i18n";

/**
 * Per-locale copy. Kept inline here so the marketing landing stays
 * self-contained and we don't have to seed messages JSON for every tweak.
 * Pricing is in EUR (€) across all locales — Portal Home is European.
 */
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

type PricingCopy = {
  eyebrow: string;
  heading: string;
  sub: string;
  mostPopular: string;
  footnote: string;
  plans: Plan[];
};

const COPY: Record<Locale, PricingCopy> = {
  es: {
    eyebrow: "Precios",
    heading: "Planes pensados para tu negocio",
    sub: "Elige el plan que mejor se adapta a tu tamaño. Sin permanencia, cambia o cancela cuando quieras.",
    mostPopular: "Más popular",
    footnote:
      "Todos los precios en euros (EUR), IVA no incluido. Cancela cuando quieras.",
    plans: [
      {
        id: "starter",
        name: "STARTER",
        price: "€0",
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
        price: "€39",
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
        price: "€99",
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
    ],
  },
  en: {
    eyebrow: "Pricing",
    heading: "Plans built for your business",
    sub: "Pick the plan that fits your size. No lock-in — change or cancel anytime.",
    mostPopular: "Most popular",
    footnote:
      "All prices in euros (EUR), VAT not included. Cancel anytime.",
    plans: [
      {
        id: "starter",
        name: "STARTER",
        price: "€0",
        priceSuffix: "14 days",
        description: "Try every essential feature with no commitment.",
        features: [
          "Up to 50 bookings per month",
          "1 operative user",
          "Basic management dashboard",
          "Email notifications",
          "Email support",
        ],
        cta: "Start free",
      },
      {
        id: "pro",
        name: "PRO",
        price: "€39",
        priceSuffix: "/month",
        description: "For growing businesses ready to scale.",
        features: [
          "Unlimited bookings",
          "Up to 10 operative users",
          "Online payments and invoicing",
          "Automated reminders",
          "Advanced reports and analytics",
          "Priority support",
        ],
        cta: "Try PRO",
        highlighted: true,
      },
      {
        id: "premium",
        name: "PREMIUM",
        price: "€99",
        priceSuffix: "/month",
        description: "For large teams with advanced needs.",
        features: [
          "Everything in PRO",
          "Unlimited users",
          "Multi-branch and multi-brand",
          "Custom integrations (API)",
          "Dedicated account manager",
          "99.9% SLA and 24/7 support",
        ],
        cta: "Talk to sales",
      },
    ],
  },
  pt: {
    eyebrow: "Preços",
    heading: "Planos pensados para o seu negócio",
    sub: "Escolha o plano que melhor se adapta ao seu tamanho. Sem fidelização, mude ou cancele quando quiser.",
    mostPopular: "Mais popular",
    footnote:
      "Todos os preços em euros (EUR), IVA não incluído. Cancele quando quiser.",
    plans: [
      {
        id: "starter",
        name: "STARTER",
        price: "€0",
        priceSuffix: "14 dias",
        description: "Experimente todas as funções essenciais sem compromisso.",
        features: [
          "Até 50 reservas por mês",
          "1 utilizador operacional",
          "Painel de gestão básico",
          "Notificações por email",
          "Suporte por email",
        ],
        cta: "Começar grátis",
      },
      {
        id: "pro",
        name: "PRO",
        price: "€39",
        priceSuffix: "/mês",
        description: "Para negócios em crescimento que querem escalar.",
        features: [
          "Reservas ilimitadas",
          "Até 10 utilizadores operacionais",
          "Pagamentos online e faturação",
          "Lembretes automáticos",
          "Relatórios e análises avançadas",
          "Suporte prioritário",
        ],
        cta: "Experimentar PRO",
        highlighted: true,
      },
      {
        id: "premium",
        name: "PREMIUM",
        price: "€99",
        priceSuffix: "/mês",
        description: "Para equipas grandes com necessidades avançadas.",
        features: [
          "Tudo o do PRO",
          "Utilizadores ilimitados",
          "Multi-sucursal e multi-marca",
          "Integrações à medida (API)",
          "Account manager dedicado",
          "SLA 99,9% e suporte 24/7",
        ],
        cta: "Falar com vendas",
      },
    ],
  },
};

export default async function PricingSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section
      id="precios"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 py-12 sm:py-28"
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
            {t.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {t.heading}
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {t.sub}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 md:grid-cols-3 md:items-stretch">
          {t.plans.map((plan) => {
            const isHighlighted = plan.highlighted === true;
            return (
              <div
                key={plan.id}
                className={
                  isHighlighted
                    ? "relative flex flex-col rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-blue-900 p-6 text-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.45)] ring-4 ring-blue-500/30 sm:p-8 md:-mt-4 md:mb-4 md:scale-[1.04]"
                    : "relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8"
                }
              >
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-900 shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      {t.mostPopular}
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

                  <div className="mt-3 flex items-baseline gap-2 sm:mt-4">
                    <span
                      className={
                        isHighlighted
                          ? "font-display text-4xl font-bold tabular-nums text-white sm:text-5xl md:text-6xl"
                          : "font-display text-4xl font-bold tabular-nums text-slate-900 sm:text-5xl md:text-6xl"
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

                  <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={feature}
                        className={
                          idx > 3
                            ? "hidden items-start gap-3 sm:flex"
                            : "flex items-start gap-3"
                        }
                      >
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
                      ? "mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:from-cyan-200 hover:to-blue-400 sm:mt-8"
                      : "mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-blue-500 hover:to-blue-600 sm:mt-8"
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 sm:mt-10">
          {t.footnote}
        </p>
      </div>
    </section>
  );
}

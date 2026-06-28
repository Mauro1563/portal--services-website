import Link from "next/link";
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
    eyebrow: "precios",
    heading: "Planes pensados para tu negocio",
    sub: "Elige el plan que mejor se adapta a tu tamaño. Sin permanencia, cambia o cancela cuando quieras.",
    mostPopular: "más popular",
    footnote:
      "Todos los precios en euros (EUR), IVA no incluido. Cancela cuando quieras.",
    plans: [
      {
        id: "starter",
        name: "starter",
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
        name: "pro",
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
        name: "premium",
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
    eyebrow: "pricing",
    heading: "Plans built for your business",
    sub: "Pick the plan that fits your size. No lock-in — change or cancel anytime.",
    mostPopular: "most popular",
    footnote:
      "All prices in euros (EUR), VAT not included. Cancel anytime.",
    plans: [
      {
        id: "starter",
        name: "starter",
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
        name: "pro",
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
        name: "premium",
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
    eyebrow: "preços",
    heading: "Planos pensados para o seu negócio",
    sub: "Escolha o plano que melhor se adapta ao seu tamanho. Sem fidelização, mude ou cancele quando quiser.",
    mostPopular: "mais popular",
    footnote:
      "Todos os preços em euros (EUR), IVA não incluído. Cancele quando quiser.",
    plans: [
      {
        id: "starter",
        name: "starter",
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
        name: "pro",
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
        name: "premium",
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

const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export default async function PricingSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section
      id="precios"
      className="relative bg-[#F4EFE6] ps-paper-grain py-24 md:py-40"
    >
      <div className="relative mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="mx-auto max-w-2xl">
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
            {t.heading}
          </h2>
          <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.45] text-[#54524D] md:text-[22px]">
            {t.sub}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:mt-24 md:gap-8 md:grid-cols-3 md:items-stretch">
          {t.plans.map((plan) => {
            const isHighlighted = plan.highlighted === true;
            // Three card variants from the brief:
            //  - standard: clay on paper
            //  - highlight: ink (used here for PRO — "one important card")
            const cardClass = isHighlighted
              ? "relative flex flex-col rounded-[12px] bg-[#141414] p-10 text-[#F4EFE6] md:p-14"
              : "relative flex flex-col rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-10 text-[#141414] md:p-14";

            const metaColor = isHighlighted ? 'text-[#F4EFE6]/65' : 'text-[#54524D]';
            const bulletBg = '#FF5B1F';

            return (
              <div key={plan.id} className={cardClass}>
                {isHighlighted && (
                  <div className="absolute -top-3 left-10">
                    <span
                      className="inline-flex items-center rounded-full bg-[#FF5B1F] px-3 py-1 text-[12px] text-[#1A0A04]"
                      style={{ fontFamily: MONO }}
                    >
                      {t.mostPopular}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <p
                    className={`text-[12px] ${isHighlighted ? 'text-[#F4EFE6]/65' : 'text-[#141414]'}`}
                    style={{ fontFamily: MONO }}
                  >
                    <span
                      className="pb-1"
                      style={{
                        backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 1px',
                        backgroundPosition: '0 calc(100% + 4px)',
                      }}
                    >
                      {plan.name}
                    </span>
                  </p>

                  <div className="mt-6 flex items-baseline gap-2 md:mt-8">
                    <span
                      className={`text-[64px] leading-[0.9] tabular-nums tracking-[-0.03em] md:text-[88px] ${isHighlighted ? 'text-[#F4EFE6]' : 'text-[#141414]'}`}
                      style={{ fontFamily: SERIF, fontWeight: 400 }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-[14px] ${metaColor}`}
                      style={{ fontFamily: MONO }}
                    >
                      {plan.priceSuffix}
                    </span>
                  </div>

                  <p className={`mt-4 text-[15px] leading-[1.55] ${metaColor}`}>
                    {plan.description}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={feature}
                        className={`${idx > 3 ? 'hidden items-start gap-3 md:flex' : 'flex items-start gap-3'} text-[14px] leading-[1.5] ${isHighlighted ? 'text-[#F4EFE6]' : 'text-[#141414]'}`}
                      >
                        <span
                          aria-hidden
                          className="mt-[8px] inline-block h-[3px] w-[10px] shrink-0"
                          style={{ backgroundColor: bulletBg }}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className={
                    isHighlighted
                      ? "mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#FF5B1F] px-6 py-3.5 text-sm font-semibold text-[#1A0A04] transition-colors hover:bg-[#E84D14]"
                      : "mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#141414] px-6 py-3.5 text-sm font-semibold text-[#F4EFE6] transition-colors hover:bg-[#000]"
                  }
                  style={{ transitionDuration: '160ms' }}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p
          className="mt-12 text-[12px] text-[#54524D] md:mt-16"
          style={{ fontFamily: MONO }}
        >
          {t.footnote}
        </p>
      </div>
    </section>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lang, t } from '@/lib/i18n';

export default function PricingPage() {
  const [lang, setLang] = useState<Lang>('en');
  const tr = t(lang).pricing;

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{tr.title}</h1>
            <p className="text-white/40 text-lg">{tr.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tr.plans.map((plan: any) => (
              <div key={plan.name}
                className={`relative p-8 rounded-3xl flex flex-col ${plan.popular ? 'scale-105' : ''}`}
                style={{
                  background: plan.popular ? 'rgba(237,139,0,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${plan.popular ? 'rgba(237,139,0,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: plan.popular ? '0 0 60px rgba(237,139,0,0.12)' : 'none',
                }}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black"
                    style={{ background: 'linear-gradient(135deg,#ED8B00,#F59E0B)', color: '#0F172A' }}>
                    {tr.popular}
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: plan.color + '20', border: `1px solid ${plan.color}40` }}>
                    <span style={{ color: plan.color, fontWeight: 900, fontSize: 16 }}>
                      {plan.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <p className="text-sm text-white/40 mt-1">{plan.desc}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                  {plan.price !== 'Custom' && plan.price !== 'Personalizado' && plan.price !== 'A medida' && (
                    <span className="text-white/30 text-sm ml-1">/ {tr.monthly}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {(plan.features as string[]).map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                      <span style={{ color: plan.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <Link href="/contact"
                  className="block text-center py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={plan.popular
                    ? { background: 'linear-gradient(135deg,#ED8B00,#F59E0B)', color: '#0F172A' }
                    : { background: 'rgba(255,255,255,0.06)', border: `1px solid ${plan.color}40`, color: plan.color }}>
                  {plan.price === 'Custom' || plan.price === 'Personalizado' || plan.price === 'A medida'
                    ? tr.ctaEnterprise
                    : tr.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ note */}
          <p className="text-center text-white/25 text-sm mt-12">
            {lang === 'en' ? 'All plans include a 14-day free trial. No credit card required.' :
             lang === 'es' ? 'Todos los planes incluyen 14 días de prueba gratis. Sin tarjeta de crédito.' :
             'Todos os planos incluem 14 dias de teste grátis. Sem cartão de crédito.'}
          </p>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}

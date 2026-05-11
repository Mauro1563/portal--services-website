'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lang, t } from '@/lib/i18n';

const SOLUTIONS = [
  { icon: '🏢', key: 'enterprise',  color: '#0077C0', bg: 'rgba(0,119,192,0.1)',  border: 'rgba(0,119,192,0.25)' },
  { icon: '🏬', key: 'medium',      color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' },
  { icon: '🏠', key: 'small',       color: '#22C55E', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)' },
  { icon: '🧹', key: 'freelance',   color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  { icon: '🛏', key: 'airbnb',      color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)' },
  { icon: '🏡', key: 'home',        color: '#14B8A6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.25)' },
];

const SOLUTION_LABELS: Record<string, Record<Lang, { title: string; desc: string }>> = {
  enterprise: { en: { title: 'Large Enterprise', desc: 'Full HQ control centre, director dashboards, multi-manager, unlimited buildings.' }, es: { title: 'Gran Empresa', desc: 'Centro de control HQ, paneles de director, multi-manager, edificios ilimitados.' }, pt: { title: 'Grande Empresa', desc: 'Centro de controle HQ, painéis de diretor, multi-gerente, edifícios ilimitados.' } },
  medium:     { en: { title: 'Medium Business', desc: 'Manager portal, supervisor teams, reports and building management.' }, es: { title: 'Mediana Empresa', desc: 'Portal de manager, equipos de supervisores, informes y gestión de edificios.' }, pt: { title: 'Empresa Média', desc: 'Portal do gerente, equipes de supervisores, relatórios e gestão de edifícios.' } },
  small:      { en: { title: 'Small Business', desc: 'Supervisor portal, shift control, supply orders. Simple and affordable.' }, es: { title: 'Pequeña Empresa', desc: 'Portal de supervisor, control de turnos, pedidos. Simple y asequible.' }, pt: { title: 'Pequena Empresa', desc: 'Portal do supervisor, controle de turnos, pedidos. Simples e acessível.' } },
  freelance:  { en: { title: 'Freelance Cleaners', desc: 'Personal schedule, job tracking and client communication — in your pocket.' }, es: { title: 'Autónomos', desc: 'Agenda personal, seguimiento de trabajos y comunicación con clientes — en tu bolsillo.' }, pt: { title: 'Autônomos', desc: 'Agenda pessoal, rastreamento de trabalhos e comunicação com clientes — no seu bolso.' } },
  airbnb:     { en: { title: 'Airbnb & Short-Let', desc: 'Automated clean scheduling between bookings. Instant status updates.' }, es: { title: 'Airbnb & Short-Let', desc: 'Programación automática de limpiezas entre reservas. Actualizaciones de estado al instante.' }, pt: { title: 'Airbnb & Short-Let', desc: 'Programação automática de limpezas entre reservas. Atualizações de status instantâneas.' } },
  home:       { en: { title: 'Home Cleaning', desc: 'Family home, regular cleans, and one-off deep cleans — tracked and invoiced.' }, es: { title: 'Limpieza Doméstica', desc: 'Hogar familiar, limpiezas regulares y limpiezas profundas — registradas y facturadas.' }, pt: { title: 'Limpeza Residencial', desc: 'Residência familiar, limpezas regulares e limpezas profundas — registradas e faturadas.' } },
};

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'Operations Director, CleanCo UK', quote: 'Portal Services transformed how we manage 200+ buildings. The HQ dashboard gives us complete visibility we never had before.' },
  { name: 'Carlos Fernández', role: 'Founder, Pristine Services', quote: 'We moved from spreadsheets to Portal Services in one week. Our supervisors love the mobile app and orders have never been easier.' },
  { name: 'Ana Ribeiro', role: 'Manager, LimpoCasa Portugal', quote: 'The multilingual support was key for us. Our team uses it in Portuguese and our UK clients see everything in English.' },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en');
  const tr = t(lang);

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />

      <main className="pt-16">

        {/* ── HERO ── */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle,#ED8B00 0%,transparent 70%)' }} />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-bold"
              style={{ background: 'rgba(237,139,0,0.1)', border: '1px solid rgba(237,139,0,0.25)', color: '#F59E0B' }}>
              ✦ {tr.hero.badge}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              {tr.hero.title.split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'gradient-text block' : 'block'}>{line}</span>
              ))}
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              {tr.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/contact"
                className="px-8 py-4 rounded-2xl font-black text-base text-[#0F172A] transition-all hover:opacity-90 hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#ED8B00,#F59E0B)', boxShadow: '0 8px 32px rgba(237,139,0,0.35)' }}>
                {tr.hero.cta1}
              </Link>
              <Link href="/pricing"
                className="px-8 py-4 rounded-2xl font-bold text-base text-white transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
                {tr.hero.cta2}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12">
              {([
                [tr.hero.stat1, tr.hero.stat1l],
                [tr.hero.stat2, tr.hero.stat2l],
                [tr.hero.stat3, tr.hero.stat3l],
              ] as [string,string][]).map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-black gradient-text">{val}</p>
                  <p className="text-sm text-white/40 font-medium mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{tr.features.title}</h2>
              <p className="text-white/40 text-lg">{tr.features.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tr.features.list.map((f) => (
                <div key={f.title} className="p-6 rounded-2xl card-glow"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-3xl mb-4 block">{f.icon}</span>
                  <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOLUTIONS PREVIEW ── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{tr.solutions.title}</h2>
              <p className="text-white/40 text-lg">{tr.solutions.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SOLUTIONS.map(s => {
                const info = SOLUTION_LABELS[s.key][lang];
                return (
                  <div key={s.key} className="p-6 rounded-2xl group cursor-pointer transition-all hover:scale-[1.02]"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <span className="text-4xl mb-4 block">{s.icon}</span>
                    <h3 className="font-black text-white text-base mb-2">{info.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: s.color + 'cc' }}>{info.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link href="/solutions"
                className="inline-block px-6 py-3 rounded-xl font-bold text-sm text-white/70 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                {lang === 'en' ? 'See all solutions →' : lang === 'es' ? 'Ver todas las soluciones →' : 'Ver todas as soluções →'}
              </Link>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-black text-white text-center mb-16">
              {lang === 'en' ? 'What our clients say' : lang === 'es' ? 'Lo que dicen nuestros clientes' : 'O que nossos clientes dizem'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="p-6 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-sm text-white/60 leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-white/30 mt-0.5">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24 border-t border-white/5">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {lang === 'en' ? 'Ready to transform your cleaning business?' : lang === 'es' ? '¿Listo para transformar tu empresa de limpieza?' : 'Pronto para transformar sua empresa de limpeza?'}
            </h2>
            <p className="text-white/40 mb-8">
              {lang === 'en' ? 'Join 500+ teams already using Portal Services Digital.' : lang === 'es' ? 'Únete a más de 500 equipos que ya usan Portal Services Digital.' : 'Junte-se a mais de 500 equipes que já usam o Portal Services Digital.'}
            </p>
            <Link href="/contact"
              className="inline-block px-10 py-4 rounded-2xl font-black text-base text-[#0F172A] transition-all hover:opacity-90 hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#ED8B00,#F59E0B)', boxShadow: '0 8px 32px rgba(237,139,0,0.35)' }}>
              {t(lang).nav.demo} →
            </Link>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </>
  );
}

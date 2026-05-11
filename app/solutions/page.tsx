'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lang, t } from '@/lib/i18n';

const SEGMENTS = [
  {
    icon: '🏢', key: 'enterprise', color: '#0077C0',
    portals: { en: 'HQ + Directors + Managers + Supervisors', es: 'HQ + Directores + Managers + Supervisores', pt: 'HQ + Diretores + Gerentes + Supervisores' },
    tags: { en: ['500+ operatives', 'Unlimited buildings', 'Full analytics', 'API access'], es: ['500+ operarios', 'Edificios ilimitados', 'Analítica completa', 'Acceso API'], pt: ['500+ operários', 'Edifícios ilimitados', 'Análises completas', 'Acesso à API'] },
    label: { en: { title: 'Large Enterprise', desc: 'Built for facilities management companies, national cleaning chains and property management groups operating across multiple cities. Full HQ control, director visibility and unlimited scale.' }, es: { title: 'Gran Empresa', desc: 'Diseñado para empresas de gestión de instalaciones, cadenas nacionales de limpieza y grupos de gestión de propiedades. Control HQ total, visibilidad de directores y escala ilimitada.' }, pt: { title: 'Grande Empresa', desc: 'Desenvolvido para empresas de gestão de instalações, redes nacionais de limpeza e grupos de gestão de propriedades. Controle HQ total, visibilidade de diretores e escala ilimitada.' } },
  },
  {
    icon: '🏬', key: 'medium', color: '#8B5CF6',
    portals: { en: 'Managers + Supervisors + Operatives', es: 'Managers + Supervisores + Operarios', pt: 'Gerentes + Supervisores + Operários' },
    tags: { en: ['Up to 100 operatives', '10–50 buildings', 'Manager dashboard', 'Reports'], es: ['Hasta 100 operarios', '10–50 edificios', 'Panel de manager', 'Informes'], pt: ['Até 100 operários', '10–50 edifícios', 'Painel do gerente', 'Relatórios'] },
    label: { en: { title: 'Medium Business', desc: 'Ideal for regional cleaning companies managing 10–50 contracts. A manager oversees multiple supervisor teams, with shift reports and supply ordering built in.' }, es: { title: 'Mediana Empresa', desc: 'Ideal para empresas de limpieza regionales con 10–50 contratos. Un manager supervisa múltiples equipos de supervisores con informes de turno y pedidos de suministros.' }, pt: { title: 'Empresa Média', desc: 'Ideal para empresas de limpeza regionais com 10–50 contratos. Um gerente supervisiona várias equipes com relatórios de turno e pedidos de suprimentos.' } },
  },
  {
    icon: '🏠', key: 'small', color: '#22C55E',
    portals: { en: 'Supervisor + Operatives', es: 'Supervisor + Operarios', pt: 'Supervisor + Operários' },
    tags: { en: ['Up to 20 operatives', '1–10 buildings', 'Simple setup', 'Affordable'], es: ['Hasta 20 operarios', '1–10 edificios', 'Configuración simple', 'Asequible'], pt: ['Até 20 operários', '1–10 edifícios', 'Configuração simples', 'Acessível'] },
    label: { en: { title: 'Small Business', desc: 'Perfect for small cleaning companies with 1 to 10 buildings. Set up in minutes — one supervisor manages the whole operation from their phone.' }, es: { title: 'Pequeña Empresa', desc: 'Perfecto para pequeñas empresas de limpieza con 1 a 10 edificios. Configúralo en minutos — un supervisor gestiona toda la operación desde su teléfono.' }, pt: { title: 'Pequena Empresa', desc: 'Perfeito para pequenas empresas de limpeza com 1 a 10 edifícios. Configure em minutos — um supervisor gerencia toda a operação pelo celular.' } },
  },
  {
    icon: '🧹', key: 'freelance', color: '#F59E0B',
    portals: { en: 'Operative Portal', es: 'Portal de Operario', pt: 'Portal do Operário' },
    tags: { en: ['Solo cleaner', 'Job tracker', 'Client messaging', 'Invoice ready'], es: ['Limpiador autónomo', 'Seguimiento de trabajos', 'Mensajería con clientes', 'Facturación'], pt: ['Limpador autônomo', 'Rastreamento de trabalhos', 'Mensagens com clientes', 'Faturamento'] },
    label: { en: { title: 'Freelance & Independent', desc: 'For self-employed cleaners who want to look professional. Manage your schedule, communicate with clients and track completed jobs — all from one simple portal.' }, es: { title: 'Autónomo e Independiente', desc: 'Para limpiadores autónomos que quieren proyectar profesionalidad. Gestiona tu agenda, comunícate con clientes y haz seguimiento de trabajos — todo desde un portal simple.' }, pt: { title: 'Autônomo e Independente', desc: 'Para limpadores autônomos que querem parecer profissionais. Gerencie sua agenda, comunique-se com clientes e rastreie trabalhos concluídos — tudo em um portal simples.' } },
  },
  {
    icon: '🛏', key: 'airbnb', color: '#EF4444',
    portals: { en: 'Property + Cleaner Portal', es: 'Portal de Propiedad + Limpiador', pt: 'Portal de Propriedade + Limpador' },
    tags: { en: ['Auto-scheduling', 'Booking sync', 'Photo check-in', 'Real-time status'], es: ['Programación automática', 'Sincronización de reservas', 'Check-in con foto', 'Estado en tiempo real'], pt: ['Programação automática', 'Sincronização de reservas', 'Check-in com foto', 'Status em tempo real'] },
    label: { en: { title: 'Airbnb & Short-Let', desc: 'Automate your cleaning workflow between guest stays. Cleaners get notified the moment a booking ends, and you get photo confirmation when the property is guest-ready.' }, es: { title: 'Airbnb & Short-Let', desc: 'Automatiza tu flujo de limpiezas entre estancias de huéspedes. Los limpiadores reciben notificación en cuanto termina una reserva y tú recibes confirmación con foto.' }, pt: { title: 'Airbnb & Short-Let', desc: 'Automatize seu fluxo de limpezas entre estadias de hóspedes. Os limpadores são notificados assim que uma reserva termina e você recebe confirmação por foto.' } },
  },
  {
    icon: '🏡', key: 'home', color: '#14B8A6',
    portals: { en: 'Client + Cleaner Portal', es: 'Portal de Cliente + Limpiador', pt: 'Portal de Cliente + Limpador' },
    tags: { en: ['Regular cleans', 'Deep cleans', 'Key holding', 'Invoicing'], es: ['Limpiezas regulares', 'Limpiezas profundas', 'Gestión de llaves', 'Facturación'], pt: ['Limpezas regulares', 'Limpezas profundas', 'Gestão de chaves', 'Faturamento'] },
    label: { en: { title: 'Home Cleaning', desc: 'For domestic cleaning businesses serving residential clients. Manage weekly cleans, deep cleans and special requests — with client-facing updates and automated invoicing.' }, es: { title: 'Limpieza Doméstica', desc: 'Para empresas de limpieza doméstica que atienden clientes residenciales. Gestiona limpiezas semanales, profundas y solicitudes especiales — con actualizaciones para clientes y facturación automática.' }, pt: { title: 'Limpeza Residencial', desc: 'Para empresas de limpeza doméstica que atendem clientes residenciais. Gerencie limpezas semanais, profundas e pedidos especiais — com atualizações para clientes e faturamento automático.' } },
  },
];

export default function SolutionsPage() {
  const [lang, setLang] = useState<Lang>('en');

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t(lang).solutions.title}
            </h1>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">{t(lang).solutions.subtitle}</p>
          </div>

          <div className="space-y-8">
            {SEGMENTS.map((s, i) => {
              const info = s.label[lang];
              const tags = s.tags[lang];
              const portals = s.portals[lang];
              const reverse = i % 2 === 1;
              return (
                <div key={s.key}
                  className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 p-8 rounded-3xl`}
                  style={{ background: s.color + '08', border: `1px solid ${s.color}20` }}>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-5xl mb-4">{s.icon}</span>
                    <h2 className="text-2xl font-black text-white mb-3">{info.title}</h2>
                    <p className="text-white/50 leading-relaxed mb-4">{info.desc}</p>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: s.color + '80' }}>
                      {lang === 'en' ? 'Portals included' : lang === 'es' ? 'Portales incluidos' : 'Portais incluídos'}
                    </p>
                    <p className="text-sm font-semibold mb-5" style={{ color: s.color }}>{portals}</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: s.color + '15', color: s.color, border: `1px solid ${s.color}30` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:w-48">
                    <Link href="/contact"
                      className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 text-center whitespace-nowrap"
                      style={{ background: s.color, color: '#fff' }}>
                      {t(lang).nav.demo} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}

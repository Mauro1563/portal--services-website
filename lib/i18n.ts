export type Lang = 'en' | 'es' | 'pt';

export const translations = {
  en: {
    nav: {
      home: 'Home', solutions: 'Solutions', pricing: 'Pricing',
      contact: 'Contact', demo: 'Book a Demo',
    },
    hero: {
      badge: 'Trusted by 500+ cleaning teams across the UK',
      title: 'The Complete Portal for\nCleaning Companies',
      subtitle: 'Manage supervisors, operatives, orders and reports — all in one platform. Built for large enterprises, growing businesses, and independent cleaners.',
      cta1: 'Book a Free Demo',
      cta2: 'View Pricing',
      stat1: '500+', stat1l: 'Active Teams',
      stat2: '12K+', stat2l: 'Operatives',
      stat3: '98%',  stat3l: 'Satisfaction',
    },
    features: {
      title: 'Everything your cleaning business needs',
      subtitle: 'One platform — multiple portals — complete control.',
      list: [
        { icon: '📋', title: 'Shift Management', desc: 'Day & night supervisors, live presence tracking and real-time building status.' },
        { icon: '📦', title: 'Supply Orders', desc: 'Operatives order supplies directly from the app. HQ approves and tracks.' },
        { icon: '📊', title: 'Reports & Analytics', desc: 'Evaluation scores, attendance, timesheets and performance dashboards.' },
        { icon: '🏢', title: 'Multi-Building', desc: 'Manage hundreds of buildings and locations from a single HQ dashboard.' },
        { icon: '📱', title: 'Mobile-First', desc: 'Works on any phone — no app download needed. Instant access via browser.' },
        { icon: '🔐', title: 'Role-Based Access', desc: 'Separate portals for HQ, Directors, Managers, Supervisors and Operatives.' },
      ],
    },
    solutions: {
      title: 'Built for every size',
      subtitle: 'Whether you run one building or five hundred, we have the right portal for you.',
    },
    pricing: {
      title: 'Simple, transparent pricing',
      subtitle: 'No hidden fees. Scale as you grow.',
      monthly: 'per month',
      cta: 'Get Started',
      ctaEnterprise: 'Contact Sales',
      popular: 'Most Popular',
      plans: [
        {
          name: 'Starter', price: '£29', color: '#22c55e',
          desc: 'Perfect for small cleaning teams just getting started.',
          features: ['Up to 5 operatives', '1 building', 'Supervisor portal', 'Supply orders', 'Email support'],
        },
        {
          name: 'Business', price: '£79', color: '#ED8B00',
          desc: 'For growing companies managing multiple sites.',
          features: ['Up to 30 operatives', 'Unlimited buildings', 'Manager portal', 'Reports & analytics', 'Priority support', 'Custom branding'],
          popular: true,
        },
        {
          name: 'Enterprise', price: 'Custom', color: '#0077C0',
          desc: 'Full-scale solution for large organisations.',
          features: ['Unlimited operatives', 'HQ control centre', 'Director dashboard', 'API access', 'Dedicated account manager', 'On-site training'],
        },
      ],
    },
    contact: {
      title: 'Book your free demo',
      subtitle: 'See how Portal Services Digital works for your business in a 20-minute live walkthrough.',
      form: {
        name: 'Full Name', company: 'Company Name', email: 'Work Email',
        phone: 'Phone Number', size: 'Company Size', message: 'Tell us about your business',
        sizes: ['1–5 operatives', '6–20 operatives', '21–100 operatives', '100+ operatives'],
        submit: 'Book My Demo →',
        success: 'Thank you! We\'ll be in touch within 24 hours.',
      },
    },
    footer: {
      tagline: 'The complete management platform for cleaning companies.',
      links: 'Quick Links', legal: 'Legal',
      privacy: 'Privacy Policy', terms: 'Terms of Service',
      copyright: '© 2025 Portal Services Digital. All rights reserved.',
    },
  },

  es: {
    nav: {
      home: 'Inicio', solutions: 'Soluciones', pricing: 'Precios',
      contact: 'Contacto', demo: 'Solicitar Demo',
    },
    hero: {
      badge: 'Más de 500 equipos de limpieza confían en nosotros en el Reino Unido',
      title: 'El Portal Completo para\nEmpresas de Limpieza',
      subtitle: 'Gestiona supervisores, operarios, pedidos e informes — todo en una sola plataforma. Diseñado para grandes empresas, negocios en crecimiento y limpiadores independientes.',
      cta1: 'Solicitar Demo Gratis',
      cta2: 'Ver Precios',
      stat1: '500+', stat1l: 'Equipos Activos',
      stat2: '12K+', stat2l: 'Operarios',
      stat3: '98%',  stat3l: 'Satisfacción',
    },
    features: {
      title: 'Todo lo que necesita tu empresa de limpieza',
      subtitle: 'Una plataforma — múltiples portales — control total.',
      list: [
        { icon: '📋', title: 'Gestión de Turnos', desc: 'Supervisores de día y noche, seguimiento de presencia en tiempo real y estado de edificios.' },
        { icon: '📦', title: 'Pedidos de Suministros', desc: 'Los operarios hacen pedidos directamente desde la app. HQ aprueba y hace seguimiento.' },
        { icon: '📊', title: 'Informes y Analítica', desc: 'Puntuaciones de evaluación, asistencia, hojas de horas y paneles de rendimiento.' },
        { icon: '🏢', title: 'Multi-Edificio', desc: 'Gestiona cientos de edificios y ubicaciones desde un único panel HQ.' },
        { icon: '📱', title: 'Móvil Primero', desc: 'Funciona en cualquier teléfono — sin descarga de app. Acceso instantáneo desde el navegador.' },
        { icon: '🔐', title: 'Acceso por Roles', desc: 'Portales separados para HQ, Directores, Managers, Supervisores y Operarios.' },
      ],
    },
    solutions: {
      title: 'Diseñado para cada tamaño',
      subtitle: 'Ya gestiones un edificio o quinientos, tenemos el portal adecuado para ti.',
    },
    pricing: {
      title: 'Precios simples y transparentes',
      subtitle: 'Sin costes ocultos. Escala según creces.',
      monthly: 'por mes',
      cta: 'Empezar',
      ctaEnterprise: 'Contactar Ventas',
      popular: 'Más Popular',
      plans: [
        {
          name: 'Starter', price: '£29', color: '#22c55e',
          desc: 'Perfecto para pequeños equipos de limpieza que empiezan.',
          features: ['Hasta 5 operarios', '1 edificio', 'Portal de supervisor', 'Pedidos de suministros', 'Soporte por email'],
        },
        {
          name: 'Business', price: '£79', color: '#ED8B00',
          desc: 'Para empresas en crecimiento con múltiples ubicaciones.',
          features: ['Hasta 30 operarios', 'Edificios ilimitados', 'Portal de manager', 'Informes y analítica', 'Soporte prioritario', 'Marca personalizada'],
          popular: true,
        },
        {
          name: 'Enterprise', price: 'A medida', color: '#0077C0',
          desc: 'Solución completa para grandes organizaciones.',
          features: ['Operarios ilimitados', 'Centro de control HQ', 'Panel de Director', 'Acceso API', 'Account manager dedicado', 'Formación presencial'],
        },
      ],
    },
    contact: {
      title: 'Reserva tu demo gratuita',
      subtitle: 'Descubre cómo Portal Services Digital funciona para tu negocio en una demostración en vivo de 20 minutos.',
      form: {
        name: 'Nombre Completo', company: 'Nombre de la Empresa', email: 'Email Profesional',
        phone: 'Teléfono', size: 'Tamaño de la Empresa', message: 'Cuéntanos sobre tu negocio',
        sizes: ['1–5 operarios', '6–20 operarios', '21–100 operarios', '100+ operarios'],
        submit: 'Reservar Mi Demo →',
        success: '¡Gracias! Nos pondremos en contacto en menos de 24 horas.',
      },
    },
    footer: {
      tagline: 'La plataforma de gestión completa para empresas de limpieza.',
      links: 'Enlaces Rápidos', legal: 'Legal',
      privacy: 'Política de Privacidad', terms: 'Términos de Servicio',
      copyright: '© 2025 Portal Services Digital. Todos los derechos reservados.',
    },
  },

  pt: {
    nav: {
      home: 'Início', solutions: 'Soluções', pricing: 'Preços',
      contact: 'Contato', demo: 'Agendar Demo',
    },
    hero: {
      badge: 'Mais de 500 equipes de limpeza confiam em nós no Reino Unido',
      title: 'O Portal Completo para\nEmpresas de Limpeza',
      subtitle: 'Gerencie supervisores, operários, pedidos e relatórios — tudo em uma plataforma. Desenvolvido para grandes empresas, negócios em crescimento e limpadores independentes.',
      cta1: 'Agendar Demo Grátis',
      cta2: 'Ver Preços',
      stat1: '500+', stat1l: 'Equipes Ativas',
      stat2: '12K+', stat2l: 'Operários',
      stat3: '98%',  stat3l: 'Satisfação',
    },
    features: {
      title: 'Tudo que sua empresa de limpeza precisa',
      subtitle: 'Uma plataforma — múltiplos portais — controle total.',
      list: [
        { icon: '📋', title: 'Gestão de Turnos', desc: 'Supervisores diurnos e noturnos, rastreamento de presença em tempo real e status de edificios.' },
        { icon: '📦', title: 'Pedidos de Suprimentos', desc: 'Operários fazem pedidos diretamente pelo app. HQ aprova e acompanha.' },
        { icon: '📊', title: 'Relatórios e Análises', desc: 'Pontuações de avaliação, presença, folhas de horas e painéis de desempenho.' },
        { icon: '🏢', title: 'Multi-Edifício', desc: 'Gerencie centenas de edifícios e localizações em um único painel HQ.' },
        { icon: '📱', title: 'Mobile First', desc: 'Funciona em qualquer celular — sem download de app. Acesso instantâneo pelo navegador.' },
        { icon: '🔐', title: 'Acesso por Funções', desc: 'Portais separados para HQ, Diretores, Gerentes, Supervisores e Operários.' },
      ],
    },
    solutions: {
      title: 'Desenvolvido para cada tamanho',
      subtitle: 'Seja gerenciando um edifício ou quinhentos, temos o portal certo para você.',
    },
    pricing: {
      title: 'Preços simples e transparentes',
      subtitle: 'Sem taxas ocultas. Escale conforme cresce.',
      monthly: 'por mês',
      cta: 'Começar',
      ctaEnterprise: 'Falar com Vendas',
      popular: 'Mais Popular',
      plans: [
        {
          name: 'Starter', price: '£29', color: '#22c55e',
          desc: 'Perfeito para pequenas equipes de limpeza que estão começando.',
          features: ['Até 5 operários', '1 edifício', 'Portal do supervisor', 'Pedidos de suprimentos', 'Suporte por email'],
        },
        {
          name: 'Business', price: '£79', color: '#ED8B00',
          desc: 'Para empresas em crescimento gerenciando vários locais.',
          features: ['Até 30 operários', 'Edifícios ilimitados', 'Portal do gerente', 'Relatórios e análises', 'Suporte prioritário', 'Marca personalizada'],
          popular: true,
        },
        {
          name: 'Enterprise', price: 'Personalizado', color: '#0077C0',
          desc: 'Solução completa para grandes organizações.',
          features: ['Operários ilimitados', 'Centro de controle HQ', 'Painel do Diretor', 'Acesso à API', 'Gerente de conta dedicado', 'Treinamento presencial'],
        },
      ],
    },
    contact: {
      title: 'Agende sua demo gratuita',
      subtitle: 'Veja como o Portal Services Digital funciona para o seu negócio em uma demonstração ao vivo de 20 minutos.',
      form: {
        name: 'Nome Completo', company: 'Nome da Empresa', email: 'Email Profissional',
        phone: 'Telefone', size: 'Tamanho da Empresa', message: 'Fale sobre o seu negócio',
        sizes: ['1–5 operários', '6–20 operários', '21–100 operários', '100+ operários'],
        submit: 'Agendar Minha Demo →',
        success: 'Obrigado! Entraremos em contato em até 24 horas.',
      },
    },
    footer: {
      tagline: 'A plataforma de gestão completa para empresas de limpeza.',
      links: 'Links Rápidos', legal: 'Legal',
      privacy: 'Política de Privacidade', terms: 'Termos de Serviço',
      copyright: '© 2025 Portal Services Digital. Todos os direitos reservados.',
    },
  },
} as const;

export function t(lang: Lang) {
  return translations[lang];
}

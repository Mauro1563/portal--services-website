import 'server-only';
import type { PricingContent } from '@/app/hq/content/pricing/PricingEditor';

/**
 * Default pricing content (matches the static JSON / current public site).
 * Used as a fallback when nothing has been saved to Supabase yet, and as
 * the seed for the editor on first load.
 */
export const DEFAULT_PRICING: PricingContent = {
  eyebrow: 'Planes y precios',
  title: 'Empieza pequeño. Crece sin cambiar de plataforma.',
  subtitle:
    'Dos líneas de producto: corporativo para edificios y servicios, y limpiezas de hogar con experiencia premium para el cliente.',
  trial_note: 'Prueba gratuita 30 días — sin tarjeta de crédito. Cancela cuando quieras.',
  footnote:
    'Todos los precios en GBP, sin IVA. Descuentos por volumen disponibles. Cambia de plan en cualquier momento.',
  popular: 'Más popular',
  corporate_eyebrow: 'Portal Services · Corporativo',
  corporate: [
    {
      name: 'Starter',
      range: '1 – 3 edificios · hasta 10 operativos',
      price: '£49',
      period: '/mes',
      cta: 'Empezar prueba',
      features: [
        'Portal Supervisor + Manager',
        'Inspecciones de calidad',
        'Partes diarios y aprobaciones',
        'Hasta 10 operativos',
        'Soporte por email',
      ],
    },
    {
      name: 'Business',
      range: '4 – 15 edificios · hasta 40 operativos',
      price: '£119',
      period: '/mes',
      cta: 'Solicitar demo',
      featured: true,
      features: [
        'Todo lo de Starter',
        'Portal Director con KPIs',
        'Estadísticas por edificio y operativo',
        'Exportación de informes',
        'Encuestas de satisfacción',
        'Hasta 40 operativos',
      ],
    },
    {
      name: 'Enterprise',
      range: 'Ilimitado · soporte dedicado · branding propio',
      price: 'Desde £249',
      period: '/mes',
      cta: 'Hablar con ventas',
      features: [
        'Todo lo de Business',
        'Edificios y operativos ilimitados',
        'Portal HQ — centro de control',
        'Branding propio y dominio',
        'API e integración con ERP / nómina',
        'SLA dedicado + account manager',
      ],
    },
  ],
  addons: [
    {
      name: 'Airbnb Add-on',
      desc: 'Módulo para propiedades turísticas',
      price: '£29',
    },
    {
      name: 'Home Cleaning Add-on',
      desc: 'Módulo para limpiezas domésticas',
      price: '£29',
    },
  ],
  home_eyebrow: 'Portal Limpiezas de Hogar',
  home: [
    {
      name: 'Starter',
      range: 'Hasta 15 clientes · 3 limpiadores',
      price: '£39',
      period: '/mes',
      cta: 'Empezar prueba',
      features: [
        'Portal cliente básico',
        'Mensajes con el equipo',
        'Feedback tras cada visita',
        'Opiniones de otros clientes',
        'Notificaciones en tiempo real',
        'Historial de limpiezas',
      ],
    },
    {
      name: 'Professional',
      range: 'Hasta 50 clientes · 10 limpiadores',
      price: '£89',
      period: '/mes',
      cta: 'Solicitar demo',
      featured: true,
      features: [
        'Todo en Starter',
        'Portal cliente completo',
        'Programa de recomendaciones',
        'Club de fidelización con puntos',
        'Branding parcial',
      ],
    },
    {
      name: 'Premium',
      range: 'Clientes ilimitados · limpiadores ilimitados',
      price: '£169',
      period: '/mes',
      cta: 'Empezar premium',
      features: [
        'Todo en Professional',
        'Pagos integrados (tarjeta, Apple Pay, BACS)',
        'Branding personalizado completo',
        'Soporte prioritario 24/7',
        'Sorpresas exclusivas del equipo',
      ],
    },
  ],
  home_enterprise: {
    name: 'Enterprise',
    range: 'Configuración personalizada',
    price: 'Desde £299',
    period: '/mes',
    cta: 'Hablar con ventas',
  },
};

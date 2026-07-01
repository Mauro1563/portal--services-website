/**
 * Editable knobs for the Portal Services Digital marketing site.
 * Change these values here — no rebuild needed of any page that reads
 * them because they're plain module exports.
 */

export type TrustMetric = {
  value: string;
  label: { en: string; es: string; pt: string };
};

export type DemoTarget = {
  key: string;
  name: { en: string; es: string; pt: string };
  href: string;
  requiresAuth: boolean;
};

// Trust bar metrics — ANONYMOUS ONLY, no company names.
export const TRUST_METRICS: TrustMetric[] = [
  { value: '+59', label: { en: 'Active operatives', es: 'Operativos activos', pt: 'Operativos ativos' } },
  { value: '7', label: { en: 'Buildings managed', es: 'Edificios gestionados', pt: 'Edifícios geridos' } },
  { value: '3', label: { en: 'Languages', es: 'Idiomas', pt: 'Idiomas' } },
  { value: '24/7', label: { en: 'Uptime', es: 'Uptime', pt: 'Uptime' } },
];

// Contact form target — leads land in Supabase marketing_leads.
// If you want emails instead, set NOTIFY_EMAIL and adjust the server action.
export const CONTACT_CONFIG = {
  leadsTable: 'marketing_leads',
  notifyEmail: null as string | null,
};

// Workforce sub-portal demo URLs — edit as new portals ship.
export const WORKFORCE_DEMOS: DemoTarget[] = [
  { key: 'operative', name: { en: 'Operative', es: 'Operativo', pt: 'Operativo' }, href: '/operative/preview', requiresAuth: false },
  { key: 'supervisor', name: { en: 'Supervisor', es: 'Supervisor', pt: 'Supervisor' }, href: '/operative/preview', requiresAuth: false },
  { key: 'manager', name: { en: 'Manager', es: 'Manager', pt: 'Gestor' }, href: '/owner/preview', requiresAuth: false },
  { key: 'hq', name: { en: 'Director / HQ', es: 'Director / HQ', pt: 'Diretor / HQ' }, href: '/hq', requiresAuth: true },
  { key: 'client', name: { en: 'Client', es: 'Cliente', pt: 'Cliente' }, href: '/client/preview', requiresAuth: false },
  { key: 'community', name: { en: 'Community', es: 'Comunidad', pt: 'Comunidade' }, href: '/operative/preview', requiresAuth: false },
  { key: 'hs', name: { en: 'Health & Safety', es: 'Salud y Seguridad', pt: 'Saúde e Segurança' }, href: '/operative/preview', requiresAuth: false },
];

// Home sub-solution demo URLs.
export const HOME_DEMOS: DemoTarget[] = [
  { key: 'owner', name: { en: 'Owner dashboard', es: 'Panel del dueño', pt: 'Painel do dono' }, href: '/owner/preview', requiresAuth: false },
  { key: 'cleaner', name: { en: 'Cleaner app', es: 'App del limpiador', pt: 'App do limpador' }, href: '/operative/preview', requiresAuth: false },
  { key: 'client', name: { en: 'Customer portal', es: 'Portal del cliente', pt: 'Portal do cliente' }, href: '/client/preview', requiresAuth: false },
  { key: 'airbnb-owner', name: { en: 'Airbnb host', es: 'Anfitrión Airbnb', pt: 'Anfitrião Airbnb' }, href: '/owner/preview-airbnb', requiresAuth: false },
  { key: 'airbnb-cleaner', name: { en: 'Airbnb turnover', es: 'Turnover Airbnb', pt: 'Turnover Airbnb' }, href: '/operative/preview-airbnb', requiresAuth: false },
];

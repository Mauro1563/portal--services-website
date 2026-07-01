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
  /**
   * When true, the demo card renders as a disabled "Coming soon" tile
   * instead of a clickable link. Set to true for portals that don't
   * yet have their own preview route so the marketing site never
   * misroutes users into an unrelated demo (e.g. Workforce Operative
   * → residential Home Cleaner demo).
   */
  comingSoon?: boolean;
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
// Client sits in HOME_DEMOS only (clients belong to the residential
// / Home surface, not Workforce, which is for corporate staff roles).
//
// The Workforce portals are all marked comingSoon: true until their
// dedicated preview routes ship. Reusing the Home /operative/preview
// or /owner/preview demos here would misroute users into the wrong
// product (a Workforce visitor clicking "Operative" would land on the
// residential Home cleaner app). Flip comingSoon to false and update
// the href when the real Workforce demo goes live.
export const WORKFORCE_DEMOS: DemoTarget[] = [
  { key: 'operative', name: { en: 'Operative', es: 'Operativo', pt: 'Operativo' }, href: '#', requiresAuth: false, comingSoon: true },
  { key: 'supervisor', name: { en: 'Supervisor', es: 'Supervisor', pt: 'Supervisor' }, href: '#', requiresAuth: false, comingSoon: true },
  { key: 'manager', name: { en: 'Manager', es: 'Manager', pt: 'Gestor' }, href: '#', requiresAuth: false, comingSoon: true },
  { key: 'hq', name: { en: 'Director / HQ', es: 'Director / HQ', pt: 'Diretor / HQ' }, href: '/hq', requiresAuth: true, comingSoon: true },
  { key: 'community', name: { en: 'Community', es: 'Comunidad', pt: 'Comunidade' }, href: '#', requiresAuth: false, comingSoon: true },
  { key: 'hs', name: { en: 'Health & Safety', es: 'Salud y Seguridad', pt: 'Saúde e Segurança' }, href: '#', requiresAuth: false, comingSoon: true },
];

// Home sub-solution demo URLs.
export const HOME_DEMOS: DemoTarget[] = [
  { key: 'owner', name: { en: 'Owner dashboard', es: 'Panel del dueño', pt: 'Painel do dono' }, href: '/owner/preview', requiresAuth: false },
  { key: 'cleaner', name: { en: 'Cleaner app', es: 'App del limpiador', pt: 'App do limpador' }, href: '/operative/preview', requiresAuth: false },
  { key: 'client', name: { en: 'Customer portal', es: 'Portal del cliente', pt: 'Portal do cliente' }, href: '/client/preview', requiresAuth: false },
  { key: 'airbnb-owner', name: { en: 'Airbnb host', es: 'Anfitrión Airbnb', pt: 'Anfitrião Airbnb' }, href: '/owner/preview-airbnb', requiresAuth: false },
  { key: 'airbnb-cleaner', name: { en: 'Airbnb turnover', es: 'Turnover Airbnb', pt: 'Turnover Airbnb' }, href: '/operative/preview-airbnb', requiresAuth: false },
];

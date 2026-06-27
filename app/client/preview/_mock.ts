/**
 * Shared mock context for the no-auth CLIENT portal preview.
 * Mirrors the shape of `ClientContext` from `@/lib/client-auth` so
 * all client components type-check identically to the real portal.
 */
import type { ClientContext } from '@/lib/client-auth';

export const PREVIEW_TOKEN = 'preview';

export const MOCK_CTX: ClientContext = {
  client: {
    id: 'preview',
    owner_id: 'preview',
    name: 'Sofía Martín',
    email: 'sofia@example.com',
    phone: null,
    address: null,
    notes: null,
    access_token: 'preview',
    referral_code: 'PREVIEW',
    created_at: new Date().toISOString(),
  },
  owner: {
    business_name: 'Limpiezas Premium',
    business_logo_url: null,
    business_type: 'hybrid',
    brand_color: null,
    email: null,
  },
};

export const MOCK_SERVICES = [
  { id: 'standard', name: 'Limpieza estándar' },
  { id: 'profunda', name: 'Limpieza profunda' },
  { id: 'cristales', name: 'Cristales' },
  { id: 'mudanza', name: 'Mudanza' },
];

export const MOCK_CLEANERS = [
  { id: 'ana', name: 'Ana Ruiz', avgStars: 4.9, ratingCount: 12 },
  { id: 'luis', name: 'Luis Pérez', avgStars: 4.7, ratingCount: 8 },
];

/**
 * Shared mock context for the no-auth CLIENT portal preview.
 * Mirrors the shape of `ClientContext` from `@/lib/client-auth` so
 * all client components type-check identically to the real portal.
 *
 * Addresses follow the shared London property pool used across the
 * owner/cleaner/client portals so the same property maps to the same
 * street everywhere in the demo.
 */
import type { ClientContext } from '@/lib/client-auth';

export const PREVIEW_TOKEN = 'preview';

export const MOCK_CTX: ClientContext = {
  client: {
    id: 'preview',
    owner_id: 'preview',
    name: 'Sofía Martín',
    email: 'sofia@example.com',
    phone: '+44 20 7946 0123',
    address: '22 Old Compton St, Soho, London W1D 4TR',
    notes: null,
    access_token: 'preview',
    referral_code: 'PREVIEW',
    created_at: new Date().toISOString(),
  },
  owner: {
    business_name: 'London Sparkle Cleaning Co.',
    business_logo_url: null,
    business_type: 'hybrid',
    brand_color: null,
    email: 'hello@londonsparkle.co.uk',
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

/** Shared London property pool. Same property = same address across portals. */
export const LONDON_PROPERTIES = {
  soho:       { name: 'Soho Loft',           address: '22 Old Compton St, Soho, London W1D 4TR' },
  camden:     { name: 'Camden House',        address: '47 Camden High St, London NW1 0LT' },
  notting:    { name: 'Notting Hill Flat',   address: '12 Portobello Rd, London W11 2DZ' },
  mayfair:    { name: 'Mayfair Studio',      address: '8 Berkeley St, Mayfair, London W1J 8DY' },
  shoreditch: { name: 'Shoreditch Penthouse', address: '31 Curtain Rd, Shoreditch, London EC2A 3LT' },
  hackney:    { name: 'Hackney Studio',      address: '78 Mare St, Hackney, London E8 4RT' },
} as const;

/** Real cleaning photos hosted on Unsplash (no auth required). */
export const DEMO_PHOTOS = {
  kitchen:    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=70',
  living:     'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop&q=70',
  bathroom:   'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=70',
  bedroom:    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=70',
  floor:      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=70',
  vacuum:     'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=70',
  sink:       'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=70',
  airbnb:     'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=70',
} as const;

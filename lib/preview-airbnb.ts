/**
 * Mock data for the AIRBNB OWNER preview demo (/owner/preview-airbnb).
 *
 * Parallel to /owner/preview but tuned for cleaning companies whose
 * customers are Airbnb hosts — properties are short-let listings synced
 * via iCal, tasks are triggered by checkout events, and there is no
 * separate "client portal" (the host IS the client).
 *
 * Keeping all the mock data in one module lets the page render at the
 * server (no fetching) and keeps demo strings consistent if other
 * preview-airbnb sub-pages need them later.
 */

export type AirbnbListing = {
  id: string;
  /** Airbnb-side listing id (mock) shown to the host as proof of sync. */
  airbnbId: number;
  name: string;
  /** Per-night price in pence so we can reuse the £-formatting helpers. */
  pricePence: number;
  /** Average star rating shown next to the listing card. */
  rating: number;
  /** Number of reviews backing the rating. */
  reviewsCount: number;
  /** Short neighbourhood label rendered under the name. */
  neighbourhood: string;
};

export const AIRBNB_LISTINGS: AirbnbListing[] = [
  {
    id: 'soho-loft',
    airbnbId: 9234,
    name: 'Soho Loft',
    pricePence: 18000,
    rating: 4.8,
    reviewsCount: 47,
    neighbourhood: 'Soho · W1',
  },
  {
    id: 'camden-house',
    airbnbId: 4521,
    name: 'Camden House',
    pricePence: 24000,
    rating: 4.9,
    reviewsCount: 89,
    neighbourhood: 'Camden · NW1',
  },
  {
    id: 'notting-hill-flat',
    airbnbId: 7812,
    name: 'Notting Hill Flat',
    pricePence: 21000,
    rating: 4.7,
    reviewsCount: 32,
    neighbourhood: 'Notting Hill · W11',
  },
  {
    id: 'mayfair-studio',
    airbnbId: 1093,
    name: 'Mayfair Studio',
    pricePence: 32000,
    rating: 5.0,
    reviewsCount: 21,
    neighbourhood: 'Mayfair · W1',
  },
  {
    id: 'shoreditch-penthouse',
    airbnbId: 6644,
    name: 'Shoreditch Penthouse',
    pricePence: 45000,
    rating: 4.9,
    reviewsCount: 64,
    neighbourhood: 'Shoreditch · E1',
  },
  {
    id: 'hackney-studio',
    airbnbId: 8801,
    name: 'Hackney Studio',
    pricePence: 16500,
    rating: 4.6,
    reviewsCount: 18,
    neighbourhood: 'Hackney · E8',
  },
];

export type TurnaroundTask = {
  id: string;
  listingId: AirbnbListing['id'];
  listingName: string;
  /** Cleaner assigned to the turnaround. */
  cleanerName: string;
  /** Previous guest's checkout time, e.g. "11:00". */
  checkoutAt: string;
  /** When the cleaner is scheduled to arrive on-site. */
  cleanerArrivesAt: string;
  /** Next guest's check-in deadline — the SLA the host promised Airbnb. */
  nextCheckInAt: string;
  /** Turnaround window in minutes (nextCheckIn − checkout). */
  windowMinutes: number;
  status: 'pending' | 'in-progress' | 'done';
};

/**
 * Mock turnover tasks for "today" — cover all three states so the demo
 * can show pending / live / done badges in the same panel.
 */
export const TURNAROUND_TASKS: TurnaroundTask[] = [
  {
    id: 'turn-1',
    listingId: 'soho-loft',
    listingName: 'Soho Loft',
    cleanerName: 'Carmen Ruiz',
    checkoutAt: '11:00',
    cleanerArrivesAt: '11:15',
    nextCheckInAt: '15:00',
    windowMinutes: 240,
    status: 'in-progress',
  },
  {
    id: 'turn-2',
    listingId: 'camden-house',
    listingName: 'Camden House',
    cleanerName: 'Lucía Vega',
    checkoutAt: '10:00',
    cleanerArrivesAt: '10:20',
    nextCheckInAt: '14:00',
    windowMinutes: 240,
    status: 'done',
  },
  {
    id: 'turn-3',
    listingId: 'notting-hill-flat',
    listingName: 'Notting Hill Flat',
    cleanerName: 'Pedro Kovac',
    checkoutAt: '11:00',
    cleanerArrivesAt: '11:30',
    nextCheckInAt: '16:00',
    windowMinutes: 300,
    status: 'pending',
  },
  {
    id: 'turn-4',
    listingId: 'shoreditch-penthouse',
    listingName: 'Shoreditch Penthouse',
    cleanerName: 'Sofía Marín',
    checkoutAt: '10:30',
    cleanerArrivesAt: '11:00',
    nextCheckInAt: '15:00',
    windowMinutes: 270,
    status: 'pending',
  },
];

export type RestockAlert = {
  id: string;
  listingName: string;
  /** Headline copy — what's running low and the suggested action. */
  message: string;
  severity: 'low' | 'urgent';
};

export const RESTOCK_ALERTS: RestockAlert[] = [
  {
    id: 'restock-1',
    listingName: 'Soho Loft',
    message: 'Quedan 2 rollos de papel · pedir hoy',
    severity: 'urgent',
  },
  {
    id: 'restock-2',
    listingName: 'Camden House',
    message: 'Cápsulas de café (3 restantes) · reponer esta semana',
    severity: 'low',
  },
  {
    id: 'restock-3',
    listingName: 'Mayfair Studio',
    message: 'Botellas de agua agotadas · reponer antes del próximo check-in',
    severity: 'urgent',
  },
];

/** Daily revenue (pence) for the 7-day chart. */
export const AIRBNB_REVENUE_WEEK: Array<{ label: string; pence: number }> = [
  { label: 'L', pence: 22000 },
  { label: 'M', pence: 31000 },
  { label: 'X', pence: 28500 },
  { label: 'J', pence: 36000 },
  { label: 'V', pence: 41000 },
  { label: 'S', pence: 38500 },
  { label: 'D', pence: 21000 },
];

/** Aggregate stats for the tile row at the top of the dashboard. */
export const AIRBNB_STATS = {
  activeListings: AIRBNB_LISTINGS.length,
  turnoversThisWeek: 14,
  /** Average turnaround duration shown as "2h 45m". */
  avgTurnaroundLabel: '2h 45m',
  monthlyRevenuePence: 218000,
};

export function formatPence(pence: number): string {
  return `£${(pence / 100).toLocaleString('en-GB', {
    maximumFractionDigits: 0,
  })}`;
}

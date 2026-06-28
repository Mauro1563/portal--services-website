'use client';

/**
 * Shared weekly schedule for the 3 demo portals.
 *
 * In real product the schedule lives in Supabase; in /preview it lives
 * in localStorage so changes the owner makes in /owner/preview/scheduler
 * appear instantly in /operative/preview/week and
 * /client/preview/cleanings when the user navigates between portals.
 *
 * Refresh keeps the changes for the rest of the demo session; clearing
 * site data resets to INITIAL_WEEKLY_SCHEDULE.
 */

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type ScheduledTask = {
  id: string;
  day: WeekDay;
  startTime: string; // 'HH:MM'
  durationMin: number;
  cleanerId: string;
  cleanerName: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  clientId: string;
  clientName: string;
  service: 'estandar' | 'profunda' | 'cristales' | 'mudanza';
  chargePence: number;
  payPence: number;
  status: 'scheduled' | 'in_progress' | 'completed';
};

export const DAY_LABELS: Record<WeekDay, string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
};

export const WEEK_DAYS: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DEMO_CLEANERS = [
  { id: 'cl-carmen', name: 'Carmen Ruiz', initials: 'CR', color: '#2563eb' },
  { id: 'cl-pedro', name: 'Pedro Kovac', initials: 'PK', color: '#16a34a' },
  { id: 'cl-lucia', name: 'Lucía Vega', initials: 'LV', color: '#dc2626' },
  { id: 'cl-ana', name: 'Ana Ruiz', initials: 'AR', color: '#9333ea' },
];

export const DEMO_PROPERTIES = [
  { id: 'pr-soho', name: 'Soho Loft', address: '22 Old Compton St, London W1D 4TR', clientId: 'c-thompson', clientName: 'Mr. Thompson' },
  { id: 'pr-camden', name: 'Camden House', address: '47 Camden High St, London NW1 0LT', clientId: 'c-walker', clientName: 'Ms. Walker' },
  { id: 'pr-notting', name: 'Notting Hill Flat', address: '12 Portobello Rd, London W11 2DZ', clientId: 'c-patel', clientName: 'Ms. Patel' },
  { id: 'pr-mayfair', name: 'Mayfair Studio', address: '8 Berkeley St, Mayfair W1J 8DY', clientId: 'c-romero', clientName: 'Ana Romero' },
  { id: 'pr-shore', name: 'Shoreditch Penthouse', address: '31 Curtain Rd, Shoreditch EC2A 3LT', clientId: 'c-garcia', clientName: 'María García' },
  { id: 'pr-hackney', name: 'Hackney Studio', address: '78 Mare St, Hackney E8 4RT', clientId: 'c-patel2', clientName: 'Ms. Patel' },
];

export const INITIAL_WEEKLY_SCHEDULE: ScheduledTask[] = [
  { id: 't-mon-1', day: 'mon', startTime: '09:00', durationMin: 120, cleanerId: 'cl-carmen', cleanerName: 'Carmen Ruiz', propertyId: 'pr-soho', propertyName: 'Soho Loft', propertyAddress: '22 Old Compton St, London W1D 4TR', clientId: 'c-thompson', clientName: 'Mr. Thompson', service: 'estandar', chargePence: 4500, payPence: 2800, status: 'completed' },
  { id: 't-mon-2', day: 'mon', startTime: '14:00', durationMin: 180, cleanerId: 'cl-pedro', cleanerName: 'Pedro Kovac', propertyId: 'pr-camden', propertyName: 'Camden House', propertyAddress: '47 Camden High St, London NW1 0LT', clientId: 'c-walker', clientName: 'Ms. Walker', service: 'profunda', chargePence: 9500, payPence: 5400, status: 'completed' },
  { id: 't-tue-1', day: 'tue', startTime: '10:00', durationMin: 90, cleanerId: 'cl-ana', cleanerName: 'Ana Ruiz', propertyId: 'pr-notting', propertyName: 'Notting Hill Flat', propertyAddress: '12 Portobello Rd, London W11 2DZ', clientId: 'c-patel', clientName: 'Ms. Patel', service: 'estandar', chargePence: 4500, payPence: 2800, status: 'in_progress' },
  { id: 't-wed-1', day: 'wed', startTime: '11:00', durationMin: 120, cleanerId: 'cl-carmen', cleanerName: 'Carmen Ruiz', propertyId: 'pr-mayfair', propertyName: 'Mayfair Studio', propertyAddress: '8 Berkeley St, Mayfair W1J 8DY', clientId: 'c-romero', clientName: 'Ana Romero', service: 'estandar', chargePence: 4500, payPence: 2800, status: 'scheduled' },
  { id: 't-thu-1', day: 'thu', startTime: '09:00', durationMin: 240, cleanerId: 'cl-pedro', cleanerName: 'Pedro Kovac', propertyId: 'pr-shore', propertyName: 'Shoreditch Penthouse', propertyAddress: '31 Curtain Rd, Shoreditch EC2A 3LT', clientId: 'c-garcia', clientName: 'María García', service: 'profunda', chargePence: 9500, payPence: 5400, status: 'scheduled' },
  { id: 't-thu-2', day: 'thu', startTime: '14:30', durationMin: 120, cleanerId: 'cl-lucia', cleanerName: 'Lucía Vega', propertyId: 'pr-hackney', propertyName: 'Hackney Studio', propertyAddress: '78 Mare St, Hackney E8 4RT', clientId: 'c-patel2', clientName: 'Ms. Patel', service: 'estandar', chargePence: 4500, payPence: 2800, status: 'scheduled' },
  { id: 't-fri-1', day: 'fri', startTime: '10:00', durationMin: 90, cleanerId: 'cl-carmen', cleanerName: 'Carmen Ruiz', propertyId: 'pr-soho', propertyName: 'Soho Loft', propertyAddress: '22 Old Compton St, London W1D 4TR', clientId: 'c-thompson', clientName: 'Mr. Thompson', service: 'estandar', chargePence: 4500, payPence: 2800, status: 'scheduled' },
  { id: 't-sat-1', day: 'sat', startTime: '12:00', durationMin: 180, cleanerId: 'cl-ana', cleanerName: 'Ana Ruiz', propertyId: 'pr-camden', propertyName: 'Camden House', propertyAddress: '47 Camden High St, London NW1 0LT', clientId: 'c-walker', clientName: 'Ms. Walker', service: 'profunda', chargePence: 9500, payPence: 5400, status: 'scheduled' },
];

const KEY = 'portal_preview_schedule_v1';

export function loadSchedule(): ScheduledTask[] {
  if (typeof window === 'undefined') return INITIAL_WEEKLY_SCHEDULE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return INITIAL_WEEKLY_SCHEDULE;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_WEEKLY_SCHEDULE;
    return parsed as ScheduledTask[];
  } catch {
    return INITIAL_WEEKLY_SCHEDULE;
  }
}

export function saveSchedule(tasks: ScheduledTask[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function resetSchedule() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch { /* ignore */ }
}

/**
 * Minimal iCalendar (.ics) parser tailored for Airbnb / Booking.com
 * checkout calendars. We only need DTEND for each VEVENT — that's when
 * the cleaning needs to happen.
 */
export function parseIcsCheckoutDates(text: string): string[] {
  const dates: string[] = [];
  const blocks = text.split('BEGIN:VEVENT').slice(1);

  for (const block of blocks) {
    const body = block.split('END:VEVENT')[0];
    const lines = body.split(/\r?\n/);
    let dtendRaw: string | null = null;

    for (const raw of lines) {
      // DTEND can appear as 'DTEND:20251217' or 'DTEND;VALUE=DATE:20251217'
      // or 'DTEND:20251217T120000Z'.
      if (/^DTEND[;:]/.test(raw)) {
        const colon = raw.indexOf(':');
        if (colon !== -1) {
          dtendRaw = raw.slice(colon + 1).trim();
        }
      }
    }

    if (!dtendRaw) continue;
    const yyyy = dtendRaw.slice(0, 4);
    const mm = dtendRaw.slice(4, 6);
    const dd = dtendRaw.slice(6, 8);
    if (yyyy.length !== 4 || mm.length !== 2 || dd.length !== 2) continue;
    dates.push(`${yyyy}-${mm}-${dd}`);
  }

  // Dedupe and sort
  return Array.from(new Set(dates)).sort();
}

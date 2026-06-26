/**
 * Build a Google Maps deep-link that opens turn-by-turn directions.
 *
 * Single stop: `https://www.google.com/maps/dir/?api=1&destination=…&travelmode=driving`
 * Multi stop: chain N-1 waypoints + final destination.
 *
 * On iOS the URL still opens — Apple Maps doesn't support waypoints in URL,
 * but Google Maps app installed picks it up. On Android the native Google
 * Maps app picks it up directly. Web fallback works everywhere.
 *
 * Google caps waypoints at 9 between origin and destination (10 stops total
 * for free tier). We surface a warning at the call site if truncation happens.
 */

const MAX_WAYPOINTS = 9;

export type Stop = {
  address: string;
  postcode?: string | null;
  /**
   * Used as a label only when the caller needs to render it back to the
   * user — not encoded into the maps URL itself.
   */
  label?: string;
};

function formatQuery(stop: Stop): string {
  return [stop.address, stop.postcode].filter(Boolean).join(', ');
}

/** Single-stop driving directions from current location. */
export function singleStopUrl(stop: Stop): string {
  const q = encodeURIComponent(formatQuery(stop));
  return `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`;
}

/**
 * Multi-stop directions. Origin = device current location. Last stop is
 * the destination; every stop in between is a waypoint. Returns null when
 * given no stops (caller should hide the button).
 *
 * `truncated` flags whether we dropped stops past Google's 10-stop cap.
 */
export function routeUrl(stops: Stop[]): {
  url: string;
  truncated: boolean;
} | null {
  if (stops.length === 0) return null;

  if (stops.length === 1) {
    return { url: singleStopUrl(stops[0]), truncated: false };
  }

  const max = 1 + MAX_WAYPOINTS; // destination + 9 waypoints = 10 stops
  const truncated = stops.length > max;
  const trimmed = stops.slice(0, max);
  const destination = trimmed[trimmed.length - 1];
  const waypoints = trimmed.slice(0, -1);

  const params = new URLSearchParams({
    api: '1',
    destination: formatQuery(destination),
    travelmode: 'driving',
  });
  if (waypoints.length > 0) {
    params.set('waypoints', waypoints.map(formatQuery).join('|'));
  }

  return {
    url: `https://www.google.com/maps/dir/?${params.toString()}`,
    truncated,
  };
}

/** Tel URI — strips whitespace so it's dial-safe. */
export function telUrl(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/\s+/g, '');
  if (!cleaned) return null;
  return `tel:${cleaned}`;
}

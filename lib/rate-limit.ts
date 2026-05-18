import 'server-only';

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const buckets = new Map<string, Bucket>();

let sweeper: NodeJS.Timeout | null = null;
const ensureSweeper = () => {
  if (sweeper) return;
  sweeper = setInterval(() => {
    const now = Date.now();
    for (const [key, b] of buckets) {
      if (b.resetAt < now) buckets.delete(key);
    }
  }, 60_000);
  sweeper.unref?.();
};

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfter: number };

/**
 * Per-key fixed-window limiter. State lives in process memory, so on Vercel /
 * serverless this is per-instance. Adequate for marketing form abuse; swap to
 * Upstash/Redis if the site ever scales beyond one warm instance.
 */
export const checkRate = (key: string): RateLimitResult => {
  ensureSweeper();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
};

export const getClientIp = (req: Request): string => {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('cf-connecting-ip') ??
    'unknown'
  );
};

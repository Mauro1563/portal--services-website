import Link from 'next/link';
import { Gift, Sparkles } from 'lucide-react';

/**
 * Promo banner pinned high on the client home — same role as the
 * "25% Off On First Cleaning Services" card in the marketplace
 * template, but pointed at our actual feature (Refer & Earn) so it
 * always has somewhere meaningful to send the tap.
 *
 * Caller can override the destination + copy when we ship a real
 * "first cleaning discount" coupon flow.
 */
export function PromoBanner({
  token,
  eyebrow,
  title,
  cta,
  href,
}: {
  token: string;
  eyebrow?: string;
  title?: string;
  cta?: string;
  href?: string;
}) {
  const finalHref = href ?? `/client/${token}/refer`;
  return (
    <Link
      href={finalHref}
      className="group relative mt-4 flex items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-inset ring-blue-100 transition hover:ring-blue-200"
    >
      {/* Sparkle decoration */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-2 text-sky-200/70"
        style={{ fontSize: 90, lineHeight: 1 }}
      >
        <Sparkles />
      </span>

      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.55)]">
        <Gift className="h-5 w-5" />
      </span>

      <div className="relative min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
          {eyebrow ?? 'Refer & Earn'}
        </p>
        <p className="mt-1 font-display text-sm font-bold text-slate-900">
          {title ?? 'Invita a un amigo y gana un premio'}
        </p>
        <span className="mt-1 inline-flex h-7 items-center rounded-full bg-blue-600 px-3 text-[10.5px] font-bold uppercase tracking-wider text-white transition group-hover:bg-blue-700">
          {cta ?? 'Ver detalles'}
        </span>
      </div>
    </Link>
  );
}

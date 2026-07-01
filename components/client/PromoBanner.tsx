import Link from 'next/link';
import { Gift } from 'lucide-react';

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
      className="group relative mt-3 flex items-center gap-3 overflow-hidden rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200 transition hover:bg-white hover:ring-blue-200"
    >
      {/* Brand-driven swatch — uses the owner's --brand-primary / secondary
          when mounted under <BrandThemeProvider>; falls back to blue/cyan
          Portal Services defaults everywhere else. */}
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-on-brand shadow-[0_8px_18px_-8px_rgba(15,23,42,0.35)]">
        <Gift className="h-5 w-5" />
      </span>

      <div className="relative min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-slate-700">
          {eyebrow ?? 'Refer & Earn'}
        </p>
        <p className="mt-0.5 font-display text-[13.5px] font-bold text-slate-900">
          {title ?? 'Invita a un amigo y gana un premio'}
        </p>
      </div>

      <span className="relative shrink-0 self-center rounded-full bg-brand-primary px-3 py-1.5 text-[11px] font-bold text-on-brand transition group-hover:brightness-110">
        {cta ?? 'Ver detalles'}
      </span>
    </Link>
  );
}

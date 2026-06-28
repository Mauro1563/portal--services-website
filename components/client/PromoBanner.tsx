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
      className="ps-set group relative mt-3 flex items-center gap-3 overflow-hidden rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-4 transition"
      style={{ transitionDuration: '160ms' }}
    >
      <span
        className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border border-[#1414141A] text-[#141414]"
        style={{ backgroundColor: '#F4EFE6' }}
      >
        <Gift className="h-5 w-5" />
      </span>

      <div className="relative min-w-0 flex-1">
        <p className="ps-mono text-[11px] text-[#54524D]">
          <span
            style={{
              backgroundImage: 'linear-gradient(#FF5B1F, #FF5B1F)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 1px',
              backgroundPosition: '0 calc(100% + 3px)',
              paddingBottom: '3px',
            }}
          >
            {eyebrow ?? 'refer & earn'}
          </span>
        </p>
        <p className="ps-serif mt-2 text-[18px] leading-tight tracking-[-0.015em] text-[#141414]">
          {title ?? 'Invita a un amigo y gana un premio'}
        </p>
      </div>

      <span
        className="ps-mono relative shrink-0 self-center rounded-full px-3 py-1.5 text-[11px] text-[#1A0A04] transition"
        style={{ backgroundColor: '#FF5B1F', transitionDuration: '160ms' }}
      >
        {cta ?? 'ver detalles'}
      </span>
    </Link>
  );
}

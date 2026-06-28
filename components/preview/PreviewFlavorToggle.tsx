import Link from 'next/link';

/**
 * Tiny pill bar that sits just below DemoTopBar on every /<portal>/preview*
 * entry page. Lets a prospect flip between the residential ("Hogar") and
 * short-let ("Airbnb") flavours of the same portal without having to bounce
 * back to the marketing site. Two pills, active = solid blue, inactive =
 * white card with a hairline ring.
 *
 * The component is intentionally stateless — `active` decides which pill is
 * solid; the hogarHref / airbnbHref props decide where each link goes — so
 * the same toggle works on both the owner and operative previews and on
 * either flavour of either portal.
 */
export function PreviewFlavorToggle({
  active,
  hogarHref,
  airbnbHref,
}: {
  active: 'hogar' | 'airbnb';
  hogarHref: string;
  airbnbHref: string;
}) {
  const baseCls =
    'inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';
  const activeCls = 'bg-blue-600 text-white shadow-sm';
  const inactiveCls =
    'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50';

  return (
    <div className="border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-8 max-w-5xl items-center justify-center gap-1.5 px-3 sm:px-4 lg:px-8">
        <Link
          href={hogarHref}
          aria-current={active === 'hogar' ? 'page' : undefined}
          className={`${baseCls} ${active === 'hogar' ? activeCls : inactiveCls}`}
        >
          <span aria-hidden>🏠</span>
          <span>Hogar{active === 'hogar' ? ' (activo)' : ''}</span>
        </Link>
        <Link
          href={airbnbHref}
          aria-current={active === 'airbnb' ? 'page' : undefined}
          className={`${baseCls} ${active === 'airbnb' ? activeCls : inactiveCls}`}
        >
          <span aria-hidden>🏨</span>
          <span>Airbnb{active === 'airbnb' ? ' (activo)' : ''}</span>
        </Link>
      </div>
    </div>
  );
}

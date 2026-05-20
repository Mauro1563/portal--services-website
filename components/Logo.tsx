type Size = 'sm' | 'md' | 'lg';

const LOGO_URL =
  'https://raw.githubusercontent.com/Mauro1563/portal--services-website/main/logo%20png%20portal%20.PNG';

const CROP_ASPECT = '2.6 / 1';

const sizeConfig: Record<Size, { imgWrap: string }> = {
  sm: { imgWrap: 'h-10 sm:h-12 w-auto' },
  md: { imgWrap: 'mx-auto w-full max-w-[280px]' },
  lg: { imgWrap: 'mx-auto w-full max-w-md sm:max-w-lg' },
};

export function Logo({
  size = 'sm',
  className = '',
}: {
  size?: Size;
  className?: string;
}) {
  const cfg = sizeConfig[size];
  return (
    <div className={className}>
      <div
        className={`${cfg.imgWrap} overflow-hidden`}
        style={{ aspectRatio: CROP_ASPECT }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_URL}
          alt="Portal Services"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

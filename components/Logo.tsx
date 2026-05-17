type Size = 'sm' | 'md' | 'lg';

const LOGO_URL =
  'https://raw.githubusercontent.com/Mauro1563/portal--services-website/main/logo%20png%20portal%20.PNG';

const sizeClasses: Record<Size, string> = {
  sm: 'block h-12 w-auto sm:h-14',
  md: 'block h-auto w-full max-w-[260px] mx-auto',
  lg: 'block h-auto w-full max-w-sm sm:max-w-md mx-auto',
};

export function Logo({
  size = 'sm',
  className = '',
}: {
  size?: Size;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <img
      src={LOGO_URL}
      alt="Portal Services Digital — One platform. One place. Everyone connected."
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}

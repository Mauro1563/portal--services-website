import type { SVGProps } from 'react';

type P = { size?: number; sw?: number } & SVGProps<SVGSVGElement>;

const Icon = ({
  size = 16,
  sw = 1.6,
  children,
  ...rest
}: P & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const I = {
  search: (p: P = {}) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Icon>,
  bell: (p: P = {}) => <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z" /><path d="M10 21a2 2 0 0 0 4 0" /></Icon>,
  plus: (p: P = {}) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>,
  download: (p: P = {}) => <Icon {...p}><path d="M12 3v14M5 12l7 7 7-7M5 21h14" /></Icon>,
  chev_d: (p: P = {}) => <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>,
  chev_r: (p: P = {}) => <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>,
  more: (p: P = {}) => <Icon {...p}><circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" /></Icon>,
  check: (p: P = {}) => <Icon {...p}><path d="M5 13l4 4L19 7" /></Icon>,
  grid: (p: P = {}) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>,
  clipboard: (p: P = {}) => <Icon {...p}><rect x="7" y="4" width="10" height="3" rx="1" /><path d="M7 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><path d="M8 12h8M8 16h5" /></Icon>,
  pin: (p: P = {}) => <Icon {...p}><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></Icon>,
  users: (p: P = {}) => <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M3 21v-1a6 6 0 0 1 12 0v1" /><circle cx="17" cy="9" r="2.5" /><path d="M21 21v-1a5 5 0 0 0-4-4.9" /></Icon>,
  calendar: (p: P = {}) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></Icon>,
  chart: (p: P = {}) => <Icon {...p}><path d="M4 19V5M4 19h16M8 16V11M12 16V8M16 16v-3" /></Icon>,
  card: (p: P = {}) => <Icon {...p}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></Icon>,
  msg: (p: P = {}) => <Icon {...p}><path d="M21 12a8 8 0 1 1-3.5-6.6L21 5l-1.5 3.5A8 8 0 0 1 21 12z" /></Icon>,
  cog: (p: P = {}) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></Icon>,
  help: (p: P = {}) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.9.5-1 1.2-1 2" /><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" /></Icon>,
  briefcase: (p: P = {}) => <Icon {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></Icon>,
  building: (p: P = {}) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></Icon>,
  bed: (p: P = {}) => <Icon {...p}><path d="M3 18v-7M3 18h18M3 14h18v4M21 14v-2a3 3 0 0 0-3-3H10v5" /><circle cx="6" cy="11" r="1.5" /></Icon>,
  sparkle: (p: P = {}) => <Icon {...p}><path d="M12 3l1.8 5L19 10l-5.2 2L12 17l-1.8-5L5 10l5.2-2zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z" /></Icon>,
  shield: (p: P = {}) => <Icon {...p}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></Icon>,
  euro: (p: P = {}) => <Icon {...p}><path d="M18 7a6 6 0 1 0 0 10M4 10h10M4 14h10" /></Icon>,
  logout: (p: P = {}) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Icon>,
};

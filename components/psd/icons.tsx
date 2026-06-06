import type { SVGProps } from 'react';

export const Icon = {
  arrow: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg className="arrow" viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}>
      <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plus: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}>
      <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  star: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" {...p}>
      <path d="M6.5 1l1.7 3.4 3.8.55-2.75 2.68.65 3.77L6.5 9.6l-3.4 1.8.65-3.77L1 4.95l3.8-.55L6.5 1z" />
    </svg>
  ),
  menu: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M3 6h12M3 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  lock: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <rect x="4" y="9" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 9V6.5a3.5 3.5 0 117 0V9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  shield: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M10 2l6 2.5v5c0 3.6-2.4 6.7-6 8-3.6-1.3-6-4.4-6-8v-5L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  globe: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 10h14M10 3c2 2.3 3 5 3 7s-1 4.7-3 7c-2-2.3-3-5-3-7s1-4.7 3-7z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  zap: (p: SVGProps<SVGSVGElement> = {}) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M11 2L4 11h5l-1 7 7-9h-5l1-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
};

export const LOGO_FULL_URL = '/portal-home-logo-v2.png';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'var(--font-inter)', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          400: '#3b82f6',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        accent: { DEFAULT: '#06b6d4', soft: '#22d3ee', sky: '#3DC5F0' },
        surface: { 0: '#ffffff', 1: '#f8fafc', 2: '#f1f5f9', 3: '#e2e8f0' },
        navy: { 900: '#0a0f1e', 800: '#0f1729', 700: '#172033' },
        text: { 1: '#0f172a', 2: '#475569', 3: '#94a3b8' },
        // Legacy ink kept so old components don't break during migration
        ink: { 0: '#0a0f1e', 1: '#0f1729', 2: '#111b30', 3: '#172033' },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #22D3EE 0%, #2563EB 100%)',
        'mesh-1':
          'radial-gradient(at 18% 22%, rgba(34, 211, 238, 0.10) 0px, transparent 50%), radial-gradient(at 82% 55%, rgba(37, 99, 235, 0.08) 0px, transparent 50%)',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15,23,42,0.04), 0 1px 3px 0 rgba(15,23,42,0.06)',
        'card-lg':
          '0 4px 16px -2px rgba(15,23,42,0.08), 0 2px 4px -1px rgba(15,23,42,0.04)',
        'brand-glow': '0 8px 24px -6px rgba(37,99,235,0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;

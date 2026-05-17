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
        brand: { 50: '#eff6ff', 400: '#3b82f6', 500: '#2563eb', 600: '#1d4ed8' },
        accent: { DEFAULT: '#06b6d4', soft: '#22d3ee', sky: '#3DC5F0' },
        ink: { 0: '#060a14', 1: '#0f172a', 2: '#111b30', 3: '#1a2542' },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #3DC5F0 0%, #2563EB 50%, #1D4ED8 100%)',
        'mesh-1':
          'radial-gradient(at 20% 0%, rgba(37, 99, 235, 0.18) 0px, transparent 50%), radial-gradient(at 80% 30%, rgba(6, 182, 212, 0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(37, 99, 235, 0.12) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;

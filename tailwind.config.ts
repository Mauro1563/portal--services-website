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
        ink: { 0: '#060a14', 1: '#0f172a', 2: '#111b30', 3: '#1a2542' },
        navy: { 900: '#060a14', 800: '#0f172a', 700: '#111b30' },
        // Light marketing palette — soft off-white canvas with subtle bands.
        // The hero / CTA / footer keep using `ink` / `navy` for contrast.
        canvas: '#F6F8FC',
        paper: '#FFFFFF',
        cloud: '#EEF2F8',
        // Dark text on light surfaces
        graphite: { 1: '#0B1220', 2: '#1E293B', 3: '#475569', 4: '#94A3B8' },
        line: '#E2E8F0',
        // Old aliases kept for /hq (dark admin) routes
        surface: { 0: '#0f172a', 1: '#111b30', 2: '#1a2542', 3: '#243044' },
        text: { 1: '#f8fafc', 2: '#cbd5e1', 3: '#94a3b8' },
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #3DC5F0 0%, #2563EB 50%, #1D4ED8 100%)',
        'mesh-1':
          'radial-gradient(at 20% 0%, rgba(37, 99, 235, 0.18) 0px, transparent 50%), radial-gradient(at 80% 30%, rgba(6, 182, 212, 0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(37, 99, 235, 0.12) 0px, transparent 50%)',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,0.2), 0 1px 3px 0 rgba(0,0,0,0.3)',
        'card-lg':
          '0 4px 16px -2px rgba(0,0,0,0.3), 0 20px 40px -10px rgba(0,0,0,0.4)',
        'brand-glow': '0 8px 30px -10px rgba(37,99,235,0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;

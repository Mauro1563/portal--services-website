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
        // Refined teal — primary brand
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          400: '#2dd4bf',
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
          800: '#134e4a',
        },
        // Warm coral — hot accent for premium CTAs
        warm: {
          50: '#fff5f0',
          100: '#ffe5d6',
          400: '#ee9472',
          500: '#ea7a5a',
          600: '#d4623b',
        },
        // Stripe-style deep ocean navy
        ink: {
          0: '#0a2540',
          1: '#1a3a5c',
          2: '#2c4a6e',
          3: '#4a6585',
        },
        navy: { 900: '#0a2540', 800: '#1a3a5c', 700: '#2c4a6e' },
        // Warm cream surfaces (replaces flat white)
        surface: {
          0: '#fafaf5',
          1: '#f5f3ec',
          2: '#ebe8df',
          3: '#d8d4c8',
        },
        text: {
          1: '#0a2540',
          2: '#4a5568',
          3: '#8b8579',
        },
        // Legacy accent kept for backwards compat
        accent: { DEFAULT: '#0d9488', soft: '#2dd4bf', sky: '#0d9488' },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0d9488 0%, #0a2540 100%)',
        'warm-gradient': 'linear-gradient(135deg, #ea7a5a 0%, #d4623b 100%)',
        'mesh-1':
          'radial-gradient(at 16% 18%, rgba(13, 148, 136, 0.10) 0px, transparent 50%), radial-gradient(at 84% 60%, rgba(234, 122, 90, 0.06) 0px, transparent 50%)',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(10,37,64,0.04), 0 1px 3px 0 rgba(10,37,64,0.06)',
        'card-lg':
          '0 1px 2px 0 rgba(10,37,64,0.04), 0 4px 16px -2px rgba(10,37,64,0.06), 0 16px 40px -10px rgba(10,37,64,0.08)',
        'brand-glow': '0 8px 24px -6px rgba(13,148,136,0.40)',
        'warm-glow': '0 8px 24px -6px rgba(234,122,90,0.40)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;

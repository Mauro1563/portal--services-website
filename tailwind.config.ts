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
          300: '#93c5fd',
          400: '#3b82f6',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        accent: { DEFAULT: '#06b6d4', soft: '#22d3ee', sky: '#3DC5F0' },
        ink: { 0: '#060a14', 1: '#0f172a', 2: '#111b30', 3: '#1a2542' },
        navy: { 900: '#060a14', 800: '#0f172a', 700: '#111b30' },
        // Light marketing palette — soft off-white canvas with subtle bands.
        canvas: '#F6F8FC',
        paper: '#FFFFFF',
        cloud: '#EEF2F8',
        graphite: { 1: '#0B1220', 2: '#1E293B', 3: '#475569', 4: '#94A3B8' },
        line: '#E2E8F0',
        surface: { 0: '#FFFFFF', 1: '#F8FAFC', 2: '#F1F5F9', 3: '#E2E8F0' },
        text: { 1: '#0F172A', 2: '#475569', 3: '#94A3B8' },
        // ── Cleaning theme palette ──────────────────────────────────
        // Aqua = water, mint = freshness, pearl = clean white. Used
        // for the visual flourishes in the redesigned shells (sparkle
        // accents, ripple buttons, fresh background tints).
        clean: {
          aqua: '#06b6d4',
          'aqua-soft': '#cffafe',
          'aqua-glow': '#67e8f9',
          mint: '#10b981',
          'mint-soft': '#d1fae5',
          pearl: '#fafcff',
          bubble: 'rgba(34, 211, 238, 0.12)',
        },
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #3DC5F0 0%, #2563EB 50%, #1D4ED8 100%)',
        'mesh-1':
          'radial-gradient(at 20% 0%, rgba(37, 99, 235, 0.18) 0px, transparent 50%), radial-gradient(at 80% 30%, rgba(6, 182, 212, 0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(37, 99, 235, 0.12) 0px, transparent 50%)',
        // Cleaning-themed background washes
        'sparkle-gradient':
          'linear-gradient(135deg, #67e8f9 0%, #22d3ee 35%, #2563eb 100%)',
        'fresh-mesh':
          'radial-gradient(at 18% 12%, rgba(103, 232, 249, 0.20) 0px, transparent 50%), radial-gradient(at 82% 82%, rgba(16, 185, 129, 0.12) 0px, transparent 55%), linear-gradient(180deg, #fafcff 0%, #f1f9fc 100%)',
        'bubble-pattern':
          'radial-gradient(circle at 20% 80%, rgba(103, 232, 249, 0.15) 0, transparent 12%), radial-gradient(circle at 75% 25%, rgba(34, 211, 238, 0.10) 0, transparent 9%), radial-gradient(circle at 45% 55%, rgba(16, 185, 129, 0.08) 0, transparent 14%)',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,0.2), 0 1px 3px 0 rgba(0,0,0,0.3)',
        'card-lg':
          '0 4px 16px -2px rgba(0,0,0,0.3), 0 20px 40px -10px rgba(0,0,0,0.4)',
        'brand-glow': '0 8px 30px -10px rgba(37,99,235,0.6)',
        'sparkle-glow': '0 8px 32px -8px rgba(34, 211, 238, 0.5)',
        'mint-glow': '0 8px 32px -8px rgba(16, 185, 129, 0.4)',
        // Glassmorphism / depth
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        sparkle: 'sparkle 2.5s ease-in-out infinite',
        ripple: 'ripple 0.6s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

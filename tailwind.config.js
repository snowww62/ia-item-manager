/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0d12',
        surface: {
          DEFAULT: '#14171f',
          raised: '#1b1f2a',
          hover: '#232834',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        ink: {
          DEFAULT: '#e7e9ee',
          muted: '#9aa1af',
          faint: '#6b7280',
        },
        brand: {
          DEFAULT: '#7c5cff',
          hover: '#6b4cf0',
          soft: 'var(--brand-soft)',
        },
        accent: '#22d3ee',
        ok: '#34d399',
        warn: '#fbbf24',
        bad: {
          DEFAULT: '#f87171',
          hover: '#ef4444',
        },
      },
      fontFamily: {
        sans: [
          'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"',
          'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"', '"SFMono-Regular"', 'Consolas',
          '"Liberation Mono"', 'Menlo', 'monospace',
        ],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.4)',
        raised: '0 8px 24px -8px rgba(0,0,0,0.55)',
        pop: '0 20px 56px -16px rgba(0,0,0,0.65)',
        glow: '0 0 0 1px rgba(124,92,255,0.35), 0 8px 32px -8px rgba(124,92,255,0.35)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(16px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.24s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scale-in 0.16s cubic-bezier(0.16,1,0.3,1)',
        'toast-in': 'toast-in 0.24s cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}

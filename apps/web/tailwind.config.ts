import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#EEF3FF',
          100: '#DCE7FE',
          200: '#BFD0FC',
          300: '#94B0F8',
          400: '#6589F2',
          500: '#3D6FE8',
          600: '#1A56DB',
          700: '#1442B8',
          800: '#14378E',
          900: '#0D2256',
          950: '#091236',
        },
        ink: {
          50:  '#FAFAF8',
          100: '#F2F0ED',
          200: '#E5E2DD',
          300: '#CCC8C1',
          400: '#A8A29E',
          500: '#6B6560',
          600: '#494440',
          700: '#2E2A26',
          800: '#1F1C19',
          900: '#141110',
          950: '#0A0907',
        },
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        'display-1': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.04', letterSpacing: '-0.04em', fontWeight: '800' }],
        'display-2': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.06', letterSpacing: '-0.035em', fontWeight: '800' }],
        'display-3': ['clamp(2rem, 4.5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
      },
      letterSpacing: {
        'super-tight': '-0.045em',
      },
      boxShadow: {
        'glow-sm':   '0 0 0 1px rgba(26,86,219,0.10), 0 1px 3px rgba(26,86,219,0.08)',
        'glow':      '0 0 0 1px rgba(26,86,219,0.10), 0 8px 24px rgba(26,86,219,0.18)',
        'glow-lg':   '0 0 0 1px rgba(26,86,219,0.12), 0 24px 64px -12px rgba(26,86,219,0.35)',
        'elev-1':    '0 1px 2px rgba(20,17,16,0.04), 0 1px 3px rgba(20,17,16,0.05)',
        'elev-2':    '0 2px 4px rgba(20,17,16,0.04), 0 4px 12px rgba(20,17,16,0.06)',
        'elev-3':    '0 4px 8px rgba(20,17,16,0.04), 0 12px 24px rgba(20,17,16,0.08)',
        'elev-4':    '0 8px 16px rgba(20,17,16,0.04), 0 24px 48px rgba(20,17,16,0.12)',
        'inner-sm':  'inset 0 1px 0 0 rgba(255,255,255,0.06)',
        'ring-brand':'0 0 0 4px rgba(26,86,219,0.14)',
      },
      backgroundImage: {
        'mesh-light':  'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(61,111,232,0.13), rgba(250,250,248,0) 60%), radial-gradient(ellipse 50% 40% at 90% 30%, rgba(94,232,235,0.10), rgba(250,250,248,0) 60%), radial-gradient(ellipse 60% 50% at 10% 80%, rgba(26,86,219,0.08), rgba(250,250,248,0) 60%)',
        'mesh-dark':   'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(61,111,232,0.30), rgba(10,9,7,0) 60%), radial-gradient(ellipse 40% 30% at 85% 25%, rgba(94,232,235,0.18), rgba(10,9,7,0) 60%), radial-gradient(ellipse 50% 40% at 15% 90%, rgba(26,86,219,0.20), rgba(10,9,7,0) 60%)',
        'brand-grad':  'linear-gradient(135deg, #1A56DB 0%, #3D6FE8 50%, #38BDF8 100%)',
        'shimmer':     'linear-gradient(110deg, rgba(255,255,255,0) 25%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 75%)',
        'grid':        'linear-gradient(rgba(20,17,16,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,17,16,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid':        '64px 64px',
      },
      animation: {
        'fade-up':     'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':     'fadeIn 0.4s ease-out both',
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 9s ease-in-out infinite',
        'shimmer':     'shimmer 2.4s linear infinite',
        'pulse-ring':  'pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'marquee':     'marquee 28s linear infinite',
        'spin-slow':   'spin 9s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.95)', opacity: '0.7' },
          '70%':  { transform: 'scale(2.1)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      transitionTimingFunction: {
        'snap':    'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
export default config

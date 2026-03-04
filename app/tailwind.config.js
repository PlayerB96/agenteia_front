/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#f8fafc',
          dark: '#0f1419',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#161b22',
        },
        text: {
          DEFAULT: '#0f172a',
          dark: '#e6edf3',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#30363d',
        },
        // Enterprise palette - teal primary, amber accent
        agent: {
          50: '#ecfdfb',
          100: '#cffaf4',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        slate: {
          850: '#172033',
          950: '#0d1117',
        },
        'agent-bg': 'var(--agent-bg)',
        'agent-surface': 'var(--agent-surface)',
        'agent-surface-elevated': 'var(--agent-surface-elevated)',
        'agent-border': 'var(--agent-border)',
        'agent-text': 'var(--agent-text)',
        'agent-text-muted': 'var(--agent-text-muted)',
        'agent-primary': 'var(--agent-primary)',
        'agent-accent': 'var(--agent-accent)',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        'grid-pattern': 'linear-gradient(rgba(20, 184, 166, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.03) 1px, transparent 1px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },

  plugins: [],
}

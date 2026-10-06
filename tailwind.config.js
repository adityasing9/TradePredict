/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'rgb(var(--bg-primary-rgb) / <alpha-value>)',
          deep: 'rgb(var(--bg-deep-rgb) / <alpha-value>)',
          surface: 'rgb(var(--bg-card-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--bg-secondary-rgb) / <alpha-value>)',
          card: 'rgb(var(--bg-card-rgb) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated-rgb) / <alpha-value>)',
          border: 'rgb(var(--border-color-rgb) / <alpha-value>)',
          subtle: 'rgb(var(--border-subtle-rgb) / <alpha-value>)'
        },
        surface: {
          DEFAULT: 'rgb(var(--bg-card-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--bg-secondary-rgb) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated-rgb) / <alpha-value>)'
        },
        border: {
          DEFAULT: 'rgb(var(--border-color-rgb) / <alpha-value>)',
          subtle: 'rgb(var(--border-subtle-rgb) / <alpha-value>)'
        },
        accent: {
          cyan: 'rgb(var(--accent-cyan-rgb) / <alpha-value>)',
          'cyan-hover': 'var(--accent-cyan-hover)',
          'cyan-subtle': 'var(--accent-cyan-subtle)',
          'cyan-border': 'var(--accent-cyan-border)'
        },
        brand: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490'
        },
        market: {
          bullish: 'rgb(var(--market-bullish-rgb) / <alpha-value>)',
          bearish: 'rgb(var(--market-bearish-rgb) / <alpha-value>)',
          warning: 'rgb(var(--market-warning-rgb) / <alpha-value>)',
          neutral: 'rgb(var(--market-neutral-rgb) / <alpha-value>)'
        },
        terminal: {
          green: 'rgb(var(--market-bullish-rgb) / <alpha-value>)',
          red: 'rgb(var(--market-bearish-rgb) / <alpha-value>)',
          amber: 'rgb(var(--market-warning-rgb) / <alpha-value>)',
          cyan: 'rgb(var(--accent-cyan-rgb) / <alpha-value>)',
          slate: 'rgb(var(--market-neutral-rgb) / <alpha-value>)'
        }
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
      },
      boxShadow: {
        'panel': 'var(--shadow-panel)',
        'elevated': 'var(--shadow-elevated)',
        'modal': 'var(--shadow-modal)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}

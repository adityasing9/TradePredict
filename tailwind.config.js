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
          DEFAULT: '#05070A',
          deep: '#080B10',
          surface: '#0C1118',
          secondary: '#101720',
          card: '#0C1118',
          elevated: '#141C25',
          border: '#1B2632',
          subtle: '#15202B'
        },
        surface: {
          DEFAULT: '#0C1118',
          secondary: '#101720',
          elevated: '#141C25'
        },
        border: {
          DEFAULT: '#1B2632',
          subtle: '#15202B'
        },
        accent: {
          cyan: '#22D3EE',
          'cyan-hover': '#06B6D4',
          'cyan-subtle': 'rgba(34, 211, 238, 0.08)',
          'cyan-border': 'rgba(34, 211, 238, 0.25)'
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
          bullish: '#22C55E',
          bearish: '#EF4444',
          warning: '#F59E0B',
          neutral: '#94A3B8'
        },
        terminal: {
          green: '#22C55E',
          red: '#EF4444',
          amber: '#F59E0B',
          cyan: '#22D3EE',
          slate: '#94A3B8'
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
        'panel': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 2px 4px -1px rgba(0, 0, 0, 0.5)',
        'modal': '0 12px 24px -4px rgba(0, 0, 0, 0.8)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}

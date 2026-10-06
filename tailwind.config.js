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
          DEFAULT: '#090d14',
          secondary: '#0e1422',
          card: '#121929',
          elevated: '#172033',
          border: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)'
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca'
        },
        terminal: {
          green: '#10b981',
          emerald: '#059669',
          red: '#ef4444',
          rose: '#f43f5e',
          amber: '#f59e0b',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          indigo: '#6366f1',
          purple: '#8b5cf6'
        }
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.25), 0 1px 2px -1px rgba(0, 0, 0, 0.25)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}

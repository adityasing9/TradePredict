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
          DEFAULT: '#090d16',
          secondary: '#0f172a',
          card: '#131b2e',
          elevated: '#1a233b',
          border: '#23304e'
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5'
        },
        terminal: {
          green: '#10b981',
          red: '#f43f5e',
          amber: '#f59e0b',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#a855f7'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}

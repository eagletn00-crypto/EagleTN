/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./apps/**/*.{js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'ultra-dark': {
          950: '#070707',
          900: '#121212',
          800: '#1c1c1c',
        },
        'amber-ultra': {
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      backgroundColor: {
        glass: 'rgba(15, 15, 15, 0.72)',
        'glass-soft': 'rgba(25, 25, 25, 0.56)',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.08)',
        'amber-soft': 'rgba(245, 158, 11, 0.35)',
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0, 0, 0, 0.32)',
        'amber-glow': '0 0 40px rgba(245, 158, 11, 0.18)',
      },
      backdropBlur: {
        glass: '10px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

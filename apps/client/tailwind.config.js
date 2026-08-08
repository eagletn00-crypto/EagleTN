/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FDFBF7',
          surface: 'rgba(255, 255, 255, 0.75)',
          border: 'rgba(255, 255, 255, 0.85)',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        slate: {
          850: '#131C2E',
          900: '#0F172A',
          950: '#020617',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glass-sm': '0 4px 15px -3px rgba(245, 158, 11, 0.06), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
        'glass-md': '0 8px 25px -4px rgba(245, 158, 11, 0.10), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'glass-lg': '0 12px 35px -6px rgba(15, 23, 42, 0.12), 0 6px 15px -3px rgba(245, 158, 11, 0.08)',
        'floating': '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      backgroundImage: {
        'warm-radial': 'radial-gradient(circle at top right, rgba(253, 230, 138, 0.35), transparent 60%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 100%)',
      },
    },
  },
  plugins: [],
};

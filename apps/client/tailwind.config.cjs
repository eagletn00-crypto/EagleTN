/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        cairo: ['"Cairo"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdf4',
          500: '#10b981',
          900: '#064e3b',
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // 印尼特色色彩
        'indonesian-primary': '#D97706',
        'indonesian-secondary': '#EA580C',
        'indonesian-accent': '#DC2626',
        'indonesian-warm': '#F59E0B',
      }
    }
  },
  plugins: []
} 
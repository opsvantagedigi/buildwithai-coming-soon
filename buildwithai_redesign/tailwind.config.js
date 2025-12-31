/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(90deg, #00c6fb 0%, #05dfd7 50%, #f5d300 100%)',
      },
      colors: {
        'brand-blue': '#00c6fb',
        'brand-green': '#05dfd7',
        'brand-yellow': '#f5d300',
      },
    },
  },
  plugins: [],
}

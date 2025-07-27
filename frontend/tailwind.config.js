// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // VERY important
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        dm_sans: ['DM Sans', 'sans-serif'],
        jetBrains_mono: ['JetBrains Mono', 'monospace']
      },
      colors: { // <-- THIS is required
        brand: {
          te_mpurple: '#8F73FF',
          te_vpurple: '#6837EC',
          te_lpurple: '#CCBDFF',
          te_lteal: '#A8FFF6',
          te_mteal: '#1FFFED',
          te_vteal: '#00E2D7',
          te_black: '#0C0C0F',
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ]
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./tugasp3.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Biru Laundry Premium Palette
        'laundry': {
          '50': '#F0F9FF',
          '100': '#E0F7FE',
          '200': '#B3E5FC',
          '300': '#81D4FA',
          '400': '#4FC3F7',
          '500': '#29B6F6',
          '600': '#06B6D4',
          '700': '#0891B2',
          '800': '#0369A1',
          '900': '#0EA5E9',
          'dark': '#001F3F',
        },
        // Warna aksen
        'sky-fresh': '#F8FCFE',
        'aqua-bright': '#0EA5E9',
        'cyan-dark': '#0891B2',
        'navy-deep': '#0369A1',
      },
      backgroundColor: {
        'laundry-light': '#F8FCFE',
        'laundry-bg': '#F0F9FF',
        'laundry-card': '#FFFFFF',
      },
      borderColor: {
        'laundry-border': '#B3E5FC',
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{njk,md}",
    "./src/**/*.svg",
  ],
  theme: {
    extend: {
      colors: {
        bg: colors.gray,
        bgaccent: colors.slate,
        primary: colors.red,
        brand: "#ff0000"
      },
    },
  },
  plugins: [],
}

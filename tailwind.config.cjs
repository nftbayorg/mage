const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        silkscreen: ['Silkscreen', ...defaultTheme.fontFamily.sans]
      }
    },
    screens: {
      'sm': '500px',
      'md': '660px',
      'lg': '1100px',
      'xl': '1400px',
      '2xl': '2500px',
    }
  },
  plugins: [],
};

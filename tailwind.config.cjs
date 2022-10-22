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
      'md': '750px',
      'lg': '1200px',
      'xl': '1600px',
      '2xl': '2500px',
    }
  },
  plugins: [],
};

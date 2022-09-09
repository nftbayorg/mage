/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      'sm': '500px',
      'md': '660px',
      'lg': '1100px',
      'xl': '1400px',
    }
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind'in hangi klasörlerdeki class isimlerini tarayacağını belirtiyoruz
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
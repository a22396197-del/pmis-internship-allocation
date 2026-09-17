/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pm: {
          blue: "#1E3A8A",
          orange: "#EA580C",
          green: "#059669",
          slate: "#0F172A",
          light: "#F8FAFC"
        }
      }
    },
  },
  plugins: [],
}

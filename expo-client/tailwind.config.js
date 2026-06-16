/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        salli: {
          bg: "#020617",
          card: "#0F172A",
          teal: "#2DD4BF",
          amber: "#FBBF24",
          rose: "#FB7185",
          text: "#F1F5F9",
          muted: "#64748B"
        }
      }
    }
  },
  plugins: []
};

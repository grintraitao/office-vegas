/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "night",
      "luxury",
      "cyberpunk",
      "synthwave",
      "valentine",
      "aqua",
    ],
    darkTheme: "night",
  },
}

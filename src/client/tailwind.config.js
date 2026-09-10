/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Dark theme: near-black canvas, dark elevated surfaces, light text, muted accents.
        ink: "#e6e5ea",
        cream: "#f3f0ea",
        coral: "#c9776b",
        teal: "#4a9186",
        gold: "#c99a52",
        plum: "#8a76ac",
        mist: "#2d2d36",
        surface: "#151519",
        surface2: "#1d1d23",
        canvas: "#000000",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

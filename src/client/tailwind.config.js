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
        ink: "#1c1b29",
        cream: "#fbf7f0",
        coral: "#ff6b5e",
        teal: "#1f7a6c",
        gold: "#e8a23d",
        plum: "#5b3a8e",
        mist: "#eef0f6",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(28, 27, 41, 0.12)",
      },
    },
  },
  plugins: [],
};

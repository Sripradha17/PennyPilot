/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Neutral / surfaces
        bg: "#F6F6F1",
        surface: "#FFFFFF",
        surface2: "#FBFAF5",
        canvas: "#EFEEE6",
        ink: "#20241F",
        mist: "#E4E4DA",

        // Brand
        forest: "#2B5F47",
        "forest-dark": "#1E4735",
        sage: "#A9C6A0",
        "sage-light": "#E4EEE0",

        // Accents
        sky: "#6C97C0",
        gold: "#E1AE55",
        coral: "#D77F6C",
        plum: "#9C8FC4",
        cream: "#F1E9D6",
        teal: "#5C8FA8",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        soft: "0 16px 40px -22px rgba(32, 36, 31, 0.22)",
        card: "0 2px 10px -4px rgba(32, 36, 31, 0.08)",
        raised: "0 20px 45px -20px rgba(32, 36, 31, 0.28)",
      },
      maxWidth: {
        content: "1280px",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};

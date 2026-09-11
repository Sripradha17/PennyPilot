import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this app from https://<user>.github.io/BudgetRaccoon/, a subpath —
// every asset URL needs that prefix in production builds. Local dev stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/BudgetRaccoon/" : "/",
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
}));

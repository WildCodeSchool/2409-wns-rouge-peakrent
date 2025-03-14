/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    watch: { usePolling: true },
    // this is mandatory to use front and back apps on the same domain
    // avoiding CORS & cookies issues
    proxy: {
      "/api": {
        target: "http://backend:4000", // or http://localhost:5000 if you are running the front locally with npm run dev
      },
    },
  },
  test: {
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
});

/// <reference types="vitest" />
/// <reference types="vite/client" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    watch: { usePolling: true },
    hmr: { path: "/hmr" },
    // this is mandatory to use front and back apps on the same domain
    // avoiding CORS & cookies issues
    allowedHosts: ["frontend"],
    proxy: {
      "/api": {
        target: "http://backend:4000", // or http://localhost:5000 if you are running the front locally with npm run dev
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
});

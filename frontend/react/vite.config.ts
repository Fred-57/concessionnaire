import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/express": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/express/, ""),
      },
      "/nest": {
        target: "http://localhost:3001",
        rewrite: (path) => path.replace(/^\/nest/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

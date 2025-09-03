import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
=======
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
>>>>>>> cc024f2abfab9c996eb85828c3eb46cc1f7a6b20
});

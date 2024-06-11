import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /*build: {
    manifest: true,
    rollupOptions: {
      input: './src/client/main.jsx',
    },
  },
  server: {
    proxy: {
      "./src/server": "http:localhost:3000"
    }
  }/*
});

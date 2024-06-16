import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";
import { manifestForPlugIn } from "./src/manifestConfig";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: manifestForPlugIn.registerType,
      includeAssets: manifestForPlugIn.includeAssets,
      manifest: manifestForPlugIn.manifest
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src") // Redirects '@' imports to 'src' folder
    }
  },
  server: {
    cors: {
      origin: "https://localhost:3000", // Front end URL origin
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE "],
      allowedHeaders: ["Content-Type", "Authorization", "x-xsrf-token"],
      credentials: true
    }
  }
});

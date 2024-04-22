import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // Redirige tous les imports '@' vers le dossier 'src'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:8000',
        changeOrigin: true,
        secure: false, // If your backend is HTTP, you might need to set secure to false
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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

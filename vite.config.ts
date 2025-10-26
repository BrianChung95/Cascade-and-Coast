import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Cascade-and-Coast/',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5173
  }
});

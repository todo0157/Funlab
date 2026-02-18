import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/menhera/' : '/',
  server: {
    port: 3002,
  },
  build: {
    outDir: 'dist',
  },
}));

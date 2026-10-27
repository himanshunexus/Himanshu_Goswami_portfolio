import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: { postcss: { plugins: [] } },
  build: { rollupOptions: { output: { manualChunks: (id) => id.includes('/node_modules/three/') ? 'three' : undefined } } },
});

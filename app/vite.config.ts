import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  // src alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});

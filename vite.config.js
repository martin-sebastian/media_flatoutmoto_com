import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    // Proxy API requests to Vercel Dev
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'if-function'],
      },
    },
  },
});

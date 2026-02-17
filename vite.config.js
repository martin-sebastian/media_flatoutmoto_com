import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

/** Recursively collect all .html files for multi-page build */
function findHtmlEntries(dir, base = '') {
  const entries = {};
  for (const file of readdirSync(dir)) {
    const full = resolve(dir, file);
    const rel = base ? `${base}/${file}` : file;
    if (statSync(full).isDirectory() && !['node_modules', 'dist', '.git', 'api', '.vercel'].includes(file)) {
      Object.assign(entries, findHtmlEntries(full, rel));
    } else if (file.endsWith('.html')) {
      const name = rel.replace(/\.html$/, '').replace(/\//g, '_');
      entries[name] = full;
    }
  }
  return entries;
}

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
  build: {
    rollupOptions: {
      input: findHtmlEntries(resolve(__dirname, '.')),
    },
  },
});

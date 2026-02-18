import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync, cpSync } from 'fs';

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

/** Vite plugin: copy non-module static assets to dist after build */
function copyStaticAssets() {
  const dirs = ['js', 'css', 'img', 'fonts'];
  const files = [
    'worker.js', 'apple-touch-icon.png', 'favicon.ico',
    'hang-tags/hang-tag.js',
    'key-tags/key-tag.js', 'key-tags/zpl-template.js',
    'print/print.js',
    'parts/app.js',
    'tv/launcher.js',
    'calendar/script.js',
  ];
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const root = resolve(__dirname);
      const out = resolve(__dirname, 'dist');
      for (const d of dirs) {
        try { cpSync(resolve(root, d), resolve(out, d), { recursive: true }); } catch {}
      }
      for (const f of files) {
        try { cpSync(resolve(root, f), resolve(out, f)); } catch {}
      }
    },
  };
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
  plugins: [copyStaticAssets()],
  build: {
    rollupOptions: {
      input: findHtmlEntries(resolve(__dirname, '.')),
    },
  },
});

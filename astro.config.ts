import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { SITE } from './app/lib/site';

export default defineConfig({
  site: SITE.url,
  srcDir: './app',
  outDir: './build/client',
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { port: 5173 },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { SITE } from './app/lib/site';

export default defineConfig({
  site: SITE.url,
  srcDir: './app',
  outDir: './build/client',
  server: { port: 5173 },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});

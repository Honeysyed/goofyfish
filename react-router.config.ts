import type { Config } from '@react-router/dev/config';
import { games } from './app/lib/games';

export default {
  ssr: false,
  prerender: ['/', '/make', '/404', '/sitemap.xml', ...games.map((g) => `/${g.slug}`)],
} satisfies Config;

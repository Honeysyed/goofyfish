import { games, SITE } from '~/lib/games';

export function loader() {
  const paths = ['/', '/make', ...games.map((g) => `/${g.slug}`)];
  const urls = paths.map((p) => `  <url><loc>${new URL(p, SITE.url).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

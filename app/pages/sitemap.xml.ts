import { games } from '~/lib/games';
import { absoluteUrl } from '~/lib/site';

export function GET() {
  const paths = ['/', '/make', ...games.map((g) => `/${g.slug}`)];
  const urls = paths.map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}

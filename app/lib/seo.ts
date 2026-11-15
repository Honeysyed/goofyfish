import type { MetaDescriptor } from 'react-router';
import { SITE } from './games';

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
};

export function seo(input: SeoInput): MetaDescriptor[] {
  const url = new URL(input.path, SITE.url).href;
  const image = new URL(input.image ?? '/og/home.jpg', SITE.url).href;

  const tags: MetaDescriptor[] = [
    { title: input.title },
    { name: 'description', content: input.description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:title', content: input.title },
    { property: 'og:description', content: input.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: SITE.twitter },
    { name: 'twitter:title', content: input.title },
    { name: 'twitter:description', content: input.description },
    { name: 'twitter:image', content: image },
  ];

  if (input.jsonLd) {
    tags.push({ 'script:ld+json': input.jsonLd });
  }

  return tags;
}

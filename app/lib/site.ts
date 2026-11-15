export const SITE = {
  name: 'Goofy Fish',
  url: 'https://goofyfish.com',
  tagline: 'Small, silly games for the browser',
  description:
    'Small, silly games that run in your browser. Free, no ads, no sign-ups, no downloads. Best with sound on.',
  twitter: '@nilbuild',
  github: 'https://github.com/nilbuild/goofyfish',
  author: { name: 'Kamran Ahmed', url: 'https://kamran.fyi' },
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE.url).href;
}

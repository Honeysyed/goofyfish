# goofyfish

Small, silly games for the browser. Live at [goofyfish.com](https://goofyfish.com).

Static site built with React Router (framework mode, `ssr: false` + prerender) and Tailwind v4.

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build     # static output in build/client
pnpm preview   # serve build/client on :4173
```

## How it's put together

- `app/lib/games.ts` is the registry. Every entry gets a prerendered page at `/<slug>`, a card on the home page and a sitemap entry.
- Each game is a single self-contained HTML file in `public/games/<slug>.html`. The `/<slug>` route renders the SEO meta and loads the game in a full-screen iframe.
- Each card's thumbnail is `public/thumbs/<slug>.webp`: a generated stick-figure scene in the games' ink style, background cut out. `public/og/<slug>.jpg` (1200×630) is the social image.
- Set `VITE_GA_ID` at build time to turn on Google Analytics.

## Adding a game

1. Drop the game in `public/games/<slug>.html`. Keep it self-contained, link back with `<a class="back" href="/" target="_top">← all games</a>`.
2. Add `public/og/<slug>.jpg` (1200×630) and a thumbnail `public/thumbs/<slug>.webp` (transparent, ~640px, stick-figure style like the others).
3. Add an entry to `app/lib/games.ts` with today's date as `addedAt`. The newest date gets the "New" badge.

## Deploying

`build/client` is plain static files. Any static host works. Unknown paths should serve `404.html`.

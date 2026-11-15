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

The easy way: open the repo in [Claude Code](https://claude.com/claude-code) and ask for a game. The `make-goofyfish-game` skill in `.claude/skills/` pitches ideas, builds the game from its starter template in the house style, makes the thumbnail and social image, registers it and prepares a pull request. The same steps are on [goofyfish.com/make](https://goofyfish.com/make).

By hand:

1. Copy `.claude/skills/make-goofyfish-game/template.html` to `public/games/<slug>.html` and build the game. Follow `references/style-guide.md` in the same folder.
2. Add `public/og/<slug>.jpg` (1200×630) and a thumbnail `public/thumbs/<slug>.webp` (transparent, ~640px, stick-figure style like the others).
3. Add an entry to `app/lib/games.ts` with today's date as `addedAt`. The newest date gets the "New" badge.

## Deploying

`build/client` is plain static files. Any static host works. Unknown paths should serve `404.html`.

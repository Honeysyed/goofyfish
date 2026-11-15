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

Get the goofyfish skill for [Claude Code](https://claude.com/claude-code) (or download `skill.zip` from [goofyfish.com/make](https://goofyfish.com/make)):

```
mkdir -p ~/.claude/skills && curl -fsSL https://goofyfish.com/skill.tar.gz | tar -xz -C ~/.claude/skills
```

Then, from any folder, ask for a game (`claude "make a goofyfish game where you keep a balloon in the air"`). The `make-goofyfish-game` skill forks and clones this repo, pitches ideas, builds the game from its starter template in the house style, checks it at phone and laptop sizes, makes the social image and the card thumbnail, registers it and opens a pull request. The same steps are on [goofyfish.com/make](https://goofyfish.com/make).

The skill lives in `.claude/skills/make-goofyfish-game/`, so it's also there when you clone the repo. `pnpm build` packs that folder into `skill.zip` and `skill.tar.gz` for the site. Once the skill has cloned the repo it follows the repo's copy, so old downloads still get the latest instructions.

Helpers the skill uses, also handy by hand:

- `pnpm game:check <slug>`: with `pnpm dev` running, loads the game at phone and laptop sizes, fails on console errors, saves screenshots to `tmp/check/` and writes `public/og/<slug>.jpg`.
- `pnpm game:thumb <slug> "<scene>"`: generates the stick-figure thumbnail with the OpenAI image API (`OPENAI_API_KEY`), cuts it out and saves `public/thumbs/<slug>.webp`.

By hand: copy `.claude/skills/make-goofyfish-game/template.html` to `public/games/<slug>.html`, follow `references/style-guide.md` next to it, run the two helpers and add an entry to `app/lib/games.ts`.

## Deploying

`build/client` is plain static files. Any static host works. Unknown paths should serve `404.html`.

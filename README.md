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

Clone the repo and ask [Claude Code](https://claude.com/claude-code) for a game:

```
git clone https://github.com/nilbuild/goofyfish
cd goofyfish && pnpm install
claude "make a goofyfish game where you keep a balloon in the air"
```

The `make-goofyfish-game` skill in `.claude/skills/` pitches ideas, builds the game from its starter template in the house style, checks it at phone and laptop sizes, makes the social image and the card thumbnail, registers it, then helps you fork the repo and open a pull request (with the GitHub CLI if you have it, otherwise through the browser). The same steps are on [goofyfish.com/make](https://goofyfish.com/make).

`pnpm build` also packs the skill into `skill.zip` and `skill.tar.gz` on the site, for people who want it in `~/.claude/skills/`. Started from outside the repo, it clones the repo first and then follows the repo's copy of itself, so old downloads still get the latest instructions.

Helpers the skill uses, also handy by hand:

- `pnpm game:check <slug> [--og]`: with `pnpm dev` running, loads the game at phone and laptop sizes, fails on console errors and saves screenshots to `tmp/check/`. If the game has a `?bot` mode it times three bot runs and grabs the social image mid-run. It only writes `public/og/<slug>.jpg` when it's missing, or with `--og`.
- `pnpm game:thumb <slug> "<scene>"`: generates the stick-figure thumbnail with the OpenAI image API (`OPENAI_API_KEY`), cuts it out and saves `public/thumbs/<slug>.webp`. Attempts are kept in `tmp/thumbs/`; `--use <n>` puts an earlier one back.

By hand: copy `.claude/skills/make-goofyfish-game/template.html` to `public/games/<slug>.html`, follow `references/style-guide.md` and reuse `references/snippets.js` next to it, run the two helpers and add an entry to `app/lib/games.ts`.

## Deploying

`build/client` is plain static files. Any static host works. Unknown paths should serve `404.html`.

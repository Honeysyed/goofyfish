---
name: make-goofyfish-game
description: Make a new small browser game for goofyfish.com in the house style (stick figures, ink on dotted paper, butter-yellow accents, one simple input), generate its thumbnail and social image, and submit it as a pull request to nilbuild/goofyfish. Use when someone wants to make, build, design or submit a goofyfish game.
---

# Make a goofyfish game

goofyfish.com is a collection of small, silly games that run in the browser. Every game is one self-contained HTML file with the same look and the same chrome, so a new game should feel like it was always part of the set.

This skill takes someone from an idea to an open pull request. Work through the steps in order and keep the person posted in a line or two as you go.

## 1. Get the repo

Check whether the current folder is the goofyfish repo: it has `app/lib/games.ts` and `public/games/`. If it is, run `pnpm install` if `node_modules` is missing and move on.

If it isn't:

1. Check the tools: `node --version` (20 or newer), `pnpm --version`, `gh auth status`. If something is missing, tell the person what to install (`npm i -g pnpm`, `brew install gh` then `gh auth login`) and stop until it's there.
2. Fork and clone into a new `goofyfish` folder inside the current one:
   ```bash
   gh repo fork nilbuild/goofyfish --clone --default-branch-only
   cd goofyfish
   pnpm install
   pnpm exec playwright install chromium
   ```
   If a `goofyfish` folder already exists, use it: `cd goofyfish && git checkout main && git pull upstream main && pnpm install`.

Do all later work inside that folder.

**Use the repo's copy of this skill from here on.** The copy that was installed or downloaded may be older. Read `.claude/skills/make-goofyfish-game/SKILL.md` inside the repo and follow it from step 2. The template and style guide live next to it:

- `.claude/skills/make-goofyfish-game/template.html`: a small working game ("Keep Hopping") with all the house chrome. Start every game from it.
- `.claude/skills/make-goofyfish-game/references/style-guide.md`: palette, stick-figure proportions, line weights, UI and feel rules. Read it before drawing anything.

## 2. Pitch before building

Ask what game they have in mind. If they don't have one, pitch three short ideas and let them pick. A good goofyfish game:

- Uses **one input**: tap, hold, swipe, or aim and release. Arrow keys only when the game truly needs them.
- Has a **stick figure** (or a few simple objects) doing one physical thing: hop, stack, chop, punch, throw, balance.
- Gets you playing in under 3 seconds; a run lasts 30 seconds to 3 minutes.
- Has a goofy twist or a satisfying feel moment (perfect landings, chains, combos, near misses).
- Works for a 6-year-old and a 40-year-old. Cartoon bonks only, no text-heavy rules.
- Is original. Don't recreate an existing commercial game, its name, characters or levels.

Look at `app/lib/games.ts` so the idea doesn't repeat an existing game. Name it like the others ("Keep Stacking", "Ten Balls", "Paper Glider", "Knockdown") and pick a short lowercase slug that isn't taken (`stacks`, `hoops`).

Once they pick, create the branch: `git checkout -b game/<slug>`.

## 3. Build it

Copy `.claude/skills/make-goofyfish-game/template.html` to `public/games/<slug>.html` and replace "Keep Hopping" with the new game. Keep the structure:

- `<canvas id="c">` fills the screen; the whole game world is drawn on it.
- `.back` link top-right (`href="/" target="_top"`), the HUD panel top-left, the hint pill at the bottom, the overlay with a start card (`#playBtn`) and an end card (`#againBtn`, `#shareBtn`), and a toast.
- `store` saves lifetime stats to `localStorage` under `<slug>.` keys. Show the best score on both cards.
- Sounds are synthesized with Web Audio. No audio files. Create the context on the first tap.
- `pointerdown` on the canvas plus `Space`/`Enter` on the keyboard. `Space` also starts and restarts from the cards.
- The end card's download button renders a 1080×1350 share image (`shareCanvas`).
- `?still` freezes the loop and `?autoplay` skips the start card, for screenshots.

Open one or two existing games in `public/games/` (`stacks.html`, `hoops.html`) and borrow their patterns: poses, popups, chains, screen shake, the share image layout.

Rules:

- One file. Inline CSS and JS. External scripts only from a CDN with a pinned version, and only when really needed.
- Balsamiq Sans, regular weight (400) only.
- No analytics, trackers, ads or network calls.
- Works on a phone in portrait and on a laptop: touch, mouse and keyboard. Respect safe areas, keep `touch-action: none`, never rely on hover.
- Keep it under about 250 KB.

## 4. Play it

Start the dev server in the background with `pnpm dev`, then run:

```bash
pnpm game:check <slug>
```

It loads the game at phone and laptop sizes, presses Play, fails on any console error, saves screenshots to `tmp/check/`, and writes the social image to `public/og/<slug>.jpg`. Look at every screenshot. If you have a browser tool, also play a full run: start, lose, end card, play again, by tap and by keyboard, and check the best score survives a reload.

Fix what you find and run the check again. A first-timer should survive at least 20 seconds, and difficulty should ramp up.

The social image should show a good moment mid-game with the HUD visible and no overlay. If the automatic one is dull, retake it at 1200×630.

## 5. Make the thumbnail

The card on the home page shows one stick figure doing the game's action, in the same ink style as the other cards. Generate it:

```bash
pnpm game:thumb <slug> "A stick figure <doing the game's action with its one prop>"
```

It calls the OpenAI image API with the house style reference, cuts out the background and saves `public/thumbs/<slug>.webp`. It needs `OPENAI_API_KEY` in the environment and costs a few cents; ask before running it if you're not sure they're fine with that. Look at the result next to two existing thumbnails. If it doesn't match (wrong style, extra scenery, text), run it again with a clearer scene.

If there's no API key, skip this step and say so in the pull request. A maintainer will draw it.

## 6. Register it

Add an entry at the top of the array in `app/lib/games.ts`:

```ts
{
  slug: '<slug>',
  name: 'Keep Hopping',
  tagline: 'Hop the balls, they keep speeding up',
  description: 'Two or three plain sentences for search and link previews: what you do, the twist, how a run ends.',
  addedAt: 'YYYY-MM-DD',
  controls: 'tap',
},
```

`controls` is one word (`tap`, `hold`, `swipe`, `aim`, `arrows`, `draw`). Add `needs: 'webcam'` if it needs a camera. `addedAt` is today; the newest games get the "New" badge.

Run `pnpm typecheck` and `pnpm build`, then open `http://localhost:5173/<slug>` and `http://localhost:5173/` to see it inside the site.

## 7. Open the pull request

Show the person a short summary (name, how to play, the thumbnail, the check results) and ask if they're ready to submit. Then:

```bash
git add public/games/<slug>.html public/og/<slug>.jpg public/thumbs/<slug>.webp app/lib/games.ts
git commit -m "Add <Game Name>"
git push -u origin game/<slug>
gh pr create --repo nilbuild/goofyfish --base main --title "Add <Game Name>" --body-file <file>
```

Write the body to a temp file first:

```markdown
## <Game Name>

<Two or three sentences: what you do, the twist, how a run ends.>

**Controls:** <tap / hold / ...>

![screenshot](<raw.githubusercontent.com link to public/og/<slug>.jpg on the fork's branch>)

- [x] `pnpm game:check` passes (no console errors, phone and laptop)
- [x] Played a full run on touch and keyboard
- [x] `pnpm build` passes
- [ ] or [x] Thumbnail generated with `pnpm game:thumb`
```

Give the person the pull request link when it's open.

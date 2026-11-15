---
name: game
description: Make a new small browser game for goofyfish.com in the house style (stick figures, ink on dotted paper, butter-yellow accents, one simple input), generate its thumbnail and social image, and submit it as a pull request to nilbuild/goofyfish. Use when someone wants to make, build, design or submit a goofyfish game.
---

# Make a goofyfish game

goofyfish.com is a collection of small, silly games that run in the browser. Every game is one self-contained HTML file with the same look and the same chrome, so a new game should feel like it was always part of the set.

This skill takes someone from an idea to an open pull request. Work through the steps in order and keep the person posted in a line or two as you go.

## 1. Get the repo

Check the tools first: `git --version`, `node --version` (20 or newer) and `pnpm --version`. If one is missing, tell the person what to install (pnpm: `npm i -g pnpm`) and stop until it's there.

Check whether the current folder is the goofyfish repo: it has `app/lib/games.ts` and `public/games/`. If it is, run `pnpm install` if `node_modules` is missing.

If it isn't, clone it into a new `goofyfish` folder inside the current one:

```bash
git clone https://github.com/nilbuild/goofyfish
cd goofyfish
pnpm install
```

If a `goofyfish` folder already exists, use it: `cd goofyfish && git checkout main && git pull && pnpm install`.

Either way, run `pnpm exec playwright install chromium` once so `pnpm game:check` can drive a browser.

Do all later work inside that folder.

**Use the repo's copy of this skill from here on.** The copy that was installed or downloaded may be older. Read `.claude/skills/game/SKILL.md` inside the repo and follow it from step 2. The template and style guide live next to it:

- `.claude/skills/game/template.html`: a small working game ("Keep Hopping") with all the house chrome. Start every game from it.
- `.claude/skills/game/references/style-guide.md`: palette, stick-figure proportions, line weights, UI and feel rules. Read it before drawing anything.

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

Copy `.claude/skills/game/template.html` to `public/games/<slug>.html` and replace "Keep Hopping" with the new game. The template is a complete small game built from the same pieces as the existing games, so keep its structure and swap out the gameplay:

- `<canvas id="c">` fills the screen; the whole game world is drawn on it, in world units fitted to the screen by `fitView()`.
- `.back` link top-right (`href="/" target="_top"`), the HUD panel top-left, the hint pill at the bottom, the overlay with a start card (`#playBtn`) and an end card (`#againBtn`, `#shareBtn`), and a toast.
- `store` saves lifetime stats to `localStorage` under `<slug>.` keys and skips saving in test modes. Show the best score on both cards.
- Sounds are synthesized with Web Audio (`partial`, `hiss`, `SND`). No audio files. `audio()` runs on the first tap.
- `pointerdown` on the canvas plus `Space`/`Enter` on the keyboard. `Space` also starts and restarts from the cards.
- The end card's download button renders a 1080×1350 share image (`shareCanvas`), with the stick figure drawn on it.

**Reuse the shared pieces.** `.claude/skills/game/references/snippets.js` has everything the template uses, documented: the posed stick figure (`P` poses, `mk()` to make new ones, `Actor` to animate between them, `drawFigure()` with flip and grey "goon" colours), wobbly ground, ink shapes, popups that stay on screen, particles, screen shake, the sound engine and `fitView()`. Don't draw your own stick figure. For more patterns (chains, wind, cameras that follow the action, richer share images) read an existing game such as `public/games/stacks.html` or `public/games/bopping.html`.

**Design for both screens from the start.** Pick a world size in `VIEW` that suits a laptop. On portrait phones `fitView()` shows at least `VIEW.minW` world units centred on `VIEW.focusX`, so set those so the action stays big and visible; things outside that slice should scroll, roll or fly into view rather than sit off-screen.

**Test modes.** Keep these working, the checks rely on them:

- `?bot`: the game plays itself like a decent first-timer, with a human reaction delay and some aim error, never perfectly. Set `window.__bot = true` when it's on, and set `window.__lastRun = { score, time }` when a run ends (time in seconds). Adapt the template's `bot()` to your game.
- `?autoplay` skips the start card; `?still` freezes the loop for screenshots.
- No stats are saved in any test mode (`TEST`).

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

It loads the game at phone and laptop sizes, presses Play, fails on any console error and saves screenshots to `tmp/check/`. With a `?bot` mode it also plays three bot runs and prints how long each lasted, and if `public/og/<slug>.jpg` doesn't exist yet it takes the social image 7 seconds into a bot run. Pass `--og` to retake that image; otherwise it's left alone.

Look at every screenshot. Aim for bot runs of at least 20 seconds (a first-timer should get that far) and well under 3 minutes (the difficulty has to ramp). Tune, then run the check again.

Driving the game through browser-tool clicks is too slow to react in real time. To try specific situations, run code inside the page (call the game's own functions, or dispatch `pointerdown` events), or watch `?bot` play. Make sure start, lose, end card, play again and the share download all work, by tap and by keyboard.

The social image should show a good moment mid-game with the HUD visible and no overlay. If the automatic one is dull, adjust the timing or run with `--og` again.

## 5. Make the thumbnail

The card on the home page shows one stick figure doing the game's action, in the same ink style as the other cards. Generate it:

```bash
pnpm game:thumb <slug> "A stick figure <doing the game's action with its one prop>"
```

It calls the OpenAI image API with the house style reference, cuts out the background and saves `public/thumbs/<slug>.webp`. It needs `OPENAI_API_KEY` in the environment and costs a few cents per attempt; ask before running it if you're not sure they're fine with that.

Describe a scene that's wider than it is tall (figure and prop side by side). A tall, narrow result looks small on its card, and the script warns when that happens. Every attempt is kept in `tmp/thumbs/<slug>-<n>.webp`; the newest goes on the card, and `pnpm game:thumb <slug> --use <n>` puts an earlier one back. Compare it with two existing thumbnails and retry if it doesn't match (wrong style, extra scenery, text).

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

`controls` is one word: `tap`, `hold`, `swipe`, `aim`, `steer`, `arrows`, `draw` or `body`. Add `needs: 'webcam'` if it needs a camera. `addedAt` is today. Only the games with the newest `addedAt` get the "New" badge, so adding one moves the badge to it; that's expected.

Run `pnpm typecheck` and `pnpm build`, then open `http://localhost:5173/<slug>` and `http://localhost:5173/` to see it inside the site.

## 7. Open the pull request

Show the person a short summary (name, how to play, the thumbnail, the check results) and ask if they're ready to submit.

Commit on the branch:

```bash
git add public/games/<slug>.html public/og/<slug>.jpg public/thumbs/<slug>.webp app/lib/games.ts
git commit -m "Add <Game Name>"
```

Then get it onto their fork and open the pull request. Use the GitHub CLI if it's installed and signed in (`gh auth status`), otherwise walk them through the browser. Don't make them install anything.

**With `gh`:**

```bash
gh api user -q .login          # their username
gh repo fork --remote          # only if origin isn't already their fork; makes the fork origin
git push -u origin game/<slug>
gh pr create --repo nilbuild/goofyfish --base main --head <username>:game/<slug> --title "Add <Game Name>" --body-file <file>
```

**Without `gh`:** guide them one step at a time and wait for each:

1. Open https://github.com/nilbuild/goofyfish/fork and create the fork. Ask for their GitHub username.
2. Add it as a remote and push (git will use their usual GitHub login):
   ```bash
   git remote add fork https://github.com/<their-username>/goofyfish.git
   git push -u fork game/<slug>
   ```
3. Give them the ready link to open the pull request, with the title filled in:
   `https://github.com/nilbuild/goofyfish/compare/main...<their-username>:goofyfish:game/<slug>?expand=1&title=Add%20<Game%20Name>`
   and the body below to paste in.

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

---
name: make-goofyfish-game
description: Make a new small browser game for goofyfish.com in the house style (stick figures, ink on dotted paper, butter-yellow accents, one simple input) and prepare it as a pull request. Use when someone wants to make, build, design or submit a game for goofyfish, or asks to add a game to this repo.
---

# Make a goofyfish game

goofyfish.com is a collection of small, silly games that run in the browser. Every game is a single self-contained HTML file with the same look and the same chrome, so a new game should feel like it was always part of the set.

Work through these steps in order. Do not skip the pitch.

## 1. Pitch before building

Ask what game they have in mind. If they don't have one, pitch three short ideas and let them pick. A good goofyfish game:

- Uses **one input**: tap, hold, swipe, or aim and release. Arrow keys only when the game truly needs them.
- Has a **stick figure** (or a few simple objects) doing one physical thing: hop, stack, chop, punch, throw, balance.
- Gets you playing in under 3 seconds, and a run lasts 30 seconds to 3 minutes.
- Has a goofy twist or a satisfying feel moment (perfect landings, chains, combos, near misses).
- Works for a 6-year-old and a 40-year-old. No violence beyond cartoon bonks, no text-heavy rules.
- Is original. Do not recreate an existing commercial game, its name, characters or levels.

Name it like the others: "Keep Stacking", "Keep Chopping", "Ten Balls", "Paper Glider", "Knockdown". Pick a short lowercase slug (`stacks`, `chopping`, `hoops`).

## 2. Build it from the template

Copy `template.html` (next to this file) to `public/games/<slug>.html` and replace the example game ("Keep Hopping") with the new one. Keep the structure:

- `<canvas id="c">` fills the screen. Everything in the game world is drawn on it.
- `.back` link top-right (`href="/" target="_top"`), the HUD panel top-left, a hint pill at the bottom, the overlay with a start card and an end card, and a toast.
- `store` saves lifetime stats to `localStorage` under `<slug>.` keys. Show the best score on the start and end cards.
- Sounds are synthesized with Web Audio (`partial`, plus noise bursts if needed). No audio files. Create the context on the first tap.
- Input handles `pointerdown` on the canvas plus `Space`/`Enter` on the keyboard. `Space` also starts or restarts from the cards.
- The end card has a download button that renders a 1080×1350 share image (`shareCanvas`).
- `?still` freezes the game loop, so you can take screenshots.

Read `references/style-guide.md` before drawing anything. It has the palette, the stick-figure proportions, the line weights and the UI rules. The game must look like it belongs next to the existing ones in `public/games/`. Open one or two of them (`stacks.html`, `hoops.html`) to copy patterns such as poses, popups and screen shake.

Rules:

- One file. Inline CSS and JS. External scripts only from a CDN with a pinned version (for example `https://cdn.jsdelivr.net/npm/planck@1.0.6/dist/planck.min.js`), and only when really needed.
- Font is Balsamiq Sans, regular weight (400) only.
- No analytics, trackers, ads or network calls. Pose or camera models must run locally.
- It must work on a phone in portrait and on a laptop: touch, mouse and keyboard. Respect safe areas, keep `touch-action: none`, and don't rely on hover.
- Keep it under about 250 KB.

## 3. Play it

Run `pnpm install` once, then `pnpm dev` and open `http://localhost:5173/games/<slug>.html`. Check:

- No console errors.
- Start card, a full run, end card and play again all work, by tap and by keyboard.
- The best score survives a reload.
- It looks right at 390×844 (phone) and 1440×900 (laptop).
- The difficulty ramps up. A first-timer should survive at least 20 seconds.

Fix what you find, then play it again.

## 4. Make the two images

**Social image**, `public/og/<slug>.jpg`, 1200×630: a screenshot of a good moment mid-game, with the HUD visible and no overlay. Use `?still` or pause the loop to grab it.

**Card thumbnail**, `public/thumbs/<slug>.webp`: one stick figure doing the game's single action, in the same ink style as the other thumbnails. If you can generate images (for example with `gpt-image-2` via an image edit call), pass `assets/thumb-style-ref.jpg` as the style reference with this prompt, filling in the scene:

```
<ONE SENTENCE: a stick figure doing the game's action with its one prop>. The attached image is a STYLE REFERENCE ONLY (screenshots from my stick-figure browser games); do not copy its layout, text or scene. Draw a brand-new, very simple illustration in exactly that drawing style: a stick figure with a round solid black head and thick black rounded limbs (some limbs a lighter grey for depth), thin clean black ink lines for props, white fills, light grey secondary details, and one small butter-yellow (#fde68a) or amber (#b45309) accent. Minimal: one stick figure and one prop, no background scenery, no ground except an optional short thin ground line, no text, no letters, no UI, no numbers. Centered with generous margin on a pure flat white background, no dot grid.
```

Generate it at 1536×1024, then cut it out to a transparent WebP:

```bash
python3 .claude/skills/make-goofyfish-game/scripts/cutout.py public/thumbs path/to/<slug>.png --max 640
```

(Needs `pip install pillow numpy scipy`.) If you can't generate images, skip the thumbnail and say so in the pull request. A maintainer will draw it.

## 5. Register it

Add an entry to `app/lib/games.ts`:

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

`controls` is one word (`tap`, `hold`, `swipe`, `aim`, `arrows`, `draw`). Add `needs: 'webcam'` if the game needs a camera. Use today's date for `addedAt`; the newest games get the "New" badge.

Run `pnpm typecheck` and `pnpm build`, then open `http://localhost:5173/<slug>` to see it inside the site.

## 6. Open a pull request

Commit on a new branch with a short message ("Add Keep Hopping") and open a pull request against `main` with:

- What the game is and how to play, in two or three sentences.
- A screenshot or short screen recording.
- Confirmation of the checks in step 3, and whether the thumbnail is included.

Only open the pull request when the person asks for it.

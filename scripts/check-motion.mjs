// Plays a game with ?bot and checks every stick figure frame by frame for anatomy and motion glitches.
// usage: pnpm game:motion <slug> [seconds] [--bot <kind>]   (no dev server needed)
// --bot picks the bot kind for games whose ?bot needs a value (for example --bot good).
//
// bent-back-elbow  an elbow bends the wrong way (the forearm folds backwards)
// bent-back-knee   a knee bends the wrong way
// elbow-out-back   the upper arm swings back and the forearm folds forward to a low hand (a broken wing)
// jump             a joint of the main figure teleports between frames (a snap)
//
// It records limbs through the game's strokePath(), so draw figures with drawFigure() from the snippets.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const argv = process.argv.slice(2);
const bi = argv.indexOf('--bot');
const botKind = bi >= 0 ? argv[bi + 1] : '';
const [slug, secArg] = argv.filter((a, i) => i !== bi && i !== bi + 1 || bi < 0);
if (!slug) {
  console.error('Usage: pnpm game:motion <slug> [seconds]');
  process.exit(1);
}
const file = slug.endsWith('.html') ? resolve(slug) : resolve('public/games', slug + '.html');
if (!existsSync(file)) {
  console.error('No game at ' + file);
  process.exit(1);
}
const secs = Number(secArg || 25);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 720 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.addInitScript(() => {
  window.__frames = [];
  let cur = [];
  const tick = () => {
    window.__frames.push(cur);
    cur = [];
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const wrap = () => {
    if (typeof window.strokePath !== 'function' || window.strokePath.__w) {
      return;
    }
    const orig = window.strokePath;
    const w = function (pts, wd, col) {
      if (pts && pts.length === 3 && (wd === 4.2 || wd === 5)) {
        cur.push({ k: wd === 5 ? 'leg' : 'arm', p: pts.map((q) => [q[0], q[1]]) });
      }
      return orig.apply(this, arguments);
    };
    w.__w = true;
    window.strokePath = w;
  };
  window.addEventListener('load', wrap);
  setTimeout(wrap, 50);
  setTimeout(wrap, 500);
});
await page.goto(pathToFileURL(file).href + (botKind ? '?bot=' + encodeURIComponent(botKind) : '?bot'));
await page.waitForTimeout(1200);
const play = await page.$('button');
if (play) {
  await play.click().catch(() => {});
}
await page.waitForTimeout(secs * 1000);
const frames = await page.evaluate(() => window.__frames);
await browser.close();

const FPS = 60;
const found = [];
const add = (kind, i, note) => {
  const t = i / FPS;
  const last = found.findLast((x) => x.kind === kind && x.note === note);
  if (last && t - last.to < 0.15) {
    last.to = t;
    return;
  }
  found.push({ kind, from: t, to: t, note });
};
const bendOf = (s) => {
  const [a, b, c] = s.p;
  const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]];
  const lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);
  return { u, v, lu, lv, cross: lu < 1 || lv < 1 ? 0 : (u[0] * v[1] - u[1] * v[0]) / (lu * lv) };
};
let drawn = 0;
frames.forEach((fr, i) => {
  if (fr.length) {
    drawn++;
  }
  fr.forEach((s, n) => {
    const { u, v, lu, lv, cross } = bendOf(s);
    if (s.k === 'arm') {
      if (cross > 0.3) {
        add('bent-back-elbow', i, `arm ${n}`);
      }
      if (lu > 1 && lv > 1 && u[0] / lu < -0.55 && v[0] / lv > 0.25 && v[1] > 0) {
        add('elbow-out-back', i, `arm ${n}`);
      }
    } else if (cross < -0.3) {
      add('bent-back-knee', i, `leg ${n}`);
    }
  });
});
for (let i = 1; i < frames.length - 1; i++) {
  const a = frames[i - 1], f = frames[i], c = frames[i + 1];
  if (!f.length || a.length !== f.length || c.length !== f.length) {
    continue;
  }
  for (let s = 0; s < Math.min(4, f.length); s++) {
    for (let j = 1; j < 3; j++) {
      const acc = Math.hypot(c[s].p[j][0] - 2 * f[s].p[j][0] + a[s].p[j][0], c[s].p[j][1] - 2 * f[s].p[j][1] + a[s].p[j][1]);
      if (acc > 7) {
        add('jump', i, `${f[s].k} ${s} joint ${j}`);
      }
    }
  }
}
if (errs.length) {
  console.log('errors:\n' + errs.join('\n'));
}
if (!drawn) {
  console.log(`${slug}: no figure strokes recorded. Draw figures with drawFigure() and strokePath() from the snippets.`);
  process.exit(2);
}
if (!found.length) {
  console.log(`${slug}: motion is clean (${drawn} frames)`);
  process.exit(errs.length ? 2 : 0);
}
console.log(`${slug}: ${found.length} finding(s) over ${(frames.length / FPS).toFixed(0)}s of bot play`);
for (const x of found.slice(0, 40)) {
  console.log(`  ${x.kind.padEnd(16)} ${x.from.toFixed(2)}–${x.to.toFixed(2)}s  ${x.note}`);
}
if (found.length > 40) {
  console.log(`  …and ${found.length - 40} more`);
}
process.exitCode = 2;

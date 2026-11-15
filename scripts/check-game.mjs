import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const slug = process.argv[2];
const base = process.env.BASE_URL ?? 'http://localhost:5173';

if (!slug) {
  console.error('Usage: pnpm game:check <slug>   (with `pnpm dev` running)');
  process.exit(1);
}

const url = `${base}/games/${slug}.html`;
const shots = 'tmp/check';
await mkdir(shots, { recursive: true });

const views = [
  { name: 'phone', width: 390, height: 844, scale: 2, mobile: true },
  { name: 'laptop', width: 1440, height: 900, scale: 1, mobile: false },
  { name: 'og', width: 1200, height: 630, scale: 1, mobile: false },
];

const browser = await chromium.launch();
const problems = [];

for (const view of views) {
  const page = await browser.newPage({
    viewport: { width: view.width, height: view.height },
    deviceScaleFactor: view.scale,
    isMobile: view.mobile,
    hasTouch: view.mobile,
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      problems.push(`[${view.name}] console: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => problems.push(`[${view.name}] error: ${err.message}`));

  const res = await page.goto(url, { waitUntil: 'networkidle' });
  if (!res || !res.ok()) {
    problems.push(`[${view.name}] ${url} returned ${res ? res.status() : 'nothing'}`);
    await page.close();
    continue;
  }
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${shots}/${slug}-${view.name}-start.png` });

  const play = page.locator('#playBtn');
  if (await play.isVisible().catch(() => false)) {
    await play.click();
  } else {
    await page.mouse.click(view.width / 2, view.height / 2);
  }
  await page.waitForTimeout(2500);

  const out = view.name === 'og' ? `public/og/${slug}.jpg` : `${shots}/${slug}-${view.name}-play.png`;
  await page.screenshot({ path: out, quality: out.endsWith('.jpg') ? 85 : undefined });
  console.log(`saved ${out}`);
  await page.close();
}

await browser.close();

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.join('\n')}`);
  process.exit(1);
}

console.log(`\nNo console errors. Look at the screenshots in ${shots}/ and at public/og/${slug}.jpg.`);
console.log('If the social image is not a good moment, retake it by hand: it should show the game mid-play, HUD visible, no overlay.');

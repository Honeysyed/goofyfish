import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--'));
const retakeOg = args.includes('--og');
const base = process.env.BASE_URL ?? 'http://localhost:5173';

if (!slug) {
  console.error('Usage: pnpm game:check <slug> [--og]   (with `pnpm dev` running)');
  console.error('  --og   retake public/og/<slug>.jpg even if it exists');
  process.exit(1);
}

const url = `${base}/games/${slug}.html`;
const shots = 'tmp/check';
const ogPath = `public/og/${slug}.jpg`;
await mkdir(shots, { recursive: true });

const browser = await chromium.launch();
const problems = [];

async function open(view, query = '') {
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
  const res = await page.goto(url + query, { waitUntil: 'networkidle' });
  if (!res || !res.ok()) {
    problems.push(`[${view.name}] ${url}${query} returned ${res ? res.status() : 'nothing'}`);
    await page.close();
    return null;
  }
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function pressPlay(page, view) {
  const play = page.locator('#playBtn');
  if (await play.isVisible().catch(() => false)) {
    await play.click();
    return;
  }
  await page.mouse.click(view.width / 2, view.height / 2);
}

const phone = { name: 'phone', width: 390, height: 844, scale: 2, mobile: true };
const laptop = { name: 'laptop', width: 1440, height: 900, scale: 1, mobile: false };
const og = { name: 'og', width: 1200, height: 630, scale: 1, mobile: false };

for (const view of [phone, laptop]) {
  const page = await open(view);
  if (!page) {
    continue;
  }
  await page.screenshot({ path: `${shots}/${slug}-${view.name}-start.png` });
  await pressPlay(page, view);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${shots}/${slug}-${view.name}-play.png` });
  console.log(`saved ${shots}/${slug}-${view.name}-{start,play}.png`);
  await page.close();
}

const probe = await open(laptop, '?bot');
const hasBot = probe ? await probe.evaluate(() => window.__bot === true) : false;
await probe?.close();

const runs = [];
if (hasBot) {
  for (let i = 0; i < 3; i++) {
    const page = await open(laptop, '?bot');
    if (!page) {
      break;
    }
    const started = Date.now();
    await page
      .waitForFunction(() => document.getElementById('overlay')?.classList.contains('on') && document.getElementById('endCard')?.classList.contains('show'), null, {
        timeout: 180000,
        polling: 250,
      })
      .catch(() => null);
    const run = await page.evaluate(() => window.__lastRun ?? null);
    runs.push(run?.time ?? (Date.now() - started) / 1000);
    if (i === 0) {
      await page.screenshot({ path: `${shots}/${slug}-laptop-end.png` });
    }
    await page.close();
  }
}

if (retakeOg || !existsSync(ogPath)) {
  const page = await open(og, hasBot ? '?bot' : '');
  if (page) {
    if (!hasBot) {
      await pressPlay(page, og);
    }
    await page.waitForTimeout(hasBot ? 7000 : 2500);
    await page.screenshot({ path: ogPath, quality: 85 });
    console.log(`saved ${ogPath}${hasBot ? ' (7 s into a bot run)' : ''}`);
    await page.close();
  }
} else {
  console.log(`kept ${ogPath} (pass --og to retake it)`);
}

await browser.close();

if (hasBot) {
  const fmt = runs.map((t) => `${t.toFixed(1)}s`).join(', ');
  const worst = Math.min(...runs);
  console.log(`\nBot runs: ${fmt}`);
  if (worst < 20) {
    console.log('  A first-timer should last at least 20 s. Make the opening easier, or check the bot plays like a person.');
  }
  if (Math.max(...runs) >= 179) {
    console.log('  A run hit the 3-minute cap. The difficulty may not ramp up enough.');
  }
} else {
  console.log('\nNo ?bot mode (window.__bot), so survival time was not measured. See the template for how to add one.');
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.join('\n')}`);
  process.exit(1);
}

console.log(`\nNo console errors. Look at the screenshots in ${shots}/ and at ${ogPath}.`);

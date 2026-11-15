import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const [slug, scene] = process.argv.slice(2);

if (!slug || !scene) {
  console.error('Usage: pnpm game:thumb <slug> "<a stick figure doing the game\'s action with its one prop>"');
  process.exit(1);
}

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error('OPENAI_API_KEY is not set. Set it, or skip the thumbnail and say so in the pull request.');
  process.exit(1);
}

const STYLE =
  'The attached image is a STYLE REFERENCE ONLY (screenshots from my stick-figure browser games); do not copy its layout, text or scene. ' +
  'Draw a brand-new, very simple illustration in exactly that drawing style: a stick figure with a round solid black head and thick black rounded limbs ' +
  '(some limbs a lighter grey for depth), thin clean black ink lines for props, white fills, light grey secondary details, and one small butter-yellow (#fde68a) ' +
  'or amber (#b45309) accent. Minimal: one stick figure and one prop, no background scenery, no ground except an optional short thin ground line, no text, ' +
  'no letters, no UI, no numbers. Centered with generous margin on a pure flat white background, no dot grid.';

const ref = await readFile(join(here, 'assets', 'thumb-style-ref.jpg'));
const form = new FormData();
form.append('model', process.env.THUMB_MODEL ?? 'gpt-image-2');
form.append('prompt', `${scene.trim().replace(/\.?$/, '.')} ${STYLE}`);
form.append('size', '1536x1024');
form.append('quality', 'medium');
form.append('image', new Blob([ref], { type: 'image/jpeg' }), 'thumb-style-ref.jpg');

console.log('Generating the thumbnail (about 30 seconds)...');
const res = await fetch('https://api.openai.com/v1/images/edits', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}` },
  body: form,
});
const json = await res.json();
if (!res.ok) {
  console.error(`Image API error ${res.status}: ${json?.error?.message ?? JSON.stringify(json)}`);
  process.exit(1);
}

const raw = Buffer.from(json.data[0].b64_json, 'base64');
await mkdir('tmp/thumbs', { recursive: true });
await writeFile(`tmp/thumbs/${slug}.png`, raw);

const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const TOL = 18;
const isWhite = (i) => 255 - Math.min(data[i], data[i + 1], data[i + 2]) <= TOL;
const bg = new Uint8Array(width * height);
const stack = [];
for (let x = 0; x < width; x++) {
  stack.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  stack.push(y * width, y * width + width - 1);
}
while (stack.length) {
  const p = stack.pop();
  if (bg[p] || !isWhite(p * 4)) {
    continue;
  }
  bg[p] = 1;
  const x = p % width;
  const y = (p - x) / width;
  if (x > 0) {
    stack.push(p - 1);
  }
  if (x < width - 1) {
    stack.push(p + 1);
  }
  if (y > 0) {
    stack.push(p - width);
  }
  if (y < height - 1) {
    stack.push(p + width);
  }
}

let x0 = width, y0 = height, x1 = 0, y1 = 0;
for (let p = 0; p < width * height; p++) {
  if (bg[p]) {
    data[p * 4 + 3] = 0;
    continue;
  }
  const x = p % width;
  const y = (p - x) / width;
  x0 = Math.min(x0, x);
  x1 = Math.max(x1, x);
  y0 = Math.min(y0, y);
  y1 = Math.max(y1, y);
}

if (x1 <= x0 || y1 <= y0) {
  console.error('The generated image came back empty. Try again with a different scene.');
  process.exit(1);
}

const pad = 4;
const left = Math.max(0, x0 - pad);
const top = Math.max(0, y0 - pad);
const out = `public/thumbs/${slug}.webp`;
await sharp(data, { raw: { width, height, channels: 4 } })
  .extract({ left, top, width: Math.min(width, x1 + pad) - left, height: Math.min(height, y1 + pad) - top })
  .resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 86 })
  .toFile(out);

console.log(`saved ${out} (raw image kept in tmp/thumbs/${slug}.png)`);

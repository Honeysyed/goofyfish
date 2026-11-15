// goofyfish snippets: the shared building blocks of the existing games (mostly from public/games/stacks.html).
// Copy the sections you need into your game's <script>. Each section lists what it depends on.
// They expect `ctx` (the 2D context) and `COL` (palette) to exist, as in template.html.

// ── Helpers ────────────────────────────────────────────────────────────────

const lerp = (a, b, k) => a + (b - a) * k;
const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const EASE = {
  io: (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  in: (k) => k * k,
  out: (k) => 1 - (1 - k) * (1 - k),
  lin: (k) => k,
  soft: (k) => 0.5 - Math.cos(Math.PI * k) / 2,
};

function mulberry(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Fitting the world to any screen ────────────────────────────────────────
// Design the game in fixed world units (a VIEW box), then scale it to fit the screen, leaving room for the HUD.
// Draw with ctx.setTransform(dpr * cam.s, 0, 0, dpr * cam.s, dpr * cam.x, dpr * cam.y) and world coordinates.
// Portrait phones can't fit the whole width at a readable size, so they show at least minW world units
// centred on focusX (put the action there), and things off to the side scroll or roll into view.

const VIEW = { x0: -260, x1: 260, y0: -360, y1: 20, minW: 340, focusX: -50 };
let dpr = 1, cw = 0, ch = 0, cam = { s: 1, x: 0, y: 0 };

function fitView() {
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  cw = innerWidth;
  ch = innerHeight;
  const narrow = cw < ch;
  const top = narrow ? 150 : 110;
  const bottom = 64;
  const vw = VIEW.x1 - VIEW.x0, vh = VIEW.y1 - VIEW.y0;
  const fitH = (ch - top - bottom) / vh;
  const s = narrow ? Math.min(fitH, cw / VIEW.minW, 1.75) : Math.min((cw - 120) / vw, fitH, 1.75);
  const centre = narrow ? VIEW.focusX : (VIEW.x0 + VIEW.x1) / 2;
  cam = {
    s,
    x: cw / 2 - centre * s,
    y: top + (ch - top - bottom - vh * s) * (narrow ? 0.85 : 0.6) - VIEW.y0 * s,
  };
}
function toWorld(px, py) {
  return [(px - cam.x) / cam.s, (py - cam.y) / cam.s];
}

// ── Stick figure ───────────────────────────────────────────────────────────
// Poses are joint positions in figure space: facing right, feet near y = -8, head near y = -121.
// Draw at (x, groundY + 8) so the feet touch the ground. Needs: Helpers, strokePath, COL.fig.
// Make new poses with mk({...}) by moving a few joints of BASE; play them with an Actor.

const THIGH = 30, SHIN = 30, UARM = 21, FARM = 21;
const LIMB = 5, ARM = 4.2, TORSO = 8.5, HEAD_R = 7.8, FAR = '#9a9a9a';
const BASE = {
  face: 1,
  head: [0, -121], chest: [0, -96], hip: [0, -65],
  fF: [1, -8], fB: [-4, -8], kF: [22, -38], kB: [10, -38],
  hF: [3, -57], hB: [-1, -57], eF: [-6, -78], eB: [-6, -78],
};
const mk = (o, base = BASE) => Object.assign({}, base, o);
const P = {};
P.stand = mk({});
P.ready = mk({ head: [2, -121], hF: [15, -84], eF: [5, -71], hB: [-4, -56], eB: [-6, -77] });
P.crouch = mk({ head: [6, -100], chest: [4, -76], hip: [-2, -46], kF: [24, -30], kB: [12, -28], hF: [16, -60], eF: [10, -56], hB: [-8, -52], eB: [-8, -60] });
P.leap = mk({ head: [4, -124], chest: [2, -99], hip: [0, -68], fF: [14, -30], fB: [-14, -26], kF: [20, -52], kB: [-2, -48], hF: [18, -140], eF: [16, -120], hB: [-14, -134], eB: [-12, -116] });
P.cheer = mk({ head: [0, -122], chest: [0, -97], hip: [0, -67], hF: [16, -136], hB: [-12, -134], eF: [14, -118], eB: [-12, -116] });
P.wince = mk({ head: [-3, -118], chest: [-2, -94], hip: [0, -65], kF: [20, -37], hF: [7, -125], eF: [19, -111], hB: [-7, -125], eB: [-20, -109] });
P.phew = mk({ head: [-1, -120], chest: [-1, -95], hip: [0, -65], hF: [13, -80], eF: [4, -68], hB: [2, -122], eB: [-14, -106] });
P.punch = mk({ head: [8, -118], chest: [6, -94], hip: [0, -64], kF: [24, -36], kB: [-8, -34], fF: [18, -8], fB: [-16, -8], hF: [44, -98], eF: [26, -96], hB: [2, -88], eB: [-6, -78] });

const PTS = ['head', 'chest', 'hip', 'fF', 'fB', 'kF', 'kB', 'hF', 'hB', 'eF', 'eB'];

// Joints only bend the way real ones do, in the figure's own facing-right space (y down):
// an elbow folds the forearm toward the front of the body (ARM_BEND), a knee folds the shin back (KNEE_BEND).
// Pass the bend as the last argument; the hint then only matters when the limb is almost straight.
const ARM_BEND = -1, KNEE_BEND = 1;
function ik(a, b, l1, l2, hint, bend) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  let d = Math.hypot(dx, dy);
  const base = Math.atan2(dy, dx);
  // Ease into full extension so a straightening limb's joint doesn't race across the last few units.
  const L = l1 + l2, soft = L * 0.96;
  if (d > soft) {
    d = soft + (L - soft) * (1 - Math.exp(-(d - soft) / (L - soft)));
  }
  d = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(L - 0.001, d));
  const c = Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const ang = Math.acos(c);
  const j1 = [a[0] + l1 * Math.cos(base + ang), a[1] + l1 * Math.sin(base + ang)];
  const j2 = [a[0] + l1 * Math.cos(base - ang), a[1] + l1 * Math.sin(base - ang)];
  if (bend) {
    const side = (j) => (j[0] - a[0]) * (b[1] - j[1]) - (j[1] - a[1]) * (b[0] - j[0]);
    return Math.sign(side(j1)) === bend ? j1 : j2;
  }
  const d1 = Math.hypot(j1[0] - hint[0], j1[1] - hint[1]);
  const d2 = Math.hypot(j2[0] - hint[0], j2[1] - hint[1]);
  return d1 < d2 ? j1 : j2;
}
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function pathPose(list, u) {
  const n = list.length - 1;
  const x = Math.min(n - 1e-6, Math.max(0, u * n));
  const i = Math.floor(x), t = x - i;
  const a = list[Math.max(0, i - 1)], b = list[i], c = list[i + 1], d = list[Math.min(n, i + 2)];
  const o = { face: lerp(b.face, c.face, t), hang: lerp(b.hang ?? 1, c.hang ?? 1, t) };
  for (const k of PTS) {
    o[k] = [catmull(a[k][0], b[k][0], c[k][0], d[k][0], t), catmull(a[k][1], b[k][1], c[k][1], d[k][1], t)];
  }
  return o;
}

// An Actor plays queued pose steps: actor.push({ pose: P.crouch, d: 0.12 }, { pose: P.leap, d: 0.2, ez: 'out' }).
// A step can also be { path: [P.a, P.b, P.c], d } for a smooth curve through several poses, or { fn: () => {} } to run code.
class Actor {
  constructor(pose) {
    this.pose = pose || P.ready;
    this.q = [];
    this.step = null;
    this.t = 0;
    this.id = Math.random().toString(36).slice(2);
  }
  push(...steps) {
    this.q.push(...steps);
  }
  clear() {
    this.q = [];
    this.step = null;
  }
  get idle() {
    return !this.step && !this.q.length;
  }
  update(dt) {
    for (let guard = 0; guard < 20; guard++) {
      if (!this.step) {
        if (!this.q.length) {
          return;
        }
        this.step = this.q.shift();
        this.t = 0;
        if (this.step.fn) {
          const fn = this.step.fn;
          this.step = null;
          fn();
          continue;
        }
        const targets = this.step.path || (this.step.pose ? [this.step.pose] : [this.pose]);
        this.step.list = [this.pose, ...targets];
      }
      this.t += dt;
      const s = this.step;
      const k = Math.min(1, this.t / s.d);
      this.pose = pathPose(s.list, (EASE[s.ez] || EASE.soft)(k));
      if (k < 1) {
        return;
      }
      dt = this.t - s.d;
      this.step = null;
    }
  }
}

// A back hand resting low under the shoulder hangs from a nearly straight arm, the way a relaxed arm does.
// Set hang: 0 on a pose when the back hand has to work there (it blends between poses like any number).
function relax(sh, t, amount) {
  const dx = t[0] - sh[0], dy = t[1] - sh[1];
  const d = Math.hypot(dx, dy);
  const want = (UARM + FARM) * 0.96;
  if (dy <= 0 || d < 1 || d >= want) {
    return t;
  }
  const w = (amount ?? 1) * Math.min(1, Math.max(0, (dy / d - 0.8) / 0.18));
  const k = w * w * (3 - 2 * w);
  const nd = d + (want - d) * k;
  return [sh[0] + (dx / d) * nd, sh[1] + (dy / d) * nd];
}
function reach(a, b, max) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const d = Math.hypot(dx, dy);
  if (d <= max) {
    return b;
  }
  return [a[0] + (dx / d) * max, a[1] + (dy / d) * max];
}
function breathe(p, amt) {
  if (!amt) {
    return p;
  }
  const o = Object.assign({}, p);
  const up = (v, k) => [v[0], v[1] - amt * k];
  o.head = up(p.head, 1);
  o.chest = up(p.chest, 0.85);
  o.hF = up(p.hF, 0.6);
  o.hB = up(p.hB, 0.6);
  return o;
}
const prevJ = {};
function mirrorJoint(a, b, j) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L2 = dx * dx + dy * dy || 1;
  const t = ((j[0] - a[0]) * dx + (j[1] - a[1]) * dy) / L2;
  const px = a[0] + dx * t, py = a[1] + dy * t;
  return [2 * px - j[0], 2 * py - j[1]];
}
function ikC(key, a, b, l1, l2, hint, bend) {
  const j = ik(a, b, l1, l2, hint, bend);
  if (bend) {
    prevJ[key] = j;
    return j;
  }
  const pj = prevJ[key];
  if (pj) {
    const alt = mirrorJoint(a, b, j);
    const dj = Math.hypot(j[0] - pj[0], j[1] - pj[1]);
    const da = Math.hypot(alt[0] - pj[0], alt[1] - pj[1]);
    const dh = Math.hypot(j[0] - hint[0], j[1] - hint[1]) - Math.hypot(alt[0] - hint[0], alt[1] - hint[1]);
    if (da + 1.5 < dj && Math.abs(dh) < 4) {
      prevJ[key] = alt;
      return alt;
    }
  }
  prevJ[key] = j;
  return j;
}
function strokePath(pts, w, col) {
  ctx.strokeStyle = col;
  ctx.lineWidth = w;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.stroke();
}

// opts: { flip: true } faces left, { ink, far } recolours (goons are drawn all grey), { scale } resizes,
// { live: false } for one-off drawings such as the share image (skips joint smoothing between frames).
function drawFigure(a, x, y, breath, opts) {
  const o = opts || {};
  const ink = o.ink || COL.fig || COL.ink;
  const far = o.far || FAR;
  const p = breathe(a.pose, breath || 0);
  const af = Math.min(1, Math.abs(p.face));
  ctx.save();
  ctx.translate(x, y);
  ctx.scale((o.flip ? -1 : 1) * (o.scale || 1), o.scale || 1);
  const sx = p.chest[0] - p.hip[0], sy = p.chest[1] - p.hip[1];
  const sl = Math.hypot(sx, sy) || 1;
  const u = [sx / sl, sy / sl];
  const n = [-u[1], u[0]];
  const sideOff = 6.2 * (1 - af);
  const shF = [p.chest[0] + n[0] * sideOff - u[0], p.chest[1] + n[1] * sideOff - u[1]];
  const shB = [p.chest[0] - n[0] * sideOff - u[0], p.chest[1] - n[1] * sideOff - u[1]];
  const key = a.id || 'me';
  const solve = o.live === false ? (k, aa, bb, l1, l2, h, bd) => ik(aa, bb, l1, l2, h, bd) : (k, aa, bb, l1, l2, h, bd) => ikC(key + k, aa, bb, l1, l2, h, bd);
  const kF = solve('kF', p.hip, p.fF, THIGH, SHIN, p.kF, KNEE_BEND);
  const kB = solve('kB', p.hip, p.fB, THIGH, SHIN, p.kB, KNEE_BEND);
  const handF = reach(shF, p.hF, UARM + FARM);
  const handB = reach(shB, relax(shB, p.hB, p.hang), UARM + FARM);
  const eF = solve('eF', shF, handF, UARM, FARM, p.eF, ARM_BEND);
  const eB = solve('eB', shB, handB, UARM, FARM, p.eB, ARM_BEND);
  const hd = [p.head[0] - p.chest[0], p.head[1] - p.chest[1]];
  const hl = Math.hypot(hd[0], hd[1]) || 1;
  const hc = [p.chest[0] + (hd[0] / hl) * 20.5, p.chest[1] + (hd[1] / hl) * 20.5];
  strokePath([shB, eB, handB], ARM, far);
  strokePath([p.hip, kB, p.fB], LIMB, far);
  strokePath([[p.hip[0] + u[0], p.hip[1] + u[1]], [p.chest[0] + u[0] * 0.5, p.chest[1] + u[1] * 0.5]], TORSO, ink);
  strokePath([p.hip, kF, p.fF], LIMB, ink);
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.arc(hc[0], hc[1], HEAD_R, 0, Math.PI * 2);
  ctx.fill();
  strokePath([shF, eF, handF], ARM, ink);
  ctx.restore();
  return { head: hc, handF, handB };
}

// ── Ink drawing ────────────────────────────────────────────────────────────
// Ground is a wobbly line at y = 0 in world space, never a filled floor.

function line(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
const WOBBLE = Array.from({ length: 512 }, (_, i) => Math.sin(i * 0.37) * 0.35 + Math.sin(i * 1.71 + 1) * 0.22);
function drawGround(xl, xr) {
  ctx.strokeStyle = COL.ink;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const x0 = Math.floor(xl / 6) * 6;
  for (let x = x0; x <= xr + 6; x += 6) {
    const w = WOBBLE[((x / 6) % 512 + 512) % 512];
    if (x === x0) {
      ctx.moveTo(x, w);
    } else {
      ctx.lineTo(x, w);
    }
  }
  ctx.stroke();
}
function contactShadow(x, w, a, y) {
  ctx.save();
  ctx.fillStyle = `rgba(0,0,0,${a})`;
  ctx.beginPath();
  ctx.ellipse(x, (y || 0) + 1.2, w, 2.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
// Fill and outline the current path: roundRect(...); inkShape('#fff', 1.5);
function inkShape(fill, lw) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw || 1.5;
  ctx.strokeStyle = COL.ink;
  ctx.lineJoin = 'round';
  ctx.stroke();
}
// A thick outlined stick, for handles, poles, planks.
function inkBar(x0, y0, x1, y1, w, fill) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = COL.ink;
  ctx.lineWidth = w + 3;
  line(x0, y0, x1, y1);
  ctx.strokeStyle = fill;
  ctx.lineWidth = w;
  line(x0, y0, x1, y1);
}

// ── Popups, particles and shake ────────────────────────────────────────────
// popup('Perfect!', 'CHAIN ×2', true) over the action; burst() for hits; dust() for landings.
// Call updateFx(dt) in update() and drawBits(); drawPopups(left, right) last in render(), in world space.

const popups = [];
const bits = [];
let shake = 0, shakeV = 0;

function popup(text, sub, hot, x, y) {
  popups.push({ text, sub, hot, x, y, t: 0 });
}
function burst(x, y, n) {
  const cols = ['#141414', '#141414', '#8d8d8d', '#c8c8c8'];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
    const sp = 70 + Math.random() * 120;
    bits.push({ x: x + (Math.random() - 0.5) * 30, y: y - 3, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 18, c: cols[i % cols.length], t: 0, life: 0.8 + Math.random() * 0.5, w: 2 + Math.random() * 1.6, g: 260, drag: 1.5 });
  }
}
function dust(x, y, w, n) {
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1;
    bits.push({ x: x + side * (w / 2 - 2 - Math.random() * 6), y: y - 1, vx: side * (35 + Math.random() * 75), vy: -(4 + Math.random() * 22), r: (Math.random() - 0.5) * 0.5, vr: (Math.random() - 0.5) * 4, c: i % 3 ? '#b0b0b0' : '#8d8d8d', t: 0, life: 0.3 + Math.random() * 0.25, w: 2 + Math.random() * 2.5, g: 80, drag: 5 });
  }
}
// kick() on big moments; offset the camera by `shake` pixels in render().
function kick(amount) {
  shakeV += amount;
}
function updateFx(dt) {
  shakeV += (-260 * shake - 15 * shakeV) * dt;
  shake += shakeV * dt;
  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].t += dt;
    if (popups[i].t > 1.1) {
      popups.splice(i, 1);
    }
  }
  for (let i = bits.length - 1; i >= 0; i--) {
    const b = bits[i];
    b.t += dt;
    b.vy += b.g * dt;
    b.vx *= 1 - Math.min(1, b.drag * dt);
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.r += b.vr * dt;
    if (b.t > b.life) {
      bits.splice(i, 1);
    }
  }
}
function drawBits() {
  for (const b of bits) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - b.t / b.life);
    ctx.translate(b.x, b.y);
    ctx.rotate(b.r);
    ctx.fillStyle = b.c;
    ctx.fillRect(-b.w / 2, -0.9, b.w, 1.8);
    ctx.restore();
  }
}
// left/right are the visible world edges, so popups never get cut off on narrow phones.
function drawPopups(left, right) {
  for (const p of popups) {
    const k = p.t / 1.1;
    const a = k < 0.12 ? k / 0.12 : clamp(1 - (k - 0.55) / 0.45, 0, 1);
    const y = p.y - 26 - 24 * EASE.out(Math.min(1, k * 1.3));
    const sc = 1 + 0.22 * Math.max(0, 1 - k * 5);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = "400 24px 'Balsamiq Sans', system-ui, sans-serif";
    let half = ctx.measureText(p.text).width / 2;
    if (p.sub) {
      ctx.font = "400 10px 'Balsamiq Sans', system-ui, sans-serif";
      half = Math.max(half, ctx.measureText(p.sub).width / 2 + p.sub.length * 0.75);
    }
    half = half * sc + 10;
    const x = right - left > half * 2 ? clamp(p.x, left + half, right - half) : (left + right) / 2;
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    ctx.fillStyle = p.hot ? COL.accent : COL.ink;
    ctx.font = "400 24px 'Balsamiq Sans', system-ui, sans-serif";
    ctx.fillText(p.text, 0, 0);
    if (p.sub) {
      ctx.font = "400 10px 'Balsamiq Sans', system-ui, sans-serif";
      ctx.letterSpacing = '1.5px';
      ctx.fillText(p.sub, 0, 12);
      ctx.letterSpacing = '0px';
    }
    ctx.restore();
  }
}

// ── Sound ──────────────────────────────────────────────────────────────────
// Everything is synthesized. Call audio() inside the first tap/key handler (browsers block sound before that).
// partial() is a pitched blip, hiss() a filtered noise burst; mix a few for each sound.

let actx = null, bus = null, verb = null;
function audio() {
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = actx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      comp.connect(actx.destination);
      bus = actx.createGain();
      bus.gain.value = 0.9;
      bus.connect(comp);
      const len = Math.floor(actx.sampleRate * 1.1);
      const ir = actx.createBuffer(2, len, actx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = ir.getChannelData(c);
        for (let i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
        }
      }
      const conv = actx.createConvolver();
      conv.buffer = ir;
      verb = actx.createGain();
      verb.gain.value = 0.16;
      verb.connect(conv).connect(comp);
    } catch (e) {
      actx = null;
    }
  }
  if (actx && actx.state === 'suspended') {
    actx.resume();
  }
}
function voice(wet) {
  const g = actx.createGain();
  g.gain.value = 0;
  g.connect(bus);
  if (wet) {
    const w = actx.createGain();
    w.gain.value = wet;
    g.connect(w).connect(verb);
  }
  return g;
}
function partial(freq, f1, dur, vol, type, wet, delay) {
  if (!actx || vol < 0.003) {
    return;
  }
  const t = actx.currentTime + (delay || 0);
  const o = actx.createOscillator();
  const g = voice(wet);
  o.type = type || 'sine';
  o.frequency.setValueAtTime(freq, t);
  if (f1 && f1 !== freq) {
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  }
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function hiss(dur, vol, type, f0, f1, q, wet, attack, delay) {
  if (!actx || vol < 0.003) {
    return;
  }
  const t = actx.currentTime + (delay || 0);
  const n = Math.max(1, Math.floor(actx.sampleRate * dur));
  const buf = actx.createBuffer(1, n, actx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) {
    d[i] = Math.random() * 2 - 1;
  }
  const src = actx.createBufferSource();
  src.buffer = buf;
  const f = actx.createBiquadFilter();
  f.type = type;
  f.Q.value = q || 0.7;
  f.frequency.setValueAtTime(f0, t);
  if (f1 && f1 !== f0) {
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  }
  const g = voice(wet);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + (attack || 0.004));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g);
  src.start(t);
}
function buzz(ms) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
  } catch (e) {
    return;
  }
}
// A starter set; tune pitches and volumes to the game.
const SND = {
  thunk(k) {
    partial(108, 50, 0.22, 0.6 * k, 'sine', 0.12);
    hiss(0.07, 0.34 * k, 'bandpass', 430, 240, 1.1, 0.18);
  },
  tok(k) {
    partial(190, 140, 0.07, 0.3 * k, 'sine', 0.1);
    hiss(0.03, 0.16 * k, 'bandpass', 520, 400, 1.2, 0.1);
  },
  whoosh() {
    hiss(0.25, 0.08, 'bandpass', 600, 1600, 1.4, 0.1, 0.06);
  },
  perfect() {
    partial(1568, 1568, 0.5, 0.035, 'sine', 0.5, 0.04);
    partial(2093, 2093, 0.45, 0.028, 'sine', 0.5, 0.1);
  },
  streak(m) {
    const base = m >= 6 ? 784 : 659;
    partial(base, base, 0.22, 0.045, 'triangle', 0.4);
    partial(base * 1.5, base * 1.5, 0.3, 0.035, 'triangle', 0.4, 0.08);
  },
  record() {
    [523, 659, 784, 1047].forEach((f, i) => {
      partial(f, f, 0.32, 0.05, 'triangle', 0.45, 0.1 + i * 0.075);
    });
  },
  lose() {
    partial(220, 90, 0.5, 0.25, 'triangle', 0.3);
    hiss(0.3, 0.1, 'lowpass', 900, 200, 0.7, 0.3);
  },
};

// ── Test modes ─────────────────────────────────────────────────────────────
// ?bot plays by itself like a decent first-timer (reaction delay + aim error), so `pnpm game:check --bot` can
// measure how long a run lasts and grab a mid-game social image. Set window.__bot = true when it's on.
// Never save stats in a test mode.

const Q = new URLSearchParams(location.search);
const BOT = Q.has('bot');
const TEST = BOT || Q.has('still') || Q.has('autoplay');
window.__bot = BOT;

function gauss(r) {
  return (r() + r() + r() - 1.5) / 1.5;
}
// Example for a "press at the right moment" game: decide once per obstacle, then act after a human-ish delay.
const botRng = mulberry(7);
let botPlan = null;
function botTick(now, nextThreat, act) {
  if (!BOT || !nextThreat) {
    return;
  }
  if (!botPlan || botPlan.id !== nextThreat.id) {
    botPlan = { id: nextThreat.id, at: now + 0.18 + Math.abs(gauss(botRng)) * 0.12, aim: gauss(botRng) * 12 };
  }
  if (now >= botPlan.at && !botPlan.done) {
    botPlan.done = true;
    act(botPlan.aim);
  }
}

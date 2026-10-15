// Evolve Your Brain: the book's element library (loaded after engine.js).
// Look: YMU dark luxury. Black board, gold line work, emotion colours as accents.
'use strict';

/* ---------- palette and meaning ---------- */
const EV = {
  bg: '#080c0f', panel: '#10171b', ink: '#efe6d2', dim: '#9d9686', faint: '#3d3b35', line: '#2a2c27',
  gold: '#c9a84c', goldHi: '#e8cf86', goldLo: '#7d6a35',
  anger: '#e2694f', shame: '#9c84d8', fear: '#5fb3cf', joy: '#e8c46a', calm: '#7cc79d', sad: '#6f8fd6',
  surprise: '#f0a35e', disgust: '#a7b866', love: '#e78fa8',
  skinF: '#a9704c', skinM: '#94603f', hair: '#1a120d',
};
Object.assign(COL, { board: EV.bg, chalk: EV.ink, dim: EV.dim, faint: '#4d4a42', task: EV.gold, good: EV.calm, bad: EV.anger });

/* ---------- language ---------- */
const LANG = document.documentElement.lang === 'ml' ? 'ml' : 'en';
const TXT = { en: {}, ml: {} };
const L = k => (TXT[LANG][k] ?? TXT.en[k] ?? k);
const SERIF = LANG === 'ml' ? '"Noto Serif Malayalam","Cormorant Garamond",serif' : '"Cormorant Garamond",Georgia,serif';
const SANS = LANG === 'ml' ? '"Noto Sans Malayalam","Outfit",sans-serif' : '"Outfit","Avenir Next",sans-serif';
const ML = LANG === 'ml';

// Interface text the engine draws after load (question buttons, finish card): Malayalam where it matters.
TRANSLATIONS.ml = {
  quickCheck: 'ചെറിയ പരിശോധന', check: 'പരിശോധിക്കൂ', showAnswer: 'ഉത്തരം കാണിക്കൂ', nextQuestion: 'അടുത്ത ചോദ്യം', continue: 'തുടരൂ',
  correct: 'ശരി. ', notQuite: 'അല്ല. ', answerPrefix: 'ഉത്തരം: ', keysPrefix: 'കീകൾ: ', countOf: '{n} ൽ {k}',
  chapterNumber: 'അധ്യായം {n}', aboutMinutes: 'ഏകദേശം {n} മിനിറ്റ്, ശബ്ദവും ചെറിയ പരിശോധനകളും സഹിതം.',
  startLesson: 'പാഠം തുടങ്ങൂ', allChapters: 'എല്ലാ അധ്യായങ്ങളും', chapterComplete: 'അധ്യായം {n} പൂർത്തിയായി',
  quickChecks: 'ചെറിയ പരിശോധനകൾ', chapterPractice: 'അധ്യായ പരിശീലനം', watchAgain: 'വീണ്ടും കാണൂ', nextChapter: 'അടുത്ത അധ്യായം',
  firstTryScore: '{name}: ആദ്യ ശ്രമത്തിൽ {t} ൽ {r} ശരി.', notAttempted: '{name}: ചെയ്തിട്ടില്ല.',
  rowsRight: '{n} ൽ {r} ശരി. ✗ ഉള്ള വരികൾ തിരുത്തി വീണ്ടും പരിശോധിക്കൂ.', choicesShown: 'ശരിയായവ ഇപ്പോൾ തിരഞ്ഞെടുത്തിരിക്കുന്നു.',
  trueLabel: 'ശരി', falseLabel: 'തെറ്റ്', paused: 'നിർത്തിയിരിക്കുന്നു. തുടരാൻ സ്പേസ് അമർത്തുകയോ ക്ലിക്ക് ചെയ്യുകയോ ചെയ്യൂ.',
  soundFailed: 'ശബ്ദം പ്ലേ ചെയ്യാനായില്ല. സ്ക്രീനിലെ എഴുത്തുമായി പാഠം തുടരുന്നു.',
  hintChoose: ' തിരഞ്ഞെടുക്കൂ', hintRow: ' വരി, ', hintCheck: ' പരിശോധിക്കൂ, ',
};

/* ---------- text ---------- */
const evCtx = document.createElement('canvas').getContext('2d');
const evW = (str, size, font = SANS, weight = 500) => { evCtx.font = `${weight} ${size}px ${font}`; return evCtx.measureText(str).width; };
// One line of text; maxW shrinks it to fit. Malayalam runs ~12% smaller to keep its taller glyphs in proportion.
function evText(p, str, { x = 0, y = 0, size = 34, fill = EV.ink, anchor = 'middle', font = SANS, weight = 500, o = 1, maxW, italic = false, ls } = {}) {
  if (ML) size *= .88;
  if (maxW) { const w = evW(str, size, font, weight); if (w > maxW) size *= maxW / w; }
  const t = T(p, str, { x, y, size, fill, font, weight, anchor, o });
  if (italic && !ML) t.setAttribute('font-style', 'italic');
  if (ls) t.setAttribute('letter-spacing', ls);
  return t;
}
// Wrapped paragraph: lines broken on spaces to fit maxW. Returns a group with ._h (height).
function evPara(p, str, { x = 0, y = 0, size = 32, lh = 1.35, maxW = 600, fill = EV.ink, anchor = 'middle', font = SANS, weight = 400, o = 1, italic = false } = {}) {
  if (ML) size *= .88;
  const words = str.split(/\s+/), lines = [];
  let cur = '';
  for (const w of words) {
    const nx = cur ? cur + ' ' + w : w;
    if (cur && evW(nx, size, font, weight) > maxW) { lines.push(cur); cur = w; } else cur = nx;
  }
  if (cur) lines.push(cur);
  const g = G(p, { x, y, o });
  lines.forEach((ln, i) => {
    const t = T(g, ln, { x: 0, y: i * size * lh, size, fill, font, weight, anchor });
    if (italic && !ML) t.setAttribute('font-style', 'italic');
  });
  g._h = lines.length * size * lh;
  g._n = lines.length;
  return g;
}

/* ---------- shared defs (gradients only: no filters behind animated content) ---------- */
function evDefs() {
  const svg = document.getElementById('stage');
  if (svg.querySelector('#evDefs')) return;
  const d = mk('defs', { id: 'evDefs' }, svg);
  const rg = (id, stops, r = '50%', cx = '50%', cy = '50%') => {
    const g = mk('radialGradient', { id, r, cx, cy }, d);
    stops.forEach(([o, c, a]) => mk('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, g));
  };
  rg('evGlowGold', [[0, EV.goldHi, .55], [.45, EV.gold, .18], [1, EV.gold, 0]]);
  rg('evGlowWarm', [[0, '#ffd99a', .5], [.5, '#e8a95a', .12], [1, '#e8a95a', 0]]);
  for (const k of ['anger', 'shame', 'fear', 'joy', 'calm', 'love', 'sad']) rg('evGlow_' + k, [[0, EV[k], .6], [.5, EV[k], .16], [1, EV[k], 0]]);
  rg('evCell', [[0, '#1d272a', 1], [.82, '#141c1f', 1], [1, '#22302f', 1]]);
  rg('evNucleus', [[0, '#2b2a36', 1], [1, '#1a1a22', 1]]);
  rg('evMoon', [[0, '#fff3cf', .9], [.3, '#e8cf86', .25], [1, '#e8cf86', 0]]);
  const lg = mk('linearGradient', { id: 'evSea', x1: 0, y1: 0, x2: 0, y2: 1 }, d);
  [[0, '#0b1418', 1], [1, '#05080a', 1]].forEach(([o, c, a]) => mk('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, lg));
  const sk = mk('linearGradient', { id: 'evSky', x1: 0, y1: 0, x2: 0, y2: 1 }, d);
  [[0, '#05080b', 1], [1, '#0f1a20', 1]].forEach(([o, c, a]) => mk('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, sk));
}
const evGlow = (p, x, y, r, k = 'Gold', o = 1) => put(mk('circle', { cx: 0, cy: 0, r, fill: `url(#${k === 'Gold' || k === 'Warm' ? 'evGlow' + k : 'evGlow_' + k})` }, p), { x, y, o });

/* ---------- small pieces ---------- */
const evLine = (p, d, stroke = EV.gold, w = 3, extra = {}) => path(p, d, { stroke, 'stroke-width': w, ...extra });
const evDot = (p, x, y, r, fill, o = 1) => put(mk('circle', { cx: 0, cy: 0, r, fill }, p), { x, y, o });
// An arrow head at the end of a path's direction (x,y) pointing at angle a (degrees).
function evHead(p, x, y, a, color = EV.gold, s = 1) {
  return put(path(p, 'M-16 -10L2 0L-16 10', { stroke: color, 'stroke-width': 3.5 }), { x, y, r: a, s });
}
// Speech bubble with its tail at (0,0) pointing down-left/right; text wrapped inside.
function evBubble(p, str, { x = 0, y = 0, w = 420, size = 32, fill = EV.ink, bg = '#151d21', edge = EV.gold, tail = 'left', o = 0, italic = false } = {}) {
  const g = G(p, { x, y, o, s: .9 });
  const txt = evPara(g, str, { x: 0, y: 0, size, maxW: w - 56, fill, italic });
  const h = txt._h + 34, bw = w, by = -h - 26, bx = -bw / 2;
  const tx = tail === 'left' ? -bw / 2 + 60 : tail === 'right' ? bw / 2 - 60 : 0;
  const r = 26;
  const d = `M${bx + r} ${by}H${bx + bw - r}Q${bx + bw} ${by} ${bx + bw} ${by + r}V${by + h - r}Q${bx + bw} ${by + h} ${bx + bw - r} ${by + h}`
    + `H${tx + 22}L${tx - (tail === 'right' ? -10 : 10) * 2} ${by + h + 26}L${tx - 4} ${by + h}H${bx + r}Q${bx} ${by + h} ${bx} ${by + h - r}V${by + r}Q${bx} ${by} ${bx + r} ${by}Z`;
  g.insertBefore(path(null, d, { fill: bg, stroke: edge, 'stroke-width': 2, 'stroke-opacity': .7 }), g.firstChild);
  put(txt, { y: by + 17 + (ML ? size * .78 : size * .82) });
  g._h = h;
  return g;
}
// Thought bubble: a cloud of circles with trailing dots toward (0,0).
function evThought(p, { x = 0, y = 0, w = 360, h = 220, o = 0, edge = EV.gold, dx = 0 } = {}) {
  const g = G(p, { x, y, o });
  const cx = dx, cy = -h / 2 - 70;
  const puffs = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2;
    puffs.push([cx + Math.cos(a) * w * .42, cy + Math.sin(a) * h * .38, 46 + (i % 3) * 10]);
  }
  const bg = G(g);
  puffs.forEach(([px, py, r]) => mk('circle', { cx: px, cy: py, r, fill: '#141b1f', stroke: edge, 'stroke-width': 2, 'stroke-opacity': .55 }, bg));
  mk('ellipse', { cx, cy, rx: w * .44, ry: h * .4, fill: '#141b1f' }, bg);
  [[dx * .12 - 6, -20, 10], [dx * .3 - 10, -42, 15]].forEach(([dx, dy, r]) => mk('circle', { cx: dx, cy: dy, r, fill: '#141b1f', stroke: edge, 'stroke-width': 2, 'stroke-opacity': .55 }, bg));
  g._in = G(g, { x: cx, y: cy });
  return g;
}

/* ---------- people: flat puppets drawn around the feet, joints as groups ---------- */
// kind 'f' (Leena: bun, teal kurta) or 'm' (Ravi: short hair, sand shirt). s=1 is about 390 px tall.
function evPerson(p, { kind = 'f', x = 0, y = 0, s = 1, o = 1 } = {}) {
  const C = kind === 'f'
    ? { skin: EV.skinF, top: '#2b7c78', topD: '#1f5e5b', bottom: '#23303b', trim: EV.gold }
    : { skin: EV.skinM, top: '#c4b08a', topD: '#9f8d69', bottom: '#28303f', trim: '#7d6a35' };
  const P = { kind, C };
  P.g = G(p, { x, y, s, o });
  const rim = { stroke: EV.gold, 'stroke-width': 1.6, 'stroke-opacity': .35 };
  // shadow
  mk('ellipse', { cx: 0, cy: 4, rx: 74, ry: 12, fill: '#000', opacity: .45 }, P.g);
  // legs pivot at the hip
  const leg = side => {
    const g = G(P.g, { x: side * 17, y: -178 });
    path(g, `M-15 0L-13 168Q-13 176 -6 176H${side > 0 ? 22 : 14}Q${side > 0 ? 26 : 18} 176 ${side > 0 ? 24 : 16} 168L13 0Z`, { fill: C.bottom, ...rim });
    return g;
  };
  P.legL = leg(-1); P.legR = leg(1);
  // body above the waist
  P.torso = G(P.g, { x: 0, y: -178 });
  const T0 = P.torso;
  // arms go behind the torso shape on their shoulder groups
  const arm = side => {
    const up = G(T0, { x: side * 45, y: -120 });
    path(up, 'M-11 0Q-13 40 -10 80H10Q13 40 11 0Z', { fill: C.top, ...rim });
    const lo = G(up, { x: 0, y: 78 });
    path(lo, 'M-9 0L-8 70H8L9 0Z', { fill: kind === 'f' ? C.skin : C.top, ...rim });
    if (kind === 'm') path(lo, 'M-8 40H8', { stroke: C.topD, 'stroke-width': 3 });
    mk('circle', { cx: 0, cy: 78, r: 11, fill: C.skin }, lo);
    up._lo = lo;
    return up;
  };
  P.armL = arm(-1); P.armR = arm(1);
  if (kind === 'f') {
    path(T0, 'M-46 -124Q-52 -60 -50 0L-58 62H58L50 0Q52 -60 46 -124Q20 -136 0 -136Q-20 -136 -46 -124Z', { fill: C.top, ...rim });
    path(T0, 'M-14 -134Q0 -104 14 -134', { stroke: C.trim, 'stroke-width': 3 });
    path(T0, 'M-56 54H56', { stroke: C.trim, 'stroke-width': 2.5, opacity: .8 });
    path(T0, 'M0 -110V-30', { stroke: C.topD, 'stroke-width': 2, opacity: .6 });
  } else {
    path(T0, 'M-48 -122Q-52 -60 -44 6H44Q52 -60 48 -122Q22 -134 0 -134Q-22 -134 -48 -122Z', { fill: C.top, ...rim });
    path(T0, 'M-14 -132L0 -112L14 -132', { stroke: C.topD, 'stroke-width': 3 });
    path(T0, 'M0 -112V0', { stroke: C.topD, 'stroke-width': 2 });
    path(T0, 'M-44 2H44', { stroke: '#3a3324', 'stroke-width': 5 });
  }
  // head pivots at the neck
  P.head = G(T0, { x: 0, y: -132 });
  const H = P.head;
  path(H, 'M-9 4V-16H9V4Z', { fill: C.skin });
  if (kind === 'f') mk('circle', { cx: 30, cy: -82, r: 20, fill: EV.hair }, H);   // bun behind
  mk('ellipse', { cx: 0, cy: -54, rx: 33, ry: 40, fill: C.skin, ...rim }, H);
  if (kind === 'f') path(H, 'M-35 -50Q-38 -96 0 -98Q38 -96 35 -50Q30 -76 6 -82Q-20 -76 -35 -50Z', { fill: EV.hair });
  else path(H, 'M-34 -58Q-36 -98 0 -97Q36 -98 34 -58Q30 -80 0 -82Q-30 -80 -34 -58Z', { fill: EV.hair });
  // face
  P.eyes = G(H, { y: -52 });
  for (const ex of [-12, 12]) mk('ellipse', { cx: ex, cy: 0, rx: 3.6, ry: 4.6, fill: '#1a0f0a' }, P.eyes);
  const brow = side => { const g = G(H, { x: side * 12, y: -64 }); path(g, 'M-8 0H8', { stroke: '#22140d', 'stroke-width': 3.6 }); return g; };
  P.browL = brow(-1); P.browR = brow(1);
  const mouth = (d, o) => put(path(H, d, { stroke: '#3a1c14', 'stroke-width': 3.2 }), { o });
  P.m = {
    calm: mouth('M-10 -30Q0 -24 10 -30', 1),
    flat: mouth('M-9 -28H9', 0),
    frown: mouth('M-11 -25Q0 -34 11 -25', 0),
    open: put(mk('ellipse', { cx: 0, cy: -27, rx: 9, ry: 7, fill: '#3a1c14' }, H), { o: 0 }),
    smile: mouth('M-12 -31Q0 -20 12 -31', 0),
  };
  if (kind === 'f') mk('circle', { cx: 0, cy: -70, r: 2.6, fill: '#b23b2b' }, H);   // bindi
  P.flush = put(mk('ellipse', { cx: 0, cy: -44, rx: 30, ry: 16, fill: EV.anger }, H), { o: 0 });
  return P;
}
// Facial moods: brows rotate, one mouth shows. t0 on the beat clock, d its duration.
const MOODS = {
  calm: { b: 0, by: 0, m: 'calm', f: 0 }, ask: { b: -8, by: -3, m: 'flat', f: 0 }, hurt: { b: -14, by: -2, m: 'frown', f: 0 },
  tense: { b: 14, by: 2, m: 'flat', f: .25 }, angry: { b: 22, by: 4, m: 'frown', f: .45 }, shout: { b: 24, by: 4, m: 'open', f: .6 },
  sad: { b: -18, by: -1, m: 'frown', f: 0 }, smile: { b: -4, by: -2, m: 'smile', f: 0 }, worried: { b: -16, by: -3, m: 'flat', f: 0 },
};
function evMood(P, mood, t0, d = .35) {
  const M_ = MOODS[mood];
  tw(P.browL, { r: M_.b, y: -64 + M_.by }, t0, d);      // inner ends: left brow rotates clockwise to lower its inner end
  tw(P.browR, { r: -M_.b, y: -64 + M_.by }, t0, d);
  for (const k in P.m) tw(P.m[k], { o: k === M_.m ? 1 : 0 }, t0, d * .7);
  tw(P.flush, { o: M_.f }, t0, d * 2);
}
// Arm pose: shoulder and elbow angles (degrees, positive swings the hand toward the figure's left on screen).
function evArm(P, side, sh, el, t0, d = .45, ease = io) {
  const a = side < 0 ? P.armL : P.armR;
  tw(a, { r: sh }, t0, d, ease);
  tw(a._lo, { r: el }, t0, d, ease);
}
// A walk from x0 to x1 between t0 and t1: legs swing with the distance covered, the body bobs.
function evWalk(P, x0, x1, t0, t1, stride = 60) {
  put(P.g, { x: x0 });
  prog(q => {
    const x = x0 + (x1 - x0) * q, dist = Math.abs(x - x0), ph = dist / stride * Math.PI;
    put(P.g, { x });
    const sw = Math.sin(ph) * 14 * (q < 1 ? 1 : 0);
    put(P.legL, { r: sw }); put(P.legR, { r: -sw });
    put(P.torso, { y: -178 - Math.abs(Math.sin(ph)) * 5 });
    put(P.armL, { r: -sw * .8 }); put(P.armR, { r: -sw * .8 });
  }, t0, t1 - t0, lin);
}
// Breathing idle so a still figure never freezes.
function evBreathe(P, D, amp = 1.2, rate = .9) {
  prog(q => { const t = q * D; put(P.head, { y: -132 + Math.sin(t * rate * Math.PI * 2) * amp }); }, 0, D, lin);
}

/* ---------- the brain (side view, frontal lobe to the left) ---------- */
const BRAIN_D = 'M-205 22C-220 -62 -170 -146 -88 -164C-36 -194 44 -190 94 -164C166 -152 220 -92 214 -20C226 32 194 74 152 82C138 108 98 120 68 110C38 126 -12 122 -42 102C-92 114 -152 96 -178 70C-202 60 -208 42 -205 22Z';
const BRAIN_GYRI = [
  'M-170 -40C-140 -70 -120 -40 -96 -80C-74 -112 -40 -96 -20 -130',
  'M-150 30C-120 10 -100 40 -70 10C-40 -16 -10 20 20 -10C50 -40 80 -10 110 -40C140 -70 170 -40 190 -70',
  'M-60 -150C-50 -120 -20 -130 0 -100C20 -70 50 -90 70 -60C90 -30 130 -50 150 -20',
  'M40 -170C50 -140 80 -150 96 -120C110 -96 150 -110 170 -84',
  'M-120 80C-90 64 -60 90 -30 70C0 52 30 80 60 64',
];
const BRAIN_NET = [[-150, -20], [-120, -90], [-80, -40], [-60, -120], [-30, 10], [-10, -70], [20, -140], [40, -30], [70, -100], [90, 20], [120, -60], [150, -110], [170, -10], [-100, 40], [10, 60], [-170, 20]];
function evBrain(p, { x = 0, y = 0, s = 1, o = 1, stem = true } = {}) {
  const g = G(p, { x, y, s, o });
  if (stem) path(g, 'M36 104C40 150 44 186 50 228H80C74 186 72 150 74 104Z', { fill: '#12191d', stroke: EV.gold, 'stroke-width': 2.5, 'stroke-opacity': .7 });
  path(g, 'M86 102C100 140 168 142 186 98C176 74 126 70 86 102Z', { fill: '#12191d', stroke: EV.gold, 'stroke-width': 2.5, 'stroke-opacity': .7 });
  path(g, 'M104 104C130 112 156 110 176 96M98 116C126 126 154 124 172 110', { stroke: EV.gold, 'stroke-width': 1.5, opacity: .35 });
  g._shape = path(g, BRAIN_D, { fill: '#11181c', stroke: EV.gold, 'stroke-width': 3.2 });
  g._gyri = BRAIN_GYRI.map(d => path(g, d, { stroke: EV.gold, 'stroke-width': 2, opacity: .3 }));
  g._netG = G(g);
  g._edges = [];
  const N = BRAIN_NET;
  for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
    const dx = N[i][0] - N[j][0], dy = N[i][1] - N[j][1];
    if (dx * dx + dy * dy < 85 * 85) g._edges.push(path(g._netG, `M${N[i][0]} ${N[i][1]}L${N[j][0]} ${N[j][1]}`, { stroke: EV.goldHi, 'stroke-width': 2.4 }, { d: 0 }));
  }
  g._nodes = N.map(([nx, ny]) => evDot(g._netG, nx, ny, 6, EV.goldHi, 0));
  g._hypo = G(g, { x: -12, y: 72 });
  evGlow(g._hypo, 0, 0, 46, 'Gold', 0);
  g._hypoDot = evDot(g._hypo, 0, 0, 11, EV.gold, .9);
  return g;
}
// Fire the brain's network: edges draw in, nodes flash, between t0 and t0+d.
function evFire(B, t0, d = 1.2, color) {
  B._edges.forEach((e, i) => { if (color) e.setAttribute('stroke', color); draw(e, t0 + (i % 7) * d / 9, d * .5); });
  B._nodes.forEach((n, i) => { tw(n, { o: 1 }, t0 + (i % 5) * d / 7, .25); pulse(n, t0 + (i % 5) * d / 7, 1.8); });
}

/* ---------- the body (front silhouette) ---------- */
const BODY_D = 'M0 -250C26 -250 40 -230 40 -206C40 -184 28 -168 16 -162V-150C50 -146 78 -136 86 -110L104 -10C108 6 96 12 88 0L66 -86L62 40L58 210C58 226 30 226 28 210L12 70H-12L-28 210C-30 226 -58 226 -58 210L-62 40L-66 -86L-88 0C-96 12 -108 6 -104 -10L-86 -110C-78 -136 -50 -146 -16 -150V-162C-28 -168 -40 -184 -40 -206C-40 -230 -26 -250 0 -250Z';
function evBody(p, { x = 0, y = 0, s = 1, o = 1 } = {}) {
  const g = G(p, { x, y, s, o });
  g._glow = evGlow(g, 0, -60, 150, 'Gold', 0);
  g._shape = path(g, BODY_D, { fill: '#11181c', stroke: EV.gold, 'stroke-width': 3 });
  g._heart = evDot(g, 10, -104, 9, EV.gold, .8);
  return g;
}

/* ---------- cells, receptors, peptides ---------- */
// A cell with n receptors spread over an arc (a0..a1 degrees). Each receptor: {g, x, y, a, cup}.
function evCell(p, { x = 0, y = 0, r = 220, n = 8, a0 = -170, a1 = -10, s = 1, o = 1, color = EV.gold, nucleus = true } = {}) {
  const g = G(p, { x, y, s, o });
  g._r = r;
  g._body = mk('circle', { cx: 0, cy: 0, r, fill: 'url(#evCell)', stroke: color, 'stroke-width': 3, 'stroke-opacity': .85 }, g);
  mk('circle', { cx: 0, cy: 0, r: r - 12, fill: 'none', stroke: color, 'stroke-width': 1.2, 'stroke-opacity': .3 }, g);
  if (nucleus) {
    g._nuc = G(g, { x: r * .12, y: r * .18 });
    mk('ellipse', { cx: 0, cy: 0, rx: r * .34, ry: r * .28, fill: 'url(#evNucleus)', stroke: EV.shame, 'stroke-width': 2, 'stroke-opacity': .55 }, g._nuc);
    path(g._nuc, `M${-r * .2} -6C${-r * .1} -20 0 12 ${r * .1} -4S${r * .2} 10 ${r * .24} -2`, { stroke: EV.shame, 'stroke-width': 2, opacity: .6 });
  }
  g._rec = [];
  for (let i = 0; i < n; i++) g._rec.push(evReceptor(g, a0 + (a1 - a0) * (n === 1 ? .5 : i / (n - 1)), r, color));
  return g;
}
function evReceptor(cell, a, r = cell._r, color = EV.gold, o = 1) {
  const rad = a * Math.PI / 180, x = Math.cos(rad) * r, y = Math.sin(rad) * r;
  const g = G(cell, { x, y, r: a + 90, o });
  path(g, 'M0 10V-4', { stroke: color, 'stroke-width': 3 });
  const cup = path(g, 'M-15 -30V-12Q-15 -2 0 -2Q15 -2 15 -12V-30', { stroke: color, 'stroke-width': 4, fill: 'rgba(0,0,0,0)' });
  const lid = put(path(g, 'M-17 -31H17', { stroke: EV.dim, 'stroke-width': 5 }), { o: 0 });
  const rec = { g, a, x, y, cup, lid, ox: Math.cos(rad) * (r + 22), oy: Math.sin(rad) * (r + 22) };
  return rec;
}
// A peptide: a short bead chain, the head bead shaped to sit in a receptor cup. Drawn pointing down (head at 0,0).
function evPeptide(p, color, { x = 0, y = 0, r = 0, s = 1, o = 1 } = {}) {
  const g = G(p, { x, y, r, s, o });
  mk('circle', { cx: 0, cy: 0, r: 11, fill: color }, g);
  mk('circle', { cx: 0, cy: -22, r: 9, fill: color, opacity: .85 }, g);
  mk('circle', { cx: 9, cy: -40, r: 8, fill: color, opacity: .7 }, g);
  mk('circle', { cx: 2, cy: -56, r: 7, fill: color, opacity: .55 }, g);
  path(g, 'M0 0L0 -22L9 -40L2 -56', { stroke: color, 'stroke-width': 3, opacity: .6 });
  return g;
}
// Fly a peptide into a receptor (cell-space coordinates; the peptide must live inside the cell group).
function evDock(pep, rec, t0, d = .9) {
  put(pep, { r: rec.a + 90 });
  tw(pep, { x: Math.cos(rec.a * Math.PI / 180) * (Math.hypot(rec.x, rec.y) + 18), y: Math.sin(rec.a * Math.PI / 180) * (Math.hypot(rec.x, rec.y) + 18), o: 1 }, t0, d, out);
  tw(rec.cup, { c_stroke: '#ffffff' }, t0 + d * .85, .12);
  tw(rec.cup, { c_stroke: rec.cup.getAttribute('stroke') }, t0 + d * .85 + .12, .4);
}

/* ---------- DNA ---------- */
function evDNA(p, { x = 0, y = 0, w = 1100, amp = 34, turns = 7, o = 1, color = EV.shame } = {}) {
  const g = G(p, { x, y, o });
  const N = 160, pts = k => Array.from({ length: N + 1 }, (_, i) => {
    const u = i / N, X = -w / 2 + u * w, Y = Math.sin(u * turns * Math.PI * 2 + k) * amp;
    return (i ? 'L' : 'M') + X.toFixed(1) + ' ' + Y.toFixed(1);
  }).join('');
  g._rungs = [];
  const R = turns * 6;
  for (let i = 0; i <= R; i++) {
    const u = i / R, X = -w / 2 + u * w, a = Math.sin(u * turns * Math.PI * 2) * amp;
    g._rungs.push(path(g, `M${X} ${a}L${X} ${-a}`, { stroke: color, 'stroke-width': 3, opacity: .45 }));
  }
  g._a = path(g, pts(0), { stroke: color, 'stroke-width': 4 });
  g._b = path(g, pts(Math.PI), { stroke: EV.gold, 'stroke-width': 4, opacity: .8 });
  return g;
}

/* ---------- scenery ---------- */
// Living room at night: floor, sofa, lamp glow, window, side table with a phone.
function evRoom(p, { o = 1, door = true } = {}) {
  const g = G(p, { o });
  mk('rect', { x: -400, y: 700, width: 2400, height: 300, fill: '#0c1114' }, g);
  path(g, 'M-400 700H2000', { stroke: EV.gold, 'stroke-width': 1.5, opacity: .25 });
  // window
  const w = G(g, { x: 300, y: 170 });
  mk('rect', { x: 0, y: 0, width: 260, height: 300, rx: 6, fill: '#0b1720', stroke: '#2b3632', 'stroke-width': 6 }, w);
  path(w, 'M130 0V300M0 150H260', { stroke: '#2b3632', 'stroke-width': 5 });
  evGlow(w, 70, 70, 60, 'Gold', .25);
  mk('circle', { cx: 70, cy: 70, r: 14, fill: '#e8dcb5', opacity: .8 }, w);
  // lamp
  const l = G(g, { x: 1300, y: 700 });
  l._glow = evGlow(l, 0, -380, 260, 'Warm', .9);
  path(l, 'M0 0V-340M-40 0H40', { stroke: '#3a3324', 'stroke-width': 6 });
  path(l, 'M-56 -340L-36 -420H36L56 -340Z', { fill: '#d9b46a', opacity: .92 });
  g._lamp = l;
  // sofa
  const s = G(g, { x: 1060, y: 700 });
  path(s, 'M-190 -150Q-190 -176 -164 -176H164Q190 -176 190 -150V-60H-190Z', { fill: '#2a2320' });
  path(s, 'M-220 -110Q-220 -130 -200 -130H200Q220 -130 220 -110V-14H-220Z', { fill: '#3a2f2a' });
  path(s, 'M-200 -14V0M200 -14V0', { stroke: '#3a2f2a', 'stroke-width': 10 });
  path(s, 'M-150 -170Q0 -186 150 -170', { stroke: EV.gold, 'stroke-width': 1.4, opacity: .3 });
  // side table with phone
  const t = G(g, { x: 660, y: 700 });
  path(t, 'M-60 -150H60M-50 -150V0M50 -150V0', { stroke: '#4a3d2c', 'stroke-width': 8 });
  g._phone = G(t, { x: 0, y: -166 });
  mk('rect', { x: -22, y: -12, width: 44, height: 16, rx: 4, fill: '#1d2428', stroke: EV.gold, 'stroke-width': 1.5, 'stroke-opacity': .6 }, g._phone);
  // door
  if (door) {
    const d = G(g, { x: 1640, y: 700 });
    mk('rect', { x: -170, y: -470, width: 170, height: 470, fill: '#141b1f', stroke: '#2b3632', 'stroke-width': 6 }, d);
    mk('circle', { cx: -150, cy: -230, r: 7, fill: EV.gold }, d);
  }
  return g;
}
// A Kerala vallam-style boat seen from the side, hull centred on (0,0), with a lantern.
function evBoat(p, { x = 0, y = 0, s = 1, o = 1 } = {}) {
  const g = G(p, { x, y, s, o });
  path(g, 'M-170 -20Q-150 34 -60 40H70Q150 34 176 -30L150 -22Q120 8 60 10H-60Q-130 8 -150 -26Z', { fill: '#2a211b', stroke: EV.gold, 'stroke-width': 2, 'stroke-opacity': .5 });
  path(g, 'M-150 -26Q-120 4 -60 8H60Q120 6 150 -22', { stroke: '#4a3a2c', 'stroke-width': 3 });
  path(g, 'M-10 8V-150', { stroke: '#4a3a2c', 'stroke-width': 5 });
  path(g, 'M-6 -146Q60 -110 64 -24L-6 -14Z', { fill: '#3a2f27', opacity: .9 });
  g._lamp = G(g, { x: 118, y: -40 });
  evGlow(g._lamp, 0, 0, 70, 'Warm', .8);
  mk('circle', { cx: 0, cy: 0, r: 7, fill: '#ffe2a0' }, g._lamp);
  return g;
}

/* ---------- motion along a path, on the beat clock ---------- */
// n particles flowing along pathEl from t0 for dur seconds; speed in path-lengths per second.
function evFlow(pathEl, n, color, t0, dur, { speed = .22, r = 8, parent = pathEl.parentNode, fadeIn = .6 } = {}) {
  const L_ = pathEl.getTotalLength();
  const ps = Array.from({ length: n }, () => evDot(parent, 0, 0, r, color, 0));
  prog(q => {
    const t = q * dur;
    ps.forEach((d, i) => {
      const u = ((t * speed + i / n) % 1 + 1) % 1, pt = pathEl.getPointAtLength(u * L_);
      const edge = Math.min(1, u * 8, (1 - u) * 8);
      put(d, { x: pt.x, y: pt.y, o: Math.min(1, t / fadeIn) * edge });
    });
  }, t0, dur, lin);
  return ps;
}

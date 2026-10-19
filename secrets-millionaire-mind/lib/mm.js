// Secrets of the Millionaire Mind (YMU study book): the book's element library, loaded after engine.js.
// Look: YMU dark luxury. Black board, gold line work; heard / saw / lived and emotion / logic as accents.
// People, bubbles and text helpers come from the Evolve Your Brain library, renamed for this book.
'use strict';

/* ---------- palette and meaning ---------- */
const MM = {
  bg: '#080c0f', panel: '#10171b', ink: '#efe6d2', dim: '#9d9686', faint: '#3d3b35', line: '#2a2c27',
  gold: '#c9a84c', goldHi: '#e8cf86', goldLo: '#7d6a35',
  heard: '#5fb3cf', saw: '#9c84d8', lived: '#f0a35e',
  emotion: '#e2694f', logic: '#7cc79d', sci: '#8fb8c8', bad: '#e2694f', good: '#7cc79d',
  skinF: '#a9704c', skinM: '#94603f', skinOld: '#9a6a4a', hair: '#1a120d', grey: '#c9c4b8',
  wood: '#4a3d2c', wall: '#0d1316', floor: '#0c1114',
};
Object.assign(COL, { board: MM.bg, chalk: MM.ink, dim: MM.dim, faint: '#4d4a42', task: MM.gold, good: MM.good, bad: MM.bad });

/* ---------- language ---------- */
const LANG = document.documentElement.lang === 'ml' ? 'ml' : 'en';
const TXT = { en: {}, ml: {} };
const L = k => (TXT[LANG][k] ?? TXT.en[k] ?? k);
const ML = LANG === 'ml';
const SERIF = ML ? '"Noto Serif Malayalam","Cormorant Garamond",serif' : '"Cormorant Garamond",Georgia,serif';
const SANS = ML ? '"Noto Sans Malayalam","Outfit",sans-serif' : '"Outfit","Avenir Next",sans-serif';

// Interface text the engine draws after load (question buttons, finish card).
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
const mmCtx = document.createElement('canvas').getContext('2d');
const mmW = (str, size, font = SANS, weight = 500) => { mmCtx.font = `${weight} ${size}px ${font}`; return mmCtx.measureText(str).width; };
// One line of text; maxW shrinks it to fit. Malayalam runs ~12% smaller to keep its taller glyphs in proportion.
function mmText(p, str, { x = 0, y = 0, size = 34, fill = MM.ink, anchor = 'middle', font = SANS, weight = 500, o = 1, maxW, italic = false, ls } = {}) {
  if (ML) size *= .88;
  if (maxW) { const w = mmW(str, size, font, weight); if (w > maxW) size *= maxW / w; }
  const t = T(p, str, { x, y, size, fill, font, weight, anchor, o });
  if (italic && !ML) t.setAttribute('font-style', 'italic');
  if (ls) t.setAttribute('letter-spacing', ls);
  return t;
}
// Wrapped paragraph: lines broken on spaces to fit maxW. Returns a group with ._h (height) and ._n (lines).
function mmPara(p, str, { x = 0, y = 0, size = 32, lh = 1.35, maxW = 600, fill = MM.ink, anchor = 'middle', font = SANS, weight = 400, o = 1, italic = false } = {}) {
  if (ML) size *= .88;
  const words = str.split(/\s+/), lines = [];
  let cur = '';
  for (const w of words) {
    const nx = cur ? cur + ' ' + w : w;
    if (cur && mmW(nx, size, font, weight) > maxW) { lines.push(cur); cur = w; } else cur = nx;
  }
  if (cur) lines.push(cur);
  const g = G(p, { x, y, o });
  lines.forEach((ln, i) => {
    const t = T(g, ln, { x: 0, y: i * size * lh, size, fill, font, weight, anchor });
    if (italic && !ML) t.setAttribute('font-style', 'italic');
  });
  g._h = lines.length * size * lh;
  g._n = lines.length;
  g._w = Math.max(...lines.map(l => mmW(l, size, font, weight)));
  return g;
}

/* ---------- sync: every reveal of a spoken word starts on its [[mark]] ----------
   mmCue(m, e, mark, how) tags e with data-mark (read by the sync audit) and schedules its reveal from m(mark).
   how: 'fade' (default), 'pop', 'rise', 'draw' (a path), or 'none' (tag only; the caller schedules from m(mark)).
   off: small nudge after the word starts (0..0.3 s); negative values are refused, so nothing is guessed early. */
function mmCue(m, e, mark, how = 'fade', { off = 0, dur, dy = 18 } = {}) {
  if (off < 0 || off > .45) throw new Error(`mmCue ${mark}: offset ${off} outside 0..0.45 s`);
  e.setAttribute('data-mark', mark);
  const t = m(mark, off);
  e.setAttribute('data-mark-t', t.toFixed(3));
  if (how === 'fade') { put(e, { o: 0 }); tw(e, { o: 1 }, t, dur ?? .45, out); }
  else if (how === 'pop') { const s0 = st(e).s; put(e, { o: 0, s: s0 * .6 }); tw(e, { o: 1, s: s0 }, t, dur ?? .45, back); }
  else if (how === 'rise') { const y = st(e).y || 0; put(e, { o: 0, y: y + dy }); tw(e, { o: 1, y }, t, dur ?? .55, out); }
  else if (how === 'draw') draw(e, t, dur ?? .7);
  return t;
}
// A label that appears on its word: text built with mmText (or mmPara with para: true), revealed by mmCue.
function mmSay(m, p, str, mark, { how = 'fade', off = 0, dur, para = false, ...o } = {}) {
  const e = para ? mmPara(p, str, { ...o, o: 1 }) : mmText(p, str, { ...o, o: 1 });
  mmCue(m, e, mark, how, { off, dur });
  return e;
}

/* ---------- one clock for loops and staggers ----------
   mmClock(D, f): f(t) runs on every frame of the beat with the beat time t (0..D), so pause, seek and replay show
   the same frame. Loops write positions as functions of (t - m('mark')), never by accumulating per frame. */
function mmClock(D, f) { prog(q => f(q * D), 0, D, lin); }
const mmU = (t, t0, d) => Math.max(0, Math.min(1, (t - t0) / d));

/* ---------- shared defs (gradients only: no filters behind animated content) ---------- */
function mmDefs() {
  const svg = document.getElementById('stage');
  if (svg.querySelector('#mmDefs')) return;
  const d = mk('defs', { id: 'mmDefs' }, svg);
  const rg = (id, stops) => {
    const g = mk('radialGradient', { id, r: '50%', cx: '50%', cy: '50%' }, d);
    stops.forEach(([o, c, a]) => mk('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, g));
  };
  rg('mmGlowGold', [[0, MM.goldHi, .55], [.45, MM.gold, .18], [1, MM.gold, 0]]);
  rg('mmGlowWarm', [[0, '#ffd99a', .5], [.5, '#e8a95a', .12], [1, '#e8a95a', 0]]);
  for (const k of ['heard', 'saw', 'lived', 'emotion', 'logic', 'sci']) rg('mmGlow_' + k, [[0, MM[k], .55], [.5, MM[k], .15], [1, MM[k], 0]]);
  const lg = (id, a, b) => { const g = mk('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, d); [[0, a], [1, b]].forEach(([o, c]) => mk('stop', { offset: o, 'stop-color': c }, g)); };
  lg('mmNight', '#05080b', '#0f1a20');
  lg('mmDusk', '#1a1410', '#0a0d10');
  lg('mmPaper', '#e9e0c8', '#d6caa8');
}
const mmGlow = (p, x, y, r, k = 'Gold', o = 1) => put(mk('circle', { cx: 0, cy: 0, r, fill: `url(#${k === 'Gold' || k === 'Warm' ? 'mmGlow' + k : 'mmGlow_' + k})` }, p), { x, y, o });

/* ---------- small pieces ---------- */
const mmLine = (p, d, stroke = MM.gold, w = 3, extra = {}) => path(p, d, { stroke, 'stroke-width': w, ...extra });
const mmDot = (p, x, y, r, fill, o = 1) => put(mk('circle', { cx: 0, cy: 0, r, fill }, p), { x, y, o });
function mmHead(p, x, y, a, color = MM.gold, s = 1) { return put(path(p, 'M-16 -10L2 0L-16 10', { stroke: color, 'stroke-width': 3.5 }), { x, y, r: a, s }); }
// Rounded box path centred on (0,0).
const mmBoxD = (w, h, r = 18) => `M${-w / 2 + r} ${-h / 2}H${w / 2 - r}Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + r}V${h / 2 - r}Q${w / 2} ${h / 2} ${w / 2 - r} ${h / 2}H${-w / 2 + r}Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - r}V${-h / 2 + r}Q${-w / 2} ${-h / 2} ${-w / 2 + r} ${-h / 2}Z`;
// A pill with text, sized to the text. Returns the group with ._w.
function mmChip(p, str, color, { x = 0, y = 0, size = 28, o = 1, fill, solid = false, weight = 500 } = {}) {
  const g = G(p, { x, y, o });
  const sz = ML ? size * .88 : size;
  const w = mmW(str, sz, SANS, weight) + sz * 1.3, h = sz * 1.7;
  path(g, mmBoxD(w, h, h / 2), { fill: solid ? color : '#10171b', stroke: color, 'stroke-width': 2.2 });
  T(g, str, { x: 0, y: sz * .36, size: sz, fill: fill || (solid ? '#0b0e10' : color), font: SANS, weight, anchor: 'middle' });
  g._w = w; g._h = h;
  return g;
}
// Speech bubble with its tail at (0,0); text wrapped inside.
function mmBubble(p, str, { x = 0, y = 0, w = 420, size = 32, fill = MM.ink, bg = '#151d21', edge = MM.gold, tail = 'left', o = 0, italic = false, font = SANS } = {}) {
  const g = G(p, { x, y, o, s: .9 });
  const txt = mmPara(g, str, { x: 0, y: 0, size, maxW: w - 56, fill, italic, font });
  const h = txt._h + 34, bw = w, by = -h - 26, bx = -bw / 2;
  const tx = tail === 'left' ? -bw / 2 + 60 : tail === 'right' ? bw / 2 - 60 : 0;
  const r = 26;
  const d = `M${bx + r} ${by}H${bx + bw - r}Q${bx + bw} ${by} ${bx + bw} ${by + r}V${by + h - r}Q${bx + bw} ${by + h} ${bx + bw - r} ${by + h}`
    + `H${tx + 22}L${tx - (tail === 'right' ? -10 : 10) * 2} ${by + h + 26}L${tx - 4} ${by + h}H${bx + r}Q${bx} ${by + h} ${bx} ${by + h - r}V${by + r}Q${bx} ${by} ${bx + r} ${by}Z`;
  g.insertBefore(path(null, d, { fill: bg, stroke: edge, 'stroke-width': 2, 'stroke-opacity': .75 }), g.firstChild);
  put(txt, { y: by + 17 + (ML ? size * .78 : size * .82) });
  g._h = h;
  return g;
}

/* ---------- people: flat puppets drawn around the feet, joints as groups ----------
   kind: 'f' woman in a headscarf, 'g' grandmother (white thattam), 'm' man (sand shirt), 'r' man with a beard
   (white shirt), 'u' tea-shop uncle (cap, beard), 'k' child. s = 1 is about 390 px tall (a child about 250). */
const MM_KIND = {
  f: { skin: MM.skinF, top: '#6e2f3a', topD: '#4f2029', bottom: '#2a1f26', scarf: '#7a3442', trim: MM.gold },
  g: { skin: MM.skinOld, top: '#d8cfbd', topD: '#b6ad9a', bottom: '#cfc6b3', scarf: '#ece6d8', trim: '#9d9686' },
  m: { skin: MM.skinM, top: '#c4b08a', topD: '#9f8d69', bottom: '#28303f', trim: '#7d6a35' },
  r: { skin: MM.skinM, top: '#e6e1d4', topD: '#bdb7a8', bottom: '#2a2f38', trim: '#8c8572', beard: true },
  u: { skin: '#8a5a3c', top: '#e9e3d4', topD: '#c4bca8', bottom: '#ece6d8', trim: '#8c8572', beard: true, cap: true },
  k: { skin: MM.skinF, top: '#2b7c78', topD: '#1f5e5b', bottom: '#23303b', trim: MM.gold },
};
function mmPerson(p, { kind = 'm', x = 0, y = 0, s = 1, o = 1 } = {}) {
  const C = MM_KIND[kind];
  const fem = kind === 'f' || kind === 'g';
  const P = { kind, C };
  const sc = kind === 'k' ? s * .64 : s;
  P.g = G(p, { x, y, s: sc, o });
  const rim = { stroke: MM.gold, 'stroke-width': 1.6, 'stroke-opacity': .35 };
  mk('ellipse', { cx: 0, cy: 4, rx: 74, ry: 12, fill: '#000', opacity: .45 }, P.g);
  const leg = side => {
    const g = G(P.g, { x: side * 17, y: -178 });
    path(g, `M-15 0L-13 168Q-13 176 -6 176H${side > 0 ? 22 : 14}Q${side > 0 ? 26 : 18} 176 ${side > 0 ? 24 : 16} 168L13 0Z`, { fill: C.bottom, ...rim });
    return g;
  };
  P.legL = leg(-1); P.legR = leg(1);
  P.torso = G(P.g, { x: 0, y: -178 });
  const T0 = P.torso;
  const arm = side => {
    const up = G(T0, { x: side * 45, y: -120 });
    path(up, 'M-11 0Q-13 40 -10 80H10Q13 40 11 0Z', { fill: C.top, ...rim });
    const lo = G(up, { x: 0, y: 78 });
    path(lo, 'M-9 0L-8 70H8L9 0Z', { fill: fem ? C.top : C.top, ...rim });
    path(lo, 'M-8 46H8', { stroke: C.topD, 'stroke-width': 3 });
    mk('circle', { cx: 0, cy: 78, r: 11, fill: C.skin }, lo);
    up._lo = lo;
    return up;
  };
  P.armL = arm(-1); P.armR = arm(1);
  if (fem) {
    path(T0, 'M-46 -124Q-52 -60 -52 0L-60 160H60L52 0Q52 -60 46 -124Q20 -136 0 -136Q-20 -136 -46 -124Z', { fill: C.top, ...rim });
    path(T0, 'M-58 120H58', { stroke: C.trim, 'stroke-width': 2.5, opacity: .7 });
  } else {
    path(T0, 'M-48 -122Q-52 -60 -44 6H44Q52 -60 48 -122Q22 -134 0 -134Q-22 -134 -48 -122Z', { fill: C.top, ...rim });
    path(T0, 'M-14 -132L0 -112L14 -132', { stroke: C.topD, 'stroke-width': 3 });
    path(T0, 'M0 -112V0', { stroke: C.topD, 'stroke-width': 2 });
    if (kind === 'u') path(T0, 'M-44 2H44', { stroke: C.topD, 'stroke-width': 4 });
    else path(T0, 'M-44 2H44', { stroke: '#3a3324', 'stroke-width': 5 });
  }
  P.head = G(T0, { x: 0, y: -132 });
  const H = P.head;
  path(H, 'M-9 4V-16H9V4Z', { fill: C.skin });
  if (fem) {
    // headscarf framing the face, falling to the shoulders
    path(H, 'M-44 10Q-52 -60 -36 -88Q0 -112 36 -88Q52 -60 44 10Q20 18 0 18Q-20 18 -44 10Z', { fill: C.scarf, ...rim });
  }
  mk('ellipse', { cx: 0, cy: -54, rx: fem ? 29 : 33, ry: fem ? 36 : 40, fill: C.skin, ...rim }, H);
  if (fem) path(H, 'M-31 -58Q-32 -94 0 -96Q32 -94 31 -58Q20 -84 0 -86Q-20 -84 -31 -58Z', { fill: C.scarf });
  else path(H, 'M-34 -58Q-36 -98 0 -97Q36 -98 34 -58Q30 -80 0 -82Q-30 -80 -34 -58Z', { fill: kind === 'u' ? MM.grey : MM.hair });
  if (C.cap) path(H, 'M-32 -78Q-30 -100 0 -101Q30 -100 32 -78Z', { fill: '#f2eee4', stroke: MM.gold, 'stroke-width': 1.2, 'stroke-opacity': .4 });
  if (C.beard) path(H, 'M-31 -46Q-30 -10 0 -6Q30 -10 31 -46Q24 -26 0 -24Q-24 -26 -31 -46Z', { fill: kind === 'u' ? MM.grey : MM.hair });
  if (kind === 'g') path(H, 'M-18 -40Q-12 -36 -6 -40M6 -40Q12 -36 18 -40', { stroke: '#6b4a34', 'stroke-width': 1.6, opacity: .7 });
  P.eyes = G(H, { y: -52 });
  for (const ex of [-12, 12]) mk('ellipse', { cx: ex, cy: 0, rx: 3.6, ry: 4.6, fill: '#1a0f0a' }, P.eyes);
  if (kind === 'u' || kind === 'g') path(H, 'M-22 -52a10 9 0 1 0 20 0a10 9 0 1 0 -20 0M2 -52a10 9 0 1 0 20 0a10 9 0 1 0 -20 0M-2 -53H2', { stroke: '#2b2b2b', 'stroke-width': 2 });
  const brow = side => { const g = G(H, { x: side * 12, y: -64 }); path(g, 'M-8 0H8', { stroke: kind === 'u' || kind === 'g' ? '#8d867a' : '#22140d', 'stroke-width': 3.6 }); return g; };
  P.browL = brow(-1); P.browR = brow(1);
  const mouth = (d, o) => put(path(H, d, { stroke: '#3a1c14', 'stroke-width': 3.2 }), { o });
  P.m = {
    calm: mouth('M-10 -30Q0 -24 10 -30', 1),
    flat: mouth('M-9 -28H9', 0),
    frown: mouth('M-11 -25Q0 -34 11 -25', 0),
    open: put(mk('ellipse', { cx: 0, cy: -27, rx: 9, ry: 7, fill: '#3a1c14' }, H), { o: 0 }),
    smile: mouth('M-12 -31Q0 -20 12 -31', 0),
  };
  P.flush = put(mk('ellipse', { cx: 0, cy: -44, rx: 30, ry: 16, fill: MM.emotion }, H), { o: 0 });
  return P;
}
const MOODS = {
  calm: { b: 0, by: 0, m: 'calm', f: 0 }, ask: { b: -8, by: -3, m: 'flat', f: 0 }, hurt: { b: -14, by: -2, m: 'frown', f: 0 },
  tense: { b: 14, by: 2, m: 'flat', f: .25 }, angry: { b: 22, by: 4, m: 'frown', f: .45 }, shout: { b: 24, by: 4, m: 'open', f: .6 },
  sad: { b: -18, by: -1, m: 'frown', f: 0 }, smile: { b: -4, by: -2, m: 'smile', f: 0 }, worried: { b: -16, by: -3, m: 'flat', f: 0 },
  talk: { b: -4, by: -2, m: 'open', f: 0 },
};
function mmMood(P, mood, t0, d = .35) {
  const M_ = MOODS[mood];
  tw(P.browL, { r: M_.b, y: -64 + M_.by }, t0, d);
  tw(P.browR, { r: -M_.b, y: -64 + M_.by }, t0, d);
  for (const k in P.m) tw(P.m[k], { o: k === M_.m ? 1 : 0 }, t0, d * .7);
  tw(P.flush, { o: M_.f }, t0, d * 2);
}
// Arm pose: shoulder and elbow angles (degrees, positive swings the hand toward the figure's left on screen).
function mmArm(P, side, sh, el, t0, d = .45, ease = io) {
  const a = side < 0 ? P.armL : P.armR;
  tw(a, { r: sh }, t0, d, ease);
  tw(a._lo, { r: el }, t0, d, ease);
}
// A walk from x0 to x1 between t0 and t1: legs swing with the distance covered, the body bobs.
function mmWalk(P, x0, x1, t0, t1, stride = 60) {
  prog(q => {
    const x = x0 + (x1 - x0) * q, dist = Math.abs(x - x0), ph = dist / stride * Math.PI;
    put(P.g, { x });
    const sw = Math.sin(ph) * 14 * (q < 1 ? 1 : 0);
    put(P.legL, { r: sw }); put(P.legR, { r: -sw });
    put(P.torso, { y: -178 - Math.abs(Math.sin(ph)) * 5 });
    put(P.armL, { r: -sw * .8 }); put(P.armR, { r: -sw * .8 });
  }, t0, t1 - t0, lin);
}
// Breathing idle so a still figure never freezes (head bob as a function of beat time).
function mmBreathe(P, D, amp = 1.2, rate = .9) {
  prog(q => { const t = q * D; put(P.head, { y: -132 + Math.sin(t * rate * Math.PI * 2) * amp }); }, 0, D, lin);
}
// Talking: the mouth opens and closes inside [t0, t1] on the beat clock. All talk windows of one person share a single
// clock function, and nothing else is tweened on the mouth, so pause, seek and replay show the same frame.
function mmTalk(P, t0, t1, D, rest = 'calm') {
  if (!P._talk) {
    P._talk = [];
    prog(q => {
      const t = q * D;
      let cur = null, last = null;
      for (const w of P._talk) { if (t >= w[0] && t <= w[1]) cur = w; if (t > w[1]) last = w; }
      if (cur) { const open = Math.sin((t - cur[0]) * 9) > .1; for (const k in P.m) put(P.m[k], { o: k === (open ? 'open' : cur[2]) ? 1 : 0 }); }
      else if (last) for (const k in P.m) put(P.m[k], { o: k === last[2] ? 1 : 0 });
    }, 0, D, lin);
  }
  P._talk.push([t0, t1, rest]);
}

/* ---------- science check card ----------
   A quiet card with a magnifier, the kicker "Science check" and a verdict chip. Rows are added by the chapter
   (each revealed on its own mark). verdict: 'ok' supported, 'half' partly, 'no' not shown. */
const MM_VERDICT = { ok: MM.good, half: MM.gold, no: MM.bad };
function mmSci(p, { x = 0, y = 0, w = 640, h = 420, o = 1, title = 'Science check' } = {}) {
  const g = G(p, { x, y, o });
  path(g, `M0 0H${w}V${h}H0Z`, { fill: 'rgba(14,20,24,.96)', stroke: '#2c3a3e', 'stroke-width': 2 });
  path(g, `M0 0H${w}`, { stroke: MM.sci, 'stroke-width': 3 });
  const mg = G(g, { x: 46, y: 50 });
  mk('circle', { cx: 0, cy: 0, r: 15, fill: 'none', stroke: MM.sci, 'stroke-width': 3.5 }, mg);
  path(mg, 'M11 11L24 24', { stroke: MM.sci, 'stroke-width': 4.5 });
  g._title = mmText(g, title, { x: 82, y: 62, size: 30, fill: MM.sci, anchor: 'start', weight: 600, ls: ML ? undefined : '2' });
  g._w = w; g._h = h;
  return g;
}

/* ---------- the chain: Programming → Thoughts → Feelings → Actions → Results ---------- */
// One node: a rounded card with an icon slot and a label. Returns group with ._box (for picking) and ._ring.
function mmNode(p, str, color, { x = 0, y = 0, w = 210, h = 120, o = 1, size = 30, sub } = {}) {
  const g = G(p, { x, y, o });
  g._ring = path(g, mmBoxD(w + 18, h + 18, 26), { stroke: color, 'stroke-width': 3, opacity: 0 });
  g._card = path(g, mmBoxD(w, h, 20), { fill: '#10171b', stroke: color, 'stroke-width': 2.6 });
  g._label = mmText(g, str, { x: 0, y: sub ? -4 : 11, size, fill: MM.ink, weight: 500, maxW: w - 24 });
  if (sub) g._sub = mmText(g, sub, { x: 0, y: 34, size: 20, fill: color, weight: 400, maxW: w - 24 });
  g._box = [x - w / 2, y - h / 2, w, h];
  g._w = w; g._h = h;
  return g;
}
// Arrow from (x0,y) to (x1,y), drawn on; head shown when drawing ends.
function mmArrow(p, x0, y0, x1, y1, color = MM.gold, w = 3) {
  const g = G(p);
  const a = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
  g._line = path(g, `M${x0} ${y0}L${x1 - Math.cos(a * Math.PI / 180) * 6} ${y1 - Math.sin(a * Math.PI / 180) * 6}`, { stroke: color, 'stroke-width': w }, { d: 0 });
  g._head = put(mmHead(g, x1, y1, a, color, .9), { o: 0 });
  return g;
}
function mmArrowIn(A, t, d = .45) { draw(A._line, t, d); show(A._head, t + d * .8, .15); }

/* ---------- the mind's files ---------- */
// A filing drawer seen from the front, open, with n file tabs. Returns group with ._files (tab groups) and ._front.
function mmCabinet(p, { x = 0, y = 0, s = 1, o = 1, n = 6, color = MM.gold } = {}) {
  const g = G(p, { x, y, s, o });
  path(g, 'M-170 -40H170V170H-170Z', { fill: '#12191d', stroke: color, 'stroke-width': 3 });
  g._files = [];
  for (let i = 0; i < n; i++) {
    const f = G(g, { x: -130 + i * 52, y: -40 });
    path(f, 'M-22 0V-56Q-22 -64 -14 -64H14Q22 -64 22 -56V0', { fill: '#d9cfb3', stroke: '#8f845f', 'stroke-width': 1.6 });
    path(f, 'M-14 -50H10M-14 -40H4', { stroke: '#8f845f', 'stroke-width': 2 });
    g._files.push(f);
  }
  g._front = G(g);
  path(g._front, 'M-170 -40H170V60H-170Z', { fill: '#161f24', stroke: color, 'stroke-width': 3 });
  path(g._front, 'M-40 2H40', { stroke: color, 'stroke-width': 6 });
  return g;
}
// A single file folder with a label on its tab. Drawn around its centre; ._label is the text.
function mmFile(p, str, { x = 0, y = 0, s = 1, o = 1, color = MM.gold, w = 300, h = 200, size = 26, lines = [] } = {}) {
  const g = G(p, { x, y, s, o });
  path(g, `M${-w / 2} ${-h / 2 + 20}H${-w / 2 + 120}L${-w / 2 + 140} ${-h / 2}H${-w / 2 + 230}L${-w / 2 + 250} ${-h / 2 + 20}H${w / 2}V${h / 2}H${-w / 2}Z`,
    { fill: '#d9cfb3', stroke: color, 'stroke-width': 2.4 });
  g._label = mmText(g, str, { x: -w / 2 + 190, y: -h / 2 + 16, size: size * .7, fill: '#3a3222', weight: 600, maxW: 100 });
  g._lines = lines.map((ln, i) => mmText(g, ln, { x: 0, y: -h / 2 + 76 + i * 44, size, fill: '#2a2318', weight: 500, maxW: w - 40, font: SERIF }));
  return g;
}

/* ---------- props ---------- */
function mmPhone(p, { x = 0, y = 0, s = 1, o = 1 } = {}) {
  const g = G(p, { x, y, s, o });
  path(g, mmBoxD(56, 96, 10), { fill: '#141b1f', stroke: MM.goldHi, 'stroke-width': 2.5 });
  path(g, mmBoxD(44, 70, 4), { fill: '#24343b' });
  mk('circle', { cx: 0, cy: 40, r: 3, fill: MM.goldHi }, g);
  return g;
}
function mmPlate(p, { x = 0, y = 0, s = 1, o = 1 } = {}) {
  const g = G(p, { x, y, s, o });
  mk('ellipse', { cx: 0, cy: 0, rx: 52, ry: 18, fill: '#e9e2d0' }, g);
  mk('ellipse', { cx: 0, cy: -4, rx: 30, ry: 10, fill: '#c98a3e' }, g);
  path(g, 'M-70 -30V20M-78 -30V-6M-62 -30V-6M70 -30V20', { stroke: MM.dim, 'stroke-width': 3 });
  return g;
}
function mmTransfer(p, { x = 0, y = 0, s = 1, o = 1 } = {}) {
  const g = G(p, { x, y, s, o });
  path(g, mmBoxD(110, 70, 10), { fill: '#12191d', stroke: MM.goldHi, 'stroke-width': 2.5 });
  path(g, 'M-30 -6H26M14 -18L28 -6L14 6', { stroke: MM.goldHi, 'stroke-width': 3 });
  path(g, 'M-30 16H6', { stroke: MM.dim, 'stroke-width': 3 });
  return g;
}
// A heart outline at (0,0), about 60 px wide.
const MM_HEART = 'M0 26C-46 -4 -38 -42 -13 -38C-4 -36 0 -28 0 -22C0 -28 4 -36 13 -38C38 -42 46 -4 0 26Z';

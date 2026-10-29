// The Science of Getting Rich: the book's element library (loaded after engine.js).
// Look: YMU dark luxury, the same board, gold and type as the other books in the library.
// The lessons were first drawn for a single-page book; this file keeps that drawing kit
// (deterministic beat timelines: tw, show, draw, pop, prog...) and runs it inside the shared engine:
// every beat draws into its own engine panel, and one engine prog replays the beat's own timeline.
'use strict';

/* ---------- palette ---------- */
const EV = {
  bg: '#080c0f', panel: '#10171b', ink: '#efe6d2', dim: '#9d9686', faint: '#3d3b35', line: '#2a2c27',
  gold: '#c9a84c', goldHi: '#e8cf86', goldLo: '#7d6a35', sun: '#e8c46a', good: '#7cc79d', bad: '#e2694f',
};
Object.assign(COL, { board: EV.bg, chalk: EV.ink, dim: EV.dim, faint: '#4d4a42', task: EV.gold, good: EV.good, bad: EV.bad });

/* ---------- language ---------- */
const LANG = document.documentElement.lang === 'ml' ? 'ml' : 'en';
const ML = LANG === 'ml';
const SERIF = ML ? '"Noto Serif Malayalam","Cormorant Garamond",serif' : '"Cormorant Garamond",Georgia,serif';
const SANS = ML ? '"Noto Sans Malayalam","Outfit",sans-serif' : '"Outfit","Avenir Next",sans-serif';

// Interface text the engine draws (question buttons, finish card), in Malayalam.
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
  hintChoose: ' തിരഞ്ഞെടുക്കൂ', hintRow: ' വരി, ', hintCheck: ' പരിശോധിക്കൂ, ', hintMove: ' നീങ്ങൂ, ', hintChooseOrClick: ' തിരഞ്ഞെടുക്കൂ, അല്ലെങ്കിൽ ചിത്രത്തിൽ തൊടൂ',
};

/* ---------- on-screen text in Malayalam ----------
   The drawings are written with English labels. A chapter page in Malayalam supplies SG_TR (English -> Malayalam)
   and every text node is translated as it enters the page. SVG text that comes out wider than the English it
   replaces is shrunk back to that width, so layouts drawn for English still fit. */
const SG_NUM = { one: 'ഒരു', two: 'രണ്ട്', three: 'മൂന്ന്', four: 'നാല്' };
const SG_PAT = [
  [/^read (\d+) times?$/, a => `${a} തവണ വായിച്ചു`],
  [/^year (\d+)$/, a => `വർഷം ${a}`],
  [/^day (\d+)$/, a => `ദിവസം ${a}`],
  [/^UNIT (\d+) · CHAPTER (\d+)$/, (a, b) => `യൂണിറ്റ് ${a} · അധ്യായം ${b}`],
  [/^Chapter (\d+)$/, a => `അധ്യായം ${a}`],
  [/^Chapter (\d+) complete$/, a => `അധ്യായം ${a} പൂർത്തിയായി`],
  [/^Chapter (\d+) in (one|two|three|four) lines?$/, (a, n) => `അധ്യായം ${a}, ${SG_NUM[n]} വരികളിൽ`],
  [/^Wattles: “(.+)”$/, q => `വാട്ടിൽസ്: “${tr(q)}”`],
  [/^(\d+) of (\d+)$/, (a, b) => `${b}-ൽ ${a}`],
];
const norm = s => s.replace(/\s+/g, ' ').trim();
const SG_MAP = (ML && window.SG_TR) || {};
function tr(s) {
  if (!ML || s == null) return s;
  const k = norm(String(s));
  if (!k) return s;
  if (k in SG_MAP) return SG_MAP[k];
  for (const [re, fn] of SG_PAT) { const m = re.exec(k); if (m) return fn(...m.slice(1)); }
  return s;
}
if (ML) {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const fix = node => {
    const t = node.nodeValue;
    if (!t || !/[A-Za-z]/.test(t)) return;
    let out = tr(t);
    if (out === t || out == null) return;
    out = t.match(/^\s*/)[0] + out + t.match(/\s*$/)[0];
    const host = node.parentNode;
    // letter-spacing splits Malayalam conjuncts apart, so it goes wherever translated text lands
    if (host && host.nodeType === 1 && host.getAttribute('letter-spacing')) host.removeAttribute('letter-spacing');
    if (host && host.namespaceURI === SVGNS && host.getComputedTextLength) {
      let w0 = 0; try { w0 = host.getComputedTextLength(); } catch (e) {}
      node.nodeValue = out;
      if (w0 > 4) {
        let w1 = 0; try { w1 = host.getComputedTextLength(); } catch (e) {}
        if (w1 > w0 * 1.08) {
          const fs = parseFloat(host.getAttribute('font-size')) || 28;
          host.setAttribute('font-size', (fs * Math.max(.6, (w0 * 1.08) / w1)).toFixed(1));
        }
      }
    } else node.nodeValue = out;
  };
  const walk = root => {
    if (root.nodeType === 3) { fix(root); return; }
    if (root.nodeType !== 1 || root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) fix(n);
  };
  new MutationObserver(list => {
    for (const r of list) {
      if (r.type === 'characterData') fix(r.target);
      else r.addedNodes.forEach(walk);
    }
  }).observe(document.body, { subtree: true, childList: true, characterData: true });
}

/* ---------- the drawing kit ---------- */
// the engine's own pieces this kit hands work to (taken before the kit's own quiz, choice... shadow them)
const SG_ENG = { panel, quiz, choice, grid, pickEls, finishCard, prog, lin, TF, SCREEN, BAND, translate };
const SG = (() => {
  const ENG = SG_ENG;
  const NS = 'http://www.w3.org/2000/svg';
  function mk(tag, attrs = {}, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  const C = { ink: EV.ink, dim: EV.dim, faint: EV.faint, gold: EV.gold, goldHi: EV.goldHi, cash: '#7fa7b9', loss: '#d97a5f', board: EV.bg, surface: EV.panel };
  const FD = SERIF, FT = SANS, FM = SANS;
  const E = {
    out: q => 1 - Math.pow(1 - q, 3), expo: q => q === 1 ? 1 : 1 - Math.pow(2, -10 * q),
    io: q => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2, soft: q => .5 - .5 * Math.cos(Math.PI * q),
    back: q => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(q - 1, 3) + c1 * Math.pow(q - 1, 2); }, lin: q => q,
  };
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // one timeline per beat: the elements it tracks, its progs and its last moment
  let CX = { ELS: [], PROGS: [], LAST: 0 };
  function track(e, st) { e._b = Object.assign({ x: 0, y: 0, s: 1, r: 0, o: 1 }, st); e._tw = []; e._k = ''; CX.ELS.push(e); return e; }
  function G(p, st = {}) { return track(mk('g', {}, p), st); }
  function T(p, str, o = {}) {
    const e = mk('text', { 'font-family': o.font || FT, 'font-size': o.size || 30, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'start', 'font-weight': o.weight || 400 }, p);
    if (o.italic && !ML) e.setAttribute('font-style', 'italic');
    if (o.ls && !ML) e.setAttribute('letter-spacing', o.ls);
    e.textContent = str;
    return track(e, { x: o.x || 0, y: o.y || 0, o: o.o ?? 1, s: o.s ?? 1, r: o.r || 0 });
  }
  function Pth(p, d, attrs = {}, st = {}) {
    const e = mk('path', Object.assign({ d, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs), p);
    if ('dw' in st) { e.setAttribute('pathLength', '1'); e.setAttribute('stroke-dasharray', '1 1'); }
    return track(e, st);
  }
  function valAt(e, k, t) {
    let v = e._b[k];
    for (const w of e._tw) { if (!(k in w.to)) continue; if (t < w.t0) break; const q = w.dur <= 0 ? 1 : Math.min(1, (t - w.t0) / w.dur); v = w.from[k] + (w.to[k] - w.from[k]) * w.ease(q); }
    return v;
  }
  function tw(e, to, t0, dur = .6, ease = E.out) {
    if (REDUCED && dur > .25 && !('dw' in to)) dur = .25;
    // Malayalam can put two cues a word apart; a fade written after another must not start before that one
    // has had a moment on screen, or a label gets stuck visible.
    if (ML && 'o' in to) { if (e._lastO && t0 < e._lastO.t0 + Math.min(e._lastO.dur, .5)) t0 = e._lastO.t0 + Math.min(e._lastO.dur, .5); e._lastO = { t0, dur }; }
    const from = {}; for (const k in to) { if (e._b[k] === undefined) e._b[k] = to[k]; from[k] = valAt(e, k, t0); }
    const w = { to, from, t0, dur, ease }; let i = e._tw.length; while (i > 0 && e._tw[i - 1].t0 > t0) i--; e._tw.splice(i, 0, w);
    CX.LAST = Math.max(CX.LAST, t0 + dur); return e;
  }
  const show = (e, t0, d = .5) => tw(e, { o: 1 }, t0, d);
  const hide = (e, t0, d = .4) => tw(e, { o: 0 }, t0, d);
  const draw = (e, t0, d = 1, ease = E.io) => tw(e, { dw: 1 }, t0, d, ease);
  const rise = (e, t0, d = .6) => { e._b.y += 14; e._b.o = 0; return tw(e, { y: e._b.y - 14, o: 1 }, t0, d); };
  const lastEl = () => CX.ELS[CX.ELS.length - 1];
  const pop = (e, t0, d = .55) => { e._b.s = .82; e._b.o = 0; return tw(e, { s: 1, o: 1 }, t0, d, E.back); };
  function prog(fn, t0, dur, ease = E.io) { CX.PROGS.push({ fn, t0, dur, ease, lv: null }); CX.LAST = Math.max(CX.LAST, t0 + dur); }
  function clockRun(fn, D) { CX.PROGS.push({ fn: q => fn(q * D), t0: 0, dur: D, ease: E.lin, lv: null }); }
  function render(t, cx = CX) {
    for (const e of cx.ELS) {
      const x = valAt(e, 'x', t), y = valAt(e, 'y', t), s = valAt(e, 's', t), r = valAt(e, 'r', t), o = Math.max(0, Math.min(1, valAt(e, 'o', t)));
      const tr = `translate(${x.toFixed(2)} ${y.toFixed(2)})` + (r ? ` rotate(${r.toFixed(2)})` : '') + (Math.abs(s - 1) > 1e-4 ? ` scale(${s.toFixed(4)})` : '');
      const k = tr + '|' + o.toFixed(3);
      if (k !== e._k) { e.setAttribute('transform', tr); e.setAttribute('opacity', o.toFixed(3)); e._k = k; }
      if (e._b.dw !== undefined) { const dv = (1 - valAt(e, 'dw', t)).toFixed(4); if (dv !== e._ld) { e.setAttribute('stroke-dashoffset', dv); e._ld = dv; } }
    }
    for (const p of cx.PROGS) { const q = p.dur <= 0 ? 1 : Math.max(0, Math.min(1, (t - p.t0) / p.dur)); const v = p.ease(q); if (v !== p.lv) { p.fn(v); p.lv = v; } }
  }

  /* ---------- people and things ---------- */
  function figure(p, { x = 0, y = 0, s = 1, col = C.ink, hood = false, o = 1, armL = [-64, -140], armR = [64, -140], dress = 'coat', hair = null, r = 0 } = {}) {
    // A standing person drawn around the feet (0,0), 300 units tall at s = 1. dress: 'coat' | 'mundu' | 'saree' | 'shirt'
    const g = G(p, { x, y, s, o, r });
    const st = { stroke: col, 'stroke-width': (3 / Math.max(.3, s)).toFixed(2), fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    const a = (d, extra = {}) => mk('path', Object.assign({}, st, extra, { d }), g);
    if (dress === 'mundu') {
      a('M-16 -10 L-18 -4 M16 -10 L18 -4 M-18 -4 h-14 M18 -4 h14');
      a('M-40 -132 L-44 -10 L44 -10 L40 -132 Z', { fill: C.board });
      a('M-40 -132 H40 M12 -132 L22 -14', { 'stroke-width': 1.5, opacity: .6 });
      a('M-34 -226 Q-48 -180 -42 -132 L42 -132 Q48 -180 34 -226 Z', { fill: C.board });
    } else if (dress === 'saree') {
      a('M-14 -10 L-16 -4 M14 -10 L16 -4 M-16 -4 h-12 M16 -4 h12');
      a('M-30 -226 Q-50 -150 -54 -10 L54 -10 Q50 -150 30 -226 Z', { fill: C.board });
      a('M-28 -224 Q10 -170 50 -40', { 'stroke-width': 2, opacity: .75 });
      a('M-50 -60 H50', { 'stroke-width': 1.5, opacity: .5 });
    } else {
      a('M-18 -92 L-22 -4 M18 -92 L22 -4 M-22 -4 h-14 M22 -4 h14');
      a('M-34 -226 Q-56 -150 -52 -92 L52 -92 Q56 -150 34 -226 Z', { fill: C.board });
      if (dress === 'coat') a('M-10 -200 V-110', { 'stroke-width': 1.5, opacity: .5 });
    }
    g.armL = a(`M-30 -214 L${armL[0]} ${armL[1]}`); g.armR = a(`M30 -214 L${armR[0]} ${armR[1]}`);
    g.hand = (side = 'R') => side === 'R' ? [x + armR[0] * s, y + armR[1] * s] : [x + armL[0] * s, y + armL[1] * s];
    if (hood) {
      a('M-38 -262 Q-40 -316 0 -318 Q40 -316 38 -262 Q32 -224 0 -222 Q-32 -224 -38 -262Z', { fill: C.board });
      a('M-24 -262 Q-24 -294 0 -295 Q24 -294 24 -262 Q20 -238 0 -237 Q-20 -238 -24 -262Z', { 'stroke-width': 1.6, 'stroke-dasharray': '3 4' });
    }
    if (hair === 'bun' || dress === 'saree') mk('circle', Object.assign({}, st, { cx: 0, cy: -298, r: 12, fill: C.board }), g);
    mk('circle', Object.assign({}, st, { cx: 0, cy: -262, r: hood ? 18 : 25, fill: C.board }), g);
    if (hair === 'short') a('M-24 -270 Q-20 -292 0 -290 Q20 -292 24 -270', { 'stroke-width': 2 });
    return g;
  }
  function painting(p, x, y) {
    const g = G(p, { x, y });
    mk('rect', { x: -66, y: -50, width: 132, height: 100, fill: C.board, stroke: C.gold, 'stroke-width': 4 }, g);
    mk('rect', { x: -56, y: -40, width: 112, height: 80, fill: 'none', stroke: C.gold, 'stroke-width': 1.2, opacity: .7 }, g);
    mk('path', { d: 'M-50 26 Q-20 -18 6 10 Q24 -10 50 22', fill: 'none', stroke: C.goldHi, 'stroke-width': 2 }, g);
    mk('circle', { cx: 26, cy: -18, r: 8, fill: 'none', stroke: C.goldHi, 'stroke-width': 2 }, g);
    return g;
  }
  function furs(p, x, y, col = C.ink) {
    const g = G(p, { x, y });
    mk('path', { d: 'M-58 0 Q-62 -38 -20 -44 Q24 -52 56 -30 Q70 -6 52 8 Q0 18 -58 0Z', fill: C.board, stroke: col, 'stroke-width': 3 }, g);
    mk('path', { d: 'M-36 -30 q8 10 0 22 M-8 -38 q8 12 0 26 M22 -36 q8 12 0 26', fill: 'none', stroke: col, 'stroke-width': 1.6, opacity: .7 }, g);
    return g;
  }
  function gun(p, x, y) {
    const g = G(p, { x, y, r: -8 });
    mk('path', { d: 'M-80 4 L40 -2 L84 -4 M40 -2 L36 10 Q20 24 -6 12 L-80 10 Z M-12 10 v10', fill: C.board, stroke: C.goldHi, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    return g;
  }
  function fish(p, x, y, col = C.gold) {
    const g = G(p, { x, y });
    mk('path', { d: 'M-26 0 Q-6 -16 18 0 Q-6 16 -26 0Z M18 0 L32 -10 L32 10 Z', fill: C.board, stroke: col, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g);
    mk('circle', { cx: 8, cy: -2, r: 2, fill: col }, g);
    return g;
  }
  function ring(p, x, y, r = 46) {
    const g = G(p, { x, y });
    mk('circle', { r, fill: 'none', stroke: C.faint, 'stroke-width': 6 }, g);
    g.arc = Pth(g, `M0 ${-r} A${r} ${r} 0 1 1 -0.01 ${-r}`, { stroke: C.gold, 'stroke-width': 6 }, { dw: 0 });
    g.bad = mk('circle', { r, fill: 'none', stroke: C.loss, 'stroke-width': 6, opacity: 0 }, g);
    return g;
  }
  function sewing(p, x, y, col = C.goldHi, sc = 1) {
    const g = G(p, { x, y, s: sc });
    const st = { fill: 'none', stroke: col, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke' };
    mk('path', Object.assign({}, st, { d: 'M-96 40 H96 V58 H-96 Z', fill: C.board }), g);
    mk('path', Object.assign({}, st, { d: 'M-72 40 V-28 Q-72 -54 -46 -54 H58 Q78 -54 78 -34 V6 H62 V40', fill: C.board }), g);
    mk('path', Object.assign({}, st, { d: 'M70 6 V30 M64 30 H76 M-28 -54 V-66 H12 V-54' }), g);
    mk('circle', Object.assign({}, st, { cx: -48, cy: -8, r: 16 }), g);
    return g;
  }
  function stamp(p, str, x, y, col) {
    const g = G(p, { x, y, r: -7, o: 0 });
    const w = (ML ? tr(str).length * 20 : str.length * 24) + 44;
    mk('rect', { x: -w / 2, y: -34, width: w, height: 64, rx: 6, fill: 'none', stroke: col, 'stroke-width': 4 }, g);
    T(g, str, { x: 0, y: 12, size: 36, fill: col, font: FM, weight: 600, anchor: 'middle', ls: 6 });
    return g;
  }

  /* ---------- text ---------- */
  function label(p, str, x, y, t0, { size = 28, fill = C.ink, anchor = 'middle', font = FT, weight = 400, italic = false, ls } = {}) {
    const e = T(p, str, { x, y, size, fill, anchor, font, weight, italic, ls, o: 0 }); rise(e, t0); return e;
  }
  function heading(p, str, x, y, t0, { size = 46, fill = C.ink, anchor = 'middle', italic = false } = {}) {
    return label(p, str, x, y, t0, { size, fill, anchor, font: FD, weight: 600, italic });
  }
  // a Wattles quotation in gold italic, wrapped to maxChars per line; returns the group
  function quoteBlock(p, text, x, y, t0, { size = 44, maxChars = 46, anchor = 'start', fill = C.goldHi, credit = 'Wattles' } = {}) {
    text = tr(text); const LH = ML ? 1.45 : 1.18; if (ML) { size = Math.round(size * .82); maxChars = Math.round(maxChars * 1.05); credit = credit && tr(credit); }
    const words = text.split(' '), lines = []; let cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    if (cur) lines.push(cur);
    const g = G(p, { o: 0 });
    lines.forEach((ln, i) => T(g, (i === 0 ? '“' : '') + ln + (i === lines.length - 1 ? '”' : ''), { x, y: y + i * size * LH, size, font: FD, italic: true, weight: 600, fill, anchor }));
    if (credit) T(g, ML ? credit : credit.toUpperCase(), { x, y: y + lines.length * size * LH + 10, size: 18, font: FM, weight: 500, fill: C.dim, anchor, ls: 4 });
    show(g, t0, .7); g.lines = lines.length; return g;
  }
  function chip(p, str, x, y, t0, { col = C.gold, size = 26, pad = 22, fill = C.board } = {}) {
    str = tr(str); const g = G(p, { x, y, o: 0 }); const w = str.length * size * (ML ? .62 : .56) + pad * 2;
    mk('rect', { x: -w / 2, y: -size * .95, width: w, height: size * 1.9, rx: size * .95, fill, stroke: col, 'stroke-width': 2.5 }, g);
    T(g, str, { x: 0, y: size * .35, size, fill: col, anchor: 'middle' });
    pop(g, t0); g.w = w; return g;
  }
  function arrow(p, x1, y1, x2, y2, t0, { col = C.gold, w = 3, dur = .7, bend = 0 } = {}) {
    const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
    const ang = Math.atan2(y2 - my, x2 - mx), h = 16;
    const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2} M${x2 - h * Math.cos(ang - .45)} ${y2 - h * Math.sin(ang - .45)} L${x2} ${y2} L${x2 - h * Math.cos(ang + .45)} ${y2 - h * Math.sin(ang + .45)}`;
    const e = Pth(p, d, { stroke: col, 'stroke-width': w }, { dw: 0 }); draw(e, t0, dur); return e;
  }
  function strike(p, x1, y1, x2, y2, t0, col = C.loss) { const e = Pth(p, `M${x1} ${y1} L${x2} ${y2}`, { stroke: col, 'stroke-width': 4 }, { dw: 0 }); draw(e, t0, .45, E.out); return e; }

  /* ---------- questions: the engine's cards, fed from the old question format ---------- */
  const S = {};
  const QZ = { querySelector: () => null, animate() {} };   // the old page's quiz box; the engine draws its own
  // The old page had a separate narrow (phone) layout; the engine scales the whole stage, so the wide layout always holds.
  const wrapEl = { classList: { contains: () => false } };
  const yes = s => tr(s).replace(/^(Right|Correct|Exactly|Yes)[.,!:]\s+/, '').replace(/^(ശരി|ശരിയാണ്|അതെ|കൃത്യം)[.,!:]\s*/, '');
  const no = s => tr(s).replace(/^(No|Not quite|Wrong)[.,!:]\s+/, '').replace(/^(അല്ല|തെറ്റ്)[.,!:]\s*/, '');
  const SIDE = { x: 896, y: 84, w: 680, cls: 'side', maxH: 712 };
  const POS = { band: ENG.BAND, side: SIDE, screen: ENG.SCREEN, panel: ENG.BAND };
  let practice = false;
  function quiz(pos, qs, done) {
    practice = pos === 'screen' || qs.some(q => /^Chapter practice/.test(q.label || ''));
    const id = q => practice ? (q.id.startsWith('p-') ? q.id : 'p-' + q.id) : (q.id.startsWith('c-') ? q.id : 'c-' + q.id);
    ENG.quiz(POS[pos] || ENG.BAND, qs.map(q => ({ id: id(q), prompt: [tr(q.prompt)], build: q.build })), done,
      ENG.translate(practice ? 'chapterPractice' : 'quickCheck'));
  }
  // options: [[text, why], ...]; the why of the right one is the confirmation, the others explain the slip
  const choice = (opts, right) => ENG.choice(opts.map(o => [tr(o[0])]), right, yes(opts[right][1]), opts.map((o, i) => i === right ? null : no(o[1])));
  const truth = rows => ENG.grid(rows.map(r => ({ parts: [tr(r.t)], ans: [r.ans ? 't' : 'f'], why: no(r.why) })), ENG.TF, { multi: false, text: true });
  // tap a thing in the picture: items [{ el, label, ok, why }], each el with .box [x, y, w, h] in its own frame
  function pickQ(items, prompt, id, done) {
    const scene = document.getElementById('scene'), inv = scene.getScreenCTM().inverse();
    const its = items.map(it => {
      const [x, y, w, h] = it.el.box, M = inv.multiply(it.el.getScreenCTM());
      const pts = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([a, b]) => [M.a * a + M.c * b + M.e, M.b * a + M.d * b + M.f]);
      const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
      return { el: null, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)], label: tr(it.label) };
    });
    const right = items.findIndex(it => it.ok);
    ENG.quiz(ENG.BAND, [{ id: id.startsWith('c-') ? id : 'c-' + id, prompt: [tr(prompt)], build: ENG.pickEls(its, right, yes(items[right].why), i => no(items[i].why)) }], done);
  }
  const finishCard = () => ENG.finishCard();

  /* ---------- standard beats ---------- */
  function askFrame(p, pos = 'band') { return pos === 'side' ? G(p, { x: 4, y: 150, s: .555 }) : G(p, { x: 224, y: 0, s: .72 }); }
  function titleCard(n, title, sub) {
    return ['intro', title, (p, m) => {
      const k = T(p, `UNIT ${META[n].part} · CHAPTER ${n}`, { x: 800, y: 330, size: 26, fill: C.gold, font: FM, weight: 500, anchor: 'middle', ls: 6, o: 0 }); rise(k, .1);
      const size = title.length > 26 ? 84 : 100;
      const t = T(p, title, { x: 800, y: 450, size, font: FD, weight: 600, anchor: 'middle', o: 0 }); rise(t, m('title', -.1), .9);
      const line = Pth(p, 'M560 506 C700 486 900 526 1040 500', { stroke: C.gold, 'stroke-width': 2 }, { dw: 0 }); draw(line, m('title', .4), 1.1);
      const s = T(p, sub, { x: 800, y: 590, size: 38, font: FD, italic: true, fill: C.dim, anchor: 'middle', o: 0 }); rise(s, m('sub'));
    }];
  }
  function takeawaysBeat(n, items) {
    return ['wrap', 'To sum up', (p, m) => {
      const h = T(p, `Chapter ${n} in ${['', 'one line', 'two lines', 'three lines', 'four lines'][items.length]}`, { x: 220, y: 190, size: 52, font: FD, weight: 600, o: 0 }); rise(h, .1);
      items.forEach((s, i) => {
        const g = G(p, { x: -18, y: 320 + i * 130, o: 0 });
        mk('circle', { cx: 250, cy: -12, r: 28, fill: 'none', stroke: C.gold, 'stroke-width': 2.5 }, g);
        const num = mk('text', { x: 250, y: -2, 'text-anchor': 'middle', 'font-family': FT, 'font-size': 26, fill: C.gold }, g); num.textContent = i + 1;
        const tx = mk('text', { x: 310, y: 0, 'font-family': FT, 'font-size': 38, fill: C.ink }, g); tx.textContent = s;
        tw(g, { o: 1, x: 0 }, m('w' + (i + 1)), .6, E.out);
      });
    }];
  }
  function practiceBeat(qs) {
    return ['final', 'Chapter practice', () => { }, { ask: done => quiz('screen', qs.map(q => ({ id: q.id, label: 'Chapter practice', prompt: q.prompt, build: choice(q.options, q.right) })), done) }];
  }
  function finishBeat() { return ['finish', 'Finished', () => { }, { ask: finishCard }]; }
  function checkBeat(id, prompt, options, right, { pos = 'band', picture = null, qid } = {}) {
    return [id, 'Quick check', (p) => { if (picture) picture(askFrame(p, pos)); },
      { ask: done => quiz(pos, [{ id: qid || 'c-' + id, label: 'Quick check', prompt, build: choice(options, right) }], done) }];
  }
  function truthBeat(id, rows, { pos = 'side', picture = null } = {}) {
    return [id, 'Quick check', (p) => { if (picture) picture(askFrame(p, pos)); },
      { ask: done => quiz(pos, [{ id: 'c-' + id, label: 'Quick check', prompt: 'True or false?', build: truth(rows) }], done) }];
  }

  /* ---------- chapters ---------- */
  // Chapter list: unit (1-5) of each chapter, for the title card kicker.
  const META = {};
  [[1, 3], [4, 7], [8, 10], [11, 15], [16, 17]].forEach(([a, b], u) => { for (let n = a; n <= b; n++) META[n] = { part: u + 1 }; });
  let DEF = null;
  function chapter(n, def) { DEF = { n, ...def }; }
  // The engine's BEATS from the registered chapter: each beat gets a fresh panel and its own timeline.
  function beats(titles = {}) {
    return DEF.beats.map(([id, title, run, extra = {}]) => {
      const t = title === 'Quick check' ? ENG.translate('quickCheck') : title === 'Chapter practice' ? ENG.translate('chapterPractice')
        : (ML && titles[id]) || tr(title);
      const b = { id, title: t, ...extra };
      b.run = (m, D) => {
        const p = ENG.panel(0);
        const cx = CX = { ELS: [], PROGS: [], LAST: 0 };
        run(p, m, D);
        const end = Math.max(D, cx.LAST) + .3;
        render(0, cx);
        ENG.prog(q => render(q * end, cx), 0, end, ENG.lin);
      };
      return b;
    });
  }
  return { mk, C, FD, FT, FM, E, REDUCED, track, G, T, Pth, valAt, lastEl, tw, show, hide, draw, rise, pop, prog, clockRun, render,
    figure, painting, furs, gun, fish, ring, sewing, stamp, label, heading, quoteBlock, chip, arrow, strike,
    S, QZ, wrapEl, quiz, choice, truth, pickQ, finishCard, askFrame, titleCard, takeawaysBeat, practiceBeat, finishBeat,
    checkBeat, truthBeat, META, chapter, beats, tr, norm, LANG, NS };
})();

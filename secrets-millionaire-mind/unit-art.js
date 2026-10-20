// Unit header sketches (viewBox 0 0 600 180), one per unit. Left ~200 px kept light for the unit title on phones.
'use strict';
(() => {
  let k = 0;
  const ML = document.documentElement.lang === 'ml';
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };
  const flow = 'M270 120H560';
  window.UNIT_ART = [
    // 1 The inner game: a tree with its roots drawn below the ground line, a fruit riding down to the roots
    reset(P('M240 112H580', 'a') + P('M410 112V70') + C(410, 52, 30) + C(380, 66, 20) + C(440, 66, 20) +
      P('M410 112q-20 20-46 30M410 112q4 24-6 40M410 112q22 18 50 26', 'a') +
      `<circle class="t ride" r="6" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('M440 66C470 90 470 130 430 146')"/>` +
      Tx(410, 172, ML ? 'കാണാത്ത വേര്, കാണുന്ന പഴം' : 'hidden roots, visible fruit', 18, 'a', 'middle')),
    // 2 Your money blueprint: a house plan whose line runs on into a row of results
    reset(P('M250 120V70L290 40L330 70V120Z', 'a') + P('M270 120V96H310V120', 'a') +
      P('M360 96h40M420 96h40M480 96h40') + P('M392 90l8 6-8 6M452 90l8 6-8 6M512 90l8 6-8 6') +
      P('M540 120c0-26 30-26 30 0', 'a') +
      `<circle class="t ride" r="6" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('M340 96H540')"/>` +
      Tx(410, 160, ML ? 'പ്ലാൻ → ചിന്ത → വികാരം → പ്രവൃത്തി → ഫലം' : 'plan → thoughts → feelings → actions → results', 18, 'a', 'middle')),
  ];
})();

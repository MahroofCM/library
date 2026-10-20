// Unit header sketches (viewBox 0 0 600 180), one per unit. Left ~200 px kept light for the unit title on phones.
'use strict';
(() => {
  let k = 0;
  const ML = document.documentElement.lang === 'ml';
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };
  // wages climb in steps and go flat; equity keeps climbing; a coin rides the equity curve
  const eq = 'M240 140C330 136 420 112 470 84S540 40 572 28';

  window.UNIT_ART = [
    // 1 Building wealth: wage steps that go flat, and an equity curve that keeps rising
    reset(P('M232 148H580', 'a faint') + P('M240 140H272V128H304V116H336V104H400V104H460V92H500V92H580', 'a') + P(eq) +
      `<circle class="t ride" r="7" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('${eq}')"/>` +
      Tx(410, 172, ML ? 'ഉറങ്ങുമ്പോഴും സമ്പാദിക്കുന്നത്' : 'what earns while you sleep', 20, 'a', 'middle')),
  ];
})();

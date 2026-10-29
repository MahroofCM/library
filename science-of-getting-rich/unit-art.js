// Unit header sketches (viewBox 0 0 600 180), one per unit. Left ~200 px kept light for the unit title on phones.
'use strict';
(() => {
  let k = 0;
  const ML = document.documentElement.lang === 'ml';
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };
  const ride = p => `<circle class="t ride" r="6" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('${p}')"/>`;
  const grow = 'M300 140C300 110 320 90 360 80S440 50 470 36';
  const steps = 'M250 140H310V116H370V92H430V68H490V44H560';

  window.UNIT_ART = [
    // 1 The right and the science: a sprout on the ground, growing toward a small sun
    reset(P('M240 140H560') + P('M300 140V112', 'a') + P('M300 118c-14-2-24-12-24-24 14 0 24 10 24 24ZM300 112c2-16 14-26 28-26 0 16-12 26-28 26Z', 'a') +
      P(grow) + C(520, 40, 16, 'a') + P('M520 14v-8M546 40h8M538 22l6-6M502 22l-6-6', 'a') + ride(grow) +
      Tx(400, 170, ML ? 'ജീവൻ എപ്പോഴും കൂടുതൽ തേടുന്നു' : 'life always seeks more', 20, 'a', 'middle')),
    // 2 Thinking substance: a scatter of formless points, one thought drawing them into a house
    reset(P('M250 70h2M280 40h2M262 110h2M300 84h2M318 52h2M290 128h2M240 96h2M326 120h2') +
      P('M340 90C380 90 400 90 430 90', 'a') + P('M424 82l10 8-10 8', 'a') +
      P('M460 130V88L510 52 560 88V130ZM498 130V106H522V130', 'a') +
      Tx(400, 170, ML ? 'ചിന്ത രൂപം സൃഷ്ടിക്കുന്നു' : 'a thought produces the form', 20, 'a', 'middle')),
    // 3 Thinking in the Certain Way: a helm holding one clear heading toward the picture
    reset(C(310, 90, 34) + C(310, 90, 8, 'a') + P('M310 46V134M266 90H354M279 59l62 62M341 59l-62 62') +
      P('M352 90H520', 'a') + P('M520 60h44v40h-44Z', 'a') + P('M528 92l10-14 8 8 10-14', 'a') + ride('M352 90H520') +
      Tx(420, 160, ML ? 'വ്യക്തമായ ചിത്രം, ഉറച്ച ദിശ' : 'a clear picture, a fixed heading', 20, 'a', 'middle')),
    // 4 Acting in the Certain Way: steps, each one done fully, climbing
    reset(P(steps) + P('M556 36l10 8-10 8', 'a') + ride(steps) +
      Tx(400, 168, ML ? 'ഓരോ ദിവസവും ചെയ്യാവുന്നതെല്ലാം' : 'all that can be done each day', 20, 'a', 'middle')),
    // 5 Cautions and summary: the sun, whole
    reset(C(420, 80, 30, 'a') + P('M420 34v-14M420 126v14M374 80h-14M466 80h14M388 48l-10-10M452 48l10-10M388 112l-10 10M452 112l10 10', 'a') +
      P('M250 140H590') +
      Tx(420, 172, ML ? 'മുഴുവൻ രീതിയും ഒറ്റനോട്ടത്തിൽ' : 'the whole method at a glance', 20, 'a', 'middle')),
  ];
})();

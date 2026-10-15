// Unit header sketches (viewBox 0 0 600 180), one per unit. Left ~200 px kept light for the unit title on phones.
'use strict';
(() => {
  let k = 0;
  const ML = document.documentElement.lang === 'ml';
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };
  const loop = 'M300 96C300 50 400 50 400 96S500 142 500 96 400 50 400 96 300 142 300 96Z';
  const path1 = 'M250 140C320 140 330 70 400 70S500 40 560 40';

  window.UNIT_ART = [
    // 1 Where change begins: a road that climbs from a low start to a small sun
    reset(P('M230 140H330', 'a') + P(path1) + C(560, 40, 14, 'a') + P('M560 14v-8M586 40h8M578 22l6-6', 'a') +
      `<circle class="t ride" r="7" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('${path1}')"/>` +
      Tx(400, 168, ML ? 'ഒരു തീരുമാനത്തിൽ തുടങ്ങുന്നു' : 'change starts with a decision', 20, 'a', 'middle')),
    // 2 The living brain: two neurons and a spark crossing the gap
    reset(C(290, 90, 18, 'a') + P('M308 90H400M272 90l-30-26M272 90l-34 18M290 72l-6-34', 'a') +
      P('M412 90H490M412 90l-10 -18M412 90l-10 18') + C(508, 90, 18) + P('M526 90l34-22M526 90l36 20M508 108l4 34') +
      `<circle class="t ride" r="6" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('M308 90H490')"/>` +
      Tx(400, 168, ML ? 'ഒന്നിച്ചു മിന്നുന്നവ ഒന്നിച്ചു ചേരുന്നു' : 'cells that fire together wire together', 20, 'a', 'middle')),
    // 3 Habits of mind and body: the thought → chemistry → feeling loop
    reset(P('M262 96c-18 0-30-14-24-30 4-14 20-18 30-12 6-14 26-16 36-4 12-6 26 2 26 16') +
      C(540, 96, 34, 'a') + P('M540 62v-10M574 96h10M540 130v10', 'a') + P('M528 56q12-10 24 0', 'a') +
      P(loop) +
      `<circle class="t ride" r="7" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('${loop}')"/>` +
      Tx(400, 160, ML ? 'ചിന്ത → രസം → തോന്നൽ' : 'thought → chemistry → feeling', 20, 'a', 'middle')),
    // 4 Taking control: a loop that breaks open into a new upward line
    reset(P('M250 110C250 70 330 70 330 110S250 150 250 110', 'a') +
      P('M330 110C380 110 400 60 460 60S540 30 580 24') + P('M566 16l14 8-10 12') +
      `<circle class="t ride" r="7" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('M330 110C380 110 400 60 460 60S540 30 580 24')"/>` +
      Tx(420, 160, ML ? 'പഴയ വലയം വിട്ട്, പുതിയ വഴി' : 'step out of the old loop', 20, 'a', 'middle')),
  ];
})();
